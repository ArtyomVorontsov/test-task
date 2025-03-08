import axios from "axios";
import { env } from "../../env";
import { JsonRpcResponse, TodoTable } from "../types";

const createTodo = (tableId: number, parentId: number | null = null) => {
  axios
    .post(`${env.BACKEND_URL}/rpc/todo-item/create`, {
      params: {
        todoItem: {
          title: "",
          description: "",
          status: 0,
          deleted: false,
          parent_id: parentId,
          table_id: tableId,
        },
      },
    })
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));
};

const getAllTodoTables = () => {
  return axios.put<JsonRpcResponse<TodoTable[]>>(
    `${env.BACKEND_URL}/rpc/todo-table/get-all`
  );
};

const createTodoTable = (title: string, closed: boolean) => {
  return axios.post<JsonRpcResponse<TodoTable>>(
    `${env.BACKEND_URL}/rpc/todo-table/create`,
    {
      params: {
        todoTable: {
          title,
          closed,
        },
      },
    }
  );
};

export { createTodo, getAllTodoTables, createTodoTable };
