import { getTodoTableState } from "../model/real-time";
import { updateTodoItem } from "../model/todo-item";

const pushToDbSyncQueue = (todoTableId: number) => {
  const syncQueueString = localStorage.getItem("sync-queue");
  const syncQueue: number[] = syncQueueString
    ? JSON.parse(syncQueueString)
    : [];
  syncQueue.push(todoTableId);
  localStorage.setItem("sync-queue", JSON.stringify(syncQueue));
};

const popFromDbSyncQueue = (): number => {
  const syncQueueString = localStorage.getItem("sync-queue");
  const syncQueue: string[] = syncQueueString
    ? JSON.parse(syncQueueString)
    : [];
  const todoTableIdToSync = syncQueue.pop();
  localStorage.setItem("sync-queue", JSON.stringify(syncQueue));

  return Number(todoTableIdToSync);
};

const startDbSyncJob = () => {
  setInterval(() => {
    console.log("Start sync");

    const todoTableId = popFromDbSyncQueue();

    if (todoTableId) {
      syncWithDb(todoTableId);
      console.log(`Finish sync for ${todoTableId}`);
    } else {
      console.log("Finish sync, no items in sync queue");
    }
  }, 10000);
};

const syncWithDb = async (todoTableId: number) => {
  const state = getTodoTableState(todoTableId);

  for (const todoItem of state.todoItems) {
    await updateTodoItem(todoItem);
  }
};

export { pushToDbSyncQueue, startDbSyncJob };
