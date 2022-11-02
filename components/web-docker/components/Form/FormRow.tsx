import { Grid, GridProps } from '@mantine/core';
import React, { FC, ReactNode } from 'react';

type FormRowProps = GridProps & {
  children: [ReactNode, ReactNode];
};
export const FormRow: FC<FormRowProps> = (props) => {
  return (
    <Grid {...props}>
      <Grid.Col span={4}>{props.children[0]}</Grid.Col>
      <Grid.Col span={8}>{props.children[1]}</Grid.Col>
    </Grid>
  );
};
