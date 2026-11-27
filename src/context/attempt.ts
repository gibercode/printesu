import { createContext, useContext } from "react";

export const AttemptContext = createContext(false);
export const useAttempted = () => useContext(AttemptContext);
