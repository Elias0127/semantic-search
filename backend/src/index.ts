import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./lib/mongo.js";
import searchRoute from "./routes/search.js";
import imageProxyRoute from "./routes/imageProxy.js";


dotenv.config();

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
        messageFormat: "{msg} [id:{reqId}]",
      },
    },
  },
});

await fastify.register(cors, {
  origin: [
    "http://localhost:5173",
    "https://frontend-production-3eb6.up.railway.app",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  preflight: true, 
});
  
  
  

await fastify.register(searchRoute);
await fastify.register(imageProxyRoute);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const start = async () => {
  try {
    await connectToDatabase();
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server listening on ${PORT}`)
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
