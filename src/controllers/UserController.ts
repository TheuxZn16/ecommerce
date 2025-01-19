import type { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type { UserBodyCreate, UserBodyUpdate, UserParams } from "../types/types";
import genSlug from "../utils/genSlug";

const prisma = new PrismaClient();

class User {
	async show(req: FastifyRequest<{ Params: UserParams }>, res: FastifyReply) {
		if (!req.params) return res.status(400).send({ error: ["Faltando parâmetros"] });
		const { slug } = req.params;
		try {
			const user = await prisma.user.findUnique({ where: { slug } });
			if (!user) return res.status(404).send({ error: ["Usuário não foi encontrado"] });
			const {
				name,
				email,
				lastName,
				notifications,
				birthday,
				city,
				state,
				country,
				zipCode,
				cellphone,
				cpf,
				street,
				number,
				complement,
				neighborhood,
			} = user;
			res.status(200).send({
				name,
				email,
				lastName,
				notifications,
				birthday,
				city,
				state,
				country,
				zipCode,
				cellphone,
				cpf,
				street,
				number,
				complement,
				neighborhood,
			});
		} catch (error) {
			res.status(500).send({
				error: ["Ocorreu um erro ao procurar pelo usuário solicitado"],
			});
		}
	}

	async create(req: FastifyRequest<{ Body: UserBodyCreate }>, res: FastifyReply) {
		if (!req.body) return res.status(400).send({ errors: ["Faltando parâmetros"] });
		const user = req.body;
		const slug = await genSlug(user.name);

		const newUser = { ...user, slug };

		newUser.password = await bcrypt.hash(user.password, Number(process.env.SALT));
		const { email } = newUser;
		try {
			const userExists = await prisma.user.findUnique({ where: { email } });
			if (userExists) return res.status(409).send({ error: ["Email já está em uso"] });
			await prisma.user.create({ data: newUser });
			return res.status(201).send();
		} catch (error) {
			console.log(error);
			res.status(500).send({ error: ["Ocorreu um erro ao salvar o novo usuário"] });
		}
	}

	async update(
		req: FastifyRequest<{ Body: UserBodyUpdate; Params: UserParams }>,
		res: FastifyReply,
	) {
		if (!req.params) return res.status(400).send({ error: ["Faltando parâmetros"] });
		const { slug } = req.params;
		const user = req.body;
		const { newPassword, ...newUser } = user;

		try {
			const dbUser = await prisma.user.findUnique({ where: { slug } });

			if (!dbUser) return res.status(404).send({ error: ["Usuário não foi encontrado"] });

			const passwordValidate = await bcrypt.compare(user.password, dbUser.password);

			if (!passwordValidate) return res.status(401).send({ error: ["Senha inválida"] });

			if (user.newPassword) {
				newUser.password = await bcrypt.hash(user.newPassword, Number(process.env.SALT));
			} else {
				const passwordHash = await bcrypt.hash(user.password, Number(process.env.SALT));
				newUser.password = passwordHash;
			}

			if (user.name) {
				const newSlug = await genSlug(newUser.name as string);
				const userWithSlug = { ...newUser, slug: newSlug };
				await prisma.user.update({ where: { slug }, data: userWithSlug });
				return res.status(200).send({ message: ["Usuário atualizado com sucesso"] });
			}

			await prisma.user.update({ where: { slug }, data: newUser });
			return res.status(200).send({ message: ["Usuário atualizado com sucesso"] });
		} catch (error) {
			console.error(error);
			res.status(500).send({
				error: ["Ocorreu um erro ao atualizar o usuário solicitado"],
			});
		}
	}

	async destroy(
		req: FastifyRequest<{ Params: UserParams; Body: UserBodyUpdate }>,
		res: FastifyReply,
	) {
		if (!req.params) return res.status(400).send({ error: ["Faltando parâmetros"] });
		const { slug } = req.params;
		if (!req.body) return res.status(400).send({ error: ["Faltando parâmetros"] });
		const password = req.body.password;
		try {
			const user = await prisma.user.findUnique({ where: { slug } });
			if (!user) return res.status(404).send({ error: ["Usuário não foi encontrado"] });
			const isValid = await bcrypt.compare(password, user.password);
			if (!isValid) return res.status(401).send({ error: ["Senha inválida"] });
			await prisma.user.delete({ where: { slug } });
			return res.status(200).send({ message: ["Usuário apagado com sucesso"] });
		} catch (error) {
			console.error(error);
			res.status(500).send({
				error: ["Ocorreu um erro ao excluir o usuário solicitado"],
			});
		}
	}
}

export default new User();
