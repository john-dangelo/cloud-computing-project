import { showNotification } from '@mantine/notifications';
import { useMutation } from 'react-query';
import { queryClient, MutationConfig } from '../lib/react-query';

import { axios } from '../lib/axios';
import { IWorkflowDTO } from '../types';

export const createWorkflow = (body: Partial<IWorkflowDTO>): Promise<string> =>
  axios.post('/api/create-workflow', body);

type UseCreateWorkflowOptions = {
  config?: MutationConfig<typeof createWorkflow>;
};

export const useCreateWorkflow = ({ config }: UseCreateWorkflowOptions) => {
  // const { addNotification } = useNotificationStore();

  return useMutation({
    onError: () => {
      showNotification({
        message: 'Workflow creation error.',
        color: 'red',
      });
    },
    onSuccess: () => {
      showNotification({
        message: 'Workflow created successfully.',
      });
      queryClient.invalidateQueries(['workflowslist']);
    },
    ...config,
    mutationFn: createWorkflow,
  });
};
