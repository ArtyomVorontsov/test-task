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
  const todoTableState = localStorage.getItem(`todoTable:${todoTableId}`);
  return todoTableState && JSON.parse(todoTableState);
};

const setTodoTableState = (
  todoTableId: number,
  todoTableState: TodoTableState
) => {
  localStorage.setItem(
    `todoTable:${todoTableId}`,
    JSON.stringify(todoTableState)
  );
};

const getTodoTableStates = () => {
  const todoTableStates: TodoTableState[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key && _.head(key.split(":")) === "todoTable") {
      todoTableStates.push(getTodoTableState(Number(key.split(":").at(1))));
    }
  }
  return todoTableStates;
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

const joinUser = (todoTableId: number, socketId: string, joinedUser?: User) => {
  const todoTableState = getTodoTableState(todoTableId);

  todoTableState.users.push(joinedUser ? joinedUser : createNewUser(socketId));

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
  const todoTableStates: TodoTableState[] = getTodoTableStates();
  let removedUsers: User[] = [];

  for (let i = 0; i < todoTableStates.length; i++) {
    const state: TodoTableState = todoTableStates[i];

    const user = state.users.find((u) => u.id === userId);

    if (user) {
      removedUsers.push(user);
    }

    state.users = state.users.filter((u) => u.id !== userId);
    if (state.todoTable) setTodoTableState(state.todoTable.id, state);
  }

  return _.first(removedUsers);
};

const getTodoTableStateByUserId = (userId: string): TodoTableState | null => {
  let todoTableState: TodoTableState | null = null;

  const todoTableStates: TodoTableState[] = getTodoTableStates();

  for (let i = 0; i < todoTableStates.length && todoTableState == null; i++) {
    const state: TodoTableState = todoTableStates[i];

    if (state.users.find((u) => u.id === userId)) {
      todoTableState = state;
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
