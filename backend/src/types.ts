import { TodoItem, TodoTable } from "../types";

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

export {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcResponseError,
  TodoItemByIdGetPayload,
  TodoItemCreatePayload,
  TodoItemUpdatePayload,
  TodoTableByIdGetPayload,
  TodoTableCreatePayload,
};
