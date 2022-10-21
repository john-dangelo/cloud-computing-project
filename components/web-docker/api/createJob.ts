import { showNotification } from '@mantine/notifications';
import { useMutation } from 'react-query';

import { axios } from '../lib/axios';
import { MutationConfig } from '../lib/react-query';
import { IJobSubmit } from '../pages/api/submit';

export const createJob = (body: IJobSubmit): Promise<unknown> =>
  axios.post('/api/submit', body);

type UseCreateJobOptions = {
  config?: MutationConfig<typeof createJob>;
};

export const useCreateJob = ({ config }: UseCreateJobOptions) => {
  // const { addNotification } = useNotificationStore();

  return useMutation<string, unknown, IJobSubmit>({
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
    },
    ...config,
    mutationFn: createJob,
  });
};
