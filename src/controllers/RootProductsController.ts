import type { FastifyReply, FastifyRequest } from "fastify";

import type { productBody, productBodyUpdate } from "../types/types";
import generateUniqueEAN13 from "../utils/genEAN-13";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { genNamePhoto } from "../utils/genNamePhoto";

const prisma = new PrismaClient();

class RootProductsController {
	async create(req: FastifyRequest<{ Body: productBody }>, res: FastifyReply) {
		const data = await req.files();
		const url: string[] = [];
		if (!data) return res.status(400).send({ error: ["Faltando imagem"] });

		for await (const photo of data) {
			const filePath = path.resolve(__dirname, "..", "uploads", await genNamePhoto(photo.filename));
			await pipeline(photo.file, fs.createWriteStream(filePath));
			const urlArray = filePath.split("\\");
			const singleUrl = urlArray[urlArray.length - 1];
			url.push(singleUrl);
		}

		const body = req.body;
		if (!body) return res.status(400).send({ error: ["Faltando parâmetros"] });

		try {
			await Promise.all(
				body.map(async (supplier) => {
					await Promise.all(
						supplier.products.map(async (product) => {
							product.barcode = await generateUniqueEAN13();
						}),
					);
				}),
			);

			const createdSuppliers = await Promise.all(
				body.map(async (supplier) => {
					return await prisma.supplier.create({
						data: {
							name: supplier.name,
							contact: supplier.contact,
						},
					});
				}),
			);

			await Promise.all(
				body.map(async (supplier, index) => {
					const supplierId = createdSuppliers[index].id;

					await Promise.all(
						supplier.products.map(async (product) => {
							await prisma.product.create({
								data: {
									reference: product.reference,
									name: product.name,
									price: product.price,
									description: product.description,
									category: product.category,
									subCategory: product.subCategory,
									brand: product.brand,
									color: product.color,
									size: product.size,
									barcode: product.barcode as string,
									supplierId: supplierId,
									photos: {
										create: url.map((photo) => ({
											url: photo,
										})),
									},
								},
							});
						}),
					);
				}),
			);

			return res.status(201).send({
				message: ["Produtos criados com sucesso"],
			});
		} catch (error) {
			return res.status(500).send({ error: "Erro ao salvar produtos" });
		}
	}
	async index(req: FastifyRequest, res: FastifyReply) {
		try {
			const products = await prisma.product.findMany({
				include: {
					photos: true,
				},
			});
			return res.status(200).send(products);
		} catch (error) {
			return res.status(500).send({ error: "Erro ao buscar produtos" });
		}
	}

	async show(req: FastifyRequest<{ Params: { productId: string } }>, res: FastifyReply) {
		if (!req.params) return res.status(400).send({ error: ["Faltando parâmetros"] });
		const { productId } = req.params;
		try {
			const product = await prisma.product.findUnique({
				where: { id: Number(productId) },
				include: {
					supplier: true,
					photos: true,
					conditional: true,
					productsSold: {
						include: {
							seller: true,
						},
					},
					Saller: true,
				},
			});
			if (!product) return res.status(404).send({ error: ["Produto não foi encontrado"] });
			return res.status(200).send(product);
		} catch (error) {
			return res.status(500).send({ error: "Erro ao buscar produto" });
		}
	}
	async delete(req: FastifyRequest<{ Params: { productId: string } }>, res: FastifyReply) {
		const { productId } = req.params;

		if (!productId) {
			return res.status(400).send({ error: ["Faltando parâmetros"] });
		}

		try {
			const product = await prisma.product.findUnique({
				where: { id: Number(productId) },
			});

			if (!product) {
				return res.status(404).send({ error: ["Produto não encontrado"] });
			}

			await prisma.photo.deleteMany({
				where: { productId: Number(productId) },
			});

			await prisma.product.delete({
				where: { id: Number(productId) },
			});

			return res.status(204).send({ message: ["Produto excluído com sucesso"] });
		} catch (error) {
			return res.status(500).send({ error: ["Erro ao excluir produto"] });
		}
	}

	async update(
		req: FastifyRequest<{
			Params: { productId: string };
			Body: productBodyUpdate;
		}>,
		res: FastifyReply,
	) {
		if (!req.params.productId) return res.status(400).send({ error: ["Faltando parâmetros"] });
		if (!req.body) return res.status(400).send({ error: ["Faltando body"] });
		const { productId } = req.params;
		const productData = req.body;
		try {
			const updatedProduct = await prisma.product.update({
				where: { id: Number(productId) },
				data: {
					reference: productData.reference as string,
					name: productData.name as string,
					price: productData.price as number,
					description: productData.description as string,
					category: productData.category as string,
					subCategory: productData.subCategory as string,
					brand: productData.brand as string,
					color: productData.color as string,
					size: productData.size as string,
				},
			});

			return res.status(200).send(updatedProduct);
		} catch (error) {
			return res.status(500).send({ error: ["Erro ao atualizar produto"] });
		}
	}
}

export default new RootProductsController();
