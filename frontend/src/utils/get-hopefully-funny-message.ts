import { STATUS, TodoItem } from "../types";

const getHopefullyFunnyMessage = (
  status: STATUS,
  todoItems: TodoItem[]
) => {
  const todoItemsOfProvidedStatusAreEmpty = !todoItems.filter(
    (todoItem) => Number(todoItem.status) === status
  ).length;

  const todoItemsListIsEmpty = !todoItems.length;

  let messages = {
    [STATUS.PENDING]: "",
    [STATUS.COMPLETED]: "",
  };

  if (todoItemsListIsEmpty) {
    messages = {
      [STATUS.PENDING]: "Nothing planned, create some todo!",
      [STATUS.COMPLETED]: "If nothing is planned, nothing to be done, right?:)",
    };
  } else if (todoItemsOfProvidedStatusAreEmpty) {
    messages = {
      [STATUS.COMPLETED]: "Nothing is done! Just do it",
      [STATUS.PENDING]: "Todo list is empty! Respect",
    };
  }

  return messages;
};

export { getHopefullyFunnyMessage };
