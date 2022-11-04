import { NextPage } from 'next';
import { useForm } from '@mantine/form';
import { Button, createStyles, FileInput, Stack, Text, TextInput } from '@mantine/core';
import Layout from '../../components/Layout';
import { FormRow } from '../../components/Form/FormRow';
import { findOrCreateSessionID } from '../../utils/localStorage';
import { IContainerCreateForm, useCreateContainer } from '../../api/createContainer';

const useStyles = createStyles(() => ({
  formRow: {
    width: '50%',
    alignItems: 'center',
  },
}));
const SubmitPage: NextPage = () => {
  const { classes } = useStyles();
  const { mutate } = useCreateContainer({});
  // const [value, setValue] = useState<File | null>(null);

  const form = useForm<IContainerCreateForm>({
    initialValues: {
      userId: findOrCreateSessionID(),
      componentName: 'my-component',
      script: null,
      requirements: null,
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
    mutate(values);
    console.log(values);
  };

  return (
    <Layout>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack align="center">
          <FormRow className={classes.formRow}>
            <Text>User ID</Text>
            <TextInput {...form.getInputProps('userId')} />
          </FormRow>
          <FormRow className={classes.formRow}>
            <Text>Component name</Text>
            <TextInput {...form.getInputProps('componentName')} />
          </FormRow>
          <FormRow className={classes.formRow}>
            <Text>Python script (*)</Text>
            <FileInput {...form.getInputProps('script')} accept="text/x-python" />
          </FormRow>
          <FormRow className={classes.formRow}>
            <Text>requirement.txt (*)</Text>
            <FileInput {...form.getInputProps('requirements')} accept="text/plain" />
          </FormRow>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </Layout>
  );
};

export default SubmitPage;
