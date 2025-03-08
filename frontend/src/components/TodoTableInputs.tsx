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
      className="flex w-full ml-10 text-black "
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
