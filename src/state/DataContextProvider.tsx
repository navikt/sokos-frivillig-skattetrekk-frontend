import { BodyShort, Box, Loader, VStack } from "@navikt/ds-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
	type FrivilligSkattetrekkResponse,
	fetchSkattetrekk,
} from "../api/skattetrekkBackendClient";
import { DataContext } from "./DataContext";
import "./DataContextProvider.css";

type DataContextProviderProps = {
	children?: React.ReactNode;
};

function DataContextProvider(props: DataContextProviderProps) {
	const [isFetching, setIsFetching] = useState(false);
	const [shouldRefetch, setShouldRefetch] = useState(true);
	const [getResponse, setGetResponse] =
		useState<FrivilligSkattetrekkResponse | null>(null);
	const [loaderOverride, setLoaderOverride] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: false positive
	const refetch = useCallback(async () => {
		setIsFetching(true);
		setShouldRefetch(false);
		try {
			const response = await fetchSkattetrekk();
			setGetResponse(response);
		} catch {
			setShouldRefetch(true);
		} finally {
			setIsFetching(false);
			setLoaderOverride(false);
		}
	}, [setShouldRefetch]);

	useEffect(() => {
		if (shouldRefetch) {
			refetch();
		}
	}, [refetch, shouldRefetch]);

	const showLoader = (getResponse === null || isFetching) && !loaderOverride;

	return (
		<DataContext.Provider
			value={{
				getResponse,
				setGetResponse,
				setShouldRefetch,
				setLoaderOverride,
				getLoaderOverride: loaderOverride,
			}}
		>
			<Box position="relative" minHeight={showLoader ? "400px" : undefined}>
				{props.children}

				{showLoader ? (
					<Box
						id="data-context-overlay"
						position="absolute"
						left="0"
						right="0"
						top="0"
						bottom="0"
						background="bg-default"
					>
						<Box background="bg-subtle" padding="16" borderRadius="large">
							<VStack align="center" gap="20">
								<Loader size="3xlarge" />
								<BodyShort align="center">
									{"Vent mens vi laster inn siden."}
								</BodyShort>
							</VStack>
						</Box>
					</Box>
				) : null}
			</Box>
		</DataContext.Provider>
	);
}

export default DataContextProvider;
