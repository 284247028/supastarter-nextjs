import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import { forwardRef, useMemo } from "react";

export const UserAvatar = forwardRef<
  HTMLSpanElement,
  {
    name: string;
    avatarUrl?: string | null;
    className?: string;
  }
>(({ name, avatarUrl, className }, ref) => {
  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    [name],
  );

  const avatarSrc = useMemo(() => avatarUrl ?? undefined, [avatarUrl]);

  return (
    <Avatar ref={ref} className={className}>
      <AvatarImage src={avatarSrc} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
});
