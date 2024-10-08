import type { Product, Video } from '@/types';
import cn from 'classnames';
import routes from '@/config/routes';
import AnchorLink from '@/components/ui/links/anchor-link';
import { ShoppingCartIcon } from '@/components/icons/shopping-cart-icon';
import Image from '@/components/ui/image';
import AddToCart from '@/components/cart/add-to-cart';
import VideoAddToCart from '@/components/cart/video-add-to-cart';
import placeholder from '@/assets/images/placeholders/product.svg';
import { isFree } from '@/lib/is-free';
import { DownloadIcon } from '@/components/icons/download-icon';
import pluralize from 'pluralize';
import FreeDownloadButton from './free-download-button';
import FavoriteButton from '@/components/favorite/favorite-button';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { YouTubeIcon } from '../icons/social';
import Button from '@/components/ui/button';
interface Props {
  video: Video;
  className?: string;
  canWatch?: boolean;
}

export default function VideoDetailsPaper({
  video,
  className,
  canWatch,
}: Props) {
  const { platform_id, video_info, video_price, n_price } = video;
  const isFreeItem = isFree(n_price);
  const { t } = useTranslation('common');
  const router = useRouter();
  console.log('Can watch', canWatch);
  return (
    <div
      className={cn(
        'items-center justify-between lg:flex lg:w-full',
        className
      )}
    >
      <div className="lg:block ltr:lg:pr-5 rtl:lg:pl-5">
        <div className="flex items-center justify-center ">
          <h1 className="text-base font-medium text-dark dark:text-light 3xl:text-lg">
            {video_info?.title}
          </h1>

          {/* <FavoriteButton productId={platform_id} /> */}
        </div>

        <div className="items-center pt-1.5 rtl:space-x-reverse lg:flex lg:space-x-6 lg:pt-2.5">
          <div className="flex items-center pb-4 lg:pb-0">
            <div className="relative flex h-7 w-7 flex-shrink-0">
              <Image
                alt={video_info.ch_info.title}
                fill
                quality={100}
                src={video_info.ch_info.thumbnail_url ?? placeholder}
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="font-medium ltr:pl-2.5 rtl:pr-2.5 dark:text-dark-base lg:text-dark lg:dark:text-light-400">
              <AnchorLink
                href={routes.channelUrl(video_info.ch_info.id)}
                className="hover:text-brand"
              >
                {video_info.ch_info.title}
              </AnchorLink>
            </h2>
          </div>
          {
            <div className="flex space-x-6 border-y border-light-500 py-3 rtl:space-x-reverse dark:border-dark-400 sm:py-4 lg:border-0 lg:py-0">
              {!isFreeItem && (
                <div className="flex items-center tracking-[.1px] text-dark dark:text-light">
                  <ShoppingCartIcon className="h-[18px] w-[18px] text-dark-900 ltr:mr-2.5 rtl:ml-2.5 dark:text-light-900" />
                  {pluralize('Sale', video.sales, true)}
                </div>
              )}
              {/* <div className="flex items-center tracking-[.1px] text-dark dark:text-light">
                <DownloadIcon className="h-[18px] w-[18px] text-dark-900 ltr:mr-2.5 rtl:ml-2.5 dark:text-light-900" />
                {pluralize(t('text-download'), 60, true)}
              </div> */}
            </div>
          }
        </div>
      </div>
      {canWatch ? (
        <Button
          className="mt-2.5 w-full flex-1 xs:mt-0"
          onClick={() => {
            router.push(`/watch/${platform_id}`);
          }}
        >
          Watch Now
        </Button>
      ) : (
        <div className="flex flex-col-reverse items-center py-3.5 xs:flex-row xs:gap-2.5 sm:py-4 md:gap-3.5 lg:w-[480px] lg:gap-4 lg:py-2 2xl:w-2/5 3xl:w-[480px]">
          <VideoAddToCart
            item={video}
            toastClassName="-mt-10 xs:mt-0"
            className="mt-2.5 w-full flex-1 xs:mt-0"
          />
        </div>
      )}
    </div>
  );
}

export function VideoDetailsPaperNoBuy({ video, className }: Props) {
  const { platform_id, video_info, video_price, n_price } = video;
  const isFreeItem = isFree(n_price);
  const { t } = useTranslation('common');
  return (
    <div
      className={cn(
        'items-center justify-between lg:flex lg:w-full',
        className
      )}
    >
      <div className="lg:block ltr:lg:pr-5 rtl:lg:pl-5">
        <div className="flex items-center justify-center ">
          <h1 className="text-base font-medium text-dark dark:text-light 3xl:text-lg">
            {video_info?.title}
          </h1>

          {/* <FavoriteButton productId={platform_id} /> */}
        </div>

        <div className="items-center pt-1.5 rtl:space-x-reverse lg:flex lg:space-x-6 lg:pt-2.5">
          <div className="flex items-center pb-4 lg:pb-0">
            <div className="relative flex h-7 w-7 flex-shrink-0">
              <Image
                alt={video_info.ch_info.title}
                fill
                quality={100}
                src={video_info.ch_info.thumbnail_url ?? placeholder}
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="font-medium ltr:pl-2.5 rtl:pr-2.5 dark:text-dark-base lg:text-dark lg:dark:text-light-400">
              <AnchorLink
                href={routes.channelUrl(video_info.ch_info.id)}
                className="hover:text-brand"
              >
                {video_info.ch_info.title}
              </AnchorLink>
            </h2>
          </div>
          {
            <div className="flex space-x-6 border-y border-light-500 py-3 rtl:space-x-reverse dark:border-dark-400 sm:py-4 lg:border-0 lg:py-0">
              {!isFreeItem && (
                <div className="flex items-center tracking-[.1px] text-dark dark:text-light">
                  <ShoppingCartIcon className="h-[18px] w-[18px] text-dark-900 ltr:mr-2.5 rtl:ml-2.5 dark:text-light-900" />
                  {pluralize('Sale', video.sales, true)}
                </div>
              )}
              {/* <div className="flex items-center tracking-[.1px] text-dark dark:text-light">
                <DownloadIcon className="h-[18px] w-[18px] text-dark-900 ltr:mr-2.5 rtl:ml-2.5 dark:text-light-900" />
                {pluralize(t('text-download'), 60, true)}
              </div> */}
            </div>
          }
        </div>
      </div>
      <div className="flex flex-col-reverse items-center py-3.5 xs:flex-row xs:gap-2.5 sm:py-4 md:gap-3.5 lg:w-[480px] lg:gap-4 lg:py-2 2xl:w-2/5 3xl:w-[480px]">
        {/* <VideoAddToCart
            item={video}
            toastClassName="-mt-10 xs:mt-0"
            className="mt-2.5 w-full flex-1 xs:mt-0"
          /> */}

        {/* {Boolean(preview_url) && (
          <a
            href={preview_url}
            rel="noreferrer"
            target="_blank"
            className="transition-fill-colors flex min-h-[46px] w-full flex-1 items-center justify-center gap-2 rounded border border-light-600 bg-transparent py-3 px-4 font-semibold text-dark duration-200 hover:bg-light-400 focus:bg-light-500 dark:border-dark-600 dark:text-light dark:hover:bg-dark-600 dark:focus:bg-dark-600 xs:w-auto sm:h-12 md:px-5"
          >
            {t('text-live-preview')}
          </a>
        )} */}
      </div>
    </div>
  );
}
