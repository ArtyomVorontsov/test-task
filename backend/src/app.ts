import express from "express";
import { PORT, RPC_PREFIX } from "./constant";
import { todoItemController } from "./controller/todo-item";
import { todoTableController } from "./controller/todo-table";

const runApp = () => {
  const app = express();

  // Create a new router
  const apiRouter = express.Router();

  // Middleware to parse JSON
  app.use(express.json());
  app.use(RPC_PREFIX, apiRouter);

  // Define controllers
  todoItemController(apiRouter);
  todoTableController(apiRouter);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

export { runApp };
