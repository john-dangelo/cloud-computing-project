import { NextPage } from 'next';
import { useForm } from '@mantine/form';
import {
  Button,
  createStyles,
  MultiSelect,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import Layout from '../../components/Layout';
import { IWorkflowDTO } from '../../types';
import { FormRow } from '../../components/Form/FormRow';
import { useGetAllComponent } from '../../api/getComponents';
import { useGetAllWorkflows } from '../../api/getWorkflows';
import { useCreateWorkflow } from '../../api/createWorkflow';

type WorkflowSubmitForm = Partial<IWorkflowDTO>;

const useStyles = createStyles(() => ({
  formRow: {
    width: '50%',
    alignItems: 'center',
  },
}));
const SubmitPage: NextPage = () => {
  const { classes } = useStyles();
  const form = useForm<WorkflowSubmitForm>({
    initialValues: {
      name: '',
      component_list: [],
    },
  });
  const { data: components } = useGetAllComponent({});
  const { data: workflows } = useGetAllWorkflows({});
  const { mutateAsync } = useCreateWorkflow({});

  const handleSubmit = async (values: WorkflowSubmitForm) => {
    // console.log('form data', values);
    mutateAsync(values);
  };

  // const handleDatasourceSelectChange = (values: WorkflowSubmitForm['datasource']) => {
  //   setDatasource(values);
  //   form.setFieldValue('datasource', values);
  // };

  // const handleAnalysisTypeSelectChange = (values: WorkflowSubmitForm['analysisType']) => {
  //   setAnalysisType(values);
  //   form.setFieldValue('analysisType', values);
  // };

  // table
  const rows =
    workflows &&
    workflows.map((item) => (
      <tr key={item.name}>
        <td>{item.name}</td>
        <td>{item.component_list.join(', ')}</td>
      </tr>
    ));

  return (
    <Layout>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack align="center">
          <FormRow className={classes.formRow}>
            <Text>Workflow name</Text>
            <TextInput {...form.getInputProps('name')} />
          </FormRow>
          {components && (
            <FormRow className={classes.formRow}>
              <Text>Components</Text>
              <MultiSelect
                {...form.getInputProps('component_list')}
                data={components?.map((component) => ({
                  value: component.component_name,
                  label: component.component_name,
                }))}
              />
            </FormRow>
          )}
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
      <Table captionSide="bottom">
        <caption>Current workflows</caption>
        <thead>
          <tr>
            <th>Workflow name</th>
            <th>Components</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Layout>
  );
};

export default SubmitPage;
