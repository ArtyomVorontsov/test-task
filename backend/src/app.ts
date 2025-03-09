import express from "express";
import { PORT, RPC_PREFIX } from "./constant";
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

  // Middleware to parse JSON
  app.use(express.json());

  app.use(RPC_PREFIX, apiRouter);

  app.use(express.static(path.join(__dirname, "static")));

  // Define static controller
  staticController(apiRouter)

  // Define RPC controllers
  todoItemController(apiRouter, [syncState(io)]);
  todoTableController(apiRouter);

  // Define socket controllers
  realTimeController(io);

  // Needed to maintain sync between db and real time user changes
  startDbSyncJob(io);

  // Start the server
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

export { runApp };
