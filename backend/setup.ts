import { db } from "./src/connector/db";
import { updateTypes } from "knex-types";
import { Table } from "./types";
import { TYPES_FILE_PATH } from "./src/constant";

const setup = async () => {
  const todoTableExists = await db.schema.hasTable(Table.TodoTable);
  const todoItemExists = await db.schema.hasTable(Table.TodoItem);

  if (todoTableExists == false) {
    await db.schema.createTable(Table.TodoTable, (table) => {
      table.increments("id").primary();
      table.string("title", 255).notNullable();
      table.boolean("closed").notNullable();
      table.timestamps(true, true);
    });
  }

  if (todoItemExists == false) {
    await db.schema.createTable(Table.TodoItem, (table) => {
      table.increments("id").primary();
      table.string("title", 255).notNullable();
      table.string("description", 3000);
      table.integer("status").notNullable();
      table.check("status >= 0 AND status <= 10");
      table.boolean("deleted").notNullable();
      table
        .integer("parent_id")
        .references("id")
        .inTable(Table.TodoItem);
      table 
        .integer("table_id")
        .references("id")
        .inTable(Table.TodoTable)
        .notNullable();
      table.timestamps(true, true);
    });
  }

  updateTypes(db, { output: TYPES_FILE_PATH }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
  console.log("Types generated");
};

setup();
