import { CURRENT_TEAM_ID_COOKIE_NAME } from "@saas/shared/constants";
import Cookies from "js-cookie";

export function updateCurrentTeamIdCookie(teamId: string) {
  Cookies.set(CURRENT_TEAM_ID_COOKIE_NAME, teamId, {
    path: "/",
    expires: 30,
  });
}
