import fs from "fs/promises";

import path from "path";


import Ajv from "ajv";

const ajv = new Ajv({allErrors: true}); // ajv will continue to validate the schema even after we get the first error


const SCHEMA_BASE_PATH="response_schemas";



export async function validateSchema(dirName: string, fileName:string, responseBody: object) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);
    console.log("Schema path ", schemaPath);

    const schema = await loadSchema(schemaPath);
    //console.log(schema);

    const validate = ajv.compile(schema);

    const valid = validate(responseBody);

    if(!valid) {
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
    catch(err: any) {
        throw new Error(`Failed to read the schema file: ${err.message}`)
    }
}