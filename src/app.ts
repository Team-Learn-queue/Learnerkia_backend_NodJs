import express, { Application, Request, Response, NextFunction } from "express";
import routes from "./routes/index.routes";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// import fileUpload from "express-fileupload";
import sequelize from "./config/db";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import logger from "./utils/logger";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v3", routes);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    const logMessage = `${req.method} ${req.url} ${res.statusCode}`;

    if (Object.keys(req.query).length) {
      logger.info(`${logMessage} - Query Params: ${JSON.stringify(req.query)}`);
    }

    if (req.body && Object.keys(req.body).length > 0) {
      logger.info(`${logMessage} - Request Body: ${JSON.stringify(req.body)}`);
    } else {
      logger.info(logMessage);
    }
  });
  next();
});

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Database synchronized successfully.");
//   })
//   .catch((error: any) => {
//     console.error("Unable to synchronize the database:", error);
//   });

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Hello Learnerkia",
  });
});

export default app;
