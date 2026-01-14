import fs from "fs/promises";

import path from "path";

import Ajv from "ajv";
import { createSchema } from 'genson-js';

import addFormats from "ajv-formats"

const ajv = new Ajv({ allErrors: true }); // ajv will continue to validate the schema even after we get the first error
addFormats(ajv)

const SCHEMA_BASE_PATH = "response_schemas";


export async function validateSchema(dirName: string, fileName: string, responseBody: object, createSchemaFlag: boolean = false) {

    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);

    if (createSchemaFlag) {

        await generateNewSchema(responseBody, schemaPath)

    }
    console.log("Schema path ", schemaPath);

    const schema = await loadSchema(schemaPath);
    //console.log(schema);

    const validate = ajv.compile(schema);

    const valid = validate(responseBody);

    if (!valid) {
        throw new Error(
            `Schema validation ${fileName} failed: \n` +
            `${JSON.stringify(validate.errors, null, 4)} \n \n` +
            `Actual Response body: \n` +
            `${JSON.stringify(responseBody, null, 4)}`
        )
    }

}



async function loadSchema(schemaPath: string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        return JSON.parse(schemaContent);
    }
    catch (err: any) {
        throw new Error(`Failed to read the schema file: ${err.message}`)
    }
}


async function generateNewSchema(responseBody: object, schemaPath: string) {
    try {
        const generatedSchema = createSchema(responseBody);

        // save the generated schema in the file
        await fs.mkdir(path.dirname(schemaPath), { recursive: true }); // recursive is true means if the folder exists , it will keep the folder
        await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4));
    }
    catch (err: any) {
        throw new Error(`Failed to create the schema file:  ${err.message}`);
    }
}