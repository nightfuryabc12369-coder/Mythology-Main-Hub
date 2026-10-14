import { CardTile } from "@/components/archive/wish";
import { PageHero } from "@/components/archive/widgets";
import {
  CARD_GODS,
  MAX_STARS,
  RARITIES,
  RARITY_LABEL,
  STAR_COPIES,
  isUltra,
  rarityOf,
  type Rarity as CardRarity,
} from "@/data/cards";
import { CREATURES, RARITIES as CREATURE_RARITIES, getCreature, type Rarity as CreatureRarity } from "@/data/creatures";
import {
  AMBROSIA_PRICE,
  CREATURE_PRICE,
  CURRENCY,
  FEED_PRICE,
  ULTRA_PRICE,
  cardPrice,
  feedForStar,
} from "@/data/shop";
import { useArchiveStore } from "@/lib/archive-store";
import { playSeal, playTone } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type Tab = "cards" | "items" | "creatures";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "cards", label: "Cards" },
  { id: "items", label: "Ambrosia & feed" },
  { id: "creatures", label: "Creatures" },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } =>
    search.tab === "cards" || search.tab === "items" || search.tab === "creatures" ? { tab: search.tab } : {},
  head: () => ({ meta: [{ title: "Shop · Aether Codex" }] }),
  component: ShopPage,
});

