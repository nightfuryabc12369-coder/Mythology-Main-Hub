import { DISCLAIMER } from "@/data";
import { PageHero } from "@/components/archive/widgets";
import { AI_ART_NOTICE } from "@/data/site";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <main>
      <PageHero kicker="Colophon" title="About" subtitle="A hall, not a textbook. The interactions are the point." />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 text-sm text-muted sm:px-6">
        <p className="text-base text-fg/90">{DISCLAIMER}</p>
        <p>
          Press <span className="text-fg">/</span> to search. Escape closes whatever is open. The bookmark in the bar keeps a votive shelf on this device.
        </p>
        <ul className="space-y-3">
          <li>Walk a myth beat by beat.</li>
          <li>The Battle Arena puts any two gods on the same seven bars. The numbers are play, not scripture.</li>
        </ul>
        <p>
          Stories here follow the familiar lines of Hesiod, Homer, the Homeric Hymns, Apollonius, and the later mythographic summaries. Where the tradition splits — seed-counts, parentage, who split Zeus's head — the codex picks one telling and moves.
        </p>
        <h2 className="pt-4 font-display text-lg tracking-kicker text-gold uppercase">About the card art</h2>
        <p>{AI_ART_NOTICE}</p>
        <p>
          Questions or permission requests? See the{" "}
          <Link to="/contact" className="text-gold underline underline-offset-4 hover:text-fg">
            contact page
          </Link>
          , the{" "}
          <Link to="/privacy" className="text-gold underline underline-offset-4 hover:text-fg">
            Privacy Policy
          </Link>{" "}
          and the{" "}
          <Link to="/terms" className="text-gold underline underline-offset-4 hover:text-fg">
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
