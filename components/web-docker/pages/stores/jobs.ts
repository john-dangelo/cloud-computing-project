import create from 'zustand';

const DEFAULT_JOB_STATE = {
  result: {
    status: 'PENDING',
  },
};

type Job = {
  result: unknown;
};
type JobState = Record<string, Job>;

type JobStore = {
  jobs: JobState;
  addJob: (jobId: string) => void;
};

export const useJobStore = create<JobStore>((set) => ({
  jobs: {},
  addJob: (jobId) =>
    set((prevState) => ({
      ...prevState,
      jobs: { ...prevState.jobs, [jobId]: DEFAULT_JOB_STATE },
    })),
}));
