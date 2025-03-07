import Card from "@mui/material/Card";
import { CardContent, CardHeader, Typography } from "@mui/material";
import { TodoItem } from "../types";
import RealTimeInput from "./RealTimeInput";

type TodoListProps = {
  todoItems: TodoItem[];
  reserveField: (path: string) => () => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TodoList({
  todoItems,
  reserveField,
  handleFormChange,
}: TodoListProps) {
  return (
    <div className="w-80 h-[600px] overflow-y-auto bg-white shadow-lg rounded-lg p-4 space-y-4 border border-gray-300">
      {todoItems.map((todoItem, i) => (
        <Card key={todoItem.id} sx={{ maxWidth: 345 }}>
          <CardHeader>
            <Typography gutterBottom variant="h5" component="div">
              {todoItem.title}
            </Typography>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-gray-100">
              <div>
                <RealTimeInput
                  label="Title"
                  value={todoItem.title}
                  reserveField={reserveField}
                  path={`todoItems[${i}].title`}
                  handleFormChange={handleFormChange}
                />
              </div>
              <div>
                <RealTimeInput
                  label="Description"
                  value={todoItem.description}
                  reserveField={reserveField}
                  path={`todoItems[${i}].description`}
                  handleFormChange={handleFormChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
