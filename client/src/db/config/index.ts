import { Db, MongoClient } from "mongodb";

const uri = process.env.DB_URL;

//buat kondisi kalo connection string nya gaada
if (!uri) {
  throw new Error("MONGO_DB_CONNECTION_STRING is not defined");
}

const client: MongoClient = new MongoClient(uri);

const db: Db = client.db("bukawarung");

export { client, db };
