import { createContext } from "./context";
import { apiRouter } from "./router";

export const createApiCaller = async () => {
  const context = await createContext();
  return apiRouter.createCaller(context);
};

export const createAdminApiCaller = async () => {
  const context = await createContext({ isAdmin: true });
  return apiRouter.createCaller(context);
};
