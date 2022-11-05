import Image from 'next/image';
import ArticleList from './ArticleList';
import { parseMarkdown } from '../utils/react-utilities';
import _ from 'lodash';
import { StaffInfo } from '../types/';

// TODO - do we need lodash?

// todo - merge these
interface StaffMemberDetails {
  staffMember: StaffInfo;
}

const StaffMember = (props: StaffMemberDetails) => {
  const { staffMember } = props;
  return (
    <div key={staffMember.slug} className="staff">
      <div className="staff__header">
        <Image
          className="staff__header__staff-image"
          alt="staff"
          src={staffMember.image_url}
        />
        <div className="staff__header__staff-info">
          <h1 className="staff__header__staff-info__name">
            {staffMember.name}
          </h1>
          <h2 className="staff__header__staff-info__role">
            {staffMember.job_title}
          </h2>
          <p className="staff__header__staff-info__biography">
            {parseMarkdown(staffMember.biography)}
          </p>
        </div>
      </div>
      <ArticleList articles={_.toArray(staffMember.articles)} />
    </div>
  );
};

export default StaffMember;
