import { PageHero } from "@/components/archive/widgets";
import { LEGENDARY_UNLOCK_CARDS, MAX_LEVEL, MAX_STARS, PILLS_PER_WISH, REST_HOURS, STAR_BONUS, STAR_COPIES } from "@/data/cards";
import { AMBROSIA_PRICE, CREATURE_PRICE, DRACHMAS_PER_CORRECT, FEED_PRICE, ULTRA_PRICE, cardPrice } from "@/data/shop";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ · Aether Codex" }, { name: "description", content: "How quizzes, drachmas, wishing, cards and battles work on Aether Codex." }] }),
  component: FaqPage,
});

const hours = `${REST_HOURS} ${REST_HOURS === 1 ? "hour" : "hours"}`;
const link = "text-gold underline underline-offset-4 hover:text-fg";

type Item = { q: string; a: ReactNode };
type Group = { title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "What is Aether Codex?",
        a: (
          <p>
            A retelling of Greek myth that you can read and play. There are gods and creatures to browse, ages and myths to walk through, a Library of articles with our own theories, and a play hall with quizzes,
            wishes, cards and battles. It draws on Homer, Hesiod, the hymns and later writers, but it is not a translation of any one text.
          </p>
        ),
      },
      {
        q: "Do I need an account?",
        a: (
          <p>
            No. You can read everything and play as a guest. An account lets your cards, ambrosia and wish timer follow you to other devices. You can sign up with Google, X or an email and password on the{" "}
            <Link to="/login" className={link}>
              sign-in page
            </Link>
            .
          </p>
        ),
      },
      {
        q: "Where are my cards?",
        a: (
          <p>
            On your{" "}
            <Link to="/profile" className={link}>
              profile
            </Link>{" "}
            page, under My Cards. That is also where you spend ambrosia to level a card up.
          </p>
        ),
      },
    ],
  },
  {
    title: "Quizzes",
    items: [
      {
        q: "How do the quizzes work?",
        a: (
          <>
            <p>
              Go to{" "}
              <Link to="/play" className={link}>
                Quizzes &amp; games
              </Link>{" "}
              and pick one. Each question has four answers, you pick one, and the next question follows. There are two kinds. The Myth &amp; legend quizzes have a fixed set of questions on one subject, like the Trojan
              War or the Underworld. The From the archive quizzes are built fresh from the site's own data each time, so the questions change every time you take them.
            </p>
          </>
        ),
      },
      {
        q: "What are the titles?",
        a: (
          <p>
            Every quiz has three titles. Score 80% or more for the top one, 50% or more for the middle one, and anything lower gets the first. Your best titles show on your profile.
          </p>
        ),
      },
      {
        q: "What are \"Find who you are\" and \"Find your Creature\"?",
        a: (
          <p>
            Two personality quizzes. The first matches you to a god, with a rank of Lesser, Mid, High or Legendary. The second matches you to a creature. You cannot win a creature by wishing, so this quiz is the only free
            way to meet yours. Once you have taken either one, a special wish unlocks that lets you change your result.
          </p>
        ),
      },
      {
        q: "Do Worldle and Word scramble pay anything?",
        a: <p>No. They are just for fun. Only the quizzes pay drachmas.</p>,
      },
    ],
  },
  {
    title: "Earning and spending",
    items: [
      {
        q: "How do I earn money?",
        a: (
          <p>
            The coin here is the drachma. Every correct answer in a quiz earns you {DRACHMAS_PER_CORRECT} drachmas, paid when you finish the quiz. A perfect 8 out of 8 is {8 * DRACHMAS_PER_CORRECT}. You can retake
            quizzes, and the archive quizzes change each time, so there is always something to play.
          </p>
        ),
      },
      {
        q: "What can I buy in the shop?",
        a: (
          <>
            <p>
              Cards cost {cardPrice("", "common")} drachmas (common), {cardPrice("", "rare")} (rare), {cardPrice("", "epic")} (epic) or {cardPrice("", "legendary")} (legendary). The three ultra cards,
              Zeus, Gaia and Poseidon, cost {ULTRA_PRICE} and can only be bought, never wished for. Ambrosia is {AMBROSIA_PRICE} drachmas a drop, creature feed is {FEED_PRICE}, and creatures run from{" "}
              {CREATURE_PRICE.common} to {CREATURE_PRICE.legendary} depending on rarity.
            </p>
            <p className="mt-3">
              Visit the{" "}
              <Link to="/shop" className={link}>
                shop
              </Link>{" "}
              to see everything.
            </p>
          </>
        ),
      },
      {
        q: "I cleared my browser and my drachmas are gone. Why?",
        a: (
          <p>
            Drachmas are stored on the device you earned them on, not on your account. Your cards, ambrosia and wish timer are saved to your account if you are signed in, but drachmas are not, so clearing site data
            or switching devices starts that balance from zero. Spend them before you clear anything.
          </p>
        ),
      },
    ],
  },
  {
    title: "Wishing",
    items: [
      {
        q: "How does wishing work?",
        a: (
          <>
            <p>You get one wish at a time, and there are three kinds:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <span className="text-fg">Grant me a champion</span> gives you a random figure at Level 1.
              </li>
              <li>
                <span className="text-fg">Grant me favor</span> always gives you {PILLS_PER_WISH} drops of ambrosia. There is no luck in it.
              </li>
              <li>
                <span className="text-fg">Grant me a legend</span> gives you one of the legendary figures. It unlocks once you own {LEGENDARY_UNLOCK_CARDS} cards.
              </li>
            </ul>
            <p className="mt-3">
              After any wish, the Pantheon rests for {hours} before you can wish again. The wishes that change your quiz result do not use that rest.
            </p>
          </>
        ),
      },
      {
        q: "What are the real odds?",
        a: (
          <>
            <p>
              Every wish shows its exact odds in its details, and those are the real numbers. In short, a champion wish is 56% common, 30% rare, 11% epic and 3% legendary, before we remove any tiers you have already
              emptied. Inside a tier, the weaker figures turn up slightly more often. A card you already own can never be pulled again, so you never waste a wish on a repeat.
            </p>
            <p className="mt-3">
              The 7 most powerful figures are legendary, the next 10 epic, the next 13 rare, and everyone else common. Zeus, Gaia and Poseidon are ultra and live in the shop. Creatures are never in wishes.
            </p>
          </>
        ),
      },
      {
        q: "How do I make a card stronger?",
        a: (
          <>
            <p>
              A Level 1 card shows 40% of its figure's full power, and Level {MAX_LEVEL} shows all of it. Each drop of ambrosia raises one card by one level. You can get ambrosia from the favor wish or buy it in the shop.
            </p>
            <p className="mt-3">
              Past Level {MAX_LEVEL} there are golden stars. Collect {STAR_COPIES} copies of the same card (extra copies come from the shop) and you earn a star. Each star adds {Math.round(STAR_BONUS * 100)}% to the card's
              power, up to {MAX_STARS} stars.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Battles",
    items: [
      {
        q: "How does a battle work?",
        a: (
          <p>
            In the{" "}
            <Link to="/hall" className={link}>
              Battle Arena
            </Link>{" "}
            you pick two figures, and the arena shows each one's chance of winning before you fight. Press fight and the result is decided by that chance, like a weighted coin, then played out as seven exchanges of blows.
          </p>
        ),
      },
      {
        q: "How is a figure's strength worked out?",
        a: (
          <>
            <p>Every figure has seven bars. They are not all worth the same, because a fight cares about some more than others:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Might counts for 30%.</li>
              <li>Endurance counts for 20%.</li>
              <li>Wrath and Cunning count for 15% each.</li>
              <li>Dominion counts for 10%.</li>
              <li>Craft and Favor count for 5% each.</li>
            </ul>
            <p className="mt-3">Those add up to one battle power number for each figure. The bars are our own temple measures, made for play, and are not canon.</p>
          </>
        ),
      },
      {
        q: "Why does a stronger figure sometimes lose?",
        a: (
          <>
            <p>
              Because it is a chance, not a guarantee. The stronger figure is favoured, and the gap matters a lot, but the weaker one always has a chance. As a rough guide, a figure with 10% more battle power wins about
              64 times in 100. With 20% more it wins about 75 times in 100, and with 50% more about 92 times in 100.
            </p>
            <p className="mt-3">
              So an upset is not a bug. When the underdog wins, the arena says so. Myths are full of this too: the weaker side wins more often than anyone expects, usually through cunning, luck or a favour from someone
              else.
            </p>
          </>
        ),
      },
      {
        q: "Why did the arena say they won on a stat?",
        a: <p>After a fight, the arena names the winner's biggest advantage, such as "Won on might (90 vs 70)". It is a summary of where they were strongest, not a separate reason. The dice still decided the fight.</p>,
      },
      {
        q: "Do my card levels change the arena?",
        a: <p>No. The arena always uses each figure's base bars, so a battle is the same for everyone. Card levels and stars matter for your collection, not for the Battle Arena.</p>,
      },
    ],
  },
  {
    title: "The site and its content",
    items: [
      {
        q: "Are the articles written from one ancient source?",
        a: (
          <p>
            No. The Library holds our own readings and theories, built on what Homer, Hesiod, the hymns and other writers say. We try to mark what the sources say and what is our guess. Ancient sources often disagree,
            and when they do we tell you.
          </p>
        ),
      },
      {
        q: "The card art looks AI-made. Is it?",
        a: (
          <p>
            Yes, the card images were created with AI. If you want to use them, please ask first, or at least email us to say you are using them. If we do not reply, go ahead. You can reach us on the{" "}
            <Link to="/contact" className={link}>
              contact page
            </Link>
            .
          </p>
        ),
      },
      {
        q: "Who can see the chat?",
        a: (
          <p>
            Everyone on the site. Messages are public, shown with the name you chose, and only recent ones are kept. Please be decent, and do not share personal information. Staff can remove messages and ban people who
            break the{" "}
            <Link to="/terms" className={link}>
              rules
            </Link>
            .
          </p>
        ),
      },
      {
        q: "What do you do with my data?",
        a: (
          <p>
            Only what the game features need. The full explanation is in the{" "}
            <Link to="/privacy" className={link}>
              Privacy Policy
            </Link>
            .
          </p>
        ),
      },
      {
        q: "I found a mistake or a bug. What should I do?",
        a: (
          <p>
            Please tell us on the{" "}
            <Link to="/contact" className={link}>
              contact page
            </Link>
            . Mistakes in a myth, a name or a bar are exactly what we want to hear about.
          </p>
        ),
      },
      {
        q: "Is there a shortcut for searching?",
        a: <p>Press / on any page to search the whole codex, and Escape closes whatever is open. The bookmark in the top bar opens your votive shelf, where you keep favourites on this device.</p>,
      },
    ],
  },
];

function FaqPage() {
  return (
    <main>
      <PageHero kicker="Questions" title="FAQ" subtitle="How quizzes, coins, wishes and battles work, and why a strong god sometimes loses." />
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 pb-24 sm:px-6">
        {GROUPS.map((group) => (
          <section key={group.title} className="space-y-3">
            <h2 className="font-display text-lg tracking-kicker text-gold uppercase">{group.title}</h2>
            <div className="space-y-2">
              {group.items.map((item) => (
                <details key={item.q} className="group rounded-md bg-surface shadow-border">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm text-fg [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="text-gold transition-transform duration-150 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-muted">{item.a}</div>
                </details>
              ))}
            </div>
          </section>
        ))}
        <p className="text-sm text-subtle">
          Still stuck? Write to us on the{" "}
          <Link to="/contact" className={link}>
            contact page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
