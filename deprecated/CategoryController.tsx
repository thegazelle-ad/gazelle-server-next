import { useEffect } from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import Helmet from 'react-helmet';
import ArticleList from 'components/main/ArticleList';
import NotFound from 'components/main/NotFound';
import _ from 'lodash';

const uppercase = (str: string) => {
  const array = str.split(' ');
  const newArray = [];

  for (let x = 0; x < array.length; x++) {
    newArray.push(array[x].charAt(0).toUpperCase() + array[x].slice(1));
  }
  return newArray.join(' ');
};

interface CategoryProps {
  params: { category: string };
}

interface CategoryData {
  name: string;
  articles: {
    [index: number]: {
      title: string;
      teaser: string;
      issueNumber: string;
      slug: string;
      image_url: string;
      category: { slug: string };
      authors: {
        [index: number]: { name: string; slug: string };
      };
    };
  };
}

export default function CategoryController(props: CategoryProps) {
  const { category } = props.params;
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<CategoryData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const pathSets = CategoryController.getFalcorPathSets(props.params);
        const data = await CategoryController.getModel().get(...pathSets);
        setData(data.json.categories.bySlug[category]);
        setReady(true);
      } catch (error) {
        console.error(error);
        setReady(true);
      }
    }
    fetchData();
  }, [category, props.params]);

  if (ready) {
    if (data == null || Object.keys(data).length === 0) {
      return <NotFound />;
    }
    const meta = [
      {
        name: 'description',
        content:
          'The Gazelle is a weekly student publication, serving the ' +
          'NYU Abu Dhabi community and the greater Global Network University at NYU.',
      },
      ...CategoryController.getOpenGraphInformation(props.params, data),
    ];

    return (
      <div className="category">
        <Helmet
          meta={meta}
          title={`${uppercase(data.name)} | The Gazelle`}
        />
        <h2 className="category__header">{data.name}</h2>

        <ArticleList articles={_.toArray(data.articles)} />
      </div>
    );
  }

  return <div>Loading</div>;
}

CategoryController.getFalcorPathSets = (params: CategoryProps['params']) => {
  return [
    ['categories', 'bySlug', params.category, 'name'],
    [
      'categories',
      'bySlug',
      params.category,
      'articles',
      { length: 10 },
      ['title', 'teaser', 'issueNumber', 'slug', 'image_url'],
    ],
    [
      'categories',
      'bySlug',
      params.category,
      'articles',
      { length: 10 },
      'category',
      'slug',
    ],
    [
      'categories',
      'bySlug',
      params.category,
      'articles',
      { length: 10 },
      'authors',
      { length: 10 },
      ['name', 'slug'],
    ],
  ];
};

const getOpenGraphInformation = (
  urlParams: CategoryProps['params'],
  falcorData: CategoryData
) => {
  const { category } = urlParams;
  const categoryData = falcorData.categories.bySlug[category];
  return [
    { property: 'og:title', content: 'The Gazelle' },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: `https://www.thegazelle.org/category/${categoryData.slug}`,
    },
    {
      property: 'og:description',
      content:
        'The Gazelle is a weekly student publication serving the NYU Abu Dhabi community.',
    },
  ];
};

const CategoryController: React.FC<CategoryProps> = ({ params }) => {
  const [data, setData] = useState<CategoryData>({
    categories: { bySlug: {} },
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Get the data here and set it to state using setData
    setReady(true);
  }, []);

  if (ready) {
    if (data == null || Object.keys(data).length === 0) {
      return <NotFound />;
    }
    const { category } = params;
    const categoryData = data.categories.bySlug[category];
    const meta = [
      // Search results
      {
        name: 'description',
        content:
          'The Gazelle is a weekly student publication, serving the ' +
          'NYU Abu Dhabi community and the greater Global Network University at NYU.',
      },

      // Social media
      ...getOpenGraphInformation(params, data),
    ];
    return (
      <div className="category">
        <Helmet
          meta={meta}
          title={`${uppercase(categoryData.name)} | The Gazelle`}
        />
        <h2 className="category__header">{categoryData.name}</h2>

        {/* Render all articles fetched through ArticleList */}
        <ArticleList articles={_.toArray(categoryData.articles)} />
      </div>
    );
  }

  return <div>Loading</div>;
};

export default CategoryController;