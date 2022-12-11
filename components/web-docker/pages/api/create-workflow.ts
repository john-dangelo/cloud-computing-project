/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { COLLECTIONS, DATABASES } from '../../config/db';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASES.WORKFLOW);
    const collection = db.collection(COLLECTIONS.WORKFLOW_DEFINITIONS);
    const { body } = req;
    const newWorkflow = {
      name: body.name,
      component_list: body.component_list,
    };
    const result = await collection.updateOne(
      { name: body.name },
      { $set: { ...newWorkflow } },
      {
        upsert: true,
      },
    );
    res.status(200).send(result);
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
