import { connectToDatabase } from "../lib/mongo.js";

async function fixImageField() {
  const db = await connectToDatabase();
  const products = db.collection("products");

  const result = await products.updateMany(
    { image: { $exists: true } },
    { $rename: { image: "imageUrl" } }
  );

  console.log(`✅ Updated ${result.modifiedCount} products.`);
  process.exit(0);
}

fixImageField().catch(console.error);
