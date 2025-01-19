import crypto from "node:crypto";

export default async function genSlug(name: string) {
	const random = crypto.randomBytes(8).toString("hex");
	return `${name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s/g, "-")}-profile-${random}`;
}
