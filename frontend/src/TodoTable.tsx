import { useEffect, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { STATUS, TodoTableState } from "./types";
import _ from "lodash";
import * as rpcConnectors from "./connectors/rpc";
import { Button, Drawer, IconButton } from "@mui/material";
import { env } from "../env";
import TodoTableInputs from "./components/TodoTableInputs";
import DrawerList from "./components/Drawer";
import Users from "./components/Users";
import MenuIcon from "@mui/icons-material/Menu";

const socket = io(env.BACKEND_URL);

const reserveField = (path: string) => {
  return () => {
    socket.emit("reserveField", path);
  };
};

const releaseField = () => {
  return () => {
    socket.emit("reserveField", "users");
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

  const createTodo = () => {
    rpcConnectors.createTodo(Number(id));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: propertyPath, value } = e.target;
    const newTodoState = _.cloneDeep(todoState);
    _.set(newTodoState, propertyPath, value);
    const mergedState: TodoTableState = _.merge(todoState, newTodoState);
    setTodoState({ ...mergedState });

    socket.emit("updateState", JSON.stringify(mergedState));
  };

  const location = useLocation();

  useEffect(() => {
    if (socket.connected) {
      socket.emit("leaveRoom");
      socket.emit("joinRoom", id);
    }

    socket.on("connect", () => {
      if (socket.connected) {
        socket.emit("joinRoom", id);
      }
    });

    socket.on("stateUpdated", (data: string) => {
      setTodoState((prevState: TodoTableState) => {
        const newTodoTableState: TodoTableState =
          JSON.parse(data).todoTableState;

        const currenTodoTableState: TodoTableState = prevState;
        const user = newTodoTableState.users.find((u) => u.id === socket.id);

        if (user && user.reservedField) {
          const reservedFieldValue = _.get(
            currenTodoTableState,
            user.reservedField
          ) as string;

          const mergedTodoTableState = _.set(
            newTodoTableState,
            user.reservedField,
            reservedFieldValue
          );

          return { ...mergedTodoTableState };
        } else {
          return newTodoTableState;
        }
      });
    });
  }, [location]);

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="h-[10vh] bg-white-500 text-white flex items-center justify-between text-xl font-semibold pl-20 pr-20">
          <div className="h-[10vh] bg-white-500 text-white flex items-center justify-between w-30%">
            <IconButton
              color="primary"
              aria-label="open menu"
              onClick={toggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer()}>
              <DrawerList toggleDrawer={toggleDrawer()} />
            </Drawer>

            <TodoTableInputs
              reserveField={reserveField}
              releaseField={releaseField}
              handleFormChange={handleFormChange}
              title={todoState.todoTable.title}
              closed={todoState.todoTable.closed}
            ></TodoTableInputs>
          </div>

          <Users users={todoState.users} />
        </header>

        <main className="flex-1 bg-white-100 flex flex-row items-center justify-center space-y-6">
          <div className="flex-2 bg-white-100 flex flex-row items-center justify-center">
            <Button onClick={createTodo} variant="outlined">
              Create new todo
            </Button>
          </div>
          <div className="flex-5 bg-white-100 flex flex-row items-center  justify-around">
            <TodoList
              reserveField={reserveField}
              releaseField={releaseField}
              todoItems={todoState.todoItems}
              handleFormChange={handleFormChange}
              status={STATUS.PENDING}
            />
            <TodoList
              reserveField={reserveField}
              releaseField={releaseField}
              todoItems={todoState.todoItems}
              handleFormChange={handleFormChange}
              status={STATUS.COMPLETED}
            />
          </div>
        </main>

        <footer className="h-[10vh] bg-whte-500 text-white flex items-center justify-center text-lg font-semibold"></footer>
      </div>
    </>
  );
}

export default TodoTableComponent;
