import { Table, TodoItem, TodoTable } from "../../types";
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

const getTodoItemById = async (id: string): Promise<TodoItem> => {
  return db(Table.TodoItem).where({ id }).first();
};

const createTodoItem = async (
  itemData: Omit<TodoItem, "id">
): Promise<TodoItem> => {
  const todoItemCreateResult = _.head(
    await db(Table.TodoItem).insert(itemData, ["id"])
  );

  return getTodoItemById(todoItemCreateResult.id);
};

const updateTodoItem = async (itemData: TodoItem): Promise<TodoItem> => {
  const todoItemUpdateResult = _.head(
    await db(Table.TodoItem).where({ id: itemData.id }).update(itemData, ["id"])
  );

  return getTodoItemById(todoItemUpdateResult.id);
};

export {
  createTodoTable,
  createTodoItem,
  updateTodoItem,
  getTodoTableById,
  getTodoItemById,
};
