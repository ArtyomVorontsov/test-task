import express, { Request, Response } from "express";
import {
  createTodoItem,
  createTodoTable,
  getTodoItemById,
  getTodoTableById,
  updateTodoItem,
} from "./controller/todo-table";
import { TodoItem, TodoTable } from "../types";
import { makeJsonRPCResponse } from "./mappers/json-rpc";
import {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcResponseError,
  TodoItemByIdGetPayload,
  TodoItemCreatePayload,
  TodoItemUpdatePayload,
  TodoTableByIdGetPayload,
  TodoTableCreatePayload,
} from "./types";
import { body } from "express-validator";
import _ from "lodash";
import { handleErrors } from "./util/handle-errors";
import { PORT } from "./constant";

const runApp = () => {
  const app = express();

  // Create a new router
  const apiRouter = express.Router();

  // Middleware to parse JSON
  app.use(express.json());
  app.use("/rpc", apiRouter);

  // Home route
  apiRouter.post("/", (req, res) => {
    res.send("Hello, todo!");
  });

  apiRouter.post(
    "/todo-table/create",
    [
      body("params")
        .notEmpty()
        .withMessage("Field 'params' is required in body"),
    ],
    async (
      req: Request<{}, {}, JsonRpcRequest<TodoTableCreatePayload>>,
      res: Response<JsonRpcResponse<TodoTable> | JsonRpcResponseError>
    ) => {
      handleErrors(req, res);

      const response = await createTodoTable(req.body.params.todoTable);

      res.json(makeJsonRPCResponse(response));
    }
  );

  apiRouter.put(
    "/todo-table/get",
    [
      body("params")
        .notEmpty()
        .withMessage("Field 'params' is required in body"),
      body("params.id")
        .notEmpty()
        .withMessage("Field 'params.id' is required in body"),
    ],
    async (
      req: Request<{}, {}, JsonRpcRequest<TodoTableByIdGetPayload>>,
      res: Response<JsonRpcResponse<TodoTable>>
    ) => {
      handleErrors(req, res);

      const response = await getTodoTableById(Number(req.body.params.id));

      res.json(makeJsonRPCResponse(response));
    }
  );

  apiRouter.post(
    "/todo-item/create",
    [
      body("params")
        .notEmpty()
        .withMessage("Field 'params' is required in body"),
    ],
    async (
      req: Request<{}, {}, JsonRpcRequest<TodoItemCreatePayload>>,
      res: Response<JsonRpcResponse<TodoItem>>
    ) => {
      handleErrors(req, res);

      const response = await createTodoItem(req.body.params.todoItem);

      res.json(makeJsonRPCResponse(response));
    }
  );

  apiRouter.put(
    "/todo-item/update",
    [
      body("params")
        .notEmpty()
        .withMessage("Field 'params' is required in body"),
      body("params.id")
        .notEmpty()
        .withMessage("Field 'params.id' is required in body"),
    ],
    async (
      req: Request<{}, {}, JsonRpcRequest<TodoItemUpdatePayload>>,
      res: Response<JsonRpcResponse<TodoItem>>
    ) => {
      handleErrors(req, res);

      const response = await updateTodoItem(req.body.params.todoItem);

      res.json(makeJsonRPCResponse(response));
    }
  );

  apiRouter.put(
    "/todo-item/get",
    [
      body("params")
        .notEmpty()
        .withMessage("Field 'params' is required in body"),
      body("params.id")
        .notEmpty()
        .withMessage("Field 'params.id' is required in body"),
    ],
    async (
      req: Request<{}, {}, JsonRpcRequest<TodoItemByIdGetPayload>>,
      res: Response<JsonRpcResponse<TodoItem>>
    ) => {
      handleErrors(req, res);

      const response = await getTodoItemById(req.body.params.id);

      res.json(makeJsonRPCResponse(response));
    }
  );

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

export { runApp };
