import { LegalPage, LegalSection } from "@/components/archive/legal";
import { CONTACT_EMAIL, SITE_NAME } from "@/data/site";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <LegalPage kicker="Your data" title="Privacy Policy" subtitle={`What ${SITE_NAME} keeps, why, and how to have it removed.`}>
      <LegalSection title="The short version">
        <p>You can read almost everything here without an account. If you sign in, we store only what the game features need. We do not sell your data and we do not show ads.</p>
      </LegalSection>

      <LegalSection title="What we store on your device">
        <p>
          Your browser keeps small local settings so the site remembers you: your votive shelf and favorites, sound preference, quiz progress, and the display name you type into chat if you are not signed in. This stays on your device. Clearing your browser data removes it.
        </p>
      </LegalSection>

      <LegalSection title="If you create an account">
        <p>You can sign in with Google, X or an email and password. When you do, we store:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Your name, email address and profile picture, as provided by the sign-in method you chose.</li>
          <li>Session details that keep you signed in, such as a session token, your IP address and browser type.</li>
          <li>Your game profile: the cards you have collected, your ambrosia balance, your wish cooldown and your chosen avatar.</li>
        </ul>
        <p>If you sign in with an email and password, the password is stored in hashed form, not as plain text.</p>
      </LegalSection>

      <LegalSection title="Public chat">
        <p>
          Messages you post in the chat room are public to everyone using the site, together with the name you chose. Do not post anything personal. The chat keeps only recent messages: older ones are deleted automatically (roughly after a day, and only about the newest 200 are kept).
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <ul className="list-disc space-y-2 pl-5">
          <li>To sign you in and keep your cards and progress across devices.</li>
          <li>To run the chat and keep it safe, including moderation.</li>
          <li>To fix problems and keep the site secure.</li>
        </ul>
        <p>We do not sell or rent your information.</p>
      </LegalSection>

      <LegalSection title="Who else handles it">
        <p>
          The site runs on third-party services for hosting, its database and sign-in (including Google and X if you choose them). Those providers process data under their own privacy policies. We only share what is needed to run the site.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>{SITE_NAME} is not aimed at children under 13, and we do not knowingly collect their personal information. If you believe a child has created an account, email us and we will delete it.</p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can ask to see, correct or delete your account and game data at any time by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold underline underline-offset-4 hover:text-fg">
            {CONTACT_EMAIL}
          </a>
          . You can also clear local data in your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>If this policy changes, we will update the date at the top of this page.</p>
      </LegalSection>
    </LegalPage>
  );
}
