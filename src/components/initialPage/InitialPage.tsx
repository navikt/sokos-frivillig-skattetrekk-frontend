import {
  Accordion,
  Alert,
  BodyLong,
  Button,
  GuidePanel,
  Heading,
  HStack,
  Link,
  List,
  VStack,
} from "@navikt/ds-react";
import { useContext } from "react";
import { MessageCode } from "../../api/skattetrekkBackendClient";
import { useLocationState } from "../../common/useLocationState";
import { RegistrerteSkattetrekk } from "../../components/initialPage/RegistrerteSkattetrekk";
import { StopTilleggstrekkConfirmationModal } from "../../components/initialPage/StopTilleggstrekkConfirmationModal";
import { PageLinks } from "../../routes";
import { DataContext } from "../../state/DataContextProvider";
import "./InitialPage.css";

export function InitialPage() {
  const { getResponse } = useContext(DataContext);
  const { navigate } = useLocationState();
  const pid =
    new URLSearchParams(document.location.search).get("pid") ?? undefined;

  function onClickContinue() {
    navigate(PageLinks.ENDRING, {
      pid,
      tilleggstrekkType: null,
      tilleggstrekkValue: null,
    });
  }

  function isDecember() {
    const currentDate = new Date();
    return currentDate.getMonth() === 11;
  }

  function getYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }

  function getButtonStartTekst() {
    if (
      (getResponse?.data?.tilleggstrekk == null &&
        getResponse?.data?.fremtidigTilleggstrekk == null) ||
      getResponse?.data?.fremtidigTilleggstrekk?.sats == 0
    ) {
      return "Start registrering";
    }
    return "Endre frivillig skattetrekk";
  }

  if (document.cookie.includes("nav-obo=")) {
    return (
      <VStack gap="6">
        {guidePanel()}
        <Alert variant={"info"}>
          <Heading spacing size="small" level="2">
            Fullmektige kan dessverre ikke bruke denne tjenesten
          </Heading>
          <BodyLong spacing>
            <Link href={import.meta.env.VITE_FRIVILLIG_SKATTETREKK_INFO_URL}>
              Her finner du informasjon om hvordan du kan registrere frivillig
              skattetrekk på vegne av andre.
            </Link>
          </BodyLong>
        </Alert>
      </VStack>
    );
  }

  if (
    getResponse?.messages?.find(
      (message) => message.code === MessageCode.OPPDRAG_UTILGJENGELIG
    )
  ) {
    return (
      <VStack gap="6">
        {guidePanel()}
        <Alert variant="warning">
          <Heading spacing size="small" level="2">
            Tjenesten er ikke åpen nå
          </Heading>
          <BodyLong spacing>
            Av tekniske årsaker er registrering av frivillig skattetrekk i denne
            tjenesten kun åpent mandag-fredag 06:00 til 21:30. Offentlige
            fridager og helger er denne tjenesten ofte stengt.
          </BodyLong>
          <BodyLong>
            <strong>
              I åpningstidene kan du gjøre dette i denne tjenesten
            </strong>
          </BodyLong>
          <li>se registrert frivillig skattetrekk </li>
          <li>registrere frivillig skattetrekk </li>
          <li>stoppe frivillig skattetrekk </li>
        </Alert>
      </VStack>
    );
  }

  return (
    <VStack gap="12">
      <VStack gap="10">
        <>
          {guidePanel()}

          {isDecember() && (
            <Alert variant={"info"}>
              <VStack gap="5">
                <BodyLong>
                  {" "}
                  Frivillig skattetrekk du legger inn nå, vil gjelde for{" "}
                  {getYear() + 1}.{" "}
                </BodyLong>
                <BodyLong>
                  {" "}
                  Når skattekortet for {getYear() + 1} kommer i slutten av
                  desember, blir det oppdatert her. Frem til da vises årets
                  skattekort.
                </BodyLong>
              </VStack>
            </Alert>
          )}
        </>

        <>
          {getResponse?.data && (
            <VStack gap={"4"}>
              <Heading size={"medium"} level="2">
                Dine registrerte skattetrekk
              </Heading>

              <RegistrerteSkattetrekk
                skatteTrekk={getResponse.data.skattetrekk!}
                tilleggstrekk={getResponse.data.tilleggstrekk}
                fremtidigTilleggstrekk={getResponse.data.fremtidigTilleggstrekk}
                isDecember={isDecember()}
              />
              {(getResponse.data.tilleggstrekk !== null &&
                getResponse.data.fremtidigTilleggstrekk?.sats !== 0) ||
              (getResponse.data.tilleggstrekk === null &&
                getResponse.data.fremtidigTilleggstrekk !== null) ? (
                <StopTilleggstrekkConfirmationModal />
              ) : (
                <></>
              )}
            </VStack>
          )}
        </>

        <div>
          <Heading size={"medium"} level="2">
            Om frivillig skattetrekk
          </Heading>
          <Accordion id="initialpage-accordion">
            <Accordion.Item>
              <Accordion.Header>
                Slik trekker Nav frivillig skattetrekk
              </Accordion.Header>
              <Accordion.Content>
                <BodyLong spacing>
                  Trekket du registrerer kommer i tillegg til det ordinære
                  skattetrekket. Frivillig skattetrekk gjelder også ved
                  utbetaling av feriepenger og for perioder hvor det ellers ikke
                  blir trukket skatt. Det kan ikke trekkes frivillig skatt på
                  skattefrie pengestøtter. Frivillig skattetrekk legges inn som
                  et fast kronebeløp eller som et fast prosenttrekk per måned,
                  og vil gjelde fra og med måneden etter at du har lagt det inn.{" "}
                </BodyLong>
                <Link
                  href={import.meta.env.VITE_FRIVILLIG_SKATTETREKK_INFO_URL}
                >
                  Les om frivillig skattetrekk
                </Link>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>
                Så lenge varer frivillig skattetrekk
              </Accordion.Header>
              <Accordion.Content>
                <BodyLong>
                  Frivillig skattetrekk stoppes automatisk ved årsskiftet. Du må
                  legge inn nytt trekk for hvert nytt år. Frivillig skattetrekk
                  lagt til i desember vil gjelde fra januar og ut neste år.
                </BodyLong>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>
                Dette registrerer du frivillig skattetrekk på her:
              </Accordion.Header>
              <Accordion.Content>
                <VStack gap="4">
                  <List>
                    <List.Item>Arbeidsavklaringspenger (AAP)</List.Item>
                    <List.Item>Dagpenger</List.Item>
                    <List.Item>Foreldre- og svangerskapspenger</List.Item>
                    <List.Item>Omstillingsstønad</List.Item>
                    <List.Item>
                      Overgangsstønad til enslig mor eller far
                    </List.Item>
                    <List.Item>Pensjon fra Nav</List.Item>
                    <List.Item>
                      Pensjon fra Statens pensjonskasse (SPK)
                    </List.Item>
                    <List.Item>Pleie-, omsorg- og opplæringspenger</List.Item>
                    <List.Item>Sykepenger</List.Item>
                    <List.Item>Supplerende stønad alder</List.Item>
                    <List.Item>Supplerende stønad uføre</List.Item>
                    <List.Item>
                      Uførepensjon fra Statens pensjonskasse (SPK)
                    </List.Item>
                    <List.Item>Uføretrygd</List.Item>
                  </List>
                  <BodyLong>
                    Frivillig skattetrekk registrert i denne tjenesten vil kun
                    føre til trekk hvis du har utbetaling av pengestøttene i
                    kulepunktlisten over.
                  </BodyLong>
                  <BodyLong>
                    Noen pengestøtter kan ikke gis frivillig skattetrekk fordi
                    de er skattefrie.
                  </BodyLong>
                  <BodyLong>
                    Barnepensjon kan få frivillig skattetrekk, men det kan
                    dessverre ikke registreres i denne tjenesten.
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
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>
      </VStack>

      <HStack>
        <Button variant="primary" onClick={onClickContinue}>
          {getButtonStartTekst()}
        </Button>
      </HStack>
    </VStack>
  );

  function guidePanel() {
    return (
      <GuidePanel poster>
        <BodyLong>
          Nav trekker skatt etter skattekortet vi har fått fra Skatteetaten.
          Hvis du ønsker å trekke mer skatt av pengene du får fra Nav, kan du
          registrere et frivillig skattetrekk.
        </BodyLong>
      </GuidePanel>
    );
  }
}
