import { NextPage } from 'next';
import os from 'os';
import Layout from '../../components/Layout';
import { IMachineInfo, MachineInfo } from '../../components/MachineInfo/MachineInfo';

export const getServerSideProps = async (): Promise<{
  props: { machineInfo: IMachineInfo };
}> => {
  return {
    props: {
      machineInfo: {
        hostname: os.hostname(),
        mem: os.totalmem(),
        networkInterfaces: os.networkInterfaces(),
      },
    },
  };
};

const AdminPage: NextPage<{ machineInfo: IMachineInfo }> = (props) => {
  return (
    <Layout>
      <MachineInfo data={props.machineInfo} />
    </Layout>
  );
};

export default AdminPage;
