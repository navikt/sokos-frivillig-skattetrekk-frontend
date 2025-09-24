import { Alert, BodyLong, VStack } from "@navikt/ds-react";
import {
  ForenkletSkattetrekk,
  TrekkDTO,
} from "../../api/skattetrekkBackendClient";
import {
  showPercentageOrTable,
  visProsentEllerBelop,
} from "../../common/Utils";
import "./RegistrerteSkattetrekk.css";

type RegistrerteSkattetrekkProps = {
  skatteTrekk: ForenkletSkattetrekk;
  tilleggstrekk: TrekkDTO | null;
  fremtidigTilleggstrekk: TrekkDTO | null;
  isDecember: boolean;
};

export function formatDateLong(value: Date): string {
  const date = new Date(value);
  return date.toLocaleDateString("no-NO", { day: "numeric", month: "long" });
}

export function RegistrerteSkattetrekk(props: RegistrerteSkattetrekkProps) {
  return (
    <VStack gap="6">
      {props.fremtidigTilleggstrekk !== null &&
        props.fremtidigTilleggstrekk!.sats! > 0 && (
          <Alert variant="info">
            {props.isDecember ? (
              <BodyLong>
                Nytt frivillig skattetrekk på{" "}
                {visProsentEllerBelop(props.fremtidigTilleggstrekk, null)} vil
                gjelde fra januar neste år. Hvis du registrerte trekket i
                slutten av desember, kan det ta inntil midten av januar før
                trekket kommer med på utbetalingene dine.
              </BodyLong>
            ) : (
              <BodyLong>
                Nytt frivillig skattetrekk på{" "}
                {visProsentEllerBelop(props.fremtidigTilleggstrekk, null)} fra
                og med neste måned og ut året.
              </BodyLong>
            )}
          </Alert>
        )}

      {props.fremtidigTilleggstrekk?.sats !== null &&
        props.fremtidigTilleggstrekk?.sats === 0 && (
          <Alert variant="info">
            Det frivillige skattetrekket er stoppet fra og med neste måned.
          </Alert>
        )}

      <dl id="registrerte-skattetrekk-dl">
        <dt className="label">
          <strong>Frivillig skattetrekk:</strong>
        </dt>
        <dd className="data">
          {visProsentEllerBelop(
            props.tilleggstrekk,
            props.fremtidigTilleggstrekk
          )}
        </dd>

        <dt className="label">
          <strong>Trekk fra skattekortet:</strong>
        </dt>
        <dd className="data">{showPercentageOrTable(props.skatteTrekk)}</dd>
      </dl>
    </VStack>
  );
}
