import "@navikt/ds-css";
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

startMsw().then(() =>
	ReactDOM.createRoot(document.getElementById("root")!).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	),
);
