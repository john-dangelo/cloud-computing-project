/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { COLLECTIONS, DATABASES } from '../../config/db';
import clientPromise from '../../lib/mongodb';

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

const getBaseFolder = (userId: string) => `/mnt/scripts/${userId}`;
// const getBaseFolder = (userId: string) => `F:/test/${userId}`;

const saveFile = async (file: formidable.File, userId: string) => {
  //   console.log('file', file);
  const data = fs.readFileSync(file.filepath);
  const baseFolder = getBaseFolder(userId);
  fs.mkdir(baseFolder, { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFileSync(`${getBaseFolder(userId)}/${file.originalFilename}`, data);
    fs.unlinkSync(file.filepath);
    return Promise.resolve();
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASES.WORKFLOW);
    const collection = db.collection(COLLECTIONS.ACTIVE_JOB_LIST);
    // console.log('db', db);
    // console.log('collection', collection);
    const handleFormParse = async (
      err: unknown,
      fields: { userId: string },
      files: { script: formidable.File; requirements: formidable.File },
    ) => {
      //   await saveFile(files.file);
      await saveFile(files.script, fields.userId);
      await saveFile(files.requirements, fields.userId);
      //   console.log('files', fields);
      return res.status(201).send(getBaseFolder(fields.userId));
    };
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields: formidable.Fields, files) =>
      handleFormParse(
        err,
        fields as { userId: string },
        files as { script: formidable.File; requirements: formidable.File },
      ),
    );
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
