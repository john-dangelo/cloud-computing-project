import { Button } from '@mantine/core';
import { NextPage } from 'next';
import { useGetPing } from '../../api/getPing';

const AdminPage: NextPage = () => {
  const { data, refetch } = useGetPing({
    body: {
      ip: '127.0.0.1',
    },
  });
  return (
    <>
      {data && JSON.stringify(data)}
      <Button
        onClick={() => {
          refetch();
        }}
      />
    </>
  );
};

export default AdminPage;
