import { LegalPage, LegalSection } from "@/components/archive/legal";
import { AI_ART_NOTICE, CONTACT_EMAIL, SITE_NAME } from "@/data/site";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return (
    <LegalPage kicker="The house rules" title="Terms & Conditions" subtitle={`Plain rules for using ${SITE_NAME}.`}>
      <LegalSection title="Using the site">
        <p>
          By using {SITE_NAME} you agree to these terms. If you do not agree, please do not use the site. The site is free, offered as is, and may change or go offline at any time.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You are responsible for what happens under your account. Keep your sign-in details to yourself. We may suspend or remove accounts that break these rules or abuse the site. Cards and ambrosia are play items with no cash value, and they can be reset if needed.
        </p>
      </LegalSection>

      <LegalSection title="Chat and conduct">
        <ul className="list-disc space-y-2 pl-5">
          <li>Be decent. No harassment, hate, threats or sexual content.</li>
          <li>No spam, scams, or sharing other people&rsquo;s private information.</li>
          <li>Do not try to break, overload or reverse-engineer the site, or get around bans.</li>
        </ul>
        <p>We may remove messages and ban users at our discretion.</p>
      </LegalSection>

      <LegalSection title="Our content">
        <p>
          The retellings, layout, code and design of {SITE_NAME} belong to us. The myths themselves are ancient and belong to everyone. You may read, share links to and quote short passages of the site with credit. Please do not copy it wholesale or sell it.
        </p>
      </LegalSection>

      <LegalSection title="AI-generated card images">
        <p>{AI_ART_NOTICE}</p>
        <p>
          To ask or to tell us about your use, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold underline underline-offset-4 hover:text-fg">
            {CONTACT_EMAIL}
          </a>{" "}
          or visit the{" "}
          <Link to="/contact" className="text-gold underline underline-offset-4 hover:text-fg">
            contact page
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Accuracy">
        <p>
          Stories follow the common tellings, but sources disagree. Measure scores and other numbers are for play, not scholarship. We do not promise that anything here is complete or error-free.
        </p>
      </LegalSection>

      <LegalSection title="Liability">
        <p>
          The site is provided without warranties of any kind. To the extent the law allows, we are not liable for any loss or damage from using it, or from it being unavailable.
        </p>
      </LegalSection>

      <LegalSection title="Privacy and changes">
        <p>
          How we handle your data is explained in the{" "}
          <Link to="/privacy" className="text-gold underline underline-offset-4 hover:text-fg">
            Privacy Policy
          </Link>
          . We may update these terms, and the date at the top will change when we do. Continuing to use the site means you accept the updated terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
