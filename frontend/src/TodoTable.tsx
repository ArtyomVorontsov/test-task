import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { TodoItem, TodoTable, TodoTableState, User } from "./types";
import _ from "lodash";

const socket = io("http://192.168.1.129:3000");

const reserveField = (path: string) => {
  return () => {
    socket.emit("reserveField", path);
  };
};

function TodoTableComponent() {
  const initialState: TodoTableState = {
    todoItems: [],
    todoTable: {
      id: 0,
      title: "",
      closed: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    users: [],
  };
  const [todoState, setTodoState] = useState(initialState);
  const { id } = useParams();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: propertyPath, value } = e.target;
    const newTodoState = _.cloneDeep(todoState);
    _.set(newTodoState, propertyPath, value);
    const mergedState: TodoTableState = _.merge(todoState, newTodoState);
    setTodoState({ ...mergedState });

    socket.emit("updateState", JSON.stringify(mergedState));
  };

  useEffect(() => {
    socket.on("connect", () => {
      if (socket.connected) {
        socket.emit("joinRoom", id);
      }
    });

    socket.on("stateUpdated", (data: string) => {
      setTodoState(JSON.parse(data).todoTableState);
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="h-[10vh] bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
        <Header />
      </header>

      <main className="flex-1 bg-gray-100 flex flex-row items-center justify-center space-y-6">
        <div className="w-[300px]">
          <TodoInput />
        </div>
        <div className="w-[500px]">
          <TodoList
            reserveField={reserveField}
            todoItems={todoState.todoItems}
            handleFormChange={handleFormChange}
          />
        </div>
      </main>

      <footer className="h-[10vh] bg-blue-500 text-white flex items-center justify-center text-lg font-semibold"></footer>
    </div>
  );
}

export default TodoTableComponent;
