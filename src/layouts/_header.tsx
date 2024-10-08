import type { User } from '@/types';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Avatar from 'react-avatar';
import routes from '@/config/routes';
import Logo from '@/components/ui/logo';
import ThemeSwitcher from '@/components/ui/theme-switcher';
import ActiveLink from '@/components/ui/links/active-link';
import { useLogout, useMe } from '@/data/user';
import { Menu } from '@/components/ui/dropdown';
import { Transition } from '@/components/ui/transition';
import { UserIcon } from '@/components/icons/user-icon';
import SearchButton from '@/components/search/search-button';
import CartButton from '@/components/cart/cart-button';
import Hamburger from '@/components/ui/hamburger';
import GridSwitcher from '@/components/product/grid-switcher';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useSwapBodyClassOnScrollDirection } from '@/lib/hooks/use-swap-body-class';
import { useModalAction } from '@/components/modal-views/context';
import Button from '@/components/ui/button';
import LanguageSwitcher from '@/components/ui/language-switcher';
import { useTranslation } from 'next-i18next';

const AuthorizedMenuItems = [
  {
    label: 'Home',
    path: routes.home,
  },
  {
    label: 'My Videos',
    path: routes.myvideos,
  },
  // {
  //   label: 'text-auth-wishlist',
  //   path: routes.wishlists,
  // },
  // {
  //   label: 'text-followed-authors',
  //   path: routes.followedShop,
  // },
  // {
  //   label: 'text-auth-password',
  //   path: routes.password,
  // },
];

function AuthorizedMenu({ user }: { user: User }) {
  const { mutate: logout } = useLogout();
  const { t } = useTranslation('common');
  return (
    <Menu>
      <Menu.Button className="relative inline-flex h-8 w-8 justify-center rounded-full border border-light-400 bg-light-300 dark:border-dark-500 dark:bg-dark-500">
        {/* @ts-ignore */}
        <Avatar
          size="32"
          round={true}
          name={user.name}
          textSizeRatio={2}
          src={user?.profile?.avatar?.thumbnail}
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute top-[84%] z-30 mt-4 w-56 rounded-md bg-light py-1.5 text-dark shadow-dropdown ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left dark:bg-dark-250 dark:text-light">
          {AuthorizedMenuItems.map((item) => (
            <Menu.Item key={item.label}>
              <ActiveLink
                href={item.path}
                className="transition-fill-colors flex w-full items-center px-5 py-2.5 hover:bg-light-400 dark:hover:bg-dark-600"
              >
                {t(item.label)}
              </ActiveLink>
            </Menu.Item>
          ))}
          <Menu.Item>
            <button
              type="button"
              className="transition-fill-colors w-full px-5 py-2.5 hover:bg-light-400 ltr:text-left rtl:text-right dark:hover:bg-dark-600"
              onClick={() => logout()}
            >
              {t('text-logout')}
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function LoginMenu() {
  const { openModal } = useModalAction();
  const { me, isAuthorized, isLoading } = useMe();
  const isMounted = useIsMounted();
  if (!isMounted) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-light-300 dark:bg-dark-500" />
    );
  }
  if (isAuthorized && me && !isLoading) {
    return <AuthorizedMenu user={me} />;
  }
  return (
    <Button
      variant="icon"
      aria-label="User"
      className="flex"
      onClick={() => openModal('LOGIN_VIEW')}
    >
      <UserIcon className="h-5 w-5" />
    </Button>
  );
}

interface HeaderProps {
  isCollapse?: boolean;
  showHamburger?: boolean;
  onClickHamburger?: () => void;
}

export default function Header({
  isCollapse,
  showHamburger = false,
  onClickHamburger,
}: HeaderProps) {
  const { asPath } = useRouter();
  const { t } = useTranslation('common');
  useSwapBodyClassOnScrollDirection();
  const isMultiLangEnable =
    process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
    !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;
  return (
    <header className="app-header sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-light-300 bg-light px-4 py-1 ltr:left-0 rtl:right-0 dark:border-dark-300 dark:bg-dark-250 sm:h-[70px] sm:px-6">
      <div className="flex items-center gap-4">
        {showHamburger && (
          <Hamburger
            isToggle={isCollapse}
            onClick={onClickHamburger}
            className="hidden sm:flex"
          />
        )}
        <Logo />
      </div>
      <div className="relative flex items-center gap-5 pr-0.5 xs:gap-6 sm:gap-7">
        {/* <SearchButton className="hidden sm:flex" /> */}
        <ThemeSwitcher />
        <GridSwitcher />
        {/* {asPath !== routes.checkout && (
          <CartButton className="hidden sm:flex" />
        )} */}
        {isMultiLangEnable ? (
          <div className="ltr:ml-auto rtl:mr-auto">
            <LanguageSwitcher />
          </div>
        ) : (
          ''
        )}
        <a
          href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/register`}
          target="_blank"
          rel="noreferrer"
          className="focus:ring-accent-700 hidden h-9 shrink-0 items-center justify-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-brand-dark focus:shadow focus:outline-none focus:ring-1 sm:inline-flex"
        >
          Sell Your Videos
        </a>
        <LoginMenu />
      </div>
    </header>
  );
}
