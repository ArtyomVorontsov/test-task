import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _ from "lodash";

const handleErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ error: { message: _.head(errors.array())?.msg, code: 400 } });
  }
};

export { handleErrors };
