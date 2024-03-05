import { Link, Text } from "@react-email/components";
import PrimaryButton from "./components/PrimaryButton";
import Wrapper from "./components/Wrapper";

export function EmailChange({
  url,
  name,
}: {
  url: string;
  name: string;
}): JSX.Element {
  return (
    <Wrapper>
      <Text>
        Hey {name}, <br /> you changed your email. Please click the link below
        to confirm your new email address.
      </Text>

      <PrimaryButton href={url}>Confirm email &rarr;</PrimaryButton>

      <Text className="text-muted-foreground text-sm">
        If you want to open the link in a different browser than your default
        one, copy and paste this link:
        <Link href={url}>{url}</Link>
      </Text>
    </Wrapper>
  );
}

EmailChange.subjects = {
  en: "Email changed",
  de: "Email geändert",
};

export default EmailChange;
