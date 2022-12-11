import { showNotification } from '@mantine/notifications';
import { useMutation } from 'react-query';

import { axios } from '../lib/axios';
import { MutationConfig, queryClient } from '../lib/react-query';
import { IJobSubmitForm } from '../types';

export const createJob = (body: IJobSubmitForm): Promise<string> =>
  axios.post('/api/submit', body);

type UseCreateJobOptions = {
  config?: MutationConfig<typeof createJob>;
};

export const useCreateJob = ({ config }: UseCreateJobOptions) => {
  // const { addNotification } = useNotificationStore();

  return useMutation({
    onError: () => {
      showNotification({
        message: 'Job creation error.',
        color: 'red',
      });
    },
    onSuccess: () => {
      showNotification({
        message: 'Job created successfully.',
      });
      queryClient.invalidateQueries(['joblist']);
    },
    ...config,
    mutationFn: createJob,
  });
};
