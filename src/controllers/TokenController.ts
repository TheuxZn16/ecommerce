import type { FastifyReply, FastifyRequest } from "fastify";
import type { TokenBody } from "../types/types";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class TokenController {
	async create(req: FastifyRequest<{ Body: TokenBody }>, res: FastifyReply) {
		if (!req.body) return res.status(400).send({ errors: ["Faltando parâmetros"] });
		const { email, password } = req.body;
		try {
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) return res.status(401).send({ errors: ["E-mail inválidos"] });
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) return res.status(401).send({ errors: ["Senha inválida"] });
			const payload = {
				name: user.name,
				slug: user.slug,
				email: user.email,
				notifications: user.notifications,
				birthday: user.birthday,
				lastName: user.lastName,
				city: user.city,
				state: user.state,
				country: user.country,
				zipCode: user.zipCode,
				cellphone: user.cellphone,
				cpf: user.cpf,
				street: user.street,
				number: user.number,
				complement: user.complement,
				neighborhood: user.neighborhood,
			};
			const token = jwt.sign(payload, String(process.env.SECRET_KEY), {
				expiresIn: String(process.env.EXPIRES_IN),
			});

			return res.status(200).send({
				token,
				user: {
					name: user.name,
					slug: user.slug,
					email: user.email,
					notifications: user.notifications,
					birthday: user.birthday,
					lastName: user.lastName,
					city: user.city,
					state: user.state,
					country: user.country,
					zipCode: user.zipCode,
					cellphone: user.cellphone,
					cpf: user.cpf,
					street: user.street,
					number: user.number,
					complement: user.complement,
					neighborhood: user.neighborhood,
				},
			});
		} catch (error) {
			return res.status(500).send({ errors: ["Ocorreu um erro ao autenticar o usuário"] });
		}
	}
}
export default new TokenController();
