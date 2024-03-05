import { useContext } from "react";
import { userContext } from "../lib/user-context";

export function useUser() {
  const context = useContext(userContext);
  return context;
}