function ShopPage() {
  const { tab = "cards" } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const hydrated = useArchiveStore((state) => state.hydrated);
  const drachmas = useArchiveStore((state) => state.drachmas);
  const pills = useArchiveStore((state) => state.pills);
  const feed = useArchiveStore((state) => state.feed);
  const [note, setNote] = useState("");

  return (
    <main>
      <PageHero
        kicker="The agora"
        title="Shop"
        subtitle={`Spend the ${CURRENCY} you win in the play hall: cards, ambrosia, creature feed and a second creature.`}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-md bg-surface px-5 py-4 shadow-border">
          <p className="text-sm text-muted">
            {CURRENCY} <span className="ml-1 font-display text-2xl text-gold">{hydrated ? drachmas : 0}</span>
          </p>
          <p className="text-sm text-muted">
            Ambrosia <span className="ml-1 text-fg">x{hydrated ? pills : 0}</span>
          </p>
          <p className="text-sm text-muted">
            Creature feed <span className="ml-1 text-fg">x{hydrated ? feed : 0}</span>
          </p>
          <Link to="/play" className="ml-auto text-xs tracking-kicker text-primary uppercase underline">
            Earn more: 10 per correct answer
          </Link>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto" role="tablist">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={tab === entry.id}
              onClick={() => {
                setNote("");
                void navigate({ search: { tab: entry.id }, replace: true });
              }}
              className={cn(
                "pressable min-h-11 shrink-0 rounded-full px-5 text-xs tracking-kicker uppercase",
                tab === entry.id ? "bg-primary text-primary-fg" : "border border-border text-muted",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <p className="mt-4 min-h-5 text-sm text-gold" role="status">
          {note}
        </p>

        {tab === "cards" ? <CardsTab onNote={setNote} /> : null}
        {tab === "items" ? <ItemsTab onNote={setNote} /> : null}
        {tab === "creatures" ? <CreaturesTab onNote={setNote} /> : null}
      </div>
    </main>
  );
}

// ── Cards ────────────────────────────────────────────────────────────────────────

type Group = { key: string; title: string; blurb: string; ids: string[] };

function CardsTab({ onNote }: { onNote: (text: string) => void }) {
  const sound = useArchiveStore((state) => state.sound);
  const hydrated = useArchiveStore((state) => state.hydrated);
  const drachmas = useArchiveStore((state) => state.drachmas);
  const cards = useArchiveStore((state) => state.cards);
  const copies = useArchiveStore((state) => state.copies);
  const stars = useArchiveStore((state) => state.stars);
  const buyCard = useArchiveStore((state) => state.buyCard);

  const groups: Group[] = [
    {
      key: "ultra",
      title: "Ultra",
      blurb: `The most powerful cards in the Codex. They cannot be won by wishing: the shop is the only way. ${ULTRA_PRICE} ${CURRENCY} each.`,
      ids: CARD_GODS.filter((god) => isUltra(god.id)).map((god) => god.id),
    },
    ...[...RARITIES].reverse().map((rarity: CardRarity) => ({
      key: rarity,
      title: RARITY_LABEL[rarity],
      blurb: "",
      ids: CARD_GODS.filter((god) => !isUltra(god.id) && rarityOf(god.id) === rarity).map((god) => god.id),
    })),
  ].filter((group) => group.ids.length > 0);

  return (
    <div className="space-y-12">
      <p className="max-w-3xl text-sm text-muted">
        You can buy the same card again and again: it shows as x2, x3 and so on. With {STAR_COPIES} copies of one card you can raise a golden star from My cards
        (up to {MAX_STARS}). Each star adds 10% power.
      </p>
      {groups.map((group) => (
        <section key={group.key}>
          <h2 className="font-display text-3xl text-fg">{group.title}</h2>
          {group.blurb ? <p className="mt-1 max-w-3xl text-sm text-muted">{group.blurb}</p> : null}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {group.ids.map((id) => {
              const god = CARD_GODS.find((entry) => entry.id === id);
              if (!god) return null;
              const price = cardPrice(id, rarityOf(id));
              const owned = hydrated ? cards[id] : undefined;
              const count = owned ? (copies[id] ?? 1) : 0;
              return (
                <CardTile key={id} god={god} level={owned ?? 1} copies={count} stars={hydrated ? (stars[id] ?? 0) : 0}>
                  <button
                    type="button"
                    disabled={!hydrated || drachmas < price}
                    onClick={() => {
                      if (buyCard(id, price)) {
                        if (sound) playSeal();
                        onNote(count > 0 ? `${god.name} bought again. You now hold x${count + 1}.` : `${god.name} joined My cards.`);
                      }
                    }}
                    className="pressable mt-2 min-h-10 w-full rounded-sm bg-primary text-[11px] tracking-kicker text-primary-fg uppercase disabled:opacity-40"
                  >
                    Buy · {price}
                  </button>
                  {count > 0 ? <p className="mt-1 text-center text-[11px] text-muted">You hold x{count}</p> : null}
                </CardTile>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// ── Ambrosia & feed ──────────────────────────────────────────────────────────────

function ItemsTab({ onNote }: { onNote: (text: string) => void }) {
  const sound = useArchiveStore((state) => state.sound);
  const drachmas = useArchiveStore((state) => state.drachmas);
  const buyPills = useArchiveStore((state) => state.buyPills);
  const buyFeed = useArchiveStore((state) => state.buyFeed);

  const items = [
    {
      id: "ambrosia",
      name: "Ambrosia",
      blurb: "Raises one card by a level, up to level 10.",
      price: AMBROSIA_PRICE,
      buy: (count: number) => buyPills(count, AMBROSIA_PRICE * count),
    },
    {
      id: "feed",
      name: "Creature feed",
      blurb: `Feeds a creature to raise a golden star. Star 1 costs ${feedForStar(0)}, then ${feedForStar(1)}, ${feedForStar(2)}, and so on, up to ${MAX_STARS} stars.`,
      price: FEED_PRICE,
      buy: (count: number) => buyFeed(count, FEED_PRICE * count),
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-md bg-surface p-6 shadow-border">
          <h2 className="font-display text-3xl text-fg">{item.name}</h2>
          <p className="mt-2 text-sm text-muted">{item.blurb}</p>
          <p className="mt-4 text-sm text-gold">
            {item.price} {CURRENCY} each
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[1, 5].map((count) => (
              <button
                key={count}
                type="button"
                disabled={drachmas < item.price * count}
                onClick={() => {
                  if (item.buy(count)) {
                    if (sound) playTone(520, 0.12, 0.04);
                    onNote(`Bought ${count} ${item.name.toLowerCase()}.`);
                  }
                }}
                className="pressable min-h-11 rounded-sm bg-primary px-5 text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
              >
                Buy {count} · {item.price * count}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Creatures ────────────────────────────────────────────────────────────────────

function CreaturesTab({ onNote }: { onNote: (text: string) => void }) {
  const sound = useArchiveStore((state) => state.sound);
  const hydrated = useArchiveStore((state) => state.hydrated);
  const drachmas = useArchiveStore((state) => state.drachmas);
  const main = useArchiveStore((state) => state.creature);
  const second = useArchiveStore((state) => state.secondCreature);
  const buySecond = useArchiveStore((state) => state.buySecondCreature);
  const [confirming, setConfirming] = useState<string | null>(null);

  const secondCreature = hydrated && second ? getCreature(second.creatureId) : null;

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-2 text-sm text-muted">
        <p>
          You can have two creatures at most. Your <span className="text-fg">main</span> creature comes from the Find your Creature quiz. Your{" "}
          <span className="text-fg">second</span> creature is bought here, once, and it can never be swapped.
        </p>
        <p>Creatures cannot be won by wishing. The wishing hall only gives gods and goddesses.</p>
      </div>

      {secondCreature ? (
        <div className="rounded-md bg-surface p-6 shadow-border">
          <p className="text-xs tracking-kicker text-gold uppercase">Your second creature</p>
          <h2 className="mt-2 font-display text-3xl text-fg">{secondCreature.name}</h2>
          <p className="mt-2 text-sm text-muted">
            It is yours for good. Feed it from your{" "}
            <Link to="/profile" className="text-primary underline">
              profile
            </Link>{" "}
            to raise golden stars.
          </p>
        </div>
      ) : !main && hydrated ? (
        <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted">
          Find your main creature first.{" "}
          <Link to="/identity" search={{ mode: "creature" }} className="text-primary underline">
            Take the Find your Creature quiz
          </Link>
          .
        </div>
      ) : null}

      {!secondCreature && main
        ? [...CREATURE_RARITIES].reverse().map((tier) => (
            <section key={tier.id}>
              <h2 className="font-display text-3xl text-fg">
                {tier.label} · {CREATURE_PRICE[tier.id as CreatureRarity]} {CURRENCY}
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {CREATURES.filter((creature) => creature.rarity === tier.id && creature.id !== main.creatureId).map((creature) => {
                  const price = CREATURE_PRICE[creature.rarity];
                  const isConfirming = confirming === creature.id;
                  return (
                    <div key={creature.id} className="overflow-hidden rounded-md bg-surface shadow-border">
                      <div className="relative aspect-[4/3] w-full bg-bg-deep">
                        <img
                          src={creature.god.image}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{ objectPosition: creature.god.focus }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-display text-xl text-fg">{creature.name}</h3>
                        <p className="mt-1 text-xs text-muted">{creature.god.line}</p>
                        {isConfirming ? (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-gold">This is your only second creature. Once bought, it can't be changed.</p>
                            <button
                              type="button"
                              onClick={() => {
                                if (buySecond(creature.id, creature.rarity, price)) {
                                  if (sound) playSeal();
                                  onNote(`${creature.name} is now your second creature.`);
                                }
                                setConfirming(null);
                              }}
                              className="pressable min-h-10 w-full rounded-sm bg-primary text-[11px] tracking-kicker text-primary-fg uppercase"
                            >
                              Yes, buy it
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirming(null)}
                              className="pressable min-h-10 w-full rounded-sm border border-border text-[11px] tracking-kicker text-muted uppercase"
                            >
                              Not now
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={drachmas < price}
                            onClick={() => setConfirming(creature.id)}
                            className="pressable mt-3 min-h-10 w-full rounded-sm bg-primary text-[11px] tracking-kicker text-primary-fg uppercase disabled:opacity-40"
                          >
                            Buy · {price}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        : null}
    </div>
  );
}
