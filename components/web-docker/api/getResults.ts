import { useQuery } from 'react-query';
import { IResultDTO } from '../types/index';

import { axios } from '../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../lib/react-query';

type ResultQuery = {
  jobId: string;
};
export const getResults = (query: ResultQuery): Promise<IResultDTO[]> => {
  return axios.post(`/api/result`, query);
};

type QuerySearchPropertyFnType = typeof getResults;

type IUseGetResults = {
  config?: QueryConfig<QuerySearchPropertyFnType>;
  query: ResultQuery;
};

export const useGetResults = ({ config, query }: IUseGetResults) => {
  return useQuery<ExtractFnReturnType<QuerySearchPropertyFnType>>({
    ...config,
    queryKey: ['result'],
    queryFn: () => getResults(query),
  });
};
