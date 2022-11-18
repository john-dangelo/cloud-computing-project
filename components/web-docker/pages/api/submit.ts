/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { IJobSubmitForm } from '../../types/index';
import { COLLECTIONS, DATABASES } from '../../config/db';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASES.WORKFLOW);
    const collection = db.collection(COLLECTIONS.ACTIVE_JOB_LIST);
    const { body } = req;
    const newJob: Partial<IJobSubmitForm> = {
      workflowName: body.workflowName,
      parameters: body.parameters,
      state: body.state,
      component_list: body.component_list,
    };
    const inserted = await collection.insertOne(newJob);
    const { insertedId } = inserted;
    res.status(200).send(insertedId);
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
