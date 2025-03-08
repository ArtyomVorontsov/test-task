import * as React from "react";

type RealTimeInputProps = {
  label: string;
  value: string | null;
  reserveField: (path: string) => () => void;
  releaseField: () => () => void;
  path: string;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function RealTimeInput({
  value,
  reserveField,
  releaseField,
  path,
  handleFormChange,
  label,
}: RealTimeInputProps) {
  return (
    <div className="flex flex-col items-center justify-center pb-6">
      <input
        className="p-2 text-black w-60"
        value={value ?? ""}
        placeholder={label}
        name={path}
        onFocus={reserveField(path)}
        onChange={handleFormChange}
        onBlur={releaseField()}
      />
    </div>
  );
}

export default RealTimeInput;
