import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { Configuration, OpenAIApi } from "openai";
import openAiRoutes from "./routes/openai.js";
import authRoutes from "./routes/auth.js";
import https from "https";
import fs from "fs";
/* CONFIGURATIONS */
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin:'*'
}));

/* OPEN AI CONFIGURATION */
const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
export const openai = new OpenAIApi(configuration);

/* ROUTES */
app.use("/openai", openAiRoutes);
app.use("/auth", authRoutes);
const httpsServer = https.createServer({
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
},app);
/* SERVER SETUP */
const PORT = process.env.PORT || 9000;
httpsServer.listen(443, () => {
  console.log(`Example app listening at https://localhost:443`);
});
