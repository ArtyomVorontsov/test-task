import { Table, TodoTable } from "../../types";
import { db } from "../connector/db";
import _ from "lodash";

const getTodoTableById = async (id: number): Promise<TodoTable> => {
  return db(Table.TodoTable).where({ id }).first();
};

const createTodoTable = async (
  tableData: Omit<TodoTable, "id">
): Promise<TodoTable> => {
  const todoTableCreateResult = _.head(
    await db(Table.TodoTable).insert(tableData, ["id"])
  );

  return getTodoTableById(todoTableCreateResult.id);
};

export { createTodoTable, getTodoTableById };
