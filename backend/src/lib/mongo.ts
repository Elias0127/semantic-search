import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "";

const client = new MongoClient(uri);
let db: Db;

export async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB: ${dbName}`);
  }
  return db;
}
