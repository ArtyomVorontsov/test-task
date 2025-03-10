import { Table, TodoItem, TodoTable } from "../../types";
import { db } from "../connector/db";
import _ from "lodash";

const getTodoItemById = async (id: string): Promise<TodoItem> => {
  return db(Table.TodoItem).where({ id }).first();
};

const getTodoItemsByTableId = async (tableId: number): Promise<TodoItem[]> => {
  return db(Table.TodoItem)
    .where({ table_id: tableId })
    .orderBy("created_at", "desc");
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
  updateTodoItem,
  createTodoItem,
  getTodoItemById,
  getTodoItemsByTableId,
};
