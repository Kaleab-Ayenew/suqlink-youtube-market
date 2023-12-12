import type {
  CategoryQueryOptions,
  NextPageWithLayout,
  ProductQueryOptions,
  SettingsQueryOptions,
} from '@/types';
import type { GetStaticProps } from 'next';
import Layout from '@/layouts/_layout';
import { useClientVideoList, useProducts } from '@/data/product';
import Grid from '@/components/product/grid';
import { useRouter } from 'next/router';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import client from '@/data/client';
import { dehydrate, QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import CategoryFilter from '@/components/product/category-filter';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  try {
    await Promise.all([
      queryClient.prefetchQuery(
        [API_ENDPOINTS.SETTINGS, { language: locale }],
        ({ queryKey }) =>
          client.settings.all(queryKey[1] as SettingsQueryOptions)
      ),
      // queryClient.prefetchInfiniteQuery(
      //   [API_ENDPOINTS.PRODUCTS, { language: locale }],
      //   ({ queryKey }) =>
      //     client.products.all(queryKey[1] as ProductQueryOptions)
      // ),
      // queryClient.prefetchInfiniteQuery(
      //   [API_ENDPOINTS.CATEGORIES, { limit: 100, language: locale }],
      //   ({ queryKey }) =>
      //     client.categories.all(queryKey[1] as CategoryQueryOptions)
      // ),
    ]);
    return {
      props: {
        ...(await serverSideTranslations(locale!, ['common'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
    };
  }
};

function Videos() {
  const { query } = useRouter();
  const { videos, isLoading, error } = useClientVideoList();
  const hasNextPage = false;
  const loadMore = () => {};
  return (
    <Grid
      videos={videos}
      limit={30}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoading}
      isLoading={isLoading}
    />
  );
}

// TODO: SEO text gulo translation ready hobe kina? r seo text gulo static thakbe or dynamic?
const Home: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="A YouTube Video Marketplace"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.home}
      />
      {/* <CategoryFilter /> */}
      <Videos />
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Home;
