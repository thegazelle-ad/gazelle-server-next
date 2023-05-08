import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

/**
 * Sythesizes sample text into an .mp3 file.
 */
async function synthesize() {
    const client = new TextToSpeechClient();

    const text = 'This is a demonstration of the Google Cloud Text-to-Speech API';

    const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', name: 'en-US-Wavenet-H' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    //@ts-ignore
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
}

synthesize();