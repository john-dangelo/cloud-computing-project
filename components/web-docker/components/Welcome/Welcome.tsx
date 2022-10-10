import { Title, Text } from '@mantine/core';
import useStyles from './Welcome.styles';

export function Welcome() {
  const { classes } = useStyles();

  return (
    <>
      <Title className={classes.title} align="center" mt={100}>
        <Text inherit variant="gradient" component="span">
          Socialize
        </Text>
      </Title>
      <Text color="dimmed" align="center" size="lg" mx="auto" mt="xl">
        A CS 6343 Cloud Computing Project
      </Text>
    </>
  );
}
