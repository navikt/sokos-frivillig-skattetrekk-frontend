import { createContext } from "react";
import { FrivilligSkattetrekkResponse } from "../api/skattetrekkBackendClient";

export type DataContextValue = {
  getResponse: FrivilligSkattetrekkResponse | null;
  setGetResponse: (value: FrivilligSkattetrekkResponse) => void;
  setShouldRefetch: (value: boolean) => void;
  setLoaderOverride: (value: boolean) => void;
  getLoaderOverride: boolean;
};

const DataContextDefaultValue: DataContextValue = {
  getResponse: null,
  setGetResponse: () => undefined,
  setShouldRefetch: () => undefined,
  setLoaderOverride: () => undefined,
  getLoaderOverride: false,
};

export const DataContext = createContext(DataContextDefaultValue);
