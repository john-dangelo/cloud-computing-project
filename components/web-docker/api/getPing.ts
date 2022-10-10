import { useQuery } from 'react-query';

import { axios } from '../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../lib/react-query';

export type IPingBody = {
  ip: string
};

export const getPingResult = (body: IPingBody): Promise<unknown> => axios.post('/api/ping', body);

type QueryGetPingResultFnType = typeof getPingResult;

type IUseGetPing = {
  body: IPingBody;
  config?: QueryConfig<QueryGetPingResultFnType>;
};

export const useGetPing = ({ body, config }: IUseGetPing) =>
useQuery<ExtractFnReturnType<QueryGetPingResultFnType>>({
    ...config,
    queryKey: ['ip', body.ip],
    queryFn: () => getPingResult(body),
  });
