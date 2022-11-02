import { Header, Group, createStyles, Burger, Transition, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';

import { HEADER_HEIGHT } from '../config';

import NavBar from './Navigation/NavBar';

const useStyles = createStyles((theme) => ({
  headerGroup: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  navbarGroup: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    width: '100%',
    maxHeight: '100%',
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
  burger: {
    position: 'absolute',
    left: theme.spacing.sm,
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

function MyHeader() {
  // const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes } = useStyles();
  // const onClick = useCallback(() => {
  //   toggleColorScheme();
  // }, [toggleColorScheme]);

  return (
    <Header height={HEADER_HEIGHT} p="xs" withBorder>
      <Group className={classes.headerGroup} position="apart">
        <div className={classes.navbarGroup}>
          <NavBar isDropdown={false} />
        </div>
        <Burger opened={opened} onClick={toggle} className={classes.burger} size="md" />
        <Transition transition="scale-y" duration={200} mounted={opened}>
          {(styles) => (
            <Paper
              className={classes.dropdown}
              withBorder
              style={styles}
              sx={{ zIndex: 10 }}
            >
              <NavBar isDropdown closeBurger={close} />
            </Paper>
          )}
        </Transition>
      </Group>
    </Header>
  );
}

export default MyHeader;
