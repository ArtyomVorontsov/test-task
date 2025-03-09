import { Router } from "express";
import path from "path";

const staticController = (apiRouter: Router) => {
  apiRouter.get("/", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "static", "frontend-build", "index.html")
    );
  });
};

export { staticController };
