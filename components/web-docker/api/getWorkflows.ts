import { useQuery } from 'react-query';
import { IWorkflowDTO } from '../types/index';

import { axios } from '../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../lib/react-query';

export const getAllWorkflows = (): Promise<IWorkflowDTO[]> => {
  return axios.get(`/api/workflowlist`);
};

type QuerySearchPropertyFnType = typeof getAllWorkflows;

type IUseGetAllWorkflows = {
  config?: QueryConfig<QuerySearchPropertyFnType>;
};

export const useGetAllWorkflows = ({ config }: IUseGetAllWorkflows) => {
  return useQuery<ExtractFnReturnType<QuerySearchPropertyFnType>>({
    ...config,
    queryKey: ['workflowslist'],
    queryFn: () => getAllWorkflows(),
  });
};
