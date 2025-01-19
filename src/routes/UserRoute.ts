import type { FastifyTypeInstance, UserParams } from "../types/types";
import User from "../controllers/UserController";
import { z } from "zod";
import { loginRequired } from "../middleware/loginRequired";

export async function UserRoutes(app: FastifyTypeInstance) {
	app.post(
		"/users",
		{
			schema: {
				body: z.object({
					email: z
						.string()
						.email({ message: "O email deve ser um endereço de email válido" })
						.min(5, { message: "O email deve ter pelo menos 5 caracteres" }),

					name: z
						.string()
						.min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
						.max(30, { message: "O nome deve ter no máximo 30 caracteres" }),

					lastName: z
						.string()
						.min(2, { message: "O sobrenome deve ter pelo menos 2 caracteres" })
						.max(200, { message: "O sobrenome deve ter no máximo 200 caracteres" }),

					password: z
						.string()
						.min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
						.regex(/[A-Z]/, { message: "A senha deve ter pelo menos uma letra maiúscula" })
						.regex(/[a-z]/, { message: "A senha deve ter pelo menos uma letra minúscula" })
						.regex(/[0-9]/, { message: "A senha deve ter pelo menos um número" })
						.regex(/[\W_]/, { message: "A senha deve ter pelo menos um caractere especial" }),

					birthday: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
						message: "A data de nascimento deve ser uma data válida",
					}),

					street: z
						.string()
						.min(5, { message: "A rua deve ter pelo menos 5 caracteres" })
						.max(100, { message: "A rua deve ter no máximo 100 caracteres" }),

					number: z
						.string()
						.min(1, { message: "O número do endereço deve ter pelo menos 1 caractere" })
						.max(20, { message: "O número do endereço deve ter no máximo 20 caracteres" }),

					complement: z
						.string()
						.max(100, { message: "O complemento deve ter no máximo 100 caracteres" })
						.optional(),

					neighborhood: z
						.string()
						.min(3, { message: "O bairro deve ter pelo menos 3 caracteres" })
						.max(100, { message: "O bairro deve ter no máximo 100 caracteres" }),

					city: z
						.string()
						.min(2, { message: "A cidade deve ter pelo menos 2 caracteres" })
						.max(100, { message: "A cidade deve ter no máximo 100 caracteres" }),

					state: z.enum([
						"AC",
						"AL",
						"AP",
						"AM",
						"BA",
						"CE",
						"DF",
						"ES",
						"GO",
						"MA",
						"MT",
						"MS",
						"PA",
						"PR",
						"PB",
						"PE",
						"PI",
						"RN",
						"RO",
						"RR",
						"SE",
						"TO",
					]),

					country: z
						.string()
						.min(2, { message: "O país deve ter pelo menos 2 caracteres" })
						.max(100, { message: "O país deve ter no máximo 100 caracteres" }),

					zipCode: z
						.string()
						.min(5, { message: "O código postal deve ter pelo menos 5 caracteres" })
						.max(10, { message: "O código postal deve ter no máximo 10 caracteres" }),

					cellphone: z
						.string()
						.min(10, { message: "O celular deve ter pelo menos 10 caracteres" })
						.max(15, { message: "O celular deve ter no máximo 15 caracteres" }),

					cpf: z
						.string()
						.length(11, { message: "O CPF deve ter 11 dígitos" })
						.regex(/^\d+$/, { message: "O CPF deve conter apenas números" }),

					notifications: z.boolean().optional(),
				}),
				response: {
					201: z.object({
						error: z.array(z.string()).optional(),
					}),
					400: z.object({
						error: z.array(z.string()).optional(),
					}),
					409: z.object({
						error: z.array(z.string()).optional(),
					}),
					500: z.object({
						error: z.array(z.string()).optional(),
					}),
				},
			},
		},
		User.create,
	);
	app.get(
		"/users/:slug",
		{
			schema: {
				params: z.object({
					slug: z.string(),
				}),
				headers: z.object({
					authorization: z.string(),
				}),
				response: {
					200: z.object({
						age: z.number(),
						name: z.string(),
						email: z.string(),
						lastName: z.string(),
						notifications: z.boolean(),
					}),
					400: z.object({ error: z.array(z.string()).optional() }),
					404: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
			preHandler: loginRequired,
		},
		User.show,
	);

	app.put(
		"/users/:slug",
		{
			schema: {
				params: z.object({
					slug: z.string(),
				}),
				body: z.object({
					name: z
						.string()
						.min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
						.max(30, { message: "O nome deve ter no máximo 30 caracteres" })
						.optional(),

					email: z
						.string()
						.email({ message: "O email deve ser um endereço de email válido" })
						.optional(),

					password: z
						.string()
						.min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
						.regex(/[A-Z]/, {
							message: "A senha deve ter pelo menos uma letra maiúscula",
						})
						.regex(/[a-z]/, {
							message: "A senha deve ter pelo menos uma letra minúscula",
						})
						.regex(/[0-9]/, {
							message: "A senha deve ter pelo menos um número",
						})
						.regex(/[\W_]/, {
							message: "A senha deve ter pelo menos um caractere especial",
						}),

					lastName: z
						.string()
						.min(2, { message: "O sobrenome deve ter pelo menos 2 caracteres" })
						.max(200, {
							message: "O sobrenome deve ter no máximo 200 caracteres",
						})
						.optional(),

					newPassword: z
						.string()
						.min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
						.regex(/[A-Z]/, {
							message: "A senha deve ter pelo menos uma letra maiúscula",
						})
						.regex(/[a-z]/, {
							message: "A senha deve ter pelo menos uma letra minúscula",
						})
						.regex(/[0-9]/, {
							message: "A senha deve ter pelo menos um número",
						})
						.regex(/[\W_]/, {
							message: "A senha deve ter pelo menos um caractere especial",
						})
						.optional(),

					birthday: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
						message: "A data de nascimento deve ser uma data válida",
					}),

					street: z
						.string()
						.min(5, { message: "A rua deve ter pelo menos 5 caracteres" })
						.max(100, { message: "A rua deve ter no máximo 100 caracteres" }),

					number: z
						.string()
						.min(1, { message: "O número do endereço deve ter pelo menos 1 caractere" })
						.max(20, { message: "O número do endereço deve ter no máximo 20 caracteres" }),

					complement: z
						.string()
						.max(100, { message: "O complemento deve ter no máximo 100 caracteres" })
						.optional(),

					neighborhood: z
						.string()
						.min(3, { message: "O bairro deve ter pelo menos 3 caracteres" })
						.max(100, { message: "O bairro deve ter no máximo 100 caracteres" }),

					city: z
						.string()
						.min(2, { message: "A cidade deve ter pelo menos 2 caracteres" })
						.max(100, { message: "A cidade deve ter no máximo 100 caracteres" }),

					state: z.enum([
						"AC",
						"AL",
						"AP",
						"AM",
						"BA",
						"CE",
						"DF",
						"ES",
						"GO",
						"MA",
						"MT",
						"MS",
						"PA",
						"PR",
						"PB",
						"PE",
						"PI",
						"RN",
						"RO",
						"RR",
						"SE",
						"TO",
					]),

					country: z
						.string()
						.min(2, { message: "O país deve ter pelo menos 2 caracteres" })
						.max(100, { message: "O país deve ter no máximo 100 caracteres" }),

					zipCode: z
						.string()
						.min(5, { message: "O código postal deve ter pelo menos 5 caracteres" })
						.max(10, { message: "O código postal deve ter no máximo 10 caracteres" }),

					cellphone: z
						.string()
						.min(10, { message: "O celular deve ter pelo menos 10 caracteres" })
						.max(15, { message: "O celular deve ter no máximo 15 caracteres" }),

					cpf: z
						.string()
						.length(11, { message: "O CPF deve ter 11 dígitos" })
						.regex(/^\d+$/, { message: "O CPF deve conter apenas números" }),

					notifications: z.boolean().optional(),
				}),
				response: {
					200: z.object({ error: z.array(z.string()).optional() }),
					400: z.object({ error: z.array(z.string()).optional() }),
					401: z.object({ error: z.array(z.string()).optional() }),
					404: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
			preHandler: loginRequired,
		},
		User.update,
	);

	app.delete(
		"/users/:slug",
		{
			schema: {
				params: z.object({
					slug: z.string(),
				}),
				response: {
					200: z.object({ error: z.array(z.string()).optional() }),
					400: z.object({ error: z.array(z.string()).optional() }),
					401: z.object({ error: z.array(z.string()).optional() }),
					404: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
			preHandler: loginRequired,
		},
		User.destroy,
	);
}
