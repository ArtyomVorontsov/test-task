import { uniqueNamesGenerator, Config, colors } from "unique-names-generator";

const generateColor = () => {
  const config: Config = {
    dictionaries: [colors],
    separator: "-",
    length: 1,
  };

  return uniqueNamesGenerator(config);
};

export { generateColor };
