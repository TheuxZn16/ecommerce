import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		user?: {
			token: string;
			id: number;
			slug: string;
			email: string;
			name: string;
			lastName: string;
			age: number;
			notifications: boolean;
		};
	}
}
