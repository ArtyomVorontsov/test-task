import { generateColor } from "../util/generate-color";
import { generateNickname } from "../util/generate-nickname";
import { TodoTableState, User } from "../types";
import { getTodoTableById } from "./todo-table";
import _ from "lodash";
import { getTodoItemsByTableId } from "./todo-item";

const initTodoTableState = async (todoTableId: number) => {
  const todoTable = await getTodoTableById(todoTableId);
  const todoItems = await getTodoItemsByTableId(todoTableId);

  setTodoTableState(todoTableId, {
    todoTable,
    todoItems,
    users: [],
  });
};

const getTodoTableState = (todoTableId: number): TodoTableState => {
  const todoTableState = localStorage.getItem(String(todoTableId));
  return todoTableState && JSON.parse(todoTableState);
};

const setTodoTableState = (
  todoTableId: number,
  todoTableState: TodoTableState
) => {
  localStorage.setItem(String(todoTableId), JSON.stringify(todoTableState));
};

const mergeTodoTableState = (
  todoTableId: number,
  newState: TodoTableState,
  userId: string
) => {
  const currentState = getTodoTableState(todoTableId);
  const user = currentState.users.find((u) => u.id === userId);
  const reservedFieldPath = user?.reservedField;

  if (reservedFieldPath) {
    const newValue = _.get(newState, reservedFieldPath);
    const updatedState = _.set(currentState, reservedFieldPath, newValue);

    setTodoTableState(todoTableId, updatedState);
  }
};

const reserveField = (userId: string, reservedField: string) => {
  const todoTableId = getTodoTableStateByUserId(userId)?.todoTable.id;

  if (todoTableId) {
    const todoTableState = getTodoTableState(todoTableId);

    const user = todoTableState.users.find((user) => user.id === userId);

    if (user) {
      user.reservedField = reservedField;
    }

    setTodoTableState(todoTableId, todoTableState);
  }
};

// User

const joinUser = (todoTableId: number, socketId: string) => {
  const todoTableState = getTodoTableState(todoTableId);

  // Remove user from other tables
  removeUser(socketId);
  todoTableState.users.push(createNewUser(socketId));
  setTodoTableState(todoTableId, todoTableState);
};

const createNewUser = (id: string): User => {
  return {
    id,
    nickname: generateNickname(),
    color: generateColor(),
    reservedField: null,
    cursor: {
      x: 0,
      y: 0,
    },
  };
};

const removeUser = (userId: string) => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key) {
      const record = localStorage.getItem(key);
      if (record) {
        const state: TodoTableState = JSON.parse(record);
        state.users = state.users.filter((u) => u.id !== userId);
        setTodoTableState(state.todoTable.id, state);
      }
    }
  }
};

const getTodoTableStateByUserId = (userId: string): TodoTableState | null => {
  let todoTableState: TodoTableState | null = null;

  for (let i = 0; i < localStorage.length && todoTableState == null; i++) {
    const key = localStorage.key(i);

    if (key) {
      const record = localStorage.getItem(key);
      if (record) {
        const state: TodoTableState = JSON.parse(record);
        if (state.users.find((u) => u.id === userId)) {
          todoTableState = state;
        }
      }
    }
  }

  return todoTableState;
};

export {
  setTodoTableState,
  getTodoTableState,
  joinUser,
  removeUser,
  initTodoTableState,
  reserveField,
  mergeTodoTableState,
  getTodoTableStateByUserId,
};
