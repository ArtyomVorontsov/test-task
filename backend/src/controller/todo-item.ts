import { Request, Response, Router } from "express";
import * as todoItemModel from "../model/todo-item";
import { HookFunction, TodoItem } from "../../types";
import { makeJsonRPCResponse } from "../mappers/json-rpc";
import {
  JsonRpcRequest,
  JsonRpcResponse,
  TodoItemByIdGetPayload,
  TodoItemCreatePayload,
  TodoItemUpdatePayload,
} from "../types";
import { body } from "express-validator";
import _ from "lodash";
import { handleErrors } from "../util/handle-errors";

const todoItemController = (apiRouter: Router, hooks?: HookFunction[]) => {
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

      const response = await todoItemModel.createTodoItem(
        req.body.params.todoItem
      );

      res.json(makeJsonRPCResponse(response));

      // Post http call hooks execution
      for (const hook of hooks ?? []) {
        await hook(req);
      }
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

      const response = await todoItemModel.updateTodoItem(
        req.body.params.todoItem
      );

      res.json(makeJsonRPCResponse(response));

      // Post http call hooks execution
      for (const hook of hooks ?? []) {
        await hook(req);
      }
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

      const response = await todoItemModel.getTodoItemById(req.body.params.id);

      res.json(makeJsonRPCResponse(response));
    }
  );
};

export { todoItemController };
