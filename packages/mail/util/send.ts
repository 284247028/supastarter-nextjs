import { send } from "../provider";
import { getTemplate, type mailTemplates } from "./templates";

export async function sendEmail<
  TemplateId extends keyof typeof mailTemplates,
>(params: {
  to: string;
  templateId: TemplateId;
  context?: Parameters<(typeof mailTemplates)[TemplateId]>[0];
}) {
  const { to, templateId, context } = params;

  const { html, text, subject } = await getTemplate({
    templateId,
    context,
    locale: "en",
  });

  try {
    // send the email
    await send({
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
