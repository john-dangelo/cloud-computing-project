/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodRawShape } from 'zod';
import { uuid } from 'uuidv4';
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
    const validatedForm = await validateSchemaOnRuntime<z.infer<typeof schema>>(
      schema,
      body,
      res,
    );
    const newJob = {
      jobId: uuid(),
      ...validatedForm,
    };
    const inserted = await collection.insertOne(newJob);
    res.status(200).send(inserted);
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
