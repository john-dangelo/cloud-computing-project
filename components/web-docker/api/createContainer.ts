import { showNotification } from '@mantine/notifications';
import { useMutation } from 'react-query';

import { axios } from '../lib/axios';
import { MutationConfig, queryClient } from '../lib/react-query';

export type IContainerCreateForm = {
  userId: string;
  componentName: string;
  script: File | null;
  requirements: File | null;
  useDockerHub?: boolean;
};

export const createContainer = (body: IContainerCreateForm): Promise<string> => {
  const { script, requirements, userId, componentName } = body;
  const form = new FormData();
  if (!script || !requirements) return Promise.reject();
  form.append('userId', userId);
  form.append('componentName', componentName);
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
      queryClient.invalidateQueries(['componentlist']);
    },
    ...config,
    mutationFn: createContainer,
  });
};
