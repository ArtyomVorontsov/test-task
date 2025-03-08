import { Server } from "socket.io";
import { emitSyncEvent } from "../controller/real-time";
import {
  syncDbWithLocalStorage,
  syncLocalStorageWithDb,
} from "../jobs/db-sync";
import { Request } from "express";
import { HookFunction } from "../../types";

const syncState = (io: Server): HookFunction => {
  return async (req: Request) => {
    const todoTableId = req.body.params.todoItem.table_id;
    // Needed for quick sync with clients
    await syncLocalStorageWithDb(todoTableId);
    await syncDbWithLocalStorage(todoTableId);
    emitSyncEvent(todoTableId, io);
  };
};

export { syncState };
