import React, { useContext, useEffect, useState } from "react";
import {
  BodyLong,
  Button,
  HStack,
  Heading,
  Link,
  List,
  Radio,
  RadioGroup,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { SatsType } from "../../api/skattetrekkBackendClient";
import { numberFormatWithKr, parseInntekt } from "../../common/Utils";
import {
  SetLocationState,
  useLocationState,
} from "../../common/useLocationState";
import { PageLinks } from "../../routes";
import { DataContext } from "../../state/DataContextProvider";
import "./EndringPage.css";

export const EndringPage = () => {
  const { getResponse } = useContext(DataContext);
  const { tilleggstrekkType, tilleggstrekkValue, navigate } =
    useLocationState();

  const [canContinue, setCanContinue] = useState<boolean | null>(
    tilleggstrekkType !== null ? true : null,
  );
  const [type, setType] = useState<SatsType | null>(tilleggstrekkType);
  const [value, setValue] = useState<string | null>(
    tilleggstrekkValue?.toString(10) ?? null,
  );

  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [pageState, setPageState] = useState<"initial" | "cannotProceed">(
    "initial",
  );
  const [shouldValidateForm, setShouldValidateForm] = useState(false);

  const [canContinueError, setCanContinueError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [valueError, setValueError] = useState<string | null>(null);

  const typeRadioRef = React.useRef<HTMLFieldSetElement>(null);
  const tilleggstrekkInputRef = React.useRef<HTMLInputElement>(null);

  const radioRefFocus = () =>
    setTimeout(() => {
      typeRadioRef.current?.focus();
    }, 0);
  const tilleggstrekkRefFocus = () =>
    setTimeout(() => {
      tilleggstrekkInputRef.current?.focus();
    }, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageState]);

  async function onClickNext() {
    setShouldValidateForm(true);
    if (validateInput()) {
      if (type !== null && value !== null) {
        setButtonIsLoading(true);
        const state: SetLocationState = {
          tilleggstrekkType: type,
          tilleggstrekkValue: parseInntekt(value),
        };
        // Update the current histury entry with the state.
        navigate(PageLinks.ENDRING, state, true);
        // Navigate to the next page with the state.
        navigate(PageLinks.OPPSUMMERING, state);
        setButtonIsLoading(false);
      }
    }
  }

  const onChangeType = (val: SatsType) => {
    setType(val);
    setValue("");
    setShouldValidateForm(false);
    setTypeError(null);
    setValueError(null);
  };

  const validateInput = (): boolean => {
    const numericValue = parseInntekt(value);

    if (canContinue === null) {
      setCanContinueError(
        "Du må svare på om du har en av pengestøttene i kulepunktlisten",
      );
    } else if (!canContinue) {
      setPageState("cannotProceed");
    } else if (type === null) {
      setTypeError("Du må velge hvilken type frivillig skattetrekk du ønsker");
      radioRefFocus();
    } else if (value === "" || value === null) {
      setValueError("Du må oppgi et beløp eller en prosentsats");
      tilleggstrekkRefFocus();
    } else if (isNaN(numericValue) || numericValue < 0) {
      setValueError("Du kan ikke skrive bokstaver eller tegn");
      tilleggstrekkRefFocus();
    } else if (type === SatsType.PROSENT && numericValue === 0) {
      setValueError(
        `Du må oppgi mer enn 0 %. For å stoppe et frivillig skattetrekk, gå tilbake og klikk på knappen Stopp frivillig skattetrekk.`,
      );
      tilleggstrekkRefFocus();
    } else if (
      type === SatsType.PROSENT &&
      numericValue > getResponse!.data.maxProsent
    ) {
      setValueError(`Du kan maks oppgi ${getResponse!.data.maxProsent} %`);
      tilleggstrekkRefFocus();
    } else if (type === SatsType.KRONER && numericValue === 0) {
      setValueError(
        `Du må oppgi et høyere beløp enn 0 kr. For å stoppe et frivillig skattetrekk, gå tilbake og klikk på knappen Stopp frivillig skattetrekk.`,
      );
      tilleggstrekkRefFocus();
    } else if (
      type === SatsType.KRONER &&
      numericValue > getResponse!.data.maxBelop
    ) {
      setValueError(
        `Du kan maks oppgi ${numberFormatWithKr(
          getResponse!.data.maxBelop,
        )}. Vil du trekke et høyere beløp, kan du legge det inn som prosent.`,
      );
      tilleggstrekkRefFocus();
    } else {
      setCanContinueError(null);
      setValueError(null);
      setValueError(null);
      return true;
    }
    return false;
  };

  if (pageState === "cannotProceed") {
    return (
      <VStack gap="8" className="form-container">
        <Heading level="2" size="medium">
          Du kan ikke registrere frivillig skattetrekk i denne tjenesten
        </Heading>
        <VStack>
          <Heading level="3" size="small">
            Ikke alle pengestøtter kan få frivillig skattetrekk
          </Heading>
          <BodyLong>
            Noen pengestøtter kan ikke få frivillig skattetrekk fordi de er
            skattefrie.
          </BodyLong>
        </VStack>
        <VStack>
          <Heading level="3" size="small">
            Barnepensjon
          </Heading>
          <VStack gap="4">
            <BodyLong>
              Frivillig skattetrekk på barnepensjon kan dessverre ikke
              registreres i denne tjenesten.
            </BodyLong>
            <Link
              href={
                import.meta.env
                  .VITE_FRIVILLIG_SKATTETREKK_BARNEPENSJON_DIGITALSKJEMA_URL
              }
            >
              Frivillig skattetrekk i barnepensjon.
            </Link>
          </VStack>
        </VStack>

        <HStack gap="2">
          <Button
            variant="secondary"
            size={"medium"}
            onClick={() => setPageState("initial")}
          >
            Tilbake
          </Button>
          <Button
            variant="tertiary"
            size={"medium"}
            onClick={() => navigate(PageLinks.INDEX)}
          >
            Avbryt
          </Button>
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack gap="12">
      <BodyLong> Alle spørsmål må besvares. </BodyLong>

      <VStack gap={"6"}>
        <Heading level="2" size="medium">
          Dette registrerer du frivillig skattetrekk på her:
        </Heading>
        <article>
          <List>
            <List.Item>Arbeidsavklaringspenger (AAP)</List.Item>
            <List.Item>Dagpenger</List.Item>
            <List.Item>Foreldre- og svangerskapspenger</List.Item>
            <List.Item>Omstillingsstønad</List.Item>
            <List.Item>Overgangsstønad til enslig mor eller far</List.Item>
            <List.Item>Pensjon fra Nav</List.Item>
            <List.Item>Pensjon fra Statens pensjonskasse (SPK)</List.Item>
            <List.Item>Pleie-, omsorg- og opplæringspenger</List.Item>
            <List.Item>Sykepenger</List.Item>
            <List.Item>Supplerende stønad alder</List.Item>
            <List.Item>Supplerende stønad uføre</List.Item>
            <List.Item>Uførepensjon fra Statens pensjonskasse (SPK)</List.Item>
            <List.Item>Uføretrygd</List.Item>
          </List>
        </article>
      </VStack>

      <RadioGroup
        legend="Har du en eller flere av pengestøttene i kulepunktlisten over?"
        onChange={(e) => {
          setCanContinue(e === "true");
          setCanContinueError(null);
        }}
        value={canContinue === null ? null : canContinue.toString()}
        error={canContinueError}
      >
        <Radio value="true">Ja</Radio>
        <Radio value="false">Nei</Radio>
      </RadioGroup>

      {canContinue && (
        <VStack gap="6">
          <div>
            <Heading size={"medium"} level={"2"}>
              Ønsket frivillig skattetrekk
            </Heading>
            <BodyLong>
              Hvis du har flere skattepliktige pengestøtter, kan det bli trukket
              fra flere av pengestøttene.
            </BodyLong>
          </div>

          <RadioGroup
            id="typeRadio"
            legend="Hvordan skal skatten trekkes?"
            size={"medium"}
            value={type}
            ref={typeRadioRef}
            onChange={(v) => {
              onChangeType(v);
            }}
            onBlur={() => {
              if (shouldValidateForm) {
                validateInput();
              }
            }}
            error={typeError}
          >
            <Radio
              value={SatsType.PROSENT}
              description="Trekkes fra alle utbetalinger"
            >
              Prosent
            </Radio>
            <Radio
              value={SatsType.KRONER}
              description="Trekkes vanligvis fra månedens første utbetaling"
            >
              Kroner per måned
            </Radio>
          </RadioGroup>
        </VStack>
      )}

      {canContinue && type && (
        <TextField
          id="tilleggstrekk-input"
          label={
            <span aria-hidden={valueError ? "true" : undefined}>
              {type === SatsType.PROSENT
                ? "Hvor mange prosent?"
                : "Hvor mange kroner?"}
            </span>
          }
          description={
            type == SatsType.PROSENT ? "Eksempel: 10" : "Eksempel: 500"
          }
          inputMode="numeric"
          error={valueError}
          pattern="[\d\s]+"
          value={value ?? ""}
          ref={tilleggstrekkInputRef}
          onChange={(v) => {
            setValue(v.target.value);
          }}
          onBlur={() => {
            if (shouldValidateForm) {
              validateInput();
            }
          }}
          htmlSize={30}
        />
      )}
      <VStack gap={"4"}>
        <HStack gap="2">
          <Button
            variant="secondary"
            size={"medium"}
            onClick={() => navigate(PageLinks.INDEX)}
          >
            Tilbake
          </Button>
          <Button
            variant="primary"
            size={"medium"}
            loading={buttonIsLoading}
            type={"submit"}
            onClick={onClickNext}
          >
            {" "}
            Neste{" "}
          </Button>
        </HStack>
        <HStack>
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
