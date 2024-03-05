import { Icon } from "@ui/components/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/tooltip";
import { cn } from "@ui/lib";
import { useTranslations } from "next-intl";

export function EmailVerified({
  verified,
  className,
}: {
  verified: boolean;
  className?: string;
}) {
  const t = useTranslations();
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipContent>
          {verified
            ? t("admin.users.emailVerified.verified")
            : t("admin.users.emailVerified.waiting")}
        </TooltipContent>
        <TooltipTrigger>
          <div className={cn(className)}>
            {verified ? (
              <Icon.check className="h-3 w-3" />
            ) : (
              <Icon.clock className="h-3 w-3" />
            )}
          </div>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
}
