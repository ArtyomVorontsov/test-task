import { Server } from "socket.io";
import {
  getTodoTableState,
  initTodoTableState,
  joinUser,
  mergeTodoTableState,
  removeUser,
  reserveField,
  getTodoTableStateByUserId,
} from "../model/real-time";
import { TodoTableState } from "../types";
import { localStorageToDbSyncQueue, pushToDbSyncQueue } from "../jobs/db-sync";
import { logger } from "../util/logger";
import { printState } from "../util/print-state";

enum EVENTS {
  STATE_UPDATED = "stateUpdated",
  CONNECTION = "connection",
  JOIN_ROOM = "joinRoom",
  LEAVE_ROOM = "leaveRoom",
  RESERVE_FIELD = "reserveField",
  UPDATE_STATE = "updateState",
  DISCONNECT = "disconnect",
}

const emitSyncEvent = (roomId: number, io: Server) => {
  const todoTableId = Number(roomId);

  const todoTableState = getTodoTableState(todoTableId);
  io.to(String(todoTableId)).emit(
    EVENTS.STATE_UPDATED,
    JSON.stringify({ todoTableState })
  );
};

const realTimeController = (io: Server) => {
  io.on(EVENTS.CONNECTION, (socket) => {
    logger(`User connected: ${socket.id}`);

    // Joining a room
    socket.on(EVENTS.JOIN_ROOM, async (roomId: string) => {
      try {
        if (!roomId) {
          throw new Error("roomId argument is required");
        }

        const todoTableId = Number(roomId);
        const state = getTodoTableState(todoTableId);
        if (!state) {
          await initTodoTableState(todoTableId);
        }

        const currentTodoTableId = getTodoTableStateByUserId(socket.id)
          ?.todoTable?.id;

        // Remove user from other tables
        const joinedUser = removeUser(socket.id);

        if (currentTodoTableId) {
          emitSyncEvent(currentTodoTableId, io);
        }

        joinUser(todoTableId, socket.id, joinedUser);
        socket.join(String(todoTableId));
        emitSyncEvent(todoTableId, io);

        logger(`User ${socket.id} joined room ${roomId}`);
      } catch (error) {
        console.error(error);
      }
      printState();
    });

    // Leaving a room
    socket.on(EVENTS.LEAVE_ROOM, () => {
      try {
        const todoTableId = getTodoTableStateByUserId(socket.id)?.todoTable?.id;

        if (todoTableId) {
          socket.leave(String(todoTableId));
          removeUser(socket.id);
          emitSyncEvent(todoTableId, io);
          logger(`User ${socket.id} left room ${todoTableId}`);
        } else {
          throw new Error(`User ${todoTableId} is not joined to any room`);
        }
      } catch (error) {
        console.error(error);
      }

      printState();
    });

    socket.on(EVENTS.RESERVE_FIELD, (reservedField: string) => {
      try {
        if (!reservedField) {
          throw new Error("reservedField argument is required");
        }

        const userId = socket.id;
        const todoTableId = getTodoTableStateByUserId(userId)?.todoTable?.id;

        if (todoTableId) {
          reserveField(userId, reservedField);
          emitSyncEvent(todoTableId, io);
          logger(
            `User ${userId} reserved ${reservedField} in todoTableId ${todoTableId}`
          );
        } else {
          logger(`User ${userId} is not joined to any table`);
        }
      } catch (error) {
        console.error(error);
      }
      printState();
    });

    socket.on(EVENTS.UPDATE_STATE, (state: string) => {
      try {
        if (!state) {
          throw new Error("state argument is required");
        }

        const userId = socket.id;
        const todoTableId = getTodoTableStateByUserId(userId)?.todoTable?.id;

        if (todoTableId) {
          const todoTableStatePayload: TodoTableState = JSON.parse(state);

          mergeTodoTableState(todoTableId, todoTableStatePayload, socket.id);
          emitSyncEvent(todoTableId, io);
          pushToDbSyncQueue(localStorageToDbSyncQueue, todoTableId);
        } else {
          logger(`User ${userId} is not joined to any table`);
        }
      } catch (error) {
        console.error(error);
      }

      printState();
    });

    // Handling disconnection
    socket.on(EVENTS.DISCONNECT, () => {
      try {
        removeUser(socket.id);
      } catch (error) {
        console.error(error);
      }

      printState();
    });
  });
};

export { realTimeController, emitSyncEvent };
