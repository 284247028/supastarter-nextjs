"use client";

import { ActionBlock } from "@saas/shared/components/ActionBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { ApiOutput } from "api/trpc/router";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TeamInvitationsList } from "./TeamInvitationsList";
import { TeamMembersList } from "./TeamMembersList";

export function TeamMembersBlock({
  memberships,
  invitations,
}: {
  memberships: ApiOutput["team"]["memberships"];
  invitations: ApiOutput["team"]["invitations"];
}) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("members");

  return (
    <ActionBlock title={t("settings.team.members.title")}>
      <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab)}>
        <TabsList className="mb-4">
          <TabsTrigger value="members">
            {t("settings.team.members.activeMembers")}
          </TabsTrigger>
          <TabsTrigger value="invitations">
            {t("settings.team.members.pendingInvitations")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <TeamMembersList memberships={memberships} />
        </TabsContent>
        <TabsContent value="invitations">
          <TeamInvitationsList invitations={invitations} />
        </TabsContent>
      </Tabs>
    </ActionBlock>
  );
}
