import Card from "@mui/material/Card";
import {
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { STATUS, TodoItem } from "../types";
import RealTimeInput from "./RealTimeInput";
import { getHopefullyFunnyMessage } from "../utils/get-hopefully-funny-message";

type TodoListProps = {
  todoItems: TodoItem[];
  reserveField: (path: string) => () => void;
  releaseField: () => () => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status: STATUS;
};

export default function TodoList({
  todoItems,
  reserveField,
  releaseField,
  handleFormChange,
  status,
}: TodoListProps) {
  const amountOfTodoInTheList = todoItems.filter(
    (todoItem) => Number(todoItem.status) === status
  ).length;

  const stylesConfig = {
    [STATUS.COMPLETED]: {
      maxWidth: 345,
      borderTop: "3px solid green",
      marginBottom: "10px",
    },
    [STATUS.PENDING]: {
      maxWidth: 345,
      borderTop: "3px solid blue",
      marginBottom: "10px",
    },
  };

  const statusText = {
    [STATUS.COMPLETED]: "Done",
    [STATUS.PENDING]: "Pending",
  };

  const messages = getHopefullyFunnyMessage(status, todoItems);

  return (
    <div>
      <Card sx={stylesConfig[status]}>
        <CardContent>
          <Typography variant="caption">
            {statusText[status]} todo amount: {amountOfTodoInTheList}
          </Typography>
        </CardContent>
      </Card>

      <div className="w-80 h-[600px] overflow-y-auto bg-white shadow-lg rounded-lg p-4 space-y-4 border border-gray-300">
        <Typography variant="caption">{messages[status]}</Typography>
        {todoItems.map((todoItem, i) => {
          if (Number(todoItem.status) !== status) {
            return <div className="hidden" key={todoItem.id}></div>;
          }

          return (
            <Card sx={stylesConfig[status]} key={todoItem.id}>
              <CardContent>
                <RealTimeInput
                  label="Title"
                  value={todoItem.title}
                  reserveField={reserveField}
                  releaseField={releaseField}
                  path={`todoItems[${i}].title`}
                  handleFormChange={handleFormChange}
                />

                <RealTimeInput
                  label="Description"
                  value={todoItem.description}
                  reserveField={reserveField}
                  releaseField={releaseField}
                  path={`todoItems[${i}].description`}
                  handleFormChange={handleFormChange}
                />

                <FormControlLabel
                  label="Is done?"
                  control={
                    <Checkbox
                      color="success"
                      checked={todoItem.status == 1}
                      value={todoItem.status == 1}
                      name={`todoItems[${i}].status`}
                      onFocus={reserveField(`todoItems[${i}].status`)}
                      onChange={(e) => {
                        e.target.value = e.target.checked ? "1" : "0";
                        handleFormChange(e);
                      }}
                    />
                  }
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
