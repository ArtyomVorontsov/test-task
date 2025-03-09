import { TodoTableState } from "../types";
import { logger } from "./logger";

const printState = () => {
  if (process.env.ENVIROMENT == "DEV")
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key) {
        const record = localStorage.getItem(key);
        if (record) {
          const state: TodoTableState = JSON.parse(record);
          logger(JSON.stringify(state));
        }
      }
    }
};

export { printState };
