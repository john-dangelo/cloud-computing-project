import { createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import React, {
  forwardRef,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

export type INavLabelProps = {
  isDropdown: boolean;
  href?: string;
  onClick?: MouseEventHandler; // passed down from Link component
  closeBurger?: Function; // passed down from NavBar component
  children: ReactNode;
};

const useLabelStyles = createStyles((theme, labelProps: INavLabelProps) => ({
  label: {
    '&:hover': {
      // color: 'lightblue'
    },
  },
  labelWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: labelProps.isDropdown ? '100%' : '',
    minWidth: '50px',
    padding: '10px 15px',
    borderRadius: '5px',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.1rem',
    color: theme.colors[theme.primaryColor][8],
    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][0],
      cursor: 'pointer',
      transition: 'background-color 500ms ease',
    },
    '&.active': {
      color: theme.colors[theme.primaryColor][9],
      borderBottom: `2px solid ${theme.colors[theme.primaryColor][9]}`,
      padding: '10px 15px 8px 15px', // minus 2px from border size
      fontWeight: 900,
    },
  },
}));

export const NavLabel = forwardRef((props: INavLabelProps, ref) => {
  const { children, href, onClick, closeBurger } = props;
  const router = useRouter();
  const { classes, cx } = useLabelStyles(props);
  const [className, setClassName] = useState('');
  const processedHref = href && href.split('?')[0];
  const isActive = processedHref && router.asPath === href;

  const onClickWithCloseBurger: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      onClick && onClick(event);
      closeBurger && closeBurger();
    },
    [closeBurger, onClick],
  );

  useEffect(() => {
    if (router.isReady) {
      setClassName(cx(classes.labelWrapper, isActive && 'active'));
    }
  }, [classes.labelWrapper, cx, isActive, router.isReady]);

  return (
    <div onClick={onClickWithCloseBurger} className={className}>
      <a href={href} className={classes.label}>
        {children}
      </a>
    </div>
  );
});

NavLabel.displayName = 'NavLabel';
