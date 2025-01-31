import express, { Application } from "express";
import cors from "cors";
import router from "./routes";
import errorMiddleware from "./middleware/errorMiddleware";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);
app.use(errorMiddleware);

export default app;
