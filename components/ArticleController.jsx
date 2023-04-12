import React from 'react';
import Helmet from 'react-helmet'; // Add <head> data
import { viewArticle, isArticleViewed } from 'lib/utilities';
import _ from 'lodash';

// Components
import Article from 'components/main/Article';
import FalcorController from 'lib/falcor/FalcorController';
import NotFound from 'components/main/NotFound';

export default class ArticleController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/issue/:issueNumber/:articleCategory/:articleSlug

    // Multilevel request requires Falcor Path for each level of data requested
    return [
      // Fetch article data
      [
        'articles',
        'bySlug',
        params.articleSlug,
        [
          'title',
          'teaser',
          'html',
          'published_at',
          'issueNumber',
          'slug',
          'image_url',
        ],
      ],
      ['articles', 'bySlug', params.articleSlug, 'category', 'slug'],
      [
        'articles',
        'bySlug',
        params.articleSlug,
        'authors',
        { length: 10 },
        ['name', 'slug'],
      ],

      // Fetch two related articles
      // TODO: convert fetching by category to fetching by tag
      [
        'articles',
        'bySlug',
        params.articleSlug,
        'related',
        { length: 2 },
        ['title', 'teaser', 'image_url', 'issueNumber', 'category', 'slug'],
      ],
      [
        'articles',
        'bySlug',
        params.articleSlug,
        'related',
        { length: 2 },
        'category',
        'slug',
      ],
      [
        'articles',
        'bySlug',
        params.articleSlug,
        'related',
        { length: 2 },
        'authors',
        { length: 10 },
        ['name', 'slug'],
      ],

      // Fetch first five Trending articles
      [
        'trending',
        { length: 6 },
        ['title', 'issueNumber', 'slug', 'image_url'],
      ],
      ['trending', { length: 6 }, 'category', 'slug'],
      ['trending', { length: 6 }, 'authors', { length: 10 }, ['name', 'slug']],
    ];
  }

  static getOpenGraphInformation(urlParams, falcorData) {
    const { articleSlug } = urlParams;
    // Access data fetched via Falcor
    const articleData = falcorData.articles.bySlug[articleSlug];
    // make sure article meta image has default
    const articleMetaImage =
      articleData.image_url ||
      'https://cdn.thegazelle.org/gazelle/2016/02/saadiyat-reflection.jpg';
    return [
      { property: 'og:title', content: `${articleData.title} | The Gazelle` },
      { property: 'og:type', content: 'article' },
      {
        property: 'og:url',
        content:
          `https://www.thegazelle.org/issue/${articleData.issueNumber}/` +
          `${articleData.category.slug}/${articleData.slug}`,
      },
      { property: 'og:image', content: articleMetaImage },
      { property: 'og:image:width', content: '540' }, // 1.8:1 ratio
      { property: 'og:image:height', content: '300' },
      { property: 'og:description', content: articleData.teaser },
      { property: 'og:site_name', content: 'The Gazelle' },
    ];
  }

  componentDidMount() {
    super.componentDidMount();
    const slug = this.props.params.articleSlug;
    // We don't want beta views to count towards the total view count
    // and we only want to count each view once per session (might use cookies
    // later to make this consistent for a user in general?)
    if (process.env.NODE_ENV !== 'beta' && !isArticleViewed(slug)) {
      viewArticle(slug);
      this.props.model
        .call(['articles', 'bySlug', slug, 'addView'], [], [], [])
        .then(() => {});
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    super.componentWillReceiveProps(nextProps, nextContext);
    const slug = this.props.params.articleSlug;
    if (process.env.NODE_ENV !== 'beta' && !isArticleViewed(slug)) {
      viewArticle(slug);
      this.props.model
        .call(['articles', 'bySlug', slug, 'addView'], [], [], [])
        .then(() => {});
    }
  }

  render() {
    if (this.state.ready) {
      if (
        !_.get(
          this.state,
          `data.articles.bySlug.${this.props.params.articleSlug}.issueNumber`,
        )
      ) {
        return <NotFound />;
      }

      const { articleSlug } = this.props.params;
      // Access data fetched via Falcor
      const articleData = this.state.data.articles.bySlug[articleSlug];
      const trendingData = this.state.data.trending;
      const relatedArticlesData = articleData.related;
      const meta = [
        // Search results
        { name: 'description', content: this.props.teaser },
        // Social media sharing
        ...ArticleController.getOpenGraphInformation(
          this.props.params,
          this.state.data,
        ),
      ];
      return (
        <div>
          <Helmet meta={meta} title={`${articleData.title} | The Gazelle`} />
          <Article
            title={articleData.title}
            teaser={articleData.teaser}
            published_at={articleData.published_at}
            html={articleData.html}
            authors={_.toArray(articleData.authors)}
            featuredImage={articleData.image_url}
            url={
              `thegazelle.org/issue/${articleData.issueNumber}/` +
              `${articleData.category.slug}/${articleData.slug}`
            }
            trending={_.toArray(trendingData)}
            relatedArticles={_.toArray(relatedArticlesData)}
          />
        </div>
      );
    }

    return <div>Loading</div>;
  }
}
