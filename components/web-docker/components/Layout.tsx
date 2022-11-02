import { AppShell } from '@mantine/core';
import type { ReactNode } from 'react';

import MyHeader from './MyHeader';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AppShell
      padding={0}
      header={<MyHeader />}
      fixed={false}
      styles={(theme) => ({
        root: {
          width: '100%',
          height: '100%',
        },
        body: {
          backgroundColor: theme.colors.gray[1],
          width: '100%',
          height: '100%',
        },
        main: {
          width: '100%',
          height: '100%',
        },
      })}
    >
      {children}
    </AppShell>
  );
}
