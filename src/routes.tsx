import { EndringPage } from "@/components/endringPage/EndringPage";
import { InitialPage } from "@/components/initialPage/InitialPage";
import { KvitteringPage } from "@/components/kvittering/KvitteringPage";
import { OppsummeringPage } from "@/components/oppsummeringPage/OppsummeringPage";
import { ErrorMessage } from "@/components/pageStatus/ErrorMessage";
import { useEffect } from "react";
import { Outlet, RouteObject, useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <Outlet />;
};

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
