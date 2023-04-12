/*
 * TextPageController is used to display the About and Ethics pages as pages
 * of only text. The text used is passed in dynamically after it is sourced from
 * the database.
 */

import _ from 'lodash';
import Helmet from 'react-helmet'; // Add meta tags for pre-Ghost release

// Components
import Archives from './Archives';

// todo - loading screen?

const ArchivesController = () => {
  // static getFalcorPathSets() {
  //   return [
  //     // Returns 230 archived issues (timed for Kyle Adams' senior year)
  //     [
  //       'issues',
  //       'byNumber',
  //       { length: 250 },
  //       ['issueNumber', 'name', 'published_at'],
  //     ],
  //   ];
  // }

  // static getOpenGraphInformation() {
  //   return [
  //     { property: 'og:title', content: 'Archives | The Gazelle' },
  //     { property: 'og:type', content: 'website' },
  //     { property: 'og:url', content: 'https://www.thegazelle.org/archives' },
  //     {
  //       property: 'og:image',
  //       content:
  //         'https://www.thegazelle.org/wp-content/themes/gazelle/images/gazelle_logo.png',
  //     },
  //     {
  //       property: 'og:description',
  //       content:
  //         'The Gazelle is a weekly student publication ' +
  //         'serving the NYU Abu Dhabi community.',
  //     },
  //   ];
  // }
    // todo - get this data from prism

    const meta = [
      // Search results
      {
        name: 'description',
        content:
          'The Gazelle is a weekly student publication, serving the ' +
          'NYU Abu Dhabi community and the greater Global Network University at NYU.',
      },

      // Social media
      ...ArchivesController.getOpenGraphInformation(),
    ];
    return (
      <div>
        {/* <Helmet meta={meta} title="Archives | The Gazelle" /> */}
        <Archives archivesData={data} />
      </div>
    );
}

export default ArchivesController;
