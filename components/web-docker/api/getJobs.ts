import { useQuery } from 'react-query';
import { IJobDTO } from '../types/index';

import { axios } from '../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../lib/react-query';

export const getAllJobs = (): Promise<IJobDTO[]> => {
  return axios.get(`/api/joblist`);
};

type QuerySearchPropertyFnType = typeof getAllJobs;

type IUseGetAllJobs = {
  config?: QueryConfig<QuerySearchPropertyFnType>;
};

export const useGetAllJobs = ({ config }: IUseGetAllJobs) => {
  return useQuery<ExtractFnReturnType<QuerySearchPropertyFnType>>({
    ...config,
    queryKey: ['joblist'],
    queryFn: () => getAllJobs(),
  });
};
