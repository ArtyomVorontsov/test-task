import { Express } from "express";
import path from "path";

const staticController = (app: Express) => {
  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "static", "frontend-build", "index.html")
    );
  });
};

export { staticController };
