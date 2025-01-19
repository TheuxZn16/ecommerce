import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function calculateEAN13CheckDigit(ean: string): number {
	let sum = 0;

	for (let i = 0; i < 12; i++) {
		const digit = Number.parseInt(ean[i], 10);
		if (i % 2 === 0) {
			sum += digit;
		} else {
			sum += digit * 3;
		}
	}

	const checkDigit = (10 - (sum % 10)) % 10;
	return checkDigit;
}

export default async function generateUniqueEAN13(): Promise<string> {
	let ean = "";

	let isUnique = false;

	while (!isUnique) {
		ean = "";
		for (let i = 0; i < 12; i++) {
			ean += Math.floor(Math.random() * 10).toString();
		}

		const checkDigit = calculateEAN13CheckDigit(ean);
		ean += checkDigit.toString();

		const existingProduct = await prisma.product.findUnique({
			where: { barcode: ean },
		});

		if (!existingProduct) {
			isUnique = true;
		}
	}

	return ean;
}
