import { SessionUser } from "auth";
import { TeamMemberRoleSchema, TeamMembership, UserRoleSchema } from "database";

export function defineAbilitiesFor({
  user,
  teamMemberships,
}: {
  user: SessionUser | null;
  teamMemberships: TeamMembership[] | null;
}) {
  const isAdmin = user?.role === UserRoleSchema.Values.ADMIN;

  const getTeamRole = (teamId: string) =>
    teamMemberships?.find((m) => m.teamId === teamId)?.role ?? null;

  const isTeamOwner = (teamId: string) =>
    isAdmin || getTeamRole(teamId) === TeamMemberRoleSchema.Values.OWNER;

  const isTeamMember = (teamId: string) =>
    isTeamOwner(teamId) ||
    getTeamRole(teamId) === TeamMemberRoleSchema.Values.MEMBER;

  return {
    isAdmin,
    isTeamMember,
    isTeamOwner,
  };
}
