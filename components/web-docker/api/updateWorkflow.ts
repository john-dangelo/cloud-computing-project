import { showNotification } from '@mantine/notifications';
import { useMutation } from 'react-query';

import { axios } from '../lib/axios';
import { MutationConfig, queryClient } from '../lib/react-query';
import { IWorkflowDTO } from '../types';

export const updateWorkflow = (body: Partial<IWorkflowDTO>): Promise<string> =>
  axios.post('/api/update-workflow', body);

type UseUpdateWorkflowOptions = {
  config?: MutationConfig<typeof updateWorkflow>;
};

export const useUpdateWorkflow = ({ config }: UseUpdateWorkflowOptions) => {
  // const { addNotification } = useNotificationStore();

  return useMutation({
    onError: () => {
      showNotification({
        message: 'Workflow update error.',
        color: 'red',
      });
    },
    onSuccess: () => {
      showNotification({
        message: 'Workflow updated successfully.',
      });
      queryClient.invalidateQueries(['workflowslist']);
    },
    ...config,
    mutationFn: updateWorkflow,
  });
};
