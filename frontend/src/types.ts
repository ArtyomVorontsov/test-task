export enum Table {
  TodoItem = "todo_item",
  TodoTable = "todo_table",
}

export type Tables = {
  todo_item: TodoItem;
  todo_table: TodoTable;
};

export type TodoItem = {
  id: number;
  title: string;
  description: string | null;
  status: number;
  deleted: boolean;
  parent_id: number | null;
  table_id: number;
  created_at: Date;
  updated_at: Date;
};

export type TodoTable = {
  id: number;
  title: string;
  closed: boolean;
  created_at: Date;
  updated_at: Date;
};

export type JsonRpcRequest<T> = {
  params: T;
};

export type JsonRpcResponse<T> = {
  result: T;
};

export type JsonRpcResponseError = {
  error: {
    message: string;
    code: string;
  };
};

export type TodoItemByIdGetPayload = { id: string };
export type TodoItemCreatePayload = { todoItem: Omit<TodoItem, "id"> };
export type TodoItemUpdatePayload = { todoItem: TodoItem };
export type TodoTableByIdGetPayload = { id: string };
export type TodoTableCreatePayload = { todoTable: Omit<TodoTable, "id"> };

export type User = {
  id: string;
  nickname: string;
  color: string;
  reservedField: string | null;
  cursor: {
    x: number;
    y: number;
  };
};

export type TodoTableState = {
  todoTable: TodoTable;
  todoItems: TodoItem[];
  users: User[];
};

export enum STATUS {
  PENDING = 0,
  COMPLETED = 1,
}
