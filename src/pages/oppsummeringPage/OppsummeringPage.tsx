import {
	BodyLong,
	BodyShort,
	Box,
	Button,
	FormSummary,
	Heading,
	HStack,
	Loader,
	VStack,
} from "@navikt/ds-react";
import { useContext, useEffect, useState } from "react";
import {
	type FrivilligSkattetrekkResponse,
	SatsType,
	saveSkattetrekk,
} from "../../api/skattetrekkBackendClient";
import {
	numberFormatWithKr,
	showPercentageOrTable,
	visProsentEllerBelop,
} from "../../common/Utils";
import { useLocationState } from "../../common/useLocationState";
import { ErrorMessage } from "../../components/error/ErrorMessage";
import { PageLinks } from "../../routes";
import { DataContext } from "../../state/DataContext";
import "./OppsummeringPage.css";

export const OppsummeringPage = () => {
	const { getResponse } = useContext(DataContext);
	const { navigate, tilleggstrekkType, tilleggstrekkValue } =
		useLocationState();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <exhaustive-deps>
	useEffect(() => {
		if (tilleggstrekkType === null || tilleggstrekkValue === null) {
			navigate(PageLinks.INDEX);
		}
	}, [getResponse, tilleggstrekkType, tilleggstrekkValue, navigate]);

	if (
		getResponse === null ||
		tilleggstrekkType === null ||
		tilleggstrekkValue === null
	) {
		return null;
	}

	return (
		<InternalOppsummeringPage
			tilleggstrekkType={tilleggstrekkType}
			tilleggstrekkValue={tilleggstrekkValue}
			getResponse={getResponse}
		/>
	);
};

type Props = {
	tilleggstrekkType: SatsType;
	tilleggstrekkValue: number;
	getResponse: FrivilligSkattetrekkResponse;
};

const InternalOppsummeringPage = ({
	tilleggstrekkValue,
	tilleggstrekkType,
	getResponse,
}: Props) => {
	const { navigate } = useLocationState();
	const [isSending, setIsSending] = useState(false);
	const [isError, setIsError] = useState(false);
	const { setLoaderOverride } = useContext(DataContext);

	async function submitTilleggstrekk() {
		try {
			setIsSending(true);
			setLoaderOverride(true);
			await saveSkattetrekk({
				value: tilleggstrekkValue,
				satsType: tilleggstrekkType,
			});
			navigate(PageLinks.KVITTERING, {
				tilleggstrekkType,
				tilleggstrekkValue,
				isSent: true,
			});
		} catch {
			setIsSending(false);
			setIsError(true);
			setLoaderOverride(false);
		}
	}

	if (isError) {
		return <ErrorMessage />;
	}

	function goToPreviousPage() {
		navigate(PageLinks.ENDRING, { tilleggstrekkType, tilleggstrekkValue });
	}

	function sumStrekkString(): string {
		const { skattetrekk } = getResponse.data;

		if (skattetrekk === null) {
			return ""; // Impossible to reach. Null checked before this page.
		}

		if (skattetrekk.prosentsats === null && skattetrekk.tabellNr === null) {
			if (tilleggstrekkType === SatsType.PROSENT) {
				return `${tilleggstrekkValue} %`;
			}

			return `${numberFormatWithKr(tilleggstrekkValue!)} per måned`;
		}

		if (
			tilleggstrekkType === SatsType.PROSENT &&
			skattetrekk.prosentsats != null
		) {
			if (skattetrekk.prosentsats + tilleggstrekkValue > 100) {
				return "100 %";
			}
			return `${skattetrekk.prosentsats + tilleggstrekkValue} %`;
		}

		let sammensattResultatTekst: string;

		if (tilleggstrekkType === SatsType.KRONER) {
			sammensattResultatTekst = `${numberFormatWithKr(tilleggstrekkValue!)} per måned`;
		} else {
			sammensattResultatTekst = `${tilleggstrekkValue} %`;
		}

		sammensattResultatTekst += " i tillegg til";

		if (skattetrekk.prosentsats != null) {
			sammensattResultatTekst += ` ${skattetrekk.prosentsats} % fra skattekortet`;
		} else {
			sammensattResultatTekst += " tabelltrekket";
		}

		return sammensattResultatTekst;
	}

	if (isSending) {
		return (
			<Box background="neutral-soft" padding="space-64" borderRadius="8">
				<VStack align="center" gap="space-32">
					<Heading align="center" size={"large"} level="2">
						Vent mens vi sender inn
					</Heading>
					<Loader size="3xlarge" />
					<BodyShort align="center">Dette kan ta opptil ett minutt.</BodyShort>
				</VStack>
			</Box>
		);
	}

	return (
		<VStack gap="space-48">
			<Heading level="2" size="large">
				Oppsummering
			</Heading>
			<BodyLong>
				Nå kan du se over at alt er riktig før du registrerer det frivillige
				skattetrekket.
			</BodyLong>

			<FormSummary>
				<FormSummary.Header>
					<FormSummary.Heading level="3">Skattetrekk</FormSummary.Heading>
					<FormSummary.EditLink href="" onClick={goToPreviousPage} />
				</FormSummary.Header>
				<FormSummary.Answers>
					<FormSummary.Answer>
						<FormSummary.Label>Frivillig skattetrekk</FormSummary.Label>
						<FormSummary.Value>
							{visProsentEllerBelop(
								{
									sats: tilleggstrekkValue,
									satsType: tilleggstrekkType,
									gyldigFraOgMed: null,
								},
								null,
							)}
						</FormSummary.Value>
					</FormSummary.Answer>
					<FormSummary.Answer>
						<FormSummary.Label>Trekk fra skattekortet</FormSummary.Label>
						<FormSummary.Value>
							{getResponse?.data !== null
								? showPercentageOrTable(getResponse!.data.skattetrekk!)
								: "Skattekort ikke funnet"}
						</FormSummary.Value>
					</FormSummary.Answer>
					<FormSummary.Answer>
						<FormSummary.Value>
							<FormSummary.Answers>
								<FormSummary.Answer>
									<FormSummary.Label>
										<BodyLong id="oppsummering-sammendrag-label" size="medium">
											<strong>Skattetrekk til sammen med din endring</strong>
										</BodyLong>
									</FormSummary.Label>
									<FormSummary.Value>
										<BodyLong
											id="oppsummering-sammendrag-verdi"
											className="sum"
											size={"large"}
										>
											<strong>{sumStrekkString()}</strong>
										</BodyLong>
									</FormSummary.Value>
								</FormSummary.Answer>
							</FormSummary.Answers>
						</FormSummary.Value>
					</FormSummary.Answer>
				</FormSummary.Answers>
			</FormSummary>
			<VStack gap="space-24">
				<HStack gap="space-8">
					<Button
						variant="secondary"
						size={"medium"}
						onClick={goToPreviousPage}
					>
						Tilbake
					</Button>
					<Button
						variant="primary"
						size={"medium"}
						type={"submit"}
						onClick={submitTilleggstrekk}
					>
						{" "}
						Registrer{" "}
					</Button>
				</HStack>
				<HStack gap="space-8">
					<Button
						variant="tertiary"
						size={"medium"}
						onClick={() => navigate(PageLinks.INDEX)}
					>
						{" "}
						Avbryt{" "}
					</Button>
				</HStack>
			</VStack>
		</VStack>
	);
};
