import { FastifyInstance } from "fastify";
import { getEmbedding } from "../lib/openai.js";
import { connectToDatabase } from "../lib/mongo.js";
import { Product } from "../types.js";
import OpenAI from "openai";

/* ───────────────── CONFIG ───────────────── */
const SIMILARITY_HARD_THRESHOLD = 0.5; // 0 – 1, raise/lower to taste
const GREET_REGEX =
  /^(hi|hello|hey|good (morning|afternoon|evening))[\s!,.?]*$/i;

export default async function searchRoute(fastify: FastifyInstance) {
  fastify.post("/search", async (request, reply) => {
    const { query } = request.body as { query: string };
    if (!query) return reply.status(400).send({ error: "Missing query" });

    /* 1) Handle greetings early — no DB or OpenAI cost  */
    if (GREET_REGEX.test(query.trim())) {
      return reply.send({
        answer:
          "Hi there! Ask me about shirts, jackets, shoes – whatever you’re shopping for.",
        results: [],
      });
    }

    /* 2) Embed query & fetch products */
    const embedding = await getEmbedding(query);
    const db = await connectToDatabase();
    const products = await db.collection<Product>("products").find().toArray();

    /* 3) Score similarities */
    const scored = products.map((product) => ({
      ...product,
      similarity: cosineSimilarity(embedding, product.embedding),
    }));

    /* 4) Hard filter + relative filter (keep only those close to best match) */
    const best = Math.max(...scored.map((p) => p.similarity));
    const topMatches = scored
      .filter(
        (p) =>
          p.similarity >= SIMILARITY_HARD_THRESHOLD && // above fixed floor
          p.similarity >= best - 0.05 // within 0.05 of best
      )
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    /* 5) No matches? */
    if (topMatches.length === 0) {
      return reply.send({
        answer:
          "I couldn’t find any products that match that. Maybe try another term or describe the item?",
        results: [],
      });
    }

    /* 6) Build RAG prompt */
    const productDescriptions = topMatches
      .map((p) => `• ${p.name} — ${p.description} ($${p.price})`)
      .join("\n");

    const systemPrompt = `
You are a helpful AI assistant for a fashion store.
Use the following products to answer the customer's question naturally.

Customer: ${query}

Products:
${productDescriptions}

Response:
`;

    /* 7) Chat completion */
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemPrompt }],
    });

    const answer = chatResponse.choices[0].message.content;
    return reply.send({ answer, results: topMatches });
  });
}

/* ───────── helpers ───────── */
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}
