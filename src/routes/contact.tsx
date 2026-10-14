import { LegalPage, LegalSection } from "@/components/archive/legal";
import { AI_ART_NOTICE, CONTACT_EMAIL } from "@/data/site";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <LegalPage kicker="Reach us" title="Contact" subtitle="Questions, corrections, takedown requests, or permission to use our card art.">
      <LegalSection title="Email">
        <p>
          The best way to reach us is by email:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold underline underline-offset-4 hover:text-fg">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>We read everything, but we are a small project, so replies can take a while.</p>
      </LegalSection>
      <LegalSection title="Using our card images">
        <p>{AI_ART_NOTICE}</p>
        <p>When you write, tell us what you are using the images for and where they will appear. That is all we ask for. Nothing else is required.</p>
      </LegalSection>
      <LegalSection title="Other reasons to write">
        <ul className="list-disc space-y-2 pl-5">
          <li>A mistake in a myth, a name or a genealogy.</li>
          <li>A bug, or something that does not load.</li>
          <li>A request to delete your account or your data (see the Privacy Policy).</li>
          <li>A copyright or content concern about anything on the site.</li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
