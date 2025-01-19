import app from "./app";

const PORT = Number(process.env.PORT);

try {
	app.listen({ port: PORT });
	console.log(`Server is running at http://localhost:${PORT}`);
} catch (e) {
	console.error(e);
}
