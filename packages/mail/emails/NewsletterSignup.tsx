import { Container, Heading, Section, Text } from "@react-email/components";
import Wrapper from "./components/Wrapper";

export function NewsletterSignup(): JSX.Element {
  return (
    <Wrapper>
      <Section className="bg-card p-8">
        <Container>
          <Heading as="h1">Welcome to our newsletter!</Heading>
          <Text>Thank you for signing up for the supastarter newsletter.</Text>
        </Container>
      </Section>
    </Wrapper>
  );
}

NewsletterSignup.subjects = {
  en: "Welcome to our newsletter!",
  de: "Willkommen bei unserem Newsletter!",
};

export default NewsletterSignup;
