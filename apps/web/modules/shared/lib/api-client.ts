import { createTRPCReact } from "@trpc/react-query";
import { ApiRouter } from "api/trpc/router";

export const apiClient = createTRPCReact<ApiRouter>({});
