import { SignupForm } from "@saas/auth/components/SignupForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("auth.signup.title"),
  };
}

export default function SignupPage() {
  return <SignupForm />;
}
