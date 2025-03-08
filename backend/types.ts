// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

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
