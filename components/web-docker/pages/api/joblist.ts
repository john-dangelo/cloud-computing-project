/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { COLLECTIONS, DATABASES } from '../../config/db';
import clientPromise from '../../lib/mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASES.WORKFLOW);
    const collection = db.collection(COLLECTIONS.ACTIVE_JOB_LIST);
    // console.log('db', db);
    // console.log('collection', collection);
    const jobs = await collection.find().toArray();
    res.status(200).send(jobs);
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
