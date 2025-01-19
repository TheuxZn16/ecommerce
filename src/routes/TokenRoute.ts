import type { FastifyTypeInstance } from "../types/types";
import TokenController from "../controllers/TokenController";
import { z } from "zod";

export async function TokenRoute(app: FastifyTypeInstance) {
	app.post(
		"/token",
		{
			schema: {
				body: z.object({
					email: z.string().email({ message: "O email deve ser um endereço de email válido" }),
					password: z.string(),
				}),
				response: {
					200: z.object({
						token: z.string(),
						user: z.object({
							id: z.number(),
							slug: z.string(),
							email: z.string(),
							name: z.string(),
							lastName: z.string(),
							age: z.number(),
							notifications: z.boolean(),
						}),
					}),
					400: z.object({ error: z.array(z.string()).optional() }),
					401: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
		},
		TokenController.create,
	);
}
