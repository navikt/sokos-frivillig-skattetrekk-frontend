export interface TrekkDTO {
  sats: number | null;
  satsType: SatsType | null;
  gyldigFraOgMed: Date | null;
}

export interface ForenkletSkattetrekk {
  tabellNr: string | null;
  prosentsats: number | null;
}

export enum SatsType {
  PROSENT = "PROSENT",
  KRONER = "KRONER",
}

export interface Message {
  details: string | null;
  type: MessageType;
  code: MessageCode | null;
}

export enum MessageType {
  ERROR,
  WARNING,
  INFO,
}

export enum MessageCode {
  OPPDRAG_UTILGJENGELIG = "OPPDRAG_UTILGJENGELIG",
}

export interface FrivilligSkattetrekkResponse {
  data: FrivilligSkattetrekkData;
  messages: Message[] | null;
}

export interface FrivilligSkattetrekkData {
  tilleggstrekk: TrekkDTO | null;
  fremtidigTilleggstrekk: TrekkDTO | null;
  skattetrekk: ForenkletSkattetrekk | null;
  maxBelop: number;
  maxProsent: number;
}

export interface UpdateTilleggstrekkRequest {
  value: number;
  satsType: SatsType;
}

const BASE_URL = "/utbetaling/skattetrekk/";

export async function fetchSkattetrekk(): Promise<FrivilligSkattetrekkResponse> {
  const searchParams = new URLSearchParams(document.location.search);
  const pid = searchParams.get("pid");

  let headers;
  if (pid !== null) {
    headers = {
      "Content-Type": "application/json",
      pid: pid,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }

  return await fetch(BASE_URL + "api/skattetrekk", {
    method: "GET",
    credentials: "include",
    headers: headers,
  }).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json().then((data) => {
        return data as FrivilligSkattetrekkResponse;
      });
    } else if (response.status == 400) {
      return response.json().then((data) => {
        return data.feilkode;
      });
    } else {
      return {
        data: {
          tilleggstrekk: null,
          fremtidigTilleggstrekk: null,
          skattetrekk: null,
          maxBelop: 0,
          maxProsent: 0
        },
        messages: [
            {
                details: "Ukjent feil ved henting av skattetrekk",
                type: MessageType.ERROR,
                code: MessageCode.OPPDRAG_UTILGJENGELIG,
            },
        ]
      } as FrivilligSkattetrekkResponse
    }
  });
}

export async function saveSkattetrekk(request: UpdateTilleggstrekkRequest) {
  const searchParams = new URLSearchParams(document.location.search);
  const pid = searchParams.get("pid");

  let headers;
  if (pid !== null) {
    headers = {
      "Content-Type": "application/json",
      pid: pid,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }

  console.log("Saving skattetrekk 1", request);

  return await fetch(BASE_URL + "api/skattetrekk", {
    method: "POST",
    credentials: "include",
    headers: headers,
    body: JSON.stringify(request),
  }).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error("Fikk ikke 2xx respons fra server");
    }
  });
}
