import { Request, Response, Router } from "express";
import * as todoTableModel from "../model/todo-table";
import { TodoTable } from "../../types";
import { makeJsonRPCResponse } from "../mappers/json-rpc";
import {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcResponseError,
  TodoTableByIdGetPayload,
  TodoTableCreatePayload,
} from "../types";
import { body } from "express-validator";
import _ from "lodash";
import { handleErrors } from "../util/handle-errors";

const todoTableController = (apiRouter: Router) => {
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

      const response = await todoTableModel.createTodoTable(
        req.body.params.todoTable
      );

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

      const response = await todoTableModel.getTodoTableById(
        Number(req.body.params.id)
      );

      res.json(makeJsonRPCResponse(response));
    }
  );

  apiRouter.put(
    "/todo-table/get-all",
    async (
      req: Request<{}, {}>,
      res: Response<JsonRpcResponse<TodoTable[]>>
    ) => {
      handleErrors(req, res);

      const response = await todoTableModel.getAllTodoTables();

      res.json(makeJsonRPCResponse(response));
    }
  );
};

export { todoTableController };
