import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function imageProxyRoute(fastify: FastifyInstance) {
  fastify.get(
    "/img-proxy",
    async (req: FastifyRequest, reply: FastifyReply) => {
      // 1. Extract & decode the URL
      const rawUrl = (req.query as { url?: string }).url;
      if (!rawUrl) {
        return reply.status(400).send("Missing url param");
      }

      let imageUrl: string;
      try {
        imageUrl = decodeURIComponent(rawUrl);
      } catch {
        return reply.status(400).send("Invalid url encoding");
      }

      try {
        // 2. Fetch the image (Node 18+ global fetch)
        const upstream = await fetch(imageUrl);
        if (!upstream.ok) {
          return reply.status(502).send("Upstream fetch failed");
        }

        // 3. Buffer the whole body
        const arrayBuffer = await upstream.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. Forward correct headers and the buffer
        const contentType =
          upstream.headers.get("content-type") || "application/octet-stream";
        reply
          .header("Content-Type", contentType)
          .header("Cache-Control", "public, max-age=86400")
          .send(buffer);
      } catch (err) {
        // Catch network or parsing errors
        reply.status(502).send("Error fetching image");
      }
    }
  );
}
