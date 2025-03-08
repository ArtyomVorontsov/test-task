import { Table, TodoTable } from "../../types";
import { db } from "../connector/db";
import _ from "lodash";

const getTodoTableById = async (id: number): Promise<TodoTable> => {
  return db(Table.TodoTable).where({ id }).first();
};

const getAllTodoTables = async (): Promise<TodoTable[]> => {
  return db(Table.TodoTable).select("*").orderBy("created_at", "desc");
};

const createTodoTable = async (
  tableData: Omit<TodoTable, "id">
): Promise<TodoTable> => {
  const todoTableCreateResult = _.head(
    await db(Table.TodoTable).insert(tableData, ["id"])
  );

  return getTodoTableById(todoTableCreateResult.id);
};

const updateTodoTable = async (
  todoTableData: TodoTable
): Promise<TodoTable> => {
  const todoTableUpdateResult = _.head(
    await db(Table.TodoTable)
      .where({ id: todoTableData.id })
      .update(todoTableData, ["id"])
  );

  return getTodoTableById(todoTableUpdateResult.id);
};

export { createTodoTable, getTodoTableById, updateTodoTable, getAllTodoTables };
