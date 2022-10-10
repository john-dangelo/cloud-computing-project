import { NextPage } from 'next';
import { useForm } from '@mantine/form';
import {
  Button,
  createStyles,
  Select,
  Slider,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { IJobSubmit } from '../api/submit';
import { IWorkflowAnalysisType, IWorkflowDatasource } from '../../types';
import { FormRow } from '../../components/Form/FormRow';
import { useCreateJob } from '../../api/createJob';

type JobSubmitForm = {
  datasource: `${IWorkflowDatasource}`;
  analysisType: `${IWorkflowAnalysisType}`;
  numberOfPosts?: number;
};

const useStyles = createStyles(() => ({
  formRow: {
    width: '50%',
    alignItems: 'center',
  },
}));
const SubmitPage: NextPage = () => {
  const { classes } = useStyles();
  const form = useForm<JobSubmitForm>({
    initialValues: {
      datasource: 'facebook',
      analysisType: 'sentiment',
      numberOfPosts: 50,
    },
  });
  const mutation = useCreateJob({});
  const [datasource, setDatasource] = useState<JobSubmitForm['datasource'] | null>(
    'facebook',
  );
  const [analysisType, setAnalysisType] = useState<JobSubmitForm['analysisType'] | null>(
    'sentiment',
  );

  const handleSubmit = (values: JobSubmitForm) => {
    const submission: IJobSubmit = {
      workflowName: `${values.datasource}-${values.analysisType}`,
      parameters: {
        numberOfPosts: values.numberOfPosts,
      },
    };
    // console.log(submission);
    mutation.mutate(submission);
  };

  const handleDatasourceSelectChange = (values: JobSubmitForm['datasource']) => {
    setDatasource(values);
    form.setFieldValue('datasource', values);
  };

  const handleAnalysisTypeSelectChange = (values: JobSubmitForm['analysisType']) => {
    setAnalysisType(values);
    form.setFieldValue('analysisType', values);
  };
  return (
    <Layout>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack align="center">
          <FormRow className={classes.formRow}>
            <Text>Data source</Text>
            <Select
              value={datasource}
              onChange={handleDatasourceSelectChange}
              data={[
                { value: IWorkflowDatasource.FACEBOOK, label: 'Facebook' },
                { value: IWorkflowDatasource.TWITTER, label: 'Twitter' },
              ]}
            />
          </FormRow>
          <FormRow className={classes.formRow}>
            <Text>Analysis Type</Text>
            <Select
              value={analysisType}
              onChange={handleAnalysisTypeSelectChange}
              data={[
                { value: IWorkflowAnalysisType.SENTIMENT, label: 'Sentiment analysis' },
                {
                  value: IWorkflowAnalysisType.STATISTICAL,
                  label: 'Statistical analysis',
                },
              ]}
            />
          </FormRow>
          <FormRow className={classes.formRow}>
            <Text>Number of Posts</Text>
            <FormRow sx={{ alignItems: 'center', flexDirection: 'row-reverse' }}>
              <TextInput {...form.getInputProps('numberOfPosts')} />
              <Slider {...form.getInputProps('numberOfPosts')} />
            </FormRow>
          </FormRow>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </Layout>
  );
};

export default SubmitPage;