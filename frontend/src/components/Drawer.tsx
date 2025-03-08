import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { getAllTodoTables } from "../connectors/rpc";
import { useEffect, useState } from "react";
import { TodoTable } from "../types";
import { useNavigate } from "react-router-dom";

type DrawerListProps = {
  toggleDrawer: () => void;
};

function DrawerList({ toggleDrawer }: DrawerListProps) {
  const [todoTables, setTodoTables] = useState<TodoTable[]>([]);
  const navigate = useNavigate();

  const openTodoTable = (id: number) => {
    navigate(`/${id}`);
    toggleDrawer();
  };

  useEffect(() => {
    getAllTodoTables()
      .then((todoTables) => {
        setTodoTables(todoTables.data.result);
      })
      .catch((e) => {
        console.error("Error: unable to fetch all todo tables", e);
      });
  });

  return (
    <List className="w-md ">
      <ListItem>
        <ListItemText>Todo tables:</ListItemText>
      </ListItem>
      {todoTables.map((table) => (
        <ListItem key={table.id} disablePadding>
          <ListItemButton onClick={() => openTodoTable(table.id)}>
            <ListItemText secondary={table.title} />
          </ListItemButton>
        </ListItem>
      ))}

      <ListItem disablePadding>
        <ListItemButton onClick={toggleDrawer}>
          <ListItemText primary={"Close"} />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default DrawerList;
