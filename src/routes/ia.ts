import { FastifyInstance } from "fastify";
import fetch from "node-fetch";

async function getIAReport(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY!;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 256
    })
  });
  const data = await res.json() as any;
  console.log("Respuesta Groq:", JSON.stringify(data, null, 2));
  if (data.choices?.[0]?.message?.content) {
    console.log("Texto IA:", data.choices[0].message.content);
  }
  return data.choices?.[0]?.message?.content || "Error de la IA";
}

async function iaRoutes(fastify: FastifyInstance) {
  fastify.post("/", async (request, reply) => {
    const { nombre, descripcion, estado, fecha, responsable } = request.body as any;

    const prompt = `
      Analiza el siguiente proceso empresarial y entrega exactamente 3 sugerencias breves de mejora, cada una en una sola línea. Sé concreto y no uses más de 100 palabras en total.

      Proceso: ${nombre}
      Descripción: ${descripcion}
      Estado: ${estado}
      Fecha: ${fecha}
      Responsable: ${responsable}
    `;

    try {
      const respuesta = await getIAReport(prompt);
      reply.send({ respuesta });
    } catch (err) {
      console.error("Error al generar reporte IA con Groq:", err);
      reply.code(500).send({ error: "Error al generar reporte IA" });
    }
  });
}

export default iaRoutes;
