// import _ from 'lodash';
// import { TeamData } from '../types';

// import TeamMembersList from './TeamMembersList';

// interface TeamPageInterface {
//   teamData: TeamData[];
// }

// const TeamPage = (props: TeamPageInterface) => {
//   const renderTeams = _.map(props.teamData || [], team => (
//     <div key={team.teamInfo.name} className="team-page__team">
//       <h2 className="section-header">{team.teamInfo.name}</h2>
//       <TeamMembersList members={team.members} />
//     </div>
//   ));

//   // Top level elements can't have classes or it will break transitions
//   return (
//     <div className="team-page">
//       <h2 className="team-page__title">Our Team</h2>
//       {renderTeams}
//     </div>
//   );
// }
