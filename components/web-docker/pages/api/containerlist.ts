/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { COLLECTIONS, DATABASES } from '../../config/db';
import clientPromise from '../../lib/mongodb';
import { IContainerCreateForm } from '../../api/createContainer';

// const schema = z.object<{ [K in keyof IJobSubmit]: any }>({
//   workflowName: z.string(),
//   parameters: z.object<{ [K in keyof IWorkflowParameters]: any }>({
//     numberOfPosts: z.number(),
//   }),
// });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASES.WORKFLOW);
    const collection = db.collection(COLLECTIONS.COMPONENT_DEFINITIONS);
    // console.log('db', db);
    // console.log('collection', collection);
    const components = await collection.find().toArray();
    res.status(200).send(components);
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
