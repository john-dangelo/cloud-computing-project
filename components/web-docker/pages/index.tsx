import { NextPage } from 'next';
import os from 'os';
import { IMachineInfo, MachineInfo } from '../components/MachineInfo/MachineInfo';
import { Welcome } from '../components/Welcome/Welcome';

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

const HomePage: NextPage<{ machineInfo: IMachineInfo }> = (props) => {
  return (
    <>
      <Welcome />
      <MachineInfo data={props.machineInfo} />
    </>
  );
};

export default HomePage;
