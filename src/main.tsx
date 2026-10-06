import "@navikt/ds-css";
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

const startMsw = async () => {
	if (import.meta.env.MODE === "mock") {
		try {
			const { worker } = await import("../mock/browser");
			await worker.start({
				onUnhandledRequest: "bypass", // for assets o.l.
			});
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: <in case of errors>
			console.error("Failed to start MSW", error);
		}
	}
};

startMsw().then(() => {
	injectDecoratorClientSide({
		env: "localhost",
		localUrl: import.meta.env.VITE_DECORATOR_URL,
		params: {
			teamName: "sokos-frivillig-skattetrekk",
			chatbot: false,
			breadcrumbs: [
				{
					url: "https://www.nav.no/utbetalinger/frivillig-skattetrekk",
					title: "Frivillig skattetrekk",
				},
			],
		},
	}).catch((error) => {
		// biome-ignore lint/suspicious/noConsole: Report decorator initialization failures.
		console.error("Failed to initialize decorator", error);
	});

	ReactDOM.createRoot(document.getElementById("root")!).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
});
