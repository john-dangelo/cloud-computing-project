import { createStyles, Divider, DividerProps } from '@mantine/core';
import Link from 'next/link';
import React, { useMemo } from 'react';

import { ROUTES } from '../../routes';

import { NavLabel } from './NavLabel';

type INavBarProps = {
  isDropdown: boolean;
  closeBurger?: () => void;
};

const useNavBarStyles = createStyles((theme, navBarProps: INavBarProps) => ({
  wrapper: {
    display: 'flex',
    flexDirection: navBarProps.isDropdown ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function NavBar(props: INavBarProps) {
  const { isDropdown, closeBurger } = props;
  const { classes } = useNavBarStyles(props);

  const dividerProps: DividerProps = useMemo(
    () => ({
      sx: {
        width: isDropdown ? '75%' : '',
      },
      mx: 'xs',
      orientation: isDropdown ? 'horizontal' : 'vertical',
    }),
    [isDropdown],
  );

  return (
    <div className={classes.wrapper}>
      <Link key={ROUTES.HOME.label} href={ROUTES.HOME.href} passHref>
        <NavLabel isDropdown={isDropdown} closeBurger={closeBurger}>
          {ROUTES.HOME.label}
        </NavLabel>
      </Link>
      <Divider {...dividerProps} />
      <Link key={ROUTES.SUBMIT.label} href={ROUTES.SUBMIT.href} passHref>
        <NavLabel isDropdown={isDropdown} closeBurger={closeBurger}>
          {ROUTES.SUBMIT.label}
        </NavLabel>
      </Link>
      <Divider {...dividerProps} />
      <Link key={ROUTES.INFO.label} href={ROUTES.INFO.href} passHref>
        <NavLabel isDropdown={isDropdown} closeBurger={closeBurger}>
          {ROUTES.INFO.label}
        </NavLabel>
      </Link>
    </div>
  );
}

export default NavBar;
