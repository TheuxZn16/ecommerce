function randomNumber() {
	return Math.floor(Math.random() * 100000);
}

export async function genNamePhoto(filename: string) {
	return await `${Date.now()}${randomNumber()}.${filename.split(".")[1]}`;
}
