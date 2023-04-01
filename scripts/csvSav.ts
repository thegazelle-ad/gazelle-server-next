import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const csvString = readFileSync('profiles.csv', 'utf8');
const csvOptions = { columns: true, skip_empty_lines: true };
const records = parse(csvString, csvOptions);

function readCSV(csvFile: string='profiles.csv'): string {
  const csvString = readFileSync(csvFile, 'utf8');
  return csvString;
}

function parseTeams(csvDump=csvString): Gazelle {
  const csvOptions = { columns: true, skip_empty_lines: true };
  const records = parse(csvString, csvOptions);
  let gazelle: Gazelle = {
    objects: [],
  };
  let index: number = -1;

  for(const record of records){
    if (isTeamHeader(record)){
      let team: Team={
        team: record.DESK,
        members: [],
      };
      gazelle.objects.push(team)
      index++;
    }else if (record.DESK!==''){
    const member: Member = {
        desk:record.DESK,
        position:record.POSITION,
        email:record['NYU EMAIL'],
        signature:record.SIGNATURE,
        slug:record.Slug,
      };
    gazelle.objects[index].members.push(member);
    }
  }
  return gazelle;
}

function isTeamHeader(object): boolean {
  if (object.DESK!=='' && object.POSITION==='' && object['NYU EMAIL']==='' && object.SIGNATURE==='' && object.Slug===''){
    return true;
  }else{
    return false;
  }
}

type Member = {
  desk: string;
  position: string;
  email: string;
  signature: string;
  slug: string;
};

type Team = {
  team: string;
  members: Member[];
}

type Gazelle = {
  objects: Team[];
}

const gaz: Gazelle = parseTeams(readCSV('profiles.csv')); //parses csv
console.log(JSON.stringify(gaz)); //prints entire gazelle team

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function createTeam(teamData: Team) {
//   const team = await prisma.team.create({
//     data: {
//       name: teamData.team,
//     },
//   });
//   return team;
// }

// async function createMember(memberData: Member) {
//   const member = await prisma.member.create({
//     data: {
//       name: memberData.desk,
//       position: memberData.position,
//       email: memberData.email,
//       signature: memberData.signature,
//       slug: memberData.slug,
//     },
//   });
//   return member;
// }

// async function addMemberToTeam(teamId: number, memberId: number) {
//   const member = await prisma.member.update({
//     where: {
//       id: memberId,
//     },
//     data: {
//       team: {
//         connect: {
//           id: teamId,
//         },
//       },
//     },
//   });
//   return member;
// }

// async function updateMember(memberId: number, memberData: Member) {
//   const member = await prisma.member.update({
//     where: {
//       id: memberId,
//     },
//     data: {
//       name: memberData.desk,
//       position: memberData.position,
//       email: memberData.email,
//       signature: memberData.signature,
//       slug: memberData.slug,
//     },
//   });
//   return member;
// }

// async function main(){
//   const team=await createTeam(gaz.objects[0]);
// console.log(team.name);
// }

// main()
// .catch((e) => console.error(e))
// .finally(async () => {
//   await prisma.$disconnect();
// });