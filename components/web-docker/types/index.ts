import { UrlObject } from 'url';

export type RouteItem = {
  label: string;
  href: UrlObject;
};

export type IWorkflowName = `${IWorkflowDatasource}-${IWorkflowAnalysisType}`;

export enum IWorkflowDatasource {
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
}

export enum STATUSES {
  PENDING = 'pending',
  READY = 'ready',
  WORKING = 'working',
  DONE = 'done',
}

export enum IWorkflowAnalysisType {
  SENTIMENT = 'sentiment',
  STATISTICAL = 'statistical',
}

export type IWorkflowParameters = {
  numberOfPosts?: number;
};

export type IComponentDTO = {
  component_name: string;
  included_files: string[];
  location: string;
  status: `${STATUSES}`;
} & BaseEntity;

export type IWorkflowDTO = {
  name: string;
  component_list: string[];
} & BaseEntity;

export type IJobDTO = {
  workflowName: string;
  parameters: string[];
  state: `${STATUSES}`;
} & BaseEntity;

export type IJobSubmitForm = Omit<IJobDTO, '_id'> & {
  component_list: IWorkflowDTO['component_list'];
};

export type BaseEntity = {
  _id: string;
};
