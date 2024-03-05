import { Icon } from "@ui/components/icon";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-8">
      <Icon.spinner className="text-primary h-4 w-4 animate-spin text-3xl" />
    </div>
  );
}
