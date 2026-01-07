import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SatsType } from "../api/skattetrekkBackendClient";
import { PageLinks } from "../routes";

type LocationState = {
	pid: string | null;
	tilleggstrekkType: SatsType | null;
	tilleggstrekkValue: number | null;
	isSent: boolean;
};

export type SetLocationState = Partial<LocationState>;

type NavFn = (
	pageLink: PageLinks,
	state?: SetLocationState,
	replace?: boolean,
) => void;

type UseLocationState = LocationState & {
	navigate: NavFn;
};

export function useLocationState(): UseLocationState {
	const nav = useNavigate();
	const location = useLocation();

	const navigate: NavFn = useCallback(
		(pageLink, state) =>
			nav(import.meta.env.BASE_URL + pageLink, {
				state: { ...location.state, ...state },
			}),
		[nav, location.state],
	);

	useEffect(() => {
		if (location.state === null || typeof location.state !== "object") {
			navigate(PageLinks.INDEX, {}, true);
		}
	}, [location.state, navigate]);

	if (location.state === null) {
		return {
			navigate,
			pid: null,
			tilleggstrekkType: null,
			tilleggstrekkValue: null,
			isSent: false,
		};
	}

	const { pid, tilleggstrekkType, tilleggstrekkValue, isSent } = location.state;

	return {
		navigate,
		pid: typeof pid === "string" && pid.length !== 0 ? pid : null,
		tilleggstrekkType: isSatsType(tilleggstrekkType) ? tilleggstrekkType : null,
		tilleggstrekkValue:
			typeof tilleggstrekkValue === "number" &&
			!Number.isNaN(tilleggstrekkValue)
				? tilleggstrekkValue
				: null,
		isSent: typeof isSent === "boolean" ? isSent : false,
	};
}

const SATS_TYPES = Object.values(SatsType);
const isSatsType = (v: unknown): v is SatsType =>
	SATS_TYPES.includes(v as SatsType);
