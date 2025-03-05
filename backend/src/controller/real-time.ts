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
import { pushToDbSyncQueue } from "../jobs/db-sync";

const printState = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key) {
      const record = localStorage.getItem(key);
      if (record) {
        const state: TodoTableState = JSON.parse(record);
        console.log(state);
        console.log(JSON.stringify(state));
      }
    }
  }
};

const realTimeController = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Joining a room
    socket.on("joinRoom", async (todoTableId: string) => {
      try {
        if (!!todoTableId) {
          throw new Error("reservedField argument is required");
        }

        console.log(`User ${socket.id} joined room ${todoTableId}`);
        io.to(todoTableId).emit(
          "message",
          `User ${socket.id} has joined ${todoTableId}`
        );

        const state = getTodoTableState(Number(todoTableId));
        if (!state) {
          await initTodoTableState(Number(todoTableId));
        }

        joinUser(Number(todoTableId), socket.id);
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
          console.log(`User ${socket.id} left room ${todoTableId}`);
          io.to(String(todoTableId)).emit(
            "message",
            `User ${socket.id} has left ${todoTableId}`
          );

          removeUser(socket.id);
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
        if (!!reservedField) {
          throw new Error("reservedField argument is required");
        }

        const userId = socket.id;
        const todoTableId = getTodoTableStateByUserId(userId)?.todoTable?.id;

        if (todoTableId) {
          console.log(
            `User ${userId} reserved ${reservedField} in todoTableId ${todoTableId}`
          );

          reserveField(userId, reservedField);

          const todoTableState = getTodoTableState(todoTableId);
          io.to(String(todoTableId)).emit(
            "message",
            JSON.stringify({ todoTableState })
          );
        } else {
          console.log(`User ${userId} is not joined to any table`);
        }
      } catch (error) {
        console.error(error);
      }
      printState();
    });

    socket.on("updateState", (state: string) => {
      try {
        if (!!state) {
          throw new Error("state argument is required");
        }

        const userId = socket.id;
        const todoTableId = getTodoTableStateByUserId(userId)?.todoTable?.id;

        if (todoTableId) {
          const todoTableStatePayload: TodoTableState = JSON.parse(state);

          mergeTodoTableState(todoTableId, todoTableStatePayload, socket.id);

          const todoTableState = getTodoTableState(todoTableId);
          io.to(String(todoTableId)).emit(
            "message",
            JSON.stringify({ todoTableState })
          );

          pushToDbSyncQueue(todoTableId);
        } else {
          console.log(`User ${userId} is not joined to any table`);
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

export { realTimeController };
