import {
  FrivilligSkattetrekkData,
  MessageType,
  SatsType,
} from "@/api/skattetrekkBackendClient";
import { useLocationState } from "@/common/useLocationState";
import { numberFormatWithKr } from "@/common/Utils";
import { PageLinks } from "@/routes";
import { DataContext } from "@/state/DataContextProvider";
import {
  Alert,
  BodyLong,
  Box,
  Heading,
  Link,
  Loader,
  VStack,
} from "@navikt/ds-react";
import { useContext, useEffect } from "react";
import "./KvitteringPage.css";

export const KvitteringPage = () => {
  const {
    setShouldRefetch,
    getResponse,
    setLoaderOverride,
    getLoaderOverride,
  } = useContext(DataContext);
  const { pid, navigate, isSent } = useLocationState();

  useEffect(() => {
    if (!isSent) {
      navigate(PageLinks.INDEX);
    }
    setLoaderOverride(true);
    setShouldRefetch(true);
  }, [isSent]);

  if (getResponse === null) {
    return null;
  }

  function visRiktigNyregistertTilleggstrekk(data: FrivilligSkattetrekkData) {
    var registrertFrivilligSkattetrekk = !data.fremtidigTilleggstrekk
      ? data.tilleggstrekk
      : data.fremtidigTilleggstrekk;

    return (
      <>
        {registrertFrivilligSkattetrekk?.satsType === SatsType.PROSENT
          ? `Frivillig skattetrekk på ${registrertFrivilligSkattetrekk?.sats} % ble registrert`
          : `Frivillig skattetrekk på ${numberFormatWithKr(
              registrertFrivilligSkattetrekk?.sats ?? 0
            )} per måned ble registrert`}
      </>
    );
  }

  if (getLoaderOverride) {
    return (
      <Box background="bg-subtle" padding="16" borderRadius="large">
        <VStack align="center" gap="8">
          <Heading align="center" size={"large"} level="2">
            Vent mens vi sender inn
          </Heading>
          <Loader size="3xlarge" />
          <BodyLong align="center">Dette kan ta opptil ett minutt.</BodyLong>
        </VStack>
      </Box>
    );
  }

  if (
    getResponse.messages?.some(
      (msg: { type: MessageType }) => msg.type === MessageType.ERROR
    )
  ) {
    return (
      <VStack gap="6" className="form-container">
        <Alert variant="error">
          <VStack gap="3">
            Det har skjedd en teknisk feil. Hvis du har registrert informasjon,
            har den dessverre ikke blitt lagret. Vi beklager for dette. Du kan
            prøve igjen senere. Ta gjerne kontakt med oss hvis problemet
            fortsetter.
          </VStack>
        </Alert>
      </VStack>
    );
  }

  return (
    <VStack gap="10" className="form-container">
      <Alert variant="success">
        <VStack gap="3">
          <Heading level="2" size="small">
            {visRiktigNyregistertTilleggstrekk(getResponse.data)}
          </Heading>
          <BodyLong>
            Skattetrekket gjelder fra og med neste måned, og ut året.
          </BodyLong>
        </VStack>
      </Alert>

      <BodyLong>
        Frivillig skattetrekk stopper automatisk ved årsskiftet, du må derfor
        legge inn et nytt trekk for hvert år.
      </BodyLong>

      <div id="kvittering-divider" />

      <VStack gap="4">
        <Link href="https://www.nav.no/minside" target="_blank">
          Gå til Min side{" "}
        </Link>
        <Link href="" onClick={() => navigate(PageLinks.INDEX, { pid })}>
          {" "}
          Endre registrert frivillig skattetrekk
        </Link>
      </VStack>
    </VStack>
  );
};
