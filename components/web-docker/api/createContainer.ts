import { showNotification } from '@mantine/notifications';
import { useMutation } from 'react-query';

import { axios } from '../lib/axios';
import { MutationConfig } from '../lib/react-query';

export type IContainerCreateForm = {
  userId: string;
  script: File | null;
  requirements: File | null;
};

export const createContainer = (body: IContainerCreateForm): Promise<string> => {
  const { script, requirements, userId } = body;
  const form = new FormData();
  if (!script || !requirements) return Promise.reject();
  form.append('userId', userId);
  form.append('script', script);
  form.append('requirements', requirements);
  return axios.post('/api/container', form);
};

type UsecreateContainerOptions = {
  config?: MutationConfig<typeof createContainer>;
};

export const useCreateContainer = ({ config }: UsecreateContainerOptions) => {
  // const { addNotification } = useNotificationStore();

  return useMutation({
    onError: () => {
      showNotification({
        message: 'Container creation error.',
        color: 'red',
      });
    },
    onSuccess: () => {
      showNotification({
        message: 'Container description created successfully.',
      });
    },
    ...config,
    mutationFn: createContainer,
  });
};
