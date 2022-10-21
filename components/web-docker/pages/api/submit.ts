/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { validateSchemaOnRuntime } from '../../utils/validateSchema';
import { IWorkflowParameters, IWorkflowName } from '../../types/index';
import { COLLECTIONS, DATABASES } from '../../config/db';
import clientPromise from '../../lib/mongodb';

export type IJobDescription = {
  jobId: string;
  workflowName: IWorkflowName;
  parameters: IWorkflowParameters;
};

export type IJobSubmit = Omit<IJobDescription, 'jobId'>;

const schema = z.object<{ [K in keyof IJobSubmit]: any }>({
  workflowName: z.string(),
  parameters: z.object<{ [K in keyof IWorkflowParameters]: any }>({
    numberOfPosts: z.number(),
  }),
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASES.WORKFLOW);
    const collection = db.collection(COLLECTIONS.ACTIVE_JOB_LIST);
    // console.log('db', db);
    // console.log('collection', collection);
    const { body } = req;
    const validatedForm = await validateSchemaOnRuntime<IJobDescription>(
      schema,
      body,
      res,
    );
    if (validatedForm) {
      const { workflowName, parameters } = validatedForm;
      let newJob;
      switch (workflowName) {
        case 'facebook-sentiment':
          newJob = {
            workflowName,
            parameters: `-f ${parameters.numberOfPosts}`,
          };
          break;
        case 'facebook-statistical':
          newJob = {
            workflowName,
            parameters: `-f ${parameters.numberOfPosts}`,
          };
          break;
        case 'twitter-sentiment':
          newJob = {
            workflowName,
            parameters: `-t ${parameters.numberOfPosts}`,
          };
          break;
        case 'twitter-statistical':
          newJob = {
            workflowName,
            parameters: `-t ${parameters.numberOfPosts}`,
          };
          break;
      }
      // const newJob = {
      //   // jobId: uuid(),
      //   ...validatedForm,
      // };
      const inserted = await collection.insertOne(newJob);
      const { insertedId } = inserted;
      res.status(200).send(insertedId);
    }
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
