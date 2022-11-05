import _ from 'lodash';
import Link from 'next/link';
import Image from 'next/image';

import { StaffInfo } from '../types';

interface TeamMembersListInterface {
  members: StaffInfo[];
}

// TODO - cache gravatar locally
const TeamMembersList = (props: TeamMembersListInterface) => {
  const renderMembers = _.map(props.members || [], member => {
    const memberImage =
      member.image_url ||
      'http://0.gravatar.com/avatar/c63ec0271e2c8a10b2e343bbd1dec547?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G';
    const jobTitle = member.job_title || 'Contributor';
    return (
      <Link
        href={`/staff-member/${member.slug}`}
        key={member.name}
        className="team-page__team__members__member"
      >
        <Image
          src={memberImage}
          alt="Team Member"
          className="team-page__team__members__member__image"
        />
        <h2 className="team-page__team__members__member__name">
          {member.name}
        </h2>
        <h3 className="team-page__team__members__member__job-title">
          {jobTitle}
        </h3>
      </Link>
    );
  });

  // Top level elements can't have classes or it will break transitions
  return <div className="team-page__team__members">{renderMembers}</div>;
}

export default TeamMembersList;
