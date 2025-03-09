import "dotenv/config";
import express from "express";
import { todoItemController } from "./controller/todo-item";
import { todoTableController } from "./controller/todo-table";
import http from "http";
import { Server } from "socket.io";
import { realTimeController } from "./controller/real-time";
import { LocalStorage } from "node-localstorage";
import { startDbSyncJob } from "./jobs/db-sync";
import cors from "cors";
import { syncState } from "./hooks/sync-state";
import path from "path";
import { staticController } from "./controller/static";

const runApp = () => {
  global.localStorage = new LocalStorage("./local-storage-data");
  localStorage.clear();

  const app = express();
  app.use(cors());
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  // Create a new router
  const apiRouter = express.Router();

  app.use(express.static(path.join(__dirname, "static/frontend-build")));

  // Middleware to parse JSON
  app.use(express.json());

  app.use(process.env.RPC_PREFIX ?? '/rpc', apiRouter);

  // Define RPC controllers
  todoItemController(apiRouter, [syncState(io)]);
  todoTableController(apiRouter);

  // Define socket controllers
  realTimeController(io);

  // Define static controller
  staticController(app);

  // Needed to maintain sync between db and real time user changes
  startDbSyncJob(io);

  // Start the server
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
};

export { runApp };
