import { db } from "./connectors/db"
import { updateTypes } from "knex-types";
import fs from 'fs';
import { Table } from "../types";
import { TYPES_FILE_PATH } from "./constant";

const setup = async () => {
    const todoTableExists = await db.schema.hasTable(Table.TodoTable)
    const todoItemExists = await db.schema.hasTable(Table.TodoItem)

    if (todoTableExists == false) {
        await db.schema.createTable(Table.TodoTable, (table) => {
            table.increments('id').primary();
            table.string('title').unique().notNullable();
            table.boolean('closed').notNullable();
            table.timestamps(true, true);
        });
    }

    if (todoItemExists == false) {
        await db.schema.createTable(Table.TodoItem, (table) => {
            table.increments('id').primary();
            table.string('title').unique().notNullable();
            table.string('description');
            table.string('status').notNullable();;
            table.boolean('deleted').notNullable();;
            table.integer('parent_id');
            table.integer('table_id').notNullable();;
            table.timestamps(true, true);
        });
    }


    if (fs.existsSync(TYPES_FILE_PATH)) {
        console.log('Types already generated');
    } else {
        updateTypes(db, { output: TYPES_FILE_PATH }).catch((err) => {
            console.error(err);
            process.exit(1);
        });
        console.log('Types generated');
    }
}

setup();

