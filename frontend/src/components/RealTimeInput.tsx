import * as React from "react";

type RealTimeInputProps = {
  label: string;
  value: string | null;
  reserveField: (path: string) => () => void;
  path: string;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function RealTimeInput({
  value,
  reserveField,
  path,
  handleFormChange,
  label,
}: RealTimeInputProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-gray-100">
      <label>{label}</label>
      <input
        id="outlined-basic"
        value={value ?? ""}
        name={path}
        onClick={reserveField(path)}
        onChange={handleFormChange}
      />
    </div>
  );
}

export default RealTimeInput;
