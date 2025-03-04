import { TodoItem, TodoTable } from "../../types";
import { db } from "../connectors/db";

const createTodoTable = async (tableData: TodoTable) => {
    return db("todo_table").insert(tableData).returning("*");
};

const createTodoItem = async (itemData: TodoItem) => {
    return db("todo_item").insert(itemData).returning("*");
};

const updateTodoItem = async (itemId: number, updatedData: TodoItem) => {
    return db("todo_item")
        .where({ id: itemId })
        .update(updatedData)
        .returning("*");
};

export {
    createTodoTable,
    createTodoItem,
    updateTodoItem
}
