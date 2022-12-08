import { useQuery } from 'react-query';
import { ILogDTO } from '../types/index';

import { axios } from '../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../lib/react-query';

type LogQuery = {
  jobId: string;
};
export const getLogs = (query: LogQuery): Promise<ILogDTO[]> => {
  return axios.post(`/api/log`, query);
};

type QuerySearchPropertyFnType = typeof getLogs;

type IUseGetLogs = {
  config?: QueryConfig<QuerySearchPropertyFnType>;
  query: LogQuery;
};

export const useGetLogs = ({ config, query }: IUseGetLogs) => {
  return useQuery<ExtractFnReturnType<QuerySearchPropertyFnType>>({
    ...config,
    queryKey: ['log'],
    queryFn: () => getLogs(query),
  });
};
