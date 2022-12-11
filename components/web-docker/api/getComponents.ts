import { useQuery } from 'react-query';

import { axios } from '../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../lib/react-query';
import { IComponentDTO } from '../types';

export const getAllComponents = (): Promise<IComponentDTO[]> => {
  return axios.get(`/api/containerlist`);
};

type QuerySearchPropertyFnType = typeof getAllComponents;

type IUseGetAllComponents = {
  config?: QueryConfig<QuerySearchPropertyFnType>;
};

export const useGetAllComponent = ({ config }: IUseGetAllComponents) => {
  return useQuery<ExtractFnReturnType<QuerySearchPropertyFnType>>({
    ...config,
    queryKey: ['componentlist'],
    queryFn: () => getAllComponents(),
  });
};
