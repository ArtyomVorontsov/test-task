type TodoTableInputsProps = {
  title: string;
  closed: boolean;
  reserveField: (path: string) => () => void;
  releaseField: () => () => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function TodoTableInputs({
  title,
  reserveField,
  releaseField,
  handleFormChange,
}: TodoTableInputsProps) {
  const path = "todoTable.title";

  return (
    <input
      type="text"
      className="w-1/2 border-b-2 p-2 text-black "
      placeholder="Enter text"
      value={title ?? ""}
      name={path}
      onClick={reserveField(path)}
      onBlur={releaseField()}
      onChange={handleFormChange}
    />
  );
}

export default TodoTableInputs;
