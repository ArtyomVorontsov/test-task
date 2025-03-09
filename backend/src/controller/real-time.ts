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


const printState = () => {
  if (process.env.ENVIROMENT == 'DEV')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key) {
        const record = localStorage.getItem(key);
        if (record) {
          const state: TodoTableState = JSON.parse(record);
          logger(JSON.stringify(state));
        }
      }
    }
};

const emitSyncEvent = (roomId: number, io: Server) => {
  const todoTableId = Number(roomId);

  const todoTableState = getTodoTableState(todoTableId);
  io.to(String(todoTableId)).emit(
    "stateUpdated",
    JSON.stringify({ todoTableState })
  );
};

const realTimeController = (io: Server) => {
  io.on("connection", (socket) => {
    logger(`User connected: ${socket.id}`);

    // Joining a room
    socket.on("joinRoom", async (roomId: string) => {
      try {
        if (!roomId) {
          throw new Error("roomId argument is required");
        }

        logger(`User ${socket.id} joined room ${roomId}`);

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
          const state = getTodoTableState(currentTodoTableId);
          io.to(String(currentTodoTableId)).emit(
            "stateUpdated",
            JSON.stringify({ todoTableState: state })
          );
        }

        joinUser(todoTableId, socket.id, joinedUser);
        socket.join(String(todoTableId));

        const todoTableState = getTodoTableState(todoTableId);
        io.to(String(todoTableId)).emit(
          "stateUpdated",
          JSON.stringify({ todoTableState })
        );
      } catch (error) {
        console.error(error);
      }
      printState();
    });

    // Leaving a room
    socket.on("leaveRoom", () => {
      try {
        const todoTableId = getTodoTableStateByUserId(socket.id)?.todoTable?.id;

        if (todoTableId) {
          socket.leave(String(todoTableId));
          removeUser(socket.id);

          logger(`User ${socket.id} left room ${todoTableId}`);

          const todoTableState = getTodoTableState(todoTableId);
          socket
            .to(String(todoTableId))
            .emit("stateUpdated", JSON.stringify({ todoTableState }));
        } else {
          throw new Error(`User ${todoTableId} is not joined to any room`);
        }
      } catch (error) {
        console.error(error);
      }

      printState();
    });

    socket.on("reserveField", (reservedField: string) => {
      try {
        if (!reservedField) {
          throw new Error("reservedField argument is required");
        }

        const userId = socket.id;
        const todoTableId = getTodoTableStateByUserId(userId)?.todoTable?.id;

        if (todoTableId) {
          logger(
            `User ${userId} reserved ${reservedField} in todoTableId ${todoTableId}`
          );

          reserveField(userId, reservedField);

          const todoTableState = getTodoTableState(todoTableId);
          socket
            .to(String(todoTableId))
            .emit("stateUpdated", JSON.stringify({ todoTableState }));
        } else {
          logger(`User ${userId} is not joined to any table`);
        }
      } catch (error) {
        console.error(error);
      }
      printState();
    });

    socket.on("updateState", (state: string) => {
      try {
        if (!state) {
          throw new Error("state argument is required");
        }

        const userId = socket.id;
        const todoTableId = getTodoTableStateByUserId(userId)?.todoTable?.id;

        if (todoTableId) {
          const todoTableStatePayload: TodoTableState = JSON.parse(state);

          mergeTodoTableState(todoTableId, todoTableStatePayload, socket.id);

          const todoTableState = getTodoTableState(todoTableId);
          socket
            .to(String(todoTableId))
            .emit("stateUpdated", JSON.stringify({ todoTableState }));

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
    socket.on("disconnect", () => {
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
