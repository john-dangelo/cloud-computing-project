import { NextPage } from 'next';
import { useForm } from '@mantine/form';
import {
  Button,
  Checkbox,
  createStyles,
  FileInput,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import Layout from '../../components/Layout';
import { FormRow } from '../../components/Form/FormRow';
import { findOrCreateSessionID } from '../../utils/localStorage';
import { IContainerCreateForm, useCreateContainer } from '../../api/createContainer';
import { useGetAllComponent } from '../../api/getComponents';

const useStyles = createStyles(() => ({
  formRow: {
    width: '50%',
    alignItems: 'center',
  },
}));
const SubmitPage: NextPage = () => {
  const { classes } = useStyles();
  const { mutate } = useCreateContainer({});
  const { data } = useGetAllComponent({
    config: {
      refetchInterval: 1000,
    },
  });
  // console.log('data', data);
  // const [value, setValue] = useState<File | null>(null);

  const form = useForm<IContainerCreateForm>({
    initialValues: {
      userId: findOrCreateSessionID(),
      componentName: 'my-component',
      script: null,
      requirements: null,
      useDockerHub: false,
    },
  });
  // const { mutateAsync, data } = useCreateJob({});
  // const { jobs, addJob } = useJobStore((state) => state);
  // const [datasource, setDatasource] = useState<ContainerCreateForm['datasource'] | null>(
  //   'facebook',
  // );
  // const [analysisType, setAnalysisType] = useState<
  //   ContainerCreateForm['analysisType'] | null
  // >('sentiment');

  const handleSubmit = async (values: IContainerCreateForm) => {
    // console.log(values);
    mutate(values);
  };

  // table
  const rows =
    data &&
    data.map((item) => (
      <tr key={item.component_name}>
        <td>{item.component_name}</td>
        <td>{item.status}</td>
      </tr>
    ));

  return (
    <Layout>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack align="center">
          <FormRow className={classes.formRow}>
            <Text>User ID</Text>
            <TextInput {...form.getInputProps('userId')} />
          </FormRow>
          {/* <FormRow className={classes.formRow}>
            <Text>Use Docker Hub?</Text>
            <Checkbox {...form.getInputProps('useDockerHub')} />
          </FormRow> */}
          <FormRow className={classes.formRow}>
            <Text>Component name</Text>
            <TextInput {...form.getInputProps('componentName')} />
          </FormRow>
          <FormRow className={classes.formRow}>
            <Text>Python script (*)</Text>
            <FileInput
              {...form.getInputProps('script')}
              accept="text/x-python"
              disabled={form.values.useDockerHub}
            />
          </FormRow>
          <FormRow className={classes.formRow}>
            <Text>requirement.txt (*)</Text>
            <FileInput
              {...form.getInputProps('requirements')}
              accept="text/plain"
              disabled={form.values.useDockerHub}
            />
          </FormRow>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
      <Table captionSide="bottom">
        <caption>Current components</caption>
        <thead>
          <tr>
            <th>Component name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Layout>
  );
};

export default SubmitPage;
