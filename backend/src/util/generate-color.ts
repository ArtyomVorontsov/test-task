var randomColor = require("randomcolor");

const generateColor = () => {
  return randomColor({ luminosity: "bright", format: "hex" });
};

export { generateColor };
