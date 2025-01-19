// loginRequired.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export const loginRequired = async (
	request: FastifyRequest<{ Params: { slug: string } }>,
	reply: FastifyReply,
) => {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		return reply.status(400).send({ error: ["Token não enviado"] });
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return reply.status(400).send({ error: ["Token não enviado"] });
	}

	try {
		const isTokenValid = jwt.verify(token, String(process.env.SECRET_KEY)) as jwt.JwtPayload;
		const { id, slug, email, name, lastName, age, notifications } = isTokenValid;

		request.user = { token, id, slug, email, name, lastName, age, notifications };
	} catch (error) {
		return reply.status(401).send({ error: ["Token inválido"] });
	}
};
