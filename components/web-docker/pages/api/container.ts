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

const getBaseFolder = (fields: IContainerCreateForm) =>
  `/mnt/scripts/${fields.userId}/${fields.componentName}`;
// const getBaseFolder = (fields: IContainerCreateForm) =>
//   `E:/mnt/scripts/${fields.userId}/${fields.componentName}`;

const saveFile = async (file: formidable.File, baseFolder: string) => {
  //   console.log('file', file);
  const data = fs.readFileSync(file.filepath);
  fs.mkdir(baseFolder, { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFileSync(`${baseFolder}/${file.originalFilename}`, data);
    fs.unlinkSync(file.filepath);
    return Promise.resolve();
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASES.WORKFLOW);
    const collection = db.collection(COLLECTIONS.COMPONENT_DEFINITIONS);
    // console.log('db', db);
    // console.log('collection', collection);
    const handleFormParse = async (
      err: unknown,
      fields: IContainerCreateForm,
      files: { script: formidable.File; requirements: formidable.File },
    ) => {
      //   await saveFile(files.file);
      if (!fields.useDockerHub) {
        const baseFolder = getBaseFolder(fields);
        await saveFile(files.script, baseFolder);
        await saveFile(files.requirements, baseFolder);
        // save information to database
        const componentDefinition = {
          component_name: `managernode:5000/${fields.componentName}`,
          included_files: [files.script.originalFilename],
          location: baseFolder,
          status: 'pending',
        };
        const insertRes = await collection.insertOne(componentDefinition);
        return res.status(201).send(insertRes.acknowledged);
      }
      const componentDefinition = {
        component_name: fields.componentName,
        included_files: [],
        location: '',
        status: 'ready',
      };
      const insertRes = await collection.insertOne(componentDefinition);
      return res.status(201).send(insertRes.acknowledged);
    };
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields: formidable.Fields, files) =>
      handleFormParse(
        err,
        fields as unknown as IContainerCreateForm,
        files as { script: formidable.File; requirements: formidable.File },
      ),
    );
  } catch (e) {
    res.status(500);
    console.error(e);
  }
};
