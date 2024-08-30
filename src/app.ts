import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config()


const app: Application = express();
const port = process.env.PORT;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [

    ],
    credentials: true,
  })
)

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Hello Learnerkia",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
