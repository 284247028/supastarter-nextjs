import { trpcApiRouteHandler } from "api/trpc/router-handler";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export { trpcApiRouteHandler as GET, trpcApiRouteHandler as POST };
