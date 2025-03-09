import { getTodoTableState, setTodoTableState } from "../model/real-time";
import { getTodoItemsByTableId, updateTodoItem } from "../model/todo-item";
import { getTodoTableById, updateTodoTable } from "../model/todo-table";
import cron from "node-cron";
import { Server } from "socket.io";
import { logger } from "../util/logger";

const pushToDbSyncQueue = (syncQueueName: string, todoTableId: number) => {
  const syncQueueString = localStorage.getItem(syncQueueName);
  const syncQueue: number[] = syncQueueString
    ? JSON.parse(syncQueueString)
    : [];
  syncQueue.push(todoTableId);
  localStorage.setItem(syncQueueName, JSON.stringify(syncQueue));
};

const popFromDbSyncQueue = (syncQueueName: string): number | null => {
  const syncQueueString = localStorage.getItem(syncQueueName);
  const syncQueue: string[] = syncQueueString
    ? JSON.parse(syncQueueString)
    : [];
  const todoTableIdToSync = syncQueue.pop();
  localStorage.setItem(syncQueueName, JSON.stringify(syncQueue));

  return todoTableIdToSync ? Number(todoTableIdToSync) : null;
};

const localStorageToDbSyncQueue = "local-storage-to-db-sync-queue";
const dbToLocalStorageSyncQueue = "db-to-local-storage-sync-queue";

const startDbSyncJob = (io: Server) => {
  logger("startDbSyncJob");
  cron.schedule("*/10 * * * * *", async () => {
    logger("Start local storage -> db sync");

    let todoTableId: number | null = null;
    let todoTableIds = new Set();
    do {
      todoTableIds.add(popFromDbSyncQueue(localStorageToDbSyncQueue));
    } while (todoTableId);

    const todoTableIdsToSync = [...todoTableIds.values()].filter(
      Boolean
    ) as number[];

    if (todoTableIdsToSync.length) {
      for (const todoTableId of todoTableIdsToSync) {
        await syncLocalStorageWithDb(todoTableId);
      }
      logger(
        `Finish local storage -> db sync for ${todoTableIdsToSync.join(", ")}`
      );
    } else {
      logger("Finish local storage -> db sync, no items in sync queue");
    }
  });
};

const syncLocalStorageWithDb = async (todoTableId: number) => {
  const state = getTodoTableState(todoTableId);

  for (const todoItem of state.todoItems) {
    await updateTodoItem(todoItem);
  }

  await updateTodoTable(state.todoTable);
};

const syncDbWithLocalStorage = async (todoTableId: number) => {
  const todoTable = await getTodoTableById(todoTableId);
  const todoItems = await getTodoItemsByTableId(todoTableId);
  const users = getTodoTableState(todoTableId).users;

  setTodoTableState(todoTableId, {
    todoTable,
    todoItems,
    users,
  });
};

export {
  pushToDbSyncQueue,
  syncLocalStorageWithDb,
  syncDbWithLocalStorage,
  startDbSyncJob,
  localStorageToDbSyncQueue,
  dbToLocalStorageSyncQueue,
};
