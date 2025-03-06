import { getTodoTableState, setTodoTableState } from "../model/real-time";
import { getTodoItemsByTableId, updateTodoItem } from "../model/todo-item";
import { getTodoTableById } from "../model/todo-table";
import cron from "node-cron";
import { Server } from "socket.io";
import { emitSyncEvent } from "../controller/real-time";
import { logger } from "../util/logger";

const pushToDbSyncQueue = (syncQueueName: string, todoTableId: number) => {
  const syncQueueString = localStorage.getItem(syncQueueName);
  const syncQueue: number[] = syncQueueString
    ? JSON.parse(syncQueueString)
    : [];
  syncQueue.push(todoTableId);
  localStorage.setItem(syncQueueName, JSON.stringify(syncQueue));
};

const popFromDbSyncQueue = (syncQueueName: string): number => {
  const syncQueueString = localStorage.getItem(syncQueueName);
  const syncQueue: string[] = syncQueueString
    ? JSON.parse(syncQueueString)
    : [];
  const todoTableIdToSync = syncQueue.pop();
  localStorage.setItem(syncQueueName, JSON.stringify(syncQueue));

  return Number(todoTableIdToSync);
};

const localStorageToDbSyncQueue = "local-storage-to-db-sync-queue";
const dbToLocalStorageSyncQueue = "db-to-local-storage-sync-queue";

const startDbSyncJob = (io: Server) => {
  logger("startDbSyncJob");
  cron.schedule("*/10 * * * * *", () => {
    logger("Start local storage -> db sync");

    const todoTableId = popFromDbSyncQueue(localStorageToDbSyncQueue);

    if (todoTableId) {
      syncLocalStorageWithDb(todoTableId);
      logger(`Finish local storage -> db sync for ${todoTableId}`);
    } else {
      logger("Finish local storage -> db sync, no items in sync queue");
    }
  });

  cron.schedule("*/10 * * * * *", async () => {
    logger("Start db -> local storage sync");

    const todoTableId = popFromDbSyncQueue(dbToLocalStorageSyncQueue);

    if (todoTableId) {
      await syncDbWithLocalStorage(todoTableId);
      logger(`Finish db -> local storage sync for ${todoTableId}`);
      emitSyncEvent(todoTableId, io);
    } else {
      logger("Finish db -> local storage sync, no items in sync queue");
    }
  });
};

const syncLocalStorageWithDb = async (todoTableId: number) => {
  const state = getTodoTableState(todoTableId);

  for (const todoItem of state.todoItems) {
    await updateTodoItem(todoItem);
  }
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
  startDbSyncJob,
  localStorageToDbSyncQueue,
  dbToLocalStorageSyncQueue,
};
