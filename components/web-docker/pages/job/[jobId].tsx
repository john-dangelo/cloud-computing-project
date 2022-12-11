import { Button, Center, Table } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetLogs } from '../../api/getLogs';
import Layout from '../../components/Layout';
import { ROUTES } from '../../routes';

const JobInfo: NextPage = () => {
  const router = useRouter();
  const { jobId } = router.query;
  if (!jobId || Array.isArray(jobId)) return <></>;
  const { data } = useGetLogs({
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
        <td>{item.currentAddress}</td>
        <td>{item.nextAddress}</td>
        <td>{item.timestamp}</td>
        <td>{JSON.stringify(item.data)}</td>
      </tr>
    ));
  return (
    <Layout>
      <Center>
        <Link href={`${ROUTES.JOB_RESULT.href.pathname}/${jobId}`} passHref>
          <Button size="md" sx={{ width: '200px' }} variant="outline">
            View result
          </Button>
        </Link>
      </Center>
      <Table captionSide="bottom">
        <caption>Log for job {jobId}</caption>
        <thead>
          <tr>
            <th>Job Id</th>
            <th>Current Address</th>
            <th>Next Address</th>
            <th>Timestamp</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Layout>
  );
};

export default JobInfo;
