import { RouteObject } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorMessage } from "./components/error/ErrorMessage";
import { EndringPage } from "./pages/endringPage/EndringPage";
import { InitialPage } from "./pages/initialPage/InitialPage";
import { KvitteringPage } from "./pages/kvitteringPage/KvitteringPage";
import { OppsummeringPage } from "./pages/oppsummeringPage/OppsummeringPage";

export enum PageLinks {
  INDEX = "/",
  ENDRING = "/endring",
  KVITTERING = "/kvittering",
  OPPSUMMERING = "/oppsummering",
}

export const routes: RouteObject[] = [
  {
    element: <ScrollToTop />,
    children: [
      {
        path: import.meta.env.BASE_URL,
        element: <InitialPage />,
        errorElement: <ErrorMessage />,
      },
      {
        path: import.meta.env.BASE_URL + PageLinks.ENDRING,
        element: <EndringPage />,
        errorElement: <ErrorMessage />,
      },
      {
        path: import.meta.env.BASE_URL + PageLinks.OPPSUMMERING,
        element: <OppsummeringPage />,
        errorElement: <ErrorMessage />,
      },
      {
        path: import.meta.env.BASE_URL + PageLinks.KVITTERING,
        element: <KvitteringPage />,
        errorElement: <ErrorMessage />,
      },
    ],
  },
];
