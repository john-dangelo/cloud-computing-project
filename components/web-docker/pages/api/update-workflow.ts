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
    const { component_list, _id } = body;
    const workflow = await collection.findOne({ _id });
    if (workflow) {
      const updated = await collection.updateOne({ _id }, { $set: { component_list } });
      console.log('workflow', workflow, _id);
      res.status(200).send(updated);
    } else res.status(400);
    // const workflows = await collection.find().toArray();
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
