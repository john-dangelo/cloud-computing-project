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

export enum IWorkflowAnalysisType {
  SENTIMENT = 'sentiment',
  STATISTICAL = 'statistical',
}

export type IWorkflowParameters = {
  numberOfPosts?: number;
};
