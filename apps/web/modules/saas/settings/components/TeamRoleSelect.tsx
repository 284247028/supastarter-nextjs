import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import { TeamMemberRoleType } from "database";
import { useTranslations } from "next-intl";

export function TeamRoleSelect({
  value,
  onSelect,
  disabled,
}: {
  value: TeamMemberRoleType;
  onSelect: (value: TeamMemberRoleType) => void;
  disabled?: boolean;
}) {
  const t = useTranslations();

  const roleOptions = [
    {
      label: t("settings.team.members.roles.member"),
      value: "MEMBER",
    },
    {
      label: t("settings.team.members.roles.owner"),
      value: "OWNER",
    },
  ];

  return (
    <Select value={value} onValueChange={onSelect} disabled={disabled}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roleOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
