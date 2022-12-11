import { Button, Center, Table } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetResults } from '../../api/getResults';
// import { LastUpdated } from '../../components/LastUpdated';
import Layout from '../../components/Layout';
import { ROUTES } from '../../routes';

const ResultInfo: NextPage = () => {
  const router = useRouter();
  const { jobId } = router.query;
  if (!jobId || Array.isArray(jobId)) return <></>;
  const { data } = useGetResults({
    query: { jobId },
    config: {
      refetchInterval: 500,
    },
  });

  const rows =
    data &&
    data.map((item) => (
      <tr key={item._id}>
        <td>{item.workflowId}</td>
        <td>{JSON.stringify(item.data)}</td>
      </tr>
    ));
  return (
    <Layout>
      {/* <LastUpdated data={data} /> */}
      <Center>
        <Link href={`${ROUTES.JOB_INFO.href.pathname}/${jobId}`} passHref>
          <Button size="md" sx={{ width: '200px' }} variant="outline">
            View log
          </Button>
        </Link>
      </Center>
      <Table captionSide="bottom">
        <caption>Result for job {jobId}</caption>
        <thead>
          <tr>
            <th>Job Id</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Layout>
  );
};

export default ResultInfo;
