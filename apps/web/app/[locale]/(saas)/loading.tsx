import { Logo } from "@shared/components/Logo";

export default function Loading() {
  return (
    <div className="bg-muted flex min-h-screen w-full items-center justify-center">
      <div className="animate-pulse">
        <Logo />
      </div>
    </div>
  );
}
