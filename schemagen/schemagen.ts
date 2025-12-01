// @ts-ignore
import toJsonSchema from 'to-json-schema';

import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';

const dataPath = path.join(process.cwd(), 'schemagen', 'data.json');
const schemaPath = path.join(process.cwd(), 'schemagen', 'schema.json');
const data2Path = path.join(process.cwd(), 'schemagen', 'data2.json');

async function generateSchema() {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const schema = toJsonSchema(data);
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
    console.log('Schema generated and saved to schema.json');
  } catch (error) {
    console.error('Error generating schema:', error);
  }
}

async function validateData2() {
  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const data2 = JSON.parse(fs.readFileSync(data2Path, 'utf8'));
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data2);
    if (valid) {
      console.log('data2.json matches the schema.');
    } else {
      console.log('data2.json does not match the schema. Errors:', validate.errors);
    }
  } catch (error) {
    console.error('Error validating data2.json:', error);
  }
}

(async () => {
  await generateSchema();
  await validateData2();
})();
