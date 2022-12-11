import { Box, Button } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Welcome } from '../components/Welcome/Welcome';
import { ROUTES } from '../routes';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Welcome />
        <Link href={ROUTES.CREATE_JOBS.href} passHref>
          <Button size="md" sx={{ width: '200px' }} variant="outline">
            Submit a job
          </Button>
        </Link>
      </Box>
    </Layout>
  );
};

export default HomePage;
