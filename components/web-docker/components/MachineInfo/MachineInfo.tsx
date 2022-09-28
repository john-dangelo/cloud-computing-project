import { Paper, Table, Text } from '@mantine/core';
import os from 'os';
import { FC, Fragment } from 'react';

export type IMachineInfo = {
  hostname: string;
  mem: number;
  networkInterfaces: ReturnType<typeof os.networkInterfaces>;
};

type IMachineInfoProps = {
  data: IMachineInfo;
};

export const MachineInfo: FC<IMachineInfoProps> = (props) => {
  const { data } = props;

  const rows =
    data.networkInterfaces &&
    Object.entries(data.networkInterfaces).map(([key, val]) => (
      <Fragment key={key}>
        {val &&
          val.map((item) => (
            <tr key={key + item.address}>
              <td>{key}</td>
              <td>{item.address}</td>
              <td>{item.mac}</td>
            </tr>
          ))}
      </Fragment>
    ));
  return (
    <Paper>
      <Text weight="bold" align="left" variant="gradient">
        I am running on:
      </Text>
      <Text weight="bold" align="left">
        <Text weight="bold" component="span" color="gray" variant="gradient">
          Hostname:
        </Text>{' '}
        {data.hostname}
      </Text>
      <Text weight="bold" align="left">
        <Text weight="bold" component="span" color="gray" variant="gradient">
          Memory:
        </Text>{' '}
        {(data.mem / 1000000).toLocaleString('en-us')} GB
      </Text>

      <Table>
        <thead>
          <tr>
            <th>Interface Name</th>
            <th>Address</th>
            <th>MAC</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  );
};
