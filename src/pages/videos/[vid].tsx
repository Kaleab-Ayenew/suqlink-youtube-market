import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useRouter } from 'next/router';
import type { NextPageWithLayout, Product, Video } from '@/types';
import { motion } from 'framer-motion';
import Layout from '@/layouts/_layout';
import client from '@/data/client';
import Image from '@/components/ui/image';
import ProductSocialShare from '@/components/product/product-social-share';
import ProductInformation from '@/components/product/product-information';
import ProductDetailsPaper from '@/components/product/product-details-paper';
import VideoDetailsPaper from '@/components/product/video-details-paper';
import { LongArrowIcon } from '@/components/icons/long-arrow-icon';
import { staggerTransition } from '@/lib/framer-motion/stagger-transition';
import routes from '@/config/routes';
import {
  fadeInBottom,
  fadeInBottomWithScaleX,
  fadeInBottomWithScaleY,
} from '@/lib/framer-motion/fade-in-bottom';
import placeholder from '@/assets/images/placeholders/product.svg';
import ProductReviews from '@/components/review/product-reviews';
import AverageRatings from '@/components/review/average-ratings';
import ProductQuestions from '@/components/questions/product-questions';
import isEmpty from 'lodash/isEmpty';
import invariant from 'tiny-invariant';

// This function gets called at build time
type ParsedQueryParams = {
  vid: string;
};

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
  invariant(locales, 'locales is not defined');
  const videos = await client.videos.all();
  const paths = videos?.flatMap((video) =>
    locales?.map((locale) => ({
      params: { vid: video.platform_id },
      locale,
    }))
  );
  return {
    paths,
    fallback: 'blocking',
  };
};

type PageProps = {
  video: Video;
};

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const { vid } = params!; //* we know it's required because of getStaticPaths
  try {
    const video = await client.videos.get({
      platform_id: vid,
    });
    return {
      props: {
        video,
        ...(await serverSideTranslations(locale!, ['common'])),
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

function getPreviews(gallery: any[], image: any) {
  if (!isEmpty(gallery) && Array.isArray(gallery)) return gallery;
  if (!isEmpty(image)) return [image, {}];
  return [{}, {}];
}

const VideoPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ video }) => {
  const { t } = useTranslation('common');
  const { platform_id, video_info, video_price } = video;
  const router = useRouter();
  //   const previews = getPreviews(gallery, image);

  return (
    <div className="relative">
      <div className="h-full min-h-screen p-4 md:px-6 lg:px-8 lg:pt-6">
        <div className="sticky top-0 z-20 -mx-4 -mt-2 mb-1 flex items-center bg-light-300 p-4 dark:bg-dark-100 sm:static sm:top-auto sm:z-0 sm:m-0 sm:mb-4 sm:bg-transparent sm:p-0 sm:dark:bg-transparent">
          <button
            onClick={() => router.push(routes?.home)}
            className="group inline-flex items-center gap-1.5 font-medium text-dark/70 hover:text-dark rtl:flex-row-reverse dark:text-light/70 hover:dark:text-light lg:mb-6"
          >
            <LongArrowIcon className="h-4 w-4" />
            back
          </button>
        </div>
        <motion.div
          variants={staggerTransition()}
          className="grid gap-4 lg:grid-cols-1 lg:gap-6"
        >
          <motion.div
            variants={fadeInBottomWithScaleX()}
            className="relative aspect-[3/2]"
          >
            <Image
              alt={video_info?.title}
              fill
              quality={100}
              src={video_info?.thumbnail_url ?? placeholder}
              className="bg-light-500 object-cover dark:bg-dark-300"
            />
          </motion.div>
        </motion.div>
        <motion.div
          variants={fadeInBottom()}
          className="justify-center py-6 lg:flex lg:flex-col lg:py-10"
        >
          <VideoDetailsPaper video={video} className="lg:block" />
          <div className="lg:mx-auto 3xl:max-w-[1200px]">
            <div className="w-full rtl:space-x-reverse lg:flex lg:space-x-14 lg:pb-3 xl:space-x-20 3xl:space-x-28">
              <div className="hidden lg:block 3xl:max-w-[600px]">
                <div className="pb-5 leading-[1.9em] dark:text-light-600">
                  {video_info.description}
                </div>
                {/* <ProductSocialShare
                  productSlug={platform_id}
                  className="border-t border-light-500 pt-5 dark:border-dark-400 md:pt-7"
                /> */}
              </div>
              {/* <ProductInformation
                tags={tags}
                created_at={created_at}
                updated_at={updated_at}
                layoutType={type.name}
                //@ts-ignore
                icon={type?.icon}
                className="flex-shrink-0 pb-6 pt-2.5 lg:min-w-[350px] lg:max-w-[470px] lg:pb-0"
              /> */}
            </div>
            {/* <div className="mt-4 w-full md:mt-8 md:space-y-10 lg:mt-12 lg:flex lg:flex-col lg:space-y-12">
              <AverageRatings
                ratingCount={rating_count}
                totalReviews={total_reviews}
                ratings={ratings}
              />
              <ProductReviews productId={id} />
              <ProductQuestions
                productId={product?.id}
                shopId={product?.shop?.id}
              />
            </div> */}
          </div>

          {/* <ProductSocialShare
            productSlug={platform_id}
            className="border-t border-light-500 pt-5 dark:border-dark-400 md:pt-7 lg:hidden"
          /> */}
        </motion.div>
      </div>
      <motion.div
        variants={fadeInBottomWithScaleY()}
        className="sticky bottom-0 right-0 z-10 hidden h-[100px] w-full border-t border-light-500 bg-light-100 px-8 py-5 dark:border-dark-400 dark:bg-dark-200 lg:flex 3xl:h-[120px]"
      >
        <VideoDetailsPaper video={video} />
      </motion.div>
    </div>
  );
};

VideoPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default VideoPage;
