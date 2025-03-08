import { TodoItem, TodoTable } from "../types";
import { Request } from "express";

type JsonRpcRequest<T> = {
  params: T;
};

type JsonRpcResponse<T> = {
  result: T;
};

type JsonRpcResponseError = {
  error: {
    message: string;
    code: string;
  };
};

type TodoItemByIdGetPayload = { id: string };
type TodoItemCreatePayload = { todoItem: Omit<TodoItem, "id"> };
type TodoItemUpdatePayload = { todoItem: TodoItem };
type TodoTableByIdGetPayload = { id: string };
type TodoTableCreatePayload = { todoTable: Omit<TodoTable, "id"> };

type User = {
  id: string;
  nickname: string;
  color: string;
  reservedField: string | null;
  cursor: {
    x: number;
    y: number;
  };
};

type TodoTableState = {
  todoTable: TodoTable;
  todoItems: TodoItem[];
  users: User[];
};

export type HookFunction = (req: Request) => Promise<void>;

export {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcResponseError,
  TodoItemByIdGetPayload,
  TodoItemCreatePayload,
  TodoItemUpdatePayload,
  TodoTableByIdGetPayload,
  TodoTableCreatePayload,
  TodoTableState,
  User,
};
