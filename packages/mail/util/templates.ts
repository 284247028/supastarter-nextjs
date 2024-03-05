import { renderAsync } from "@react-email/render";
import EmailChange from "../emails/EmailChange";
import { ForgotPassword } from "../emails/ForgotPassword";
import { MagicLink } from "../emails/MagicLink";
import { NewUser } from "../emails/NewUser";
import { NewsletterSignup } from "../emails/NewsletterSignup";
import { TeamInvitation } from "../emails/TeamInvitation";

export const mailTemplates = {
  magicLink: MagicLink,
  forgotPassword: ForgotPassword,
  newUser: NewUser,
  newsletterSignup: NewsletterSignup,
  teamInvitation: TeamInvitation,
  emailChange: EmailChange,
};

export async function getTemplate<
  TemplateId extends keyof typeof mailTemplates,
>({
  templateId,
  context,
  locale,
}: {
  templateId: TemplateId;
  context: Parameters<(typeof mailTemplates)[TemplateId]>[0];
  locale: keyof (typeof mailTemplates)[TemplateId]["subjects"];
}) {
  const template = mailTemplates[templateId];
  const email = mailTemplates[templateId](context as any);
  const subject =
    locale in template.subjects
      ? (template.subjects as any)[locale]
      : template.subjects["en"];
  const html = await renderAsync(email);
  const text = await renderAsync(email, { plainText: true });
  return { html, text, subject };
}
