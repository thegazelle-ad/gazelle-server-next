import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import { eq } from 'drizzle-orm/expressions';
import { db } from '../../db/conn';
import {
    articles as Articles,
    articlesAudio as ArticlesAudio,
} from '../../db/schema';
import {
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import ffmpeg from 'fluent-ffmpeg';
// Import the necessary modules
import { Parser } from 'commonmark';

const writeFile = util.promisify(fs.writeFile);

const client = new TextToSpeechClient();

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_R2_ACCESS_KEY_SECRET!,
    },
});

function parseMarkdown(text: string) {
    // Create a CommonMark reader and writer
    const reader = new Parser();
    const parsed = reader.parse(text);

    let walker = parsed.walker();
    let event, node;

    let sentences = [];
    while ((event = walker.next())) {
        node = event.node;
        if (event.entering && node.type === 'text') {
            //@ts-ignore
            sentences.push(node.literal);
        }
    }

    return sentences.join(' ').replace(/\s{2,}/g, ' ');
}

// Function to split text into sentences
function splitSentences(text: string) {
    return text.match(/[^.!?]+[.!?]+/g) || [];
}

// Function to synthesize text to speech
async function synthesizeSpeech(text: string, outputFilename: string) {
    const request = {
        input: { text },
        voice: { languageCode: 'en-US', name: 'en-US-Studio-O' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    //@ts-ignore
    const [response] = await client.synthesizeSpeech(request);
    await writeFile(outputFilename, response.audioContent, 'binary');
    console.log(`Audio content written to file: ${outputFilename}`);
}

// Function to concatenate audio files
function concatenateAudio(files: string[], outputFilename: string) {
    return new Promise((resolve, reject) => {
        const command = ffmpeg();

        files.forEach(file => {
            command.addInput(file);
        });

        command
            .on('error', reject)
            .on('end', resolve)
            .mergeToFile(outputFilename, './temp/');
    });
}

// Main function
async function textToAudio(text: string, outputFile: string) {
    const sentences = splitSentences(text);
    const audioFiles = [];

    for (const [index, sentence] of sentences.entries()) {
        const outputFilename = `temp_audio_${index}.mp3`;
        await synthesizeSpeech(sentence, outputFilename);
        audioFiles.push(outputFilename);
    }

    await concatenateAudio(audioFiles, outputFile);
    console.log(`Concatenated audio file: ${outputFile}`);
}


async function getArticleContent(slug: string) {
    const articleId = await db.select({
        id: Articles.id,
        markdown: Articles.markdown,
        title: Articles.title,
        teaser: Articles.teaser,
    })
        .from(Articles)
        .where(eq(Articles.slug, slug))
        .limit(1);

    if (!articleId)
        throw new Error(`Article with slug ${slug} not found`);
    if (!articleId[0])
        throw new Error(`Article with slug ${slug} not found`);

    if (articleId[0].markdown == null)
        throw new Error(`Article with slug ${slug} has no markdown`);

    return {
        id: articleId[0].id,
        markdown: articleId[0].markdown,
        title: articleId[0].title,
        teaser: articleId[0].teaser,
    }
}

async function updateDB({ id, slug }: { id: number, slug: string }) {
    await db.insert(ArticlesAudio)
        .values({
            articleId: id,
            uri: `https://audio.thegazelle.org/${slug}.mp3`,
        })
        .execute();
}

// Function to upload a file to Amazon S3
async function uploadToS3(bucketName: string, key: string, filePath: string) {
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err) => console.error('File error', err));

    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
    };

    try {
        const result = await S3.send(new PutObjectCommand(uploadParams));
        console.log(`Successfully uploaded ${key} to ${bucketName}`);
        return result;
    } catch (error) {
        console.error(`Error uploading ${key} to ${bucketName}:`, error);
        throw error;
    }
}


const bucketName = 'articles-audio';
const slug = 'grandpa-dont-joke-personal-essay';
const outputFilename = `${slug}.mp3`;

console.log("Fetching content...");
const { id, markdown, title, teaser } = await getArticleContent(slug);

const content = `${title} ${teaser} ${parseMarkdown(markdown)}`;

console.log("Got content, synthesizing");
await textToAudio(content, outputFilename);

console.log("synthesized, uploading....");
await uploadToS3(bucketName, outputFilename, outputFilename);

console.log("Updating database...");
await updateDB({ id, slug });
console.log("updated db");
