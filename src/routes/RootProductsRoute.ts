import type { FastifyTypeInstance } from "../types/types";
import RootProductsController from "../controllers/RootProductsController";
import { z } from "zod";

export async function RootProductsRoute(app: FastifyTypeInstance) {
	app.post(
		"/product-root",
		{
			schema: {
				body: z
					.array(
						z.object({
							name: z
								.string()
								.min(3, "O nome deve ter pelo menos 3 caracteres.")
								.max(100, "O nome deve ter no máximo 100 caracteres.")
								.nonempty("O nome é obrigatório."),
							contact: z
								.string()
								.regex(
									/^[+]?[0-9\s()-]{10,15}$/,
									"O contato deve ser um número válido (10-15 dígitos, podendo conter +, espaços, parênteses e hífens).",
								)
								.nonempty("O contato é obrigatório."),
							products: z
								.array(
									z.object({
										reference: z
											.string()
											.min(3, "A referência deve ter pelo menos 3 caracteres.")
											.max(50, "A referência deve ter no máximo 50 caracteres.")
											.nonempty("A referência é obrigatória."),
										name: z
											.string()
											.min(3, "O nome do produto deve ter pelo menos 3 caracteres.")
											.max(100, "O nome do produto deve ter no máximo 100 caracteres.")
											.nonempty("O nome do produto é obrigatório."),
										price: z
											.number()
											.positive("O preço deve ser um número positivo.")
											.gt(0, "O preço deve ser maior que 0.")
											.lte(100000, "O preço deve ser menor ou igual a 100.000."),
										description: z
											.string()
											.min(10, "A descrição deve ter pelo menos 10 caracteres.")
											.max(500, "A descrição deve ter no máximo 500 caracteres.")
											.nonempty("A descrição é obrigatória."),
										category: z
											.string()
											.min(3, "A categoria deve ter pelo menos 3 caracteres.")
											.max(50, "A categoria deve ter no máximo 50 caracteres.")
											.nonempty("A categoria é obrigatória."),
										subCategory: z
											.string()
											.min(3, "A subcategoria deve ter pelo menos 3 caracteres.")
											.max(50, "A subcategoria deve ter no máximo 50 caracteres.")
											.optional(),
										brand: z
											.string()
											.min(2, "A marca deve ter pelo menos 2 caracteres.")
											.max(50, "A marca deve ter no máximo 50 caracteres.")
											.nonempty("A marca é obrigatória."),
										barcode: z
											.string()
											.length(13, "O código de barras deve ter exatamente 13 caracteres.")
											.regex(/^\d+$/, "O código de barras deve conter apenas números.")
											.optional(),
										color: z
											.string()
											.min(3, "A cor deve ter pelo menos 3 caracteres.")
											.max(30, "A cor deve ter no máximo 30 caracteres.")
											.nonempty("A cor é obrigatória."),
										size: z
											.string()
											.min(1, "O tamanho deve ter pelo menos 1 caractere.")
											.max(10, "O tamanho deve ter no máximo 10 caracteres.")
											.nonempty("O tamanho é obrigatório."),
									}),
								)
								.min(1, "É necessário ter pelo menos um produto."),
						}),
					)
					.min(1, "É necessário fornecer pelo menos um fornecedor."),
				response: {
					201: z.object({ message: z.array(z.string()).optional() }),
					400: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
		},
		RootProductsController.create,
	);
	app.get(
		"/product-root",
		{
			schema: {
				response: {
					400: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
		},
		RootProductsController.index,
	);
	app.get(
		"/product-root/:productId",
		{
			schema: {
				params: z.object({
					productId: z.string(),
				}),
				response: {
					400: z.object({ error: z.array(z.string()).optional() }),
					404: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
		},
		RootProductsController.show,
	);

	app.put(
		"/product-root/:productId",
		{
			schema: {
				params: z.object({
					productId: z.string(),
				}),
				body: z.object({
					reference: z.string().optional(),
					name: z.string().optional(),
					description: z.string().optional(),
					category: z.string().optional(),
					subCategory: z.string().optional(),
					brand: z.string().optional(),
					color: z.string().optional(),
					size: z.string().optional(),
					price: z.number().optional(),
					status: z.string().optional(),
				}),
				response: {
					200: z.object({
						reference: z.string().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
						category: z.string().optional(),
						subCategory: z.string().optional(),
						brand: z.string().optional(),
						color: z.string().optional(),
						size: z.string().optional(),
						price: z.unknown().optional(),
						status: z.string().optional(),
					}),
					400: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
		},
		RootProductsController.update,
	);

	app.delete(
		"/product-root/:productId",
		{
			schema: {
				params: z.object({
					productId: z.string(),
				}),
				response: {
					204: z.object({ message: z.array(z.string()).optional() }),
					400: z.object({ error: z.array(z.string()).optional() }),
					404: z.object({ error: z.array(z.string()).optional() }),
					500: z.object({ error: z.array(z.string()).optional() }),
				},
			},
		},
		RootProductsController.delete,
	);
}
