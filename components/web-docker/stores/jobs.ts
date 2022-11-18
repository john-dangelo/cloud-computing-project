import create from 'zustand';
import { IJobDTO } from '../types';

const DEFAULT_JOB_STATE = {
  result: {
    status: 'PENDING',
  },
};

type Job = {
  result: unknown;
} & IJobDTO;

type JobState = Record<string, Job>;

type JobStore = {
  jobs: JobState;
  addJob: (jobId: string, submission: IJobDTO) => void;
};

export const useJobStore = create<JobStore>((set) => ({
  jobs: {},
  addJob: (jobId, submission) =>
    set((prevState) => ({
      ...prevState,
      jobs: { ...prevState.jobs, [jobId]: { ...submission, ...DEFAULT_JOB_STATE } },
    })),
}));
