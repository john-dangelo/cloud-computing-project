/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { COLLECTIONS, DATABASES } from '../../config/db';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body } = req;
    const { jobId } = body;
    const client = await clientPromise;
    const db = client.db(DATABASES.RESULTS);
    const collection = db.collection(COLLECTIONS.OUTPUT);
    // console.log('db', db);
    // console.log('collection', collection);
    const jobs = await collection.find({ workflowId: jobId }).toArray();
    res.status(200).send(jobs);
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
