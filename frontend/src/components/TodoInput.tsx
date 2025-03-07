import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function TodoInput() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-gray-100">
      <div>
        <TextField id="outlined-basic" label="Title" variant="outlined" />
      </div>
      <div>
        <TextField id="outlined-basic" label="Description" variant="outlined" />
      </div>
      <div>
        <Button variant="outlined">Submit</Button>
      </div>
    </div>
  );
}

export default TodoInput;
