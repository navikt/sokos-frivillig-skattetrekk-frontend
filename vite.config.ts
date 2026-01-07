import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "vite";

const basePath = "/utbetalinger/frivillig-skattetrekk";

// https://vitejs.dev/config/
const buildConfig: UserConfig = {
	base: basePath,
	build: {
		outDir: "./dist",
		target: "esnext",
		rollupOptions: {
			input: {
				appBorger: "./index.html",
			},
		},
	},
	plugins: [react()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	if (command === "serve") {
		const devConfig: UserConfig = {
			base: basePath,
			build: {
				manifest: true,
				rollupOptions: {
					input: {
						appBorger: "./index.html",
					},
				},
				target: "esnext",
			},
			server: {
				open: "/index.html",
				proxy: {
					...(mode === "mock" && {
						"/mockServiceWorker.js": {
							target: "http://localhost:5173",
							rewrite: () =>
								"utbetalinger/frivillig-skattetrekk/mockServiceWorker.js",
						},
					}),
				},
			},
			plugins: [react()],
			resolve: {
				alias: {
					"@": fileURLToPath(new URL("./src", import.meta.url)),
				},
			},
		};

		return devConfig;
	}

	return buildConfig;
});
