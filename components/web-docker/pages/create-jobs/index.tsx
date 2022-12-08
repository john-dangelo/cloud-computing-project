import { GetServerSideProps, NextPage } from 'next';
import { useForm } from '@mantine/form';
import {
  Box,
  Button,
  Center,
  createStyles,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { DragHandleDots2Icon } from '@modulz/radix-icons';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { IJobSubmitForm, IWorkflowDTO } from '../../types';
import { FormRow } from '../../components/Form/FormRow';
import { useCreateJob } from '../../api/createJob';
import { useJobStore } from '../../stores/jobs';
import { getAllWorkflows } from '../../api/getWorkflows';
import { DraggableFormItems } from '../../components/Form/DraggableFormItems';
import { useUpdateWorkflow } from '../../api/updateWorkflow';
import { useGetAllJobs } from '../../api/getJobs';
import { ROUTES } from '../../routes';

const useStyles = createStyles(() => ({
  formRow: {
    width: '50%',
    alignItems: 'center',
  },
}));

type CreateJobsProps = {
  workflows: IWorkflowDTO[];
};

export const getServerSideProps: GetServerSideProps<CreateJobsProps> = async (
  context,
) => {
  // console.log('type', type);
  const data = await getAllWorkflows();

  return { props: { workflows: data } };
};

const SubmitPage: NextPage<CreateJobsProps> = (props) => {
  const { classes } = useStyles();
  const { workflows } = props;
  const form = useForm<IJobSubmitForm>({
    initialValues: {
      workflowName: '',
      parameters: [''],
      state: 'pending',
      component_list: [],
    },
  });
  const { mutateAsync, data } = useCreateJob({});
  const { mutate: mutateWorkflow } = useUpdateWorkflow({});
  const { data: serverJobs } = useGetAllJobs({});
  const { jobs, addJob } = useJobStore((state) => state);
  const [currentWorkflow, setCurrentWorkflow] = useState<IWorkflowDTO | undefined>();

  const handleSubmit = async (values: IJobSubmitForm) => {
    // const submission: IJobSubmit = {
    //   workflowName: `${values.datasource}-${values.analysisType}`,
    //   parameters: {
    //     numberOfPosts: values.numberOfPosts,
    //   },
    // };
    // // console.log(submission);
    // await mutateWorkflow({
    //   component_list: values.component_list,
    //   _id: currentWorkflow?._id,
    // });
    const res = await mutateAsync(values);
    // addJob(res, submission);
    console.log('form data', res);
  };

  const handleWorkflowChange = (workflowName: IJobSubmitForm['workflowName']) => {
    // console.log('onWorkflow change', workflowName);
    form.getInputProps('workflowName').onChange(workflowName);
    const workflow = workflows?.find((item) => item.name === workflowName);
    if (workflow) {
      setCurrentWorkflow(workflow);
      form.setFieldValue(
        'parameters',
        workflow.component_list.map(() => ''),
      );
      form.setFieldValue('component_list', workflow.component_list);
    }
  };

  // table
  const rows =
    serverJobs &&
    serverJobs.map((item) => (
      <tr key={item._id}>
        <td>
          <Link href={`${ROUTES.JOB_INFO.href.pathname}/${item._id}`}>{item._id}</Link>
        </td>
        <td>{item.workflowName}</td>
        <td>{item.parameters.join(', ')}</td>
        <td>{item.component_list?.join(', ')}</td>
        <td>{item.state}</td>
      </tr>
    ));

  return (
    <Layout>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack align="center">
          {workflows && (
            <FormRow className={classes.formRow}>
              <Text>Workflow</Text>
              <Select
                {...form.getInputProps('workflowName')}
                onChange={handleWorkflowChange}
                data={workflows.map((workflow) => ({
                  value: workflow.name,
                  label: workflow.name,
                }))}
              />
            </FormRow>
          )}
          <DraggableFormItems
            draggable
            onDragEnd={async ({ destination, source }) => {
              const newComponentList = form.values.component_list.slice(); // still old component list
              const temp = newComponentList[source.index];
              newComponentList[source.index] = newComponentList[destination?.index || 0];
              newComponentList[destination?.index || 0] = temp;
              // await mutateWorkflow({
              //   component_list: newComponentList,
              //   _id: currentWorkflow?._id,
              // });
              setCurrentWorkflow(
                (current) =>
                  current && {
                    ...current,
                    component_list: newComponentList,
                  },
              );
              form.reorderListItem('parameters', {
                from: source.index,
                to: destination?.index || 0,
              });
              form.reorderListItem('component_list', {
                from: source.index,
                to: destination?.index || 0,
              });
            }}
            droppableDirection="horizontal"
            title="Components"
          >
            {form.values.component_list?.map((item, index) => (
              <Draggable key={index} index={index} draggableId={String(index)}>
                {(provided) => (
                  <Group
                    ref={provided.innerRef}
                    p="xs"
                    {...provided.draggableProps}
                    align="center"
                  >
                    <Center {...provided.dragHandleProps}>
                      <Box>
                        <DragHandleDots2Icon />
                      </Box>
                    </Center>
                    <Stack>
                      <Text>{item}</Text>
                      <TextInput
                        withAsterisk
                        label="Command"
                        {...form.getInputProps(`parameters.${index}`)}
                      />
                    </Stack>
                  </Group>
                )}
              </Draggable>
            ))}
          </DraggableFormItems>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
      <Table captionSide="bottom">
        <caption>Current jobs</caption>
        <thead>
          <tr>
            <th>JobId</th>
            <th>Workflow name</th>
            <th>Parameters</th>
            <th>Components</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Layout>
  );
};

export default SubmitPage;
