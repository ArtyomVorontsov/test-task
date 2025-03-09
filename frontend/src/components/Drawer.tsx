import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as connectors from "../connectors/rpc";
import { useEffect, useState } from "react";
import { TodoTable } from "../types";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { ListItemIcon } from "@mui/material";

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

  const createTodoTable = async () => {
    const newTodoTable = (
      await connectors.createTodoTable("New todo table", false)
    ).data.result;

    setTodoTables([...todoTables, newTodoTable]);
  };

  useEffect(() => {
    connectors
      .getAllTodoTables()
      .then((todoTables) => {
        setTodoTables(todoTables.data.result);
      })
      .catch((e) => {
        console.error("Error: unable to fetch all todo tables", e);
      });
  }, []);

  return (
    <List className="w-md ">
      <ListItem>
        <ListItemText>Todo tables:</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemButton onClick={createTodoTable}>
          <ListItemIcon>
            <AddIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={"Create new table"} />
        </ListItemButton>
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
