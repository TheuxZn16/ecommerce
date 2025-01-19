import type {
	FastifyBaseLogger,
	FastifyInstance,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
} from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export type FastifyTypeInstance = FastifyInstance<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	FastifyBaseLogger,
	ZodTypeProvider
>;

const userParamsSchema = z.object({
	slug: z.string(),
});

export type UserParams = z.infer<typeof userParamsSchema>;

const userBodySchemaCreate = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string(),
	lastName: z.string(),
	notifications: z.boolean().optional(),
	birthday: z.string(),
	city: z.string(),
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
	country: z.string(),
	zipCode: z.string(),
	cellphone: z.string(),
	cpf: z.string(),
	street: z.string(),
	number: z.string(),
	complement: z.string().optional(),
	neighborhood: z.string(),
});

export type UserBodyCreate = z.infer<typeof userBodySchemaCreate>;

const userBodySchemaUpdate = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
	password: z.string(),
	newPassword: z.string().optional(),
	lastName: z.string().optional(),
	notifications: z.boolean().optional(),
	birthday: z.string().optional(),
	city: z.string().optional(),
	state: z
		.enum([
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
		])
		.optional(),
	country: z.string().optional(),
	zipCode: z.string().optional(),
	cellphone: z.string().optional(),
	cpf: z.string().optional(),
	street: z.string().optional(),
	number: z.string().optional(),
	complement: z.string().optional(),
	neighborhood: z.string().optional(),
});

export type UserBodyUpdate = z.infer<typeof userBodySchemaUpdate>;

const TokenBodySchema = z.object({
	email: z.string(),
	password: z.string(),
});

export type TokenBody = z.infer<typeof TokenBodySchema>;

const ProductBodySchema = z.array(
	z.object({
		name: z.string(),
		contact: z.string(),
		products: z.array(
			z.object({
				reference: z.string(),
				name: z.string(),
				price: z.number(),
				description: z.string(),
				category: z.string(),
				subCategory: z.string().optional(),
				brand: z.string(),
				barcode: z.string().optional(),
				color: z.string(),
				size: z.string(),
			}),
		),
	}),
);

export type productBody = z.infer<typeof ProductBodySchema>;

const productBodyUpdateSchema = z.object({
	reference: z.string().optional(),
	name: z.string().optional(),
	price: z.number().optional(),
	description: z.string().optional(),
	category: z.string().optional(),
	subCategory: z.string().optional(),
	brand: z.string().optional(),
	color: z.string().optional(),
	size: z.string().optional(),
});

export type productBodyUpdate = z.infer<typeof productBodyUpdateSchema>;
