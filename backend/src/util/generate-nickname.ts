import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const generateNickname = () => {
  const config: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: "-",
    length: 2,
  };

  return uniqueNamesGenerator(config);
};

export { generateNickname };
