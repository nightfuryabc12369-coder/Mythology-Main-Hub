import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Crown, S as Feather, _ as KeyRound, a as Waves, b as Flower2, c as TriangleAlert, d as Signpost, f as Shield, g as Menu, h as Moon, i as Wheat, l as Swords, m as Search, n as X, o as VolumeX, p as Shell, r as Wine, s as Volume2, t as Zap, u as Sun, v as Hammer, w as Bookmark, x as Flame, y as Grape } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/widgets-64GKbqKq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
function context() {
	if (typeof window === "undefined") return null;
	const Ctor = window.AudioContext || window.webkitAudioContext;
	if (!Ctor) return null;
	if (!ctx) ctx = new Ctor();
	return ctx;
}
/** Short lyre blip. Only call from a user gesture. */
function playTone(freq = 440, dur = .12, gain = .045) {
	const audio = context();
	if (!audio) return;
	audio.resume();
	const t = audio.currentTime;
	const osc = audio.createOscillator();
	const amp = audio.createGain();
	osc.type = "triangle";
	osc.frequency.setValueAtTime(freq, t);
	osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 1.4), t + dur);
	amp.gain.setValueAtTime(gain, t);
	amp.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	osc.connect(amp);
	amp.connect(audio.destination);
	osc.start(t);
	osc.stop(t + dur + .02);
}
function playSeal() {
	playTone(392, .08, .035);
	window.setTimeout(() => playTone(523, .12, .03), 70);
}
function playSummon() {
	[
		196,
		247,
		330,
		392
	].forEach((freq, index) => {
		window.setTimeout(() => playTone(freq, .22, .03), index * 90);
	});
}
var emptyFavorites = {
	god: [],
	myth: [],
	epithet: [],
	epic: []
};
var useArchiveStore = create()(persist((set, get) => ({
	hydrated: false,
	searchOpen: false,
	searchQuery: "",
	overlay: null,
	seated: [],
	councilOpen: false,
	compareLeft: "zeus",
	compareRight: "hades",
	sound: false,
	oracleBest: 0,
	favorites: emptyFavorites,
	setHydrated: (hydrated) => set({ hydrated }),
	setSearchOpen: (searchOpen) => set({
		searchOpen,
		searchQuery: searchOpen ? get().searchQuery : ""
	}),
	setSearchQuery: (searchQuery) => set({ searchQuery }),
	openOverlay: (overlay) => set({
		overlay,
		searchOpen: false
	}),
	closeOverlay: () => set({ overlay: null }),
	toggleSeat: (id) => {
		const seated = get().seated;
		const next = seated.includes(id) ? seated.filter((seat) => seat !== id) : [...seated, id];
		set({
			seated: next,
			councilOpen: next.length === 12
		});
	},
	resetSeats: () => set({
		seated: [],
		councilOpen: false
	}),
	setCouncilOpen: (councilOpen) => set({ councilOpen }),
	setCompare: (side, id) => {
		if ((side === "left" ? get().compareRight : get().compareLeft) === id) {
			set(side === "left" ? {
				compareLeft: id,
				compareRight: get().compareLeft
			} : {
				compareRight: id,
				compareLeft: get().compareRight
			});
			return;
		}
		set(side === "left" ? { compareLeft: id } : { compareRight: id });
	},
	toggleSound: () => set({ sound: !get().sound }),
	setOracleBest: (score) => set({ oracleBest: Math.max(get().oracleBest, score) }),
	isFavorite: (kind, id) => get().favorites[kind].includes(id),
	toggleFavorite: (kind, id) => {
		const current = get().favorites[kind];
		const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
		set({ favorites: {
			...get().favorites,
			[kind]: next
		} });
	}
}), {
	name: "aether-codex-v1",
	skipHydration: true,
	partialize: (state) => ({
		seated: state.seated,
		compareLeft: state.compareLeft,
		compareRight: state.compareRight,
		sound: state.sound,
		oracleBest: state.oracleBest,
		favorites: state.favorites
	})
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function SectionHeader({ kicker, title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-title text-fg",
					children: title
				}),
				subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-sm text-muted",
					children: subtitle
				}) : null
			]
		}), action]
	});
}
function TextLink({ to, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: "inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase",
		children
	});
}
function FavoriteButton({ kind, id, label }) {
	const hydrated = useArchiveStore((state) => state.hydrated);
	const active = useArchiveStore((state) => state.isFavorite(kind, id));
	const toggle = useArchiveStore((state) => state.toggleFavorite);
	const sound = useArchiveStore((state) => state.sound);
	const on = hydrated && active;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		"aria-label": on ? `Remove ${label} from the votive shelf` : `Set ${label} on the votive shelf`,
		onClick: (event) => {
			event.stopPropagation();
			if (sound) playSeal();
			toggle(kind, id);
		},
		className: cn("pressable inline-flex size-11 items-center justify-center rounded-full border border-border bg-bg/55 text-muted", on && "border-primary text-primary"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4 transition-transform duration-200", on && "scale-110 fill-current") })
	});
}
function usePresence(open, ms = 240) {
	const [render, setRender] = (0, import_react.useState)(open);
	const [shown, setShown] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setRender(true);
			const frame = requestAnimationFrame(() => setShown(true));
			return () => cancelAnimationFrame(frame);
		}
		setShown(false);
		const timer = window.setTimeout(() => setRender(false), ms);
		return () => window.clearTimeout(timer);
	}, [open, ms]);
	return {
		render,
		shown
	};
}
function StatRow({ label, value, delay = 0, bar = "var(--color-primary)" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-center justify-between text-xs tracking-kicker text-muted uppercase",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg",
			children: value
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 overflow-hidden rounded-full bg-bg-deep",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "stat-fill h-full rounded-full",
			style: {
				["--w"]: `${value}%`,
				["--d"]: `${delay}ms`,
				["--bar"]: bar
			}
		})
	})] });
}
function PageHero({ kicker, title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative overflow-hidden border-b border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/scenes/oracle.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover opacity-45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stagger-in text-xs tracking-kicker text-gold uppercase",
						children: kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "stagger-in mt-3 font-display text-display text-fg uppercase",
						style: { ["--d"]: "80ms" },
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stagger-in mt-4 max-w-xl text-base text-muted",
						style: { ["--d"]: "160ms" },
						children: subtitle
					})
				]
			})
		]
	});
}
function FilterChip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: cn("pressable min-h-11 shrink-0 rounded-full px-3 text-xs tracking-kicker uppercase", on ? "bg-primary text-primary-fg" : "bg-surface text-muted"),
		children
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/gods-CJL6-N-1.js
var gods = [
	{
		id: "zeus",
		name: "Zeus",
		epithet: "Cloud-gatherer",
		aliases: [
			"Olympios",
			"Xenios",
			"Kataibates"
		],
		realm: "sky",
		office: "King of the gods",
		domain: "Sky, oaths, hospitality",
		parentage: "Son of Cronus and Rhea",
		status: "Enthroned",
		age: "Olympian",
		line: "The sky keeps the oath you thought was private.",
		summary: "Youngest son of Cronus, hidden in a cave, then king by lot of the sky.",
		story: "Cronus swallowed his children so no heir could rise. Rhea hid Zeus and fed the father a stone. Grown, Zeus forced that generation open, then fought ten years for the cosmos. With his brothers he drew lots: sky, sea, and the dead. He rules by weather and by the guest-law. A broken oath is answered in thunder.",
		nature: "He is generous to hosts and terrible to oath-breakers. The court around him is a quarrel he refuses to lose.",
		symbols: [
			"Thunderbolt",
			"Eagle",
			"Oak"
		],
		epithetIds: [
			"olympios",
			"xenios",
			"kataibates"
		],
		allies: [
			"athena",
			"apollo",
			"hermes"
		],
		rivals: [
			"poseidon",
			"prometheus",
			"hades"
		],
		kin: [
			"Hera, sister and wife",
			"Poseidon and Hades, brothers",
			"Athena, daughter sprung from his head"
		],
		deeds: [
			"The ten-year war with the Titans",
			"The lots that divided the world",
			"The birth of Athena"
		],
		tags: [
			"olympian",
			"sky",
			"king"
		],
		olympian: true,
		featured: true,
		stats: {
			might: 96,
			craft: 58,
			cunning: 74,
			dominion: 99,
			wrath: 88,
			favor: 70,
			endurance: 92
		},
		image: "/scenes/hero.jpg",
		focus: "center 40%",
		emblem: "bolt",
		aura: "gold"
	},
	{
		id: "hera",
		name: "Hera",
		epithet: "Cow-eyed queen",
		aliases: ["Teleia", "Argeia"],
		realm: "olympus",
		office: "Queen of the gods",
		domain: "Marriage, sovereignty, the lawful bed",
		parentage: "Daughter of Cronus and Rhea",
		status: "Enthroned",
		age: "Olympian",
		line: "A vow is a throne. She does not lend it.",
		summary: "Sister-wife of Zeus and guardian of marriage as a political fact, not a mood.",
		story: "Hera keeps the structure Zeus would rather charm his way around. Marriage, in her cult, is the bond that makes a house and a city legible. She sponsors heroes when their cause is dynastic — Jason among them — and she is implacable when the king of gods treats kingship as a private appetite. The Iliad opens on her anger and never really leaves it.",
		nature: "Dignity first. She remembers longer than the sky does.",
		symbols: [
			"Diadem",
			"Peacock",
			"Pomegranate"
		],
		epithetIds: [],
		allies: ["athena", "hestia"],
		rivals: ["aphrodite", "zeus"],
		kin: [
			"Zeus, brother and husband",
			"Hephaestus, son",
			"Ares, son"
		],
		deeds: [
			"Patronage of the Argonauts",
			"The long spite of the Trojan War",
			"The binding of the sky-king, once, with the other gods"
		],
		tags: ["olympian", "queen"],
		olympian: true,
		featured: true,
		stats: {
			might: 78,
			craft: 64,
			cunning: 84,
			dominion: 90,
			wrath: 93,
			favor: 48,
			endurance: 96
		},
		image: "/scenes/olympus.jpg",
		focus: "center 45%",
		emblem: "crown",
		aura: "wine"
	},
	{
		id: "poseidon",
		name: "Poseidon",
		epithet: "Earth-shaker",
		aliases: ["Enosichthon", "Hippios"],
		realm: "sea",
		office: "Lord of the sea",
		domain: "Ocean, earthquakes, horses",
		parentage: "Son of Cronus and Rhea",
		status: "Enthroned below the waves",
		age: "Olympian",
		line: "He does not forget a slight the way water does not forget a hull.",
		summary: "Brother of Zeus. The sea was his lot, and he has been insulted ever since.",
		story: "After the Titan war the three brothers cast lots. Poseidon took the wine-dark sea and the shock that runs under cities. He contested Athens with Athena and lost the vote, which the Athenians told as the founding of their mind. Sailors pour to him before they trust a horizon. Odysseus learns what it means to blind a son of this house: the voyage home becomes the punishment.",
		nature: "Proud, physical, sudden. A harbor is only a pause in his attention.",
		symbols: [
			"Trident",
			"Horse",
			"Bull"
		],
		epithetIds: [],
		allies: ["aphrodite"],
		rivals: [
			"athena",
			"zeus",
			"odysseus"
		],
		kin: ["Zeus and Hades, brothers", "Theseus, in the Athenian telling, a son"],
		deeds: [
			"The contest for Athens",
			"The wrath that stretches the Odyssey",
			"Horses given to the earth"
		],
		tags: ["olympian", "sea"],
		olympian: true,
		featured: true,
		stats: {
			might: 94,
			craft: 52,
			cunning: 60,
			dominion: 88,
			wrath: 95,
			favor: 55,
			endurance: 90
		},
		image: "/scenes/sea.jpg",
		focus: "center 50%",
		emblem: "wave",
		aura: "marble"
	},
	{
		id: "demeter",
		name: "Demeter",
		epithet: "Bringer of seasons",
		aliases: ["Thesmophoros", "Chloe"],
		realm: "earth",
		office: "Lady of the grain",
		domain: "Harvest, law of bread, the grieving year",
		parentage: "Daughter of Cronus and Rhea",
		status: "Walking the furrowed world",
		age: "Olympian",
		line: "When she stops searching, the fields stop answering.",
		summary: "Mother of Persephone. Her grief is the reason the year has a winter.",
		story: "Hades took Persephone with Zeus's quiet consent. Demeter left Olympus and walked the cities as a mourning woman, and the grain failed until the gods bargained. The daughter returns, but not entire: she tasted the pomegranate, so the year must split. The Eleusinian mysteries promised initiates that this story was also about them — that what goes under can come back, changed and still itself.",
		nature: "Gentle until the world withholds her child. Then she is a famine with a name.",
		symbols: [
			"Wheat",
			"Torch",
			"Poppy"
		],
		epithetIds: [],
		allies: ["persephone", "hestia"],
		rivals: ["hades"],
		kin: ["Persephone, daughter", "Zeus, brother"],
		deeds: [
			"The search for Persephone",
			"The gift of grain and its laws",
			"The famine that forced Olympus to negotiate"
		],
		tags: ["olympian", "earth"],
		olympian: true,
		stats: {
			might: 72,
			craft: 80,
			cunning: 68,
			dominion: 84,
			wrath: 77,
			favor: 86,
			endurance: 94
		},
		image: "/scenes/earth.jpg",
		focus: "center 60%",
		emblem: "wheat",
		aura: "gold"
	},
	{
		id: "athena",
		name: "Athena",
		epithet: "Grey-eyed",
		aliases: [
			"Promachos",
			"Parthenos",
			"Glaukopis"
		],
		realm: "olympus",
		office: "Mind in armor",
		domain: "Strategy, crafts, the just city",
		parentage: "Daughter of Zeus and Metis, born armed",
		status: "Enthroned",
		age: "Olympian",
		line: "She wins before the spear is thrown.",
		summary: "Goddess of counsel and war-as-craft. Patron of Athens and of Odysseus.",
		story: "Zeus swallowed Metis, goddess of cunning, when a prophecy said her child would surpass him. The child came anyway, from his skull, already helmeted. Athena's war is not Ares's noise. It is the loom, the ship, the vote, the ambush seen three moves early. She sides with the clever mortal — Perseus, Odysseus, the city that chose her olive over a salt spring.",
		nature: "Cool, exacting, loyal to intelligence. She does not enjoy waste.",
		symbols: [
			"Aegis",
			"Owl",
			"Olive"
		],
		epithetIds: [
			"promachos",
			"parthenos",
			"glaukopis"
		],
		allies: [
			"zeus",
			"odysseus",
			"hera"
		],
		rivals: ["ares", "poseidon"],
		kin: ["Zeus, father", "Hephaestus, sometimes a rival maker, sometimes close kin in cult"],
		deeds: [
			"The contest with Poseidon for Athens",
			"Counsel through the Odyssey",
			"The aegis turned on the proud"
		],
		tags: ["olympian", "mind"],
		olympian: true,
		featured: true,
		stats: {
			might: 86,
			craft: 95,
			cunning: 98,
			dominion: 84,
			wrath: 62,
			favor: 74,
			endurance: 88
		},
		image: "/scenes/olympus.jpg",
		focus: "left center",
		emblem: "shield",
		aura: "marble"
	},
	{
		id: "apollo",
		name: "Apollo",
		epithet: "Far-shooter",
		aliases: [
			"Phoebus",
			"Musagetes",
			"Loxias"
		],
		realm: "sky",
		office: "Lord of the oracle",
		domain: "Music, prophecy, plague and healing",
		parentage: "Son of Zeus and Leto",
		status: "Enthroned, and always traveling",
		age: "Olympian",
		line: "The same hands string the lyre and the bow.",
		summary: "Twin of Artemis. Delphi speaks in his name, and never plainly.",
		story: "Leto bore him under pursuit, and the island that sheltered the birth became holy. Apollo claimed Delphi, set the oracle over a crack in the mountain, and taught that a god can answer without explaining. He leads the Muses, sends plague when honor is denied — the Iliad begins with his arrows — and he is the bright edge of a house that also contains night. His oracles are true and badly timed.",
		nature: "Lucid, severe about purity, suddenly kind to singers.",
		symbols: [
			"Lyre",
			"Laurel",
			"Bow"
		],
		epithetIds: [
			"phoebus",
			"musagetes",
			"loxias"
		],
		allies: [
			"artemis",
			"zeus",
			"the muses"
		],
		rivals: ["hermes"],
		kin: [
			"Artemis, twin",
			"Zeus, father",
			"Leto, mother"
		],
		deeds: [
			"Founding the Delphic oracle",
			"The opening plague of the Iliad",
			"The lyre taken from Hermes as wergild"
		],
		tags: ["olympian", "oracle"],
		olympian: true,
		featured: true,
		stats: {
			might: 82,
			craft: 90,
			cunning: 86,
			dominion: 80,
			wrath: 75,
			favor: 84,
			endurance: 78
		},
		image: "/scenes/oracle.jpg",
		focus: "center 40%",
		emblem: "sun",
		aura: "gold"
	},
	{
		id: "artemis",
		name: "Artemis",
		epithet: "Lady of beasts",
		aliases: ["Agrotera", "Cynthia"],
		realm: "wild",
		office: "Huntress of the margin",
		domain: "The hunt, wild animals, girls at the threshold of adulthood",
		parentage: "Daughter of Zeus and Leto",
		status: "Abroad in the hills",
		age: "Olympian",
		line: "The wilderness has a law. She is holding it.",
		summary: "Twin of Apollo. She keeps the places cities have not yet named.",
		story: "Artemis asked her father for the mountains, a bow, and a company that would not be married off as policy. She is protector and threat at once: midwives called her, and so did hunters who had gone too far into a sacred grove. With Apollo she is the clean outline of the Olympian generation — one facing the oracle, one facing the animal dark. Orion, in one telling, learns that her boundary is not a suggestion.",
		nature: "Swift, chaste in the old sense of unowned, unsentimental about blood.",
		symbols: [
			"Bow",
			"Deer",
			"Moon"
		],
		epithetIds: ["agrotera", "cynthia"],
		allies: ["apollo", "leto"],
		rivals: ["orion"],
		kin: ["Apollo, twin", "Zeus, father"],
		deeds: [
			"The defense of the unhunted grove",
			"Patronage of young lives not yet given to a house",
			"The scorpion set against Orion, in the star-myth"
		],
		tags: ["olympian", "wild"],
		olympian: true,
		featured: true,
		stats: {
			might: 84,
			craft: 76,
			cunning: 80,
			dominion: 72,
			wrath: 82,
			favor: 60,
			endurance: 90
		},
		image: "/scenes/oracle.jpg",
		focus: "right center",
		emblem: "moon",
		aura: "marble"
	},
	{
		id: "ares",
		name: "Ares",
		epithet: "Sacker of cities",
		aliases: ["Enyalios"],
		realm: "olympus",
		office: "War without a plan",
		domain: "Battle-frenzy, courage, the cost of both",
		parentage: "Son of Zeus and Hera",
		status: "Rarely welcome, always present",
		age: "Olympian",
		line: "He arrives when the speech is over.",
		summary: "The god of war as noise, blood, and the thrill that ruins a line.",
		story: "Where Athena is the campaign, Ares is the minute the line breaks. Homer treats him almost as a scandal: wounded, shouted at, necessary. Cities still sacrificed before battle because frenzy is a power whether or not it is admired. He stands with Troy in the Iliad more from appetite than policy. His children in myth tend to inherit the noise.",
		nature: "Hot, physical, easily humiliated, impossible to retire.",
		symbols: [
			"Spear",
			"Helmet",
			"Bronze"
		],
		epithetIds: [],
		allies: ["aphrodite"],
		rivals: ["athena", "hephaestus"],
		kin: ["Hera and Zeus, parents", "Hephaestus, brother"],
		deeds: [
			"The field of Troy",
			"The binding by Hephaestus, a domestic disaster told as comedy",
			"Cult at Sparta and Thrace, where frenzy was a civic tool"
		],
		tags: ["olympian", "war"],
		olympian: true,
		stats: {
			might: 92,
			craft: 34,
			cunning: 40,
			dominion: 58,
			wrath: 99,
			favor: 36,
			endurance: 74
		},
		image: "/scenes/war.jpg",
		focus: "center 55%",
		emblem: "swords",
		aura: "wine"
	},
	{
		id: "aphrodite",
		name: "Aphrodite",
		epithet: "Foam-born",
		aliases: ["Urania", "Pandemos"],
		realm: "sea",
		office: "The force that unmakes plans",
		domain: "Love, beauty, the bonds that are not contracts",
		parentage: "Born of sea-foam in Hesiod; daughter of Zeus in Homer",
		status: "Enthroned, and never still",
		age: "Olympian",
		line: "She does not argue. The room changes anyway.",
		summary: "Goddess of desire. Even the war starts, in one telling, because of a promise she made.",
		story: "Hesiod has her rise from the sea after a violence among the older gods, already a power. Homer domesticates her as Zeus's daughter and then shows gods and mortals equally helpless. Paris awards her the golden apple; she pays him with Helen, and Troy pays the rest. She is not only softness. In Sparta and Corinth she had warlike cults. Urania is love as order; Pandemos is love as the whole city feeling the same pull.",
		nature: "Irresistible, amused, dangerous to anyone who thinks they are immune — including herself, in the song of her affair with Ares.",
		symbols: [
			"Rose",
			"Myrtle",
			"Dove"
		],
		epithetIds: ["urania", "pandemos"],
		allies: ["ares", "poseidon"],
		rivals: ["hera", "athena"],
		kin: ["Hephaestus, husband in the Olympian scandal", "Aeneas, son, in the Roman afterlife of this myth"],
		deeds: [
			"The judgment of Paris",
			"The net of Hephaestus",
			"The two loves, heavenly and common"
		],
		tags: ["olympian", "sea"],
		olympian: true,
		featured: true,
		stats: {
			might: 55,
			craft: 70,
			cunning: 92,
			dominion: 86,
			wrath: 64,
			favor: 97,
			endurance: 76
		},
		image: "/scenes/sea.jpg",
		focus: "center 30%",
		emblem: "shell",
		aura: "wine"
	},
	{
		id: "hephaestus",
		name: "Hephaestus",
		epithet: "The renowned smith",
		aliases: ["Aitnaios"],
		realm: "olympus",
		office: "Maker of what the gods cannot improvise",
		domain: "Fire, metal, craft, devices",
		parentage: "Son of Hera, with or without Zeus depending on the poet",
		status: "At the forge",
		age: "Olympian",
		line: "Give him a day and he will build the thing you were ashamed to ask for.",
		summary: "Lame smith of Olympus. The palace is his handiwork, and so are its traps.",
		story: "Thrown from heaven — the tellings disagree about which parent did it — Hephaestus landed in the sea and learned fire from the bottom of the world. He returns not with an army but with objects: thrones that bind, nets that do not tear, arms that decide a duel. The gods laugh at his gait and then quietly commission him. Pandora, in Hesiod, is in part his manufacture. Craft is his answer to humiliation.",
		nature: "Patient, exact, proud of the work and sore about the court.",
		symbols: [
			"Hammer",
			"Tongs",
			"Volcano"
		],
		epithetIds: [],
		allies: ["athena"],
		rivals: ["ares"],
		kin: ["Hera, mother", "Ares, brother"],
		deeds: [
			"The throne that caught Hera",
			"The unbreakable net",
			"Arms and automata for the Olympian house"
		],
		tags: ["olympian", "forge"],
		olympian: true,
		stats: {
			might: 70,
			craft: 99,
			cunning: 77,
			dominion: 60,
			wrath: 58,
			favor: 64,
			endurance: 86
		},
		image: "/scenes/tartarus.jpg",
		focus: "center 40%",
		emblem: "hammer",
		aura: "ember"
	},
	{
		id: "hermes",
		name: "Hermes",
		epithet: "Guide of souls",
		aliases: ["Psychopompos", "Argeiphontes"],
		realm: "sky",
		office: "Messenger, thief, and escort of the dead",
		domain: "Roads, trade, luck, boundaries, sleep",
		parentage: "Son of Zeus and Maia",
		status: "Between every door",
		age: "Olympian",
		line: "He invented the loophole on the day he was born.",
		summary: "The god who can enter Olympus, the market, and the underworld without changing sandals.",
		story: "Before he was a day old, Hermes stole Apollo's cattle, invented the lyre from a tortoise shell, and talked his way into a settlement. That is the whole character: speed, charm, a crime that becomes a cult. He carries Zeus's messages, leads souls down the dark road, and blesses thieves who are clever rather than cruel. Crossroads had his piles of stones. If a story needs a door opened quietly, he is already there.",
		nature: "Light-footed, ironic, trustworthy about messages and nothing else.",
		symbols: [
			"Caduceus",
			"Petasos",
			"Traveler's cloak"
		],
		epithetIds: ["psychopompos", "argeiphontes"],
		allies: ["zeus", "hades"],
		rivals: ["apollo"],
		kin: ["Zeus, father", "Maia, mother"],
		deeds: [
			"The cattle theft and the lyre",
			"Psychopomp to the dead",
			"The messages that start and stall the epics"
		],
		tags: ["olympian", "road"],
		olympian: true,
		featured: true,
		stats: {
			might: 62,
			craft: 84,
			cunning: 99,
			dominion: 70,
			wrath: 30,
			favor: 88,
			endurance: 80
		},
		image: "/scenes/heroic.jpg",
		focus: "center 35%",
		emblem: "feather",
		aura: "gold"
	},
	{
		id: "dionysus",
		name: "Dionysus",
		epithet: "Twice-born",
		aliases: ["Bromios", "Eleutherios"],
		realm: "wild",
		office: "The god who arrives from elsewhere",
		domain: "Wine, theatre, ecstatic release",
		parentage: "Son of Zeus and Semele, in the common telling",
		status: "The last seat on Olympus",
		age: "Olympian",
		line: "He loosens the city, and the city calls it a festival so it can survive.",
		summary: "God of wine and masks. Hestia's public seat, in many lists, is the one he takes.",
		story: "Semele asked to see Zeus as Hera wears him, and the sight killed her. Zeus sewed the unborn god into his own thigh — hence twice-born. Dionysus comes to cities as a stranger with a chorus, and the kings who refuse him tear their own houses apart. Theatre begins as his rite: a mask, a chorus, a story dangerous enough to need a stage. He is joy and he is the panic under joy.",
		nature: "Smiling, boundaryless, older than the manners he offends.",
		symbols: [
			"Ivy",
			"Thyrsus",
			"Theatre mask"
		],
		epithetIds: ["bromios", "eleutherios"],
		allies: ["ariadne", "the maenads"],
		rivals: ["the kings who bar the gate"],
		kin: [
			"Zeus, father",
			"Semele, mother",
			"Ariadne, wife after the labyrinth"
		],
		deeds: [
			"The arrival at Thebes",
			"The gift of wine",
			"The crown of Ariadne set in the sky"
		],
		tags: ["olympian", "wild"],
		olympian: true,
		stats: {
			might: 74,
			craft: 68,
			cunning: 88,
			dominion: 76,
			wrath: 80,
			favor: 90,
			endurance: 84
		},
		image: "/scenes/earth.jpg",
		focus: "center 30%",
		emblem: "grape",
		aura: "wine"
	},
	{
		id: "hades",
		name: "Hades",
		epithet: "The wealthy one",
		aliases: ["Plouton", "Aidoneus"],
		realm: "underworld",
		office: "Host of the dead",
		domain: "The underworld, mineral wealth, the irrevocable",
		parentage: "Son of Cronus and Rhea",
		status: "Below, keeping the books",
		age: "Olympian generation",
		line: "He does not hunt. He receives.",
		summary: "Brother of Zeus. Not a devil — a king whose gates open one way.",
		story: "Hades drew the lot nobody celebrates and kept it with terrifying consistency. His realm is not a pit of invention; it is the place stories end, with rivers, a dog, and rules. He takes Persephone by arrangement with Zeus, which the hymn refuses to prettify, and then he is bound by the compromise Demeter forces. Mortals rarely prayed to be noticed by him. They prayed, under the name Plouton, for the wealth that comes up out of his ground.",
		nature: "Impassive, legal, almost never theatrical. That is why he is frightening.",
		symbols: [
			"Helm of darkness",
			"Sceptre",
			"Pomegranate"
		],
		epithetIds: ["plouton", "aidoneus"],
		allies: ["persephone", "hermes"],
		rivals: ["demeter", "orpheus"],
		kin: ["Zeus and Poseidon, brothers", "Persephone, wife and queen"],
		deeds: [
			"The lot of the dead",
			"The taking of Persephone",
			"The one exception he almost grants Orpheus"
		],
		tags: ["chthonic", "king"],
		olympian: false,
		featured: true,
		stats: {
			might: 88,
			craft: 50,
			cunning: 72,
			dominion: 94,
			wrath: 46,
			favor: 40,
			endurance: 99
		},
		image: "/scenes/underworld.jpg",
		focus: "center 60%",
		emblem: "key",
		aura: "ember"
	},
	{
		id: "persephone",
		name: "Persephone",
		epithet: "Dread queen",
		aliases: ["Kore"],
		realm: "underworld",
		office: "Queen below, maiden of the return",
		domain: "Spring's absence, the dead's mercy, the split year",
		parentage: "Daughter of Demeter and Zeus",
		status: "Two thrones, one calendar",
		age: "Olympian generation",
		line: "She is the reason the world knows how to come back.",
		summary: "Taken below, crowned there, and never only a victim in the later telling.",
		story: "The Homeric Hymn starts her as Kore, the girl in the meadow, and ends her as queen. The pomegranate is the plot: a taste binds her to the house of the dead for part of every year, and her mother' s grief becomes winter. Initiates at Eleusis treated the pair as the mystery worth keeping secret. In later art she sits the throne as an equal, not a guest. Spring is not innocence restored. It is a negotiated return.",
		nature: "Changing. Soft light, then the voice that can dismiss a hero from the dead.",
		symbols: [
			"Pomegranate",
			"Torch",
			"Flowers"
		],
		epithetIds: [],
		allies: ["demeter", "hecate"],
		rivals: [],
		kin: [
			"Demeter, mother",
			"Hades, husband",
			"Zeus, father"
		],
		deeds: [
			"The descent and the return",
			"Queenship beside Hades",
			"The year cut into seasons"
		],
		tags: ["chthonic", "earth"],
		olympian: false,
		featured: true,
		stats: {
			might: 68,
			craft: 74,
			cunning: 82,
			dominion: 86,
			wrath: 55,
			favor: 84,
			endurance: 92
		},
		image: "/scenes/underworld.jpg",
		focus: "center 30%",
		emblem: "flower",
		aura: "wine"
	},
	{
		id: "hestia",
		name: "Hestia",
		epithet: "First and last",
		aliases: ["the hearth"],
		realm: "olympus",
		office: "Keeper of the flame that is not a weapon",
		domain: "Hearth, home, the fire that starts a sacrifice",
		parentage: "Eldest daughter of Cronus and Rhea",
		status: "At the center, often unnamed",
		age: "Olympian generation",
		line: "Every prayer begins with her, even when the poet forgets.",
		summary: "Goddess of the hearth. She gives up the public twelfth seat and keeps the actual center.",
		story: "Hestia is the first swallowed and the last restored, and cult remembers her that way: first offering, last offering. She does not join the expeditions or the adulteries. When Dionysus arrives, many later lists give him her throne among the twelve. The stories say she yielded it. The household fire did not go out. A city without her is only a camp.",
		nature: "Still, modest, non-negotiable. The least dramatic power in the pantheon, and the one you die without.",
		symbols: [
			"Hearth flame",
			"Kettle",
			"Circle"
		],
		epithetIds: [],
		allies: ["demeter", "hera"],
		rivals: [],
		kin: ["Zeus, Poseidon, Hades, Hera, Demeter — the siblings"],
		deeds: [
			"The first and last libation",
			"The civic hearth of a colony",
			"The quiet abdication of a throne"
		],
		tags: ["hearth"],
		olympian: false,
		stats: {
			might: 48,
			craft: 77,
			cunning: 60,
			dominion: 82,
			wrath: 12,
			favor: 90,
			endurance: 99
		},
		image: "/scenes/olympus.jpg",
		focus: "center 70%",
		emblem: "flame",
		aura: "gold"
	},
	{
		id: "hecate",
		name: "Hecate",
		epithet: "Of the crossroads",
		aliases: ["Trimorphos"],
		realm: "underworld",
		office: "Keeper of thresholds",
		domain: "Crossroads, night, witchcraft, the door between",
		parentage: "Daughter of Perses and Asteria, in Hesiod",
		status: "Honored by Zeus, avoided at night",
		age: "Titan blood, Olympian favor",
		line: "Where three roads meet, someone has already chosen.",
		summary: "A Titan-born goddess Zeus unusually refuses to diminish. She walks with Demeter in the search.",
		story: "Hesiod's Theogony pauses to praise her: Zeus confirms her honors over earth, sea, and sky. That triple reach becomes, in later Greek life, the three-formed figure at the crossroads where offerings were left in the dark. She hears Persephone's cry when almost no one else does, and she holds a torch beside Demeter. Magic in the Greek sense — pharmaka, night rites, the power of the in-between — gathers under her name without making her a villain.",
		nature: "Watchful, liminal, neither cruel nor domestic.",
		symbols: [
			"Twin torches",
			"Key",
			"Crossroads"
		],
		epithetIds: [],
		allies: ["demeter", "persephone"],
		rivals: [],
		kin: ["Asteria, mother", "Leto, aunt in the Hesiodic genealogy"],
		deeds: [
			"Honors confirmed after the Titan war",
			"The torch in the search for Persephone",
			"The offerings at the triple road"
		],
		tags: ["chthonic", "titan"],
		olympian: false,
		stats: {
			might: 66,
			craft: 88,
			cunning: 94,
			dominion: 78,
			wrath: 50,
			favor: 72,
			endurance: 90
		},
		image: "/scenes/chaos.jpg",
		focus: "center 45%",
		emblem: "crossroad",
		aura: "marble"
	},
	{
		id: "prometheus",
		name: "Prometheus",
		epithet: "Forethought",
		aliases: ["the fire-thief"],
		realm: "tartarus",
		office: "Titan advocate of mortals",
		domain: "Foresight, stolen fire, the trick at the sacrifice",
		parentage: "Son of Iapetus",
		status: "Bound, then eventually freed in the later tradition",
		age: "Titan",
		line: "He looked ahead and sided with the creature that would outlast the feast.",
		summary: "The Titan who cheated Zeus at the altar and put fire in human hands.",
		story: "At Mecone, Prometheus wrapped the bones in fat so Zeus would choose the worse share of the sacrifice, and mortals would keep the meat. Zeus, whether deceived or playing along, withheld fire. Prometheus stole it in a fennel stalk. The punishment is the famous rock and the eagle; the further answer, in Hesiod, is Pandora and the jar. Aeschylus later makes him the proud mind who will not apologize to power. Fire stays lit either way.",
		nature: "Brilliant, partisan, unable to leave a rigged game alone.",
		symbols: [
			"Fennel stalk",
			"Fire",
			"Chains"
		],
		epithetIds: [],
		allies: ["mortals"],
		rivals: ["zeus"],
		kin: ["Epimetheus, brother of afterthought", "Iapetus, father"],
		deeds: [
			"The trick of the sacrifice",
			"The theft of fire",
			"The binding on the mountain"
		],
		tags: ["titan"],
		olympian: false,
		featured: true,
		stats: {
			might: 60,
			craft: 92,
			cunning: 97,
			dominion: 44,
			wrath: 70,
			favor: 82,
			endurance: 96
		},
		image: "/scenes/tartarus.jpg",
		focus: "center 20%",
		emblem: "flame",
		aura: "ember"
	}
];
var byId = Object.fromEntries(gods.map((god) => [god.id, god]));
function getGod(id) {
	return byId[id];
}
var featuredGods = gods.filter((god) => god.featured);
var realmLabel = {
	olympus: "Olympus",
	sky: "Sky",
	sea: "Sea",
	earth: "Earth",
	underworld: "Below",
	tartarus: "Tartarus",
	wild: "Wild"
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-il8cp1Nw.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
var STAT_KEYS = [
	["might", "Might"],
	["craft", "Craft"],
	["cunning", "Cunning"],
	["dominion", "Dominion"],
	["wrath", "Wrath"],
	["favor", "Favor"],
	["endurance", "Endurance"]
];
var THRONES = [
	"zeus",
	"hera",
	"poseidon",
	"demeter",
	"athena",
	"apollo",
	"artemis",
	"ares",
	"aphrodite",
	"hephaestus",
	"hermes",
	"dionysus"
];
var ages = [
	{
		id: "chaos",
		name: "Chaos",
		years: "Before measure",
		tag: "Primordial",
		summary: "A gap, then earth, night, and desire. The world is kinship before it is a court.",
		story: "Hesiod does not start with a battle. He starts with Chaos — a gap, not a monster — and then Gaia, Tartarus, Eros, and Night. The first powers are conditions: darkness, depth, want. Gods in this age are not yet persons you could invite to a table. They are the fact that anything can be separated from anything else. Every later throne is built on that split.",
		image: "/scenes/chaos.jpg",
		focus: "center top",
		aura: "marble",
		gods: ["hecate"],
		myths: ["titanomachy"]
	},
	{
		id: "titan",
		name: "Titanomachy",
		years: "Ten years of war",
		tag: "Overthrow",
		summary: "Cronus cuts the sky from the earth. Zeus cuts Cronus from the throne.",
		story: "Uranus holds his children unborn in the earth until Cronus, with Gaia's sickle, ends that reign. Cronus then repeats the crime in a new form and swallows his own. Zeus, hidden and fed on a substituted stone, grows up to force the world open again. The war with the Titans lasts ten years. The winners are not gentler. They are younger, and they divide the spoils into sky, sea, and the dead.",
		image: "/scenes/war.jpg",
		focus: "center",
		aura: "ember",
		gods: [
			"zeus",
			"prometheus",
			"hecate"
		],
		myths: ["titanomachy", "prometheus-fire"]
	},
	{
		id: "olympian",
		name: "Olympian reign",
		years: "The long present",
		tag: "Order",
		summary: "Lots, laws, fire, grain, and a court that cannot stop interfering.",
		story: "Once the three brothers have their lots, the world becomes negotiable. Fire is stolen and punished. Grain is given and then withheld. Marriage, prophecy, metal, and wine each acquire a patron who wants credit. Mortals are no longer scenery. They sacrifice, cheat the portions, and build cities that pick a god and suffer the others. This is the age the hymns are still trying to manage.",
		image: "/scenes/olympus.jpg",
		focus: "center",
		aura: "gold",
		gods: [
			"zeus",
			"hera",
			"athena",
			"apollo",
			"demeter"
		],
		myths: [
			"birth-of-athena",
			"persephone",
			"prometheus-fire"
		]
	},
	{
		id: "heroic",
		name: "Heroic age",
		years: "The last generation that dines with gods",
		tag: "Mortality",
		summary: "The Argo, the labyrinth, Troy, and the long walk home. Heroes die. That is the point.",
		story: "Hesiod calls it the age of heroes, set between bronze and iron, and already nostalgic. Heracles clears the roads. The Argo sails. Theseus walks into the maze with a thread. Then Troy burns because a quarrel on Olympus found a human stage, and Odysseus spends a decade learning which god he offended. The gods are still in the scenes. They are no longer the ones who bleed out.",
		image: "/scenes/heroic.jpg",
		focus: "center",
		aura: "wine",
		gods: [
			"athena",
			"poseidon",
			"aphrodite",
			"apollo",
			"hermes"
		],
		myths: [
			"labyrinth",
			"argonauts",
			"troy",
			"odyssey",
			"orpheus"
		]
	}
];
var realms = [
	{
		id: "olympus",
		name: "Olympus",
		epithet: "The bright court",
		keeper: "Held by Zeus, endured by Hera",
		blurb: "A mountain that is also a government. Thrones, grudges, and the forge under the floor.",
		image: "/scenes/olympus.jpg",
		focus: "center",
		gods: [
			"hera",
			"athena",
			"ares",
			"hephaestus",
			"hestia"
		]
	},
	{
		id: "sky",
		name: "The open sky",
		epithet: "Oaths and weather",
		keeper: "Zeus, with Apollo's light beside him",
		blurb: "Eagles, oracles, and the road Hermes uses when a message cannot wait for a ship.",
		image: "/scenes/hero.jpg",
		focus: "center 30%",
		gods: [
			"zeus",
			"apollo",
			"hermes"
		]
	},
	{
		id: "sea",
		name: "The wine-dark sea",
		epithet: "Unstill",
		keeper: "Poseidon",
		blurb: "Harbor, earthquake, and the foam that one poet says was Aphrodite's first shore.",
		image: "/scenes/sea.jpg",
		focus: "center",
		gods: ["poseidon", "aphrodite"]
	},
	{
		id: "earth",
		name: "The furrowed earth",
		epithet: "Bread and law",
		keeper: "Demeter",
		blurb: "Wheat, shrines, and the months when the queen below is missing from the field.",
		image: "/scenes/earth.jpg",
		focus: "center 55%",
		gods: ["demeter"]
	},
	{
		id: "underworld",
		name: "The house of Hades",
		epithet: "One way",
		keeper: "Hades and Persephone",
		blurb: "Rivers, a gate, a dog, and a queenship Demeter forced the sky to recognize.",
		image: "/scenes/underworld.jpg",
		focus: "center",
		gods: [
			"hades",
			"persephone",
			"hecate"
		]
	},
	{
		id: "tartarus",
		name: "Tartarus",
		epithet: "The depth under the dead",
		keeper: "A prison, not a court",
		blurb: "Where the Titans were thrown, and where forethought was chained for taking fire downward.",
		image: "/scenes/tartarus.jpg",
		focus: "center",
		gods: ["prometheus"]
	},
	{
		id: "wild",
		name: "The unbuilt wild",
		epithet: "Outside the wall",
		keeper: "Artemis by day, Dionysus by night",
		blurb: "Hunt, ivy, and every festival a city invents so this place can visit without staying.",
		image: "/scenes/oracle.jpg",
		focus: "left center",
		gods: ["artemis", "dionysus"]
	}
];
var myths = [
	{
		id: "titanomachy",
		name: "Titanomachy",
		age: "Titanomachy",
		order: 1,
		span: "Ten years",
		logline: "The children of Cronus take the sky from their father and do not give it back.",
		story: "Zeus frees his swallowed siblings. The Olympians fight the Titans from Mount Olympus while the older gods hold Othrys. After a decade the hundred-handed ones, buried by Uranus and released by Zeus, turn the war with volleys of stone. The Titans are cast into Tartarus. Hecate, unusually, keeps her honors. The new regime begins by repeating an imprisonment.",
		gods: [
			"zeus",
			"hecate",
			"prometheus"
		],
		mortals: [],
		beats: [
			"Rhea hides Zeus and offers Cronus a stone in swaddling.",
			"The grown son forces the siblings free. The war has two mountains.",
			"Ten years. Then the hundred-handed ones throw the stones that end it.",
			"Tartarus receives the losers. The winners draw lots for what remains."
		],
		moments: [
			"The substituted stone",
			"The ten-year stalemate",
			"The lot of sky, sea, and dead"
		],
		aura: "ember",
		image: "/scenes/war.jpg",
		focus: "center"
	},
	{
		id: "prometheus-fire",
		name: "The theft of fire",
		age: "Olympian reign",
		order: 2,
		span: "One stalk of fennel",
		logline: "Prometheus cheats the sacrifice, steals fire, and leaves mortals both gifted and liable.",
		story: "At Mecone he disguises the portions so humans keep the meat and the gods receive the smoke of bones and fat. Zeus withholds fire. Prometheus carries a coal down in a fennel stalk. Hesiod's answer is Pandora and a jar of consequences; Aeschylus's is a bound Titan who still will not apologize. Greek sacrifice forever repeats his trick: the gods get the smoke, the table gets the meal.",
		gods: [
			"prometheus",
			"zeus",
			"hephaestus"
		],
		mortals: ["the first mortals", "Pandora"],
		beats: [
			"At the feast he hides the meat and dresses the bones in fat.",
			"Zeus chooses the shining portion, then denies fire.",
			"A fennel stalk walks out of heaven with a coal inside.",
			"The eagle, the rock, and a jar that will not be unopened."
		],
		moments: [
			"The trick at Mecone",
			"Fire in the stalk",
			"Pandora's jar"
		],
		aura: "ember",
		image: "/scenes/tartarus.jpg",
		focus: "center 25%"
	},
	{
		id: "birth-of-athena",
		name: "The birth of Athena",
		age: "Olympian reign",
		order: 3,
		span: "One headache",
		logline: "Zeus swallows cunning itself. Cunning climbs back out of his skull, armed.",
		story: "Metis is prophecy as much as a person: her son will surpass his father. Zeus repeats Cronus and swallows her. He does not escape the pattern. Hephaestus — or Prometheus, in some versions — splits the headache, and Athena steps out in armor. The story is a joke about patriarchy that the patriarchy does not win. Strategy is now loose in the court, and she is loyal, not obedient.",
		gods: [
			"athena",
			"zeus",
			"hephaestus"
		],
		mortals: [],
		beats: [
			"A prophecy: the child of Metis will be greater than the father.",
			"Zeus swallows Metis and calls the problem solved.",
			"The skull splits. A goddess comes out already wearing a helmet.",
			"The court has a new mind, and she keeps her own counsel."
		],
		moments: [
			"Metis swallowed",
			"The splitting of the head",
			"Athena armed"
		],
		aura: "marble",
		image: "/scenes/olympus.jpg",
		focus: "center"
	},
	{
		id: "persephone",
		name: "The pomegranate",
		age: "Olympian reign",
		order: 4,
		span: "A third of the year, or half — the poets argue",
		logline: "Persephone is taken below. Demeter makes winter until a compromise grows a season.",
		story: "With Zeus's permission, Hades takes Kore from the meadow. Demeter searches with a torch, Hecate beside her, and the grain dies. The bargain that restores the world is bitter: because Persephone tasted the pomegranate, she must return below for part of every year. The hymn ends with two titles, girl and queen, and a mystery cult that treated the secret as worth a life of silence.",
		gods: [
			"persephone",
			"demeter",
			"hades",
			"hecate"
		],
		mortals: [],
		beats: [
			"A meadow. The ground opens. The king below does not ask twice.",
			"Demeter walks the cities. Nothing sown will rise.",
			"Hecate carries a torch. Olympus is forced to negotiate.",
			"A few seeds. The year learns how to be absent and come back."
		],
		moments: [
			"The meadow",
			"The famine",
			"The seeds",
			"The return"
		],
		aura: "wine",
		image: "/scenes/underworld.jpg",
		focus: "center"
	},
	{
		id: "labyrinth",
		name: "The labyrinth",
		age: "Heroic age",
		order: 5,
		span: "One thread",
		logline: "Theseus goes in with Ariadne's thread. The crown she loses becomes a constellation.",
		story: "Minos demands Athenian youth for the maze under the palace, and the thing inside it. Theseus volunteers. Ariadne gives him a thread and a way to love his way back out — then, in the common telling, is left on an island. Dionysus finds her there. The crown he sets in the sky is Corona. The myth is about a city paying a debt, a woman solving a building, and a god who arrives after the hero has already sailed.",
		gods: ["dionysus", "poseidon"],
		mortals: [
			"Theseus",
			"Ariadne",
			"Minos"
		],
		beats: [
			"Athens owes Crete a ship of the young.",
			"Ariadne hands Theseus a thread. The maze is a problem of return, not of strength.",
			"The hero sails. She is left on the shore.",
			"Dionysus crowns her, and the crown does not fall. It stays in the sky."
		],
		moments: [
			"The tribute",
			"The thread",
			"Naxos",
			"Corona"
		],
		aura: "gold",
		image: "/scenes/heroic.jpg",
		focus: "center 40%"
	},
	{
		id: "troy",
		name: "The war for Troy",
		age: "Heroic age",
		order: 6,
		span: "Ten years",
		logline: "Three goddesses offer a prize. A mortal chooses. Both cities and heavens spend a decade paying for it.",
		story: "Eris rolls a golden apple into a wedding, inscribed for the fairest. Hera, Athena, and Aphrodite ask Paris to judge. He chooses Aphrodite's offer — Helen — and the oaths of Helen's former suitors drag Greece to the Hellespont. Apollo, Ares, and Aphrodite lean toward Troy; Hera, Athena, and Poseidon toward the ships. Homer is less interested in who wins than in what honor costs when gods pick favorites.",
		gods: [
			"aphrodite",
			"athena",
			"hera",
			"apollo",
			"ares",
			"poseidon"
		],
		mortals: [
			"Paris",
			"Helen",
			"Achilles",
			"Hector"
		],
		beats: [
			"A wedding. A golden apple. Three goddesses who will not share.",
			"Paris chooses desire over sovereignty and over skill.",
			"The oaths drag a thousand ships into a ten-year camp.",
			"The walls fall. The gods are still arguing on the way down."
		],
		moments: [
			"The apple",
			"The judgment",
			"The camp",
			"The fall"
		],
		aura: "wine",
		image: "/scenes/war.jpg",
		focus: "center 30%"
	},
	{
		id: "odyssey",
		name: "The long return",
		age: "Heroic age",
		order: 7,
		span: "Ten more years",
		logline: "Athena wants Odysseus home. Poseidon wants him drowned. The distance between them is the poem.",
		story: "After Troy, Odysseus blinds the Cyclops Polyphemus, who is Poseidon's son. The sea becomes personal. Athena argues his case on Olympus between disguises, shipwrecks, and a household in Ithaca that is being eaten alive by guests who have forgotten guest-law. Hermes crosses the story when a message must cut through a goddess's island. Home, when it comes, is a recognition by scar and bed, not by a parade.",
		gods: [
			"athena",
			"poseidon",
			"hermes",
			"zeus"
		],
		mortals: [
			"Odysseus",
			"Penelope",
			"Telemachus"
		],
		beats: [
			"A cave. A blinded giant prays to his father, who is the sea.",
			"Calypso's island. Athena starts a lawsuit in heaven.",
			"Hermes delivers the order. The raft still has to survive.",
			"Ithaca. The bow, the bed, the guests who broke the oldest law."
		],
		moments: [
			"Polyphemus",
			"The council",
			"The raft",
			"The bow"
		],
		aura: "marble",
		image: "/scenes/sea.jpg",
		focus: "center 40%"
	},
	{
		id: "orpheus",
		name: "Orpheus looks back",
		age: "Heroic age",
		order: 8,
		span: "One song, one glance",
		logline: "The underworld allows a single exception. He spends it on the threshold.",
		story: "Orpheus sings until Hades and Persephone agree to a condition: he may lead Eurydice up, if he does not look back before they both stand in the day. He looks. The poems refuse to make this only a moral about patience. It is also about a musician who could move the king of the dead and still could not bear the one rule that made the miracle true. The road down remains a road down.",
		gods: [
			"hades",
			"persephone",
			"hermes"
		],
		mortals: ["Orpheus", "Eurydice"],
		beats: [
			"A wedding ends in a snakebite. He goes down with a lyre instead of a sword.",
			"The dead listen. The queen below is moved.",
			"One condition: do not look until the light is on you both.",
			"He looks. The song was enough for the king. It was not enough for the singer."
		],
		moments: [
			"The descent",
			"The condition",
			"The glance"
		],
		aura: "ember",
		image: "/scenes/underworld.jpg",
		focus: "left center"
	},
	{
		id: "argonauts",
		name: "The Argo",
		age: "Heroic age",
		order: 9,
		span: "One fleece",
		logline: "Jason sails with a crew of famous names because Hera and Athena have a use for him.",
		story: "Pelias sends Jason after the golden fleece expecting the errand to kill him. Hera wants Pelias punished; Athena wants the ship well made. The Argo is therefore a divine project that happens to have mortals on board. At Colchis, Medea's craft — pharmaka, fire, a terrible competence — makes the impossible tasks possible, and later makes the return impossible to wash clean. The fleece is not the part of the story that lasts.",
		gods: [
			"hera",
			"athena",
			"aphrodite"
		],
		mortals: ["Jason", "Medea"],
		beats: [
			"A usurper king invents an errand that should be fatal.",
			"Hera and Athena sponsor a ship and pick a crew of stories.",
			"In Colchis, Medea solves the bulls, the earthborn, and the serpent.",
			"The fleece comes home. The debt to the woman who won it does not."
		],
		moments: [
			"The impossible task",
			"The building of the Argo",
			"Medea's craft",
			"The return"
		],
		aura: "gold",
		image: "/scenes/heroic.jpg",
		focus: "center 70%"
	}
];
var epithets = [
	{
		id: "olympios",
		name: "Olympios",
		god: "zeus",
		line: "Sky father",
		stage: 1,
		meaning: "Of Olympus",
		description: "The public title. This is Zeus as the court, the weather above a city, the god a temple on a height is for.",
		signs: [
			"Hilltop temple",
			"Eagle",
			"The gathered cloud"
		],
		note: "When a city says Olympios it means the king, not the guest-law and not the thunderbolt in particular.",
		aura: "gold"
	},
	{
		id: "xenios",
		name: "Xenios",
		god: "zeus",
		line: "Sky father",
		stage: 2,
		meaning: "Protector of guests",
		description: "The stranger at the door is under his name. To abuse a guest is to pick a fight with the sky. The Odyssey is this epithet in narrative form.",
		signs: [
			"The shared table",
			"A gift given at parting",
			"The unasked name"
		],
		note: "Hospitality runs both ways. The guest has duties too, which the suitors in Ithaca forget.",
		aura: "gold"
	},
	{
		id: "kataibates",
		name: "Kataibates",
		god: "zeus",
		line: "Sky father",
		stage: 3,
		meaning: "He who descends",
		description: "Zeus as the strike itself. Places where lightning hit could become his ground, fenced and left alone.",
		signs: [
			"A blackened stone",
			"A fenced plot",
			"Rain after the crack"
		],
		note: "The gentlest titles and this one belong to the same god. That is the theology.",
		aura: "ember"
	},
	{
		id: "promachos",
		name: "Promachos",
		god: "athena",
		line: "Armed mind",
		stage: 1,
		meaning: "She who fights in front",
		description: "Athena as the champion standing before the line. The great bronze on the Athenian acropolis carried this name.",
		signs: [
			"Spear forward",
			"The aegis",
			"A city wall"
		],
		note: "Front of the line, not lost in it. She still expects a plan.",
		aura: "marble"
	},
	{
		id: "parthenos",
		name: "Parthenos",
		god: "athena",
		line: "Armed mind",
		stage: 2,
		meaning: "The maiden",
		description: "Not a comment on frailty. The title marks her as unattached to a husband's house — her loyalty is to the city and the craft.",
		signs: [
			"The Parthenon",
			"The untouched olive",
			"A peplos woven for her"
		],
		note: "Athens put this title on its most expensive room.",
		aura: "marble"
	},
	{
		id: "glaukopis",
		name: "Glaukopis",
		god: "athena",
		line: "Armed mind",
		stage: 3,
		meaning: "Grey-eyed, or owl-eyed",
		description: "Homer's standing epithet. The eyes are the point: a color like bright metal, and a bird that sees in the dark.",
		signs: [
			"Owl",
			"Grey sea-light",
			"An unblinking vote"
		],
		note: "Translators argue about the adjective. The stare is not in dispute.",
		aura: "marble"
	},
	{
		id: "phoebus",
		name: "Phoebus",
		god: "apollo",
		line: "Far-shooter",
		stage: 1,
		meaning: "The bright one",
		description: "Apollo as radiance — later tangled with the sun, earlier simply the glare of a god who arrives and makes a place holy or sick.",
		signs: [
			"Laurel",
			"Gold light",
			"A sudden stillness"
		],
		note: "Brightness is not kindness. The Iliad's plague is his.",
		aura: "gold"
	},
	{
		id: "musagetes",
		name: "Musagetes",
		god: "apollo",
		line: "Far-shooter",
		stage: 2,
		meaning: "Leader of the Muses",
		description: "The lyre, the chorus, the disciplined beautiful thing. He leads; he does not dissolve. That last verb belongs to his half-brother Dionysus.",
		signs: [
			"Lyre",
			"Chorus",
			"A measured step"
		],
		note: "Song under this title is architecture.",
		aura: "gold"
	},
	{
		id: "loxias",
		name: "Loxias",
		god: "apollo",
		line: "Far-shooter",
		stage: 3,
		meaning: "The oblique",
		description: "Delphi's god. The answer is true and slanted, and the mortal who treats it as plain speech writes the tragedy himself.",
		signs: [
			"Tripod",
			"Laurel fumes",
			"A sentence with two doors"
		],
		note: "If the oracle seems clear, read it again.",
		aura: "gold"
	},
	{
		id: "plouton",
		name: "Plouton",
		god: "hades",
		line: "Unseen host",
		stage: 1,
		meaning: "The wealthy one",
		description: "A name you could say aloud. Wealth — grain from under the soil, metals, the dead who are also a hoard — made him approachable in cult.",
		signs: [
			"Cornucopia",
			"Dark soil",
			"A polite euphemism"
		],
		note: "People prayed to Plouton. They avoided saying Hades over dinner.",
		aura: "ember"
	},
	{
		id: "aidoneus",
		name: "Aidoneus",
		god: "hades",
		line: "Unseen host",
		stage: 2,
		meaning: "The unseen",
		description: "The epic name. Helmet of darkness, gate, dog, the king who does not visit the bright court because his absence is the job.",
		signs: [
			"Helm",
			"Cypress",
			"A closed gate"
		],
		note: "He is not the enemy of Zeus. He is the third of the lot.",
		aura: "ember"
	},
	{
		id: "urania",
		name: "Urania",
		god: "aphrodite",
		line: "Foam-born",
		stage: 1,
		meaning: "Heavenly",
		description: "Love as a cosmic ordering, born of the older violence in the sea. Philosophers later flattered this title. The cult was older than the flattery.",
		signs: [
			"Sea-foam",
			"A high altar",
			"Myrrh"
		],
		note: "Heavenly does not mean harmless.",
		aura: "wine"
	},
	{
		id: "pandemos",
		name: "Pandemos",
		god: "aphrodite",
		line: "Foam-born",
		stage: 2,
		meaning: "Of all the people",
		description: "Love as the city's common life — marriage, desire, the pull that does not check a guest list. Pausanias and others split her in two. Practice was messier.",
		signs: [
			"The whole market",
			"Rose",
			"A festival in the streets"
		],
		note: "The apple rolled into a wedding is Pandemos with a knife in it.",
		aura: "wine"
	},
	{
		id: "psychopompos",
		name: "Psychopompos",
		god: "hermes",
		line: "Guide",
		stage: 1,
		meaning: "Escort of souls",
		description: "He takes the dead by the hand and does not dramatize it. The same god who cheats Apollo at dawn does this work at the end without joking.",
		signs: [
			"A quiet road",
			"The caduceus lowered",
			"No looking back required of him"
		],
		note: "Orpheus had to sing. Hermes only has to walk.",
		aura: "gold"
	},
	{
		id: "argeiphontes",
		name: "Argeiphontes",
		god: "hermes",
		line: "Guide",
		stage: 2,
		meaning: "Slayer of Argus",
		description: "Hera set the many-eyed watchman on Io. Hermes talked him to sleep, or bored him there, and closed the eyes. The epithet never lets him forget the murder that was also a message delivered.",
		signs: [
			"A staff",
			"A story told too well",
			"Eyes finally shut"
		],
		note: "Charm, in this title, is a weapon with a clean handle.",
		aura: "gold"
	},
	{
		id: "bromios",
		name: "Bromios",
		god: "dionysus",
		line: "Twice-born",
		stage: 1,
		meaning: "The roarer",
		description: "The noise of the rite — drums, cries, the mountain at night. He is not asking the city for a quiet cult image.",
		signs: [
			"Drum",
			"Ivy",
			"A shout that organizes itself into a chorus"
		],
		note: "Theatre will later put a stage under this sound so the city can stand it.",
		aura: "wine"
	},
	{
		id: "eleutherios",
		name: "Eleutherios",
		god: "dionysus",
		line: "Twice-born",
		stage: 2,
		meaning: "The liberator",
		description: "Wine and the mask as a release from the role you wear in daylight. Liberation, in his stories, is not always survivable for the person who refuses it.",
		signs: [
			"A mask",
			"A cup",
			"An open gate"
		],
		note: "The kings who bar him are the cautionary tales, not the heroes.",
		aura: "wine"
	}
];
var epics = [
	{
		id: "theogony",
		title: "Theogony",
		year: "8th–7th century BCE",
		voice: "Hesiod",
		synopsis: "A catalogue of births that turns into a constitution. Chaos, Titans, the war, and the distribution of honors — including an unexpected hymn to Hecate.",
		gods: [
			"zeus",
			"hecate",
			"prometheus"
		],
		image: "/scenes/chaos.jpg",
		focus: "center",
		aura: "marble"
	},
	{
		id: "works",
		title: "Works and Days",
		year: "8th–7th century BCE",
		voice: "Hesiod",
		synopsis: "Farming advice wrapped around Prometheus, Pandora, and the five ages. The gods are a labor law.",
		gods: ["zeus", "prometheus"],
		image: "/scenes/earth.jpg",
		focus: "center",
		aura: "gold"
	},
	{
		id: "iliad",
		title: "Iliad",
		year: "8th century BCE",
		voice: "Homer",
		synopsis: "Not the whole war — a few weeks of wrath. Apollo's plague, Hera's politics, Achilles, and gods who bleed a golden ichor when they interfere.",
		gods: [
			"apollo",
			"hera",
			"athena",
			"aphrodite",
			"ares",
			"zeus"
		],
		image: "/scenes/war.jpg",
		focus: "center",
		aura: "wine"
	},
	{
		id: "odyssey-poem",
		title: "Odyssey",
		year: "8th century BCE",
		voice: "Homer",
		synopsis: "The war after the war. Poseidon's grievance, Athena's patronage, and a household testing the law of guests.",
		gods: [
			"athena",
			"poseidon",
			"hermes",
			"zeus"
		],
		image: "/scenes/sea.jpg",
		focus: "center",
		aura: "marble"
	},
	{
		id: "hymn-demeter",
		title: "Hymn to Demeter",
		year: "7th–6th century BCE",
		voice: "Homeric Hymns",
		synopsis: "The telling of Persephone that founded a mystery. A meadow, a famine, a pomegranate, and a secret the poem will not fully tell.",
		gods: [
			"demeter",
			"persephone",
			"hades",
			"hecate"
		],
		image: "/scenes/underworld.jpg",
		focus: "center",
		aura: "wine"
	},
	{
		id: "argonautica",
		title: "Argonautica",
		year: "3rd century BCE",
		voice: "Apollonius of Rhodes",
		synopsis: "A Hellenistic epic of the fleece: gods still sponsor, but the psychology belongs to Medea, and the wonder is already antique.",
		gods: [
			"hera",
			"athena",
			"aphrodite"
		],
		image: "/scenes/heroic.jpg",
		focus: "center",
		aura: "gold"
	},
	{
		id: "bibliotheca",
		title: "The Library",
		year: "1st–2nd century CE",
		voice: "Apollodorus, so-called",
		synopsis: "The plot-summary the myths deserved and the poets refused to write. Gods, heroes, and genealogies without the music.",
		gods: [
			"zeus",
			"athena",
			"hermes"
		],
		image: "/scenes/oracle.jpg",
		focus: "center",
		aura: "marble"
	},
	{
		id: "metamorphoses",
		title: "Metamorphoses",
		year: "8 CE",
		voice: "Ovid",
		synopsis: "A Roman poet retells the Greek stories as a single chain of changes. Brilliant, sleek, and not a Greek rite. Read it as a lens, not a liturgy.",
		gods: [
			"apollo",
			"dionysus",
			"persephone",
			"athena"
		],
		image: "/scenes/earth.jpg",
		focus: "right center",
		aura: "gold"
	}
];
var timeline = [
	{
		id: "gap",
		age: "Chaos",
		title: "The gap opens",
		when: "Before names",
		description: "Chaos, then Earth, Tartarus, Eros, and Night. Separation is the first event.",
		aura: "marble"
	},
	{
		id: "sickle",
		age: "Titanomachy",
		title: "The sickle",
		when: "The first overthrow",
		description: "Cronus separates sky from earth. The pattern of sons against fathers begins.",
		aura: "ember"
	},
	{
		id: "stone",
		age: "Titanomachy",
		title: "The stone in the cloth",
		when: "Zeus's infancy",
		description: "Rhea saves the youngest. Cronus swallows a rock and calls himself safe.",
		aura: "gold"
	},
	{
		id: "lots",
		age: "Titanomachy",
		title: "Three lots",
		when: "After the war",
		description: "Sky, sea, and the dead are divided. Olympus becomes a capital, not the whole map.",
		aura: "gold"
	},
	{
		id: "fire",
		age: "Olympian reign",
		title: "Fire leaves heaven",
		when: "Mecone and after",
		description: "Prometheus cheats the portions and steals a coal. Mortality acquires a technology and a case file.",
		aura: "ember"
	},
	{
		id: "skull",
		age: "Olympian reign",
		title: "The armed birth",
		when: "The headache of Zeus",
		description: "Athena arrives in armor. Counsel is now a person in the room.",
		aura: "marble"
	},
	{
		id: "seeds",
		age: "Olympian reign",
		title: "Seeds of winter",
		when: "The hymn's year",
		description: "Persephone tastes the fruit of the house below. The fields learn a calendar.",
		aura: "wine"
	},
	{
		id: "thread",
		age: "Heroic age",
		title: "A thread in the maze",
		when: "Crete",
		description: "Ariadne solves the labyrinth. The hero's exit is not the end of her story.",
		aura: "gold"
	},
	{
		id: "apple",
		age: "Heroic age",
		title: "The apple and the ships",
		when: "Ten years",
		description: "A judgment among goddesses becomes a war among cities.",
		aura: "wine"
	},
	{
		id: "glance",
		age: "Heroic age",
		title: "The backward glance",
		when: "The threshold",
		description: "Orpheus is given an exception with one rule. He breaks it in sight of day.",
		aura: "ember"
	}
];
var constellations = [
	{
		id: "lyra",
		name: "Lyra",
		patron: "apollo",
		myth: "Hermes built a lyre from a tortoise shell before his first day ended, then gave it to Apollo to settle the theft of the cattle. The sky kept the instrument.",
		stars: [
			[18, 68],
			[36, 40],
			[58, 24],
			[78, 46],
			[52, 74]
		]
	},
	{
		id: "corona",
		name: "Corona",
		patron: "dionysus",
		myth: "Ariadne woke on Naxos without the hero. Dionysus set her wedding crown in the sky so the exit from the maze would have a witness.",
		stars: [
			[22, 48],
			[38, 30],
			[58, 26],
			[76, 42],
			[64, 66],
			[40, 70]
		]
	},
	{
		id: "delphinus",
		name: "Delphinus",
		patron: "poseidon",
		myth: "A dolphin carried a singer through Poseidon's water, or — in the other telling — persuaded the sea-nymph Amphitrite to take the throne. The shape is the favor, small and fast.",
		stars: [
			[24, 58],
			[42, 36],
			[62, 42],
			[74, 64],
			[48, 72]
		]
	},
	{
		id: "scorpius",
		name: "Scorpius",
		patron: "artemis",
		myth: "Orion boasted through the hunt until a scorpion was set against him. Artemis's boundary, in this star-myth, has a stinger and a season.",
		stars: [
			[20, 28],
			[36, 40],
			[52, 52],
			[66, 66],
			[80, 50]
		]
	},
	{
		id: "aquila",
		name: "Aquila",
		patron: "zeus",
		myth: "The eagle is Zeus's sudden will — the bird that carries what the sky has decided. Later poets give it errands. The shape in the dark is still a dive.",
		stars: [
			[50, 22],
			[32, 44],
			[68, 44],
			[50, 62],
			[36, 80]
		]
	}
];
var oracles = [
	"The guest is a god until the table is cleared.",
	"What you bury in spring answers you when the queen returns.",
	"A promise sworn by a river is heavier than bronze.",
	"The bright answer has two doors. You will pick the loud one.",
	"Fire remembers the hand that stole it.",
	"Do not look back until both of you are in the light.",
	"The hearth is the first altar, even when no one bows.",
	"A thread is a strategy. A sword is only a hope."
];
var ageMap = Object.fromEntries(ages.map((age) => [age.id, age]));
var mythMap = Object.fromEntries(myths.map((myth) => [myth.id, myth]));
var epithetMap = Object.fromEntries(epithets.map((epithet) => [epithet.id, epithet]));
var epicMap = Object.fromEntries(epics.map((epic) => [epic.id, epic]));
var epithetLines = [...new Set(epithets.map((epithet) => epithet.line))];
var kindLabel = {
	god: "God",
	myth: "Myth",
	epithet: "Epithet",
	epic: "Epic",
	age: "Age"
};
function searchLabel(kind) {
	return kindLabel[kind];
}
function hit(partial) {
	return {
		...partial,
		keywords: partial.keywords.toLowerCase()
	};
}
var searchIndex = [
	...gods.map((god) => hit({
		id: god.id,
		kind: "god",
		title: god.name,
		subtitle: god.office,
		keywords: [
			god.name,
			god.epithet,
			god.domain,
			god.realm,
			...god.aliases,
			...god.tags,
			god.line
		].join(" ")
	})),
	...myths.map((myth) => hit({
		id: myth.id,
		kind: "myth",
		title: myth.name,
		subtitle: myth.age,
		keywords: [
			myth.name,
			myth.age,
			myth.logline,
			...myth.mortals,
			...myth.beats
		].join(" ")
	})),
	...epithets.map((epithet) => hit({
		id: epithet.id,
		kind: "epithet",
		title: epithet.name,
		subtitle: epithet.meaning,
		keywords: [
			epithet.name,
			epithet.line,
			epithet.meaning,
			epithet.description,
			epithet.god
		].join(" ")
	})),
	...epics.map((epic) => hit({
		id: epic.id,
		kind: "epic",
		title: epic.title,
		subtitle: epic.voice,
		keywords: [
			epic.title,
			epic.voice,
			epic.synopsis,
			epic.year
		].join(" ")
	})),
	...ages.map((age) => hit({
		id: age.id,
		kind: "age",
		title: age.name,
		subtitle: age.years,
		keywords: [
			age.name,
			age.tag,
			age.summary,
			age.years
		].join(" ")
	}))
];
function searchArchive(query) {
	const needle = query.trim().toLowerCase();
	if (!needle) return searchIndex.slice(0, 8);
	return searchIndex.filter((item) => item.title.toLowerCase().includes(needle) || item.keywords.includes(needle)).slice(0, 14);
}
var APP_NAME = "Aether Codex";
var DISCLAIMER = "A living retelling for reading and play. Drawn from Homer, Hesiod, the hymns, and later mythographers — not a translation of any single text, and not a ranking the ancients agreed on.";
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display tracking-kicker text-gold uppercase",
					children: "Aether Codex"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-4 text-xs tracking-kicker text-muted uppercase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/gods",
							className: "min-h-11 inline-flex items-center hover:text-fg",
							children: "Gods"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/myths",
							className: "min-h-11 inline-flex items-center hover:text-fg",
							children: "Myths"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/compare",
							className: "min-h-11 inline-flex items-center hover:text-fg",
							children: "Measure"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "min-h-11 inline-flex items-center hover:text-fg",
							children: "About"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-3xl text-sm text-subtle",
				children: DISCLAIMER
			})]
		})
	});
}
function CodexMark({ className = "size-6" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "16",
			cy: "16",
			r: "12",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M17.2 6.5 12 16h4.6L14.2 25.5 22 14.2h-4.8z",
			fill: "currentColor"
		})]
	});
}
var links = [
	{
		to: "/gods",
		label: "Gods"
	},
	{
		to: "/ages",
		label: "Ages"
	},
	{
		to: "/myths",
		label: "Myths"
	},
	{
		to: "/epithets",
		label: "Epithets"
	},
	{
		to: "/epics",
		label: "Epics"
	},
	{
		to: "/timeline",
		label: "Time"
	},
	{
		to: "/compare",
		label: "Measure"
	}
];
function Navbar() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const setSearchOpen = useArchiveStore((state) => state.setSearchOpen);
	const sound = useArchiveStore((state) => state.sound);
	const toggleSound = useArchiveStore((state) => state.toggleSound);
	const [compact, setCompact] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setCompact(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-200", compact || open ? "border-border bg-bg/80 backdrop-blur-lg" : "border-transparent bg-transparent"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "scroll-seal absolute inset-x-0 bottom-0 h-px bg-primary",
				id: "scroll-seal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6", compact ? "h-14" : "h-16"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-h-11 items-center gap-2 text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodexMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm tracking-kicker text-fg uppercase sm:text-base",
							children: "Aether Codex"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "ml-4 hidden items-center gap-1 xl:flex",
						children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: cn("rounded-sm px-2.5 py-2 text-xs tracking-kicker uppercase transition-colors duration-150", pathname === link.to ? "text-primary" : "text-muted hover:text-fg"),
							children: link.label
						}, link.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": sound,
								"aria-label": sound ? "Mute the lyre" : "Enable the lyre",
								onClick: () => {
									toggleSound();
									if (!sound) playTone(494, .12, .04);
								},
								className: "inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg",
								children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/votive",
								"aria-label": "Votive shelf",
								className: cn("inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg", pathname === "/votive" && "text-primary"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Search the codex",
								onClick: () => setSearchOpen(true),
								className: "inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-11 items-center justify-center rounded-sm text-muted xl:hidden",
								"aria-label": open ? "Close menu" : "Open menu",
								"aria-expanded": open,
								onClick: () => setOpen((value) => !value),
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid transition-[grid-template-rows,opacity] duration-200 xl:hidden", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-col gap-1 border-t border-border bg-bg/95 px-4 py-3",
						children: [links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: cn("flex min-h-11 items-center rounded-sm px-3 text-sm tracking-kicker uppercase", pathname === link.to ? "text-primary" : "text-fg"),
							children: link.label
						}, link.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "flex min-h-11 items-center rounded-sm px-3 text-sm tracking-kicker text-fg uppercase",
							children: "About"
						})]
					})
				})
			})
		]
	});
}
function ScrollProgress() {
	(0, import_react.useEffect)(() => {
		const bar = document.getElementById("scroll-seal");
		if (!bar) return;
		const onScroll = () => {
			const height = document.documentElement.scrollHeight - window.innerHeight;
			const progress = height > 0 ? window.scrollY / height : 0;
			bar.style.setProperty("--p", String(progress));
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return null;
}
var icons = {
	bolt: Zap,
	crown: Crown,
	wave: Waves,
	wheat: Wheat,
	shield: Shield,
	sun: Sun,
	moon: Moon,
	swords: Swords,
	shell: Shell,
	hammer: Hammer,
	feather: Feather,
	grape: Grape,
	key: KeyRound,
	flower: Flower2,
	flame: Flame,
	crossroad: Signpost,
	wine: Wine
};
function EmblemMark({ name, className }) {
	const Icon = icons[name];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className,
		"aria-hidden": true
	});
}
function GodCard({ god, index = 0 }) {
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	const [tilt, setTilt] = (0, import_react.useState)({
		x: "0deg",
		y: "0deg"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "tilt-card stagger-in",
		style: {
			["--rx"]: tilt.x,
			["--ry"]: tilt.y,
			["--d"]: `${Math.min(index, 8) * 50}ms`
		},
		onPointerMove: (event) => {
			if (event.pointerType !== "mouse") return;
			const rect = event.currentTarget.getBoundingClientRect();
			const dx = (event.clientX - rect.left) / rect.width - .5;
			const dy = (event.clientY - rect.top) / rect.height - .5;
			setTilt({
				x: `${(-dy * 7).toFixed(2)}deg`,
				y: `${(dx * 8).toFixed(2)}deg`
			});
		},
		onPointerLeave: () => setTilt({
			x: "0deg",
			y: "0deg"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-md bg-surface shadow-border transition-shadow duration-200 hover:shadow-glow",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => openOverlay({
					type: "god",
					id: god.id
				}),
				className: "pressable group w-full text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-52 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: god.image,
							alt: "",
							className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
							style: { objectPosition: god.focus }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmblemMark, {
							name: god.emblem,
							className: "absolute bottom-3 left-4 size-7 text-gold"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tracking-kicker text-gold uppercase",
							children: [
								realmLabel[god.realm],
								" · ",
								god.office
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl leading-none text-fg",
							children: god.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-2 text-sm text-muted",
							children: god.line
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-3 right-3 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, {
					kind: "god",
					id: god.id,
					label: god.name
				})
			})]
		})
	});
}
function AgeCard({ age }) {
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => openOverlay({
			type: "age",
			id: age.id
		}),
		className: "pressable group relative min-h-64 overflow-hidden rounded-md text-left shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: age.image,
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
				style: { objectPosition: age.focus }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full min-h-64 flex-col justify-end p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tracking-kicker text-gold uppercase",
						children: [
							age.tag,
							" · ",
							age.years
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-3xl text-fg",
						children: age.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-sm text-sm text-fg/85",
						children: age.summary
					})
				]
			})
		]
	});
}
function MythCard({ myth }) {
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative overflow-hidden rounded-md bg-surface text-left shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => openOverlay({
				type: "myth",
				id: myth.id
			}),
			className: "pressable w-full text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-36 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: myth.image,
					alt: "",
					className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
					style: { objectPosition: myth.focus }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-surface to-transparent" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tracking-kicker text-gold uppercase",
						children: [
							myth.age,
							" · ",
							myth.span
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-2xl text-fg",
						children: myth.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-3 text-sm text-muted",
						children: myth.logline
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-3 right-3 z-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, {
				kind: "myth",
				id: myth.id,
				label: myth.name
			})
		})]
	});
}
function EpicCard({ epic }) {
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => openOverlay({
			type: "epic",
			id: epic.id
		}),
		className: "pressable group relative min-h-56 overflow-hidden rounded-md text-left shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: epic.image,
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
				style: { objectPosition: epic.focus }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/15" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-56 flex-col justify-end p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-kicker text-gold uppercase",
						children: epic.voice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl text-fg",
						children: epic.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-fg/75",
						children: epic.year
					})
				]
			})
		]
	});
}
function NameChips({ ids }) {
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	const known = ids.filter((id) => getGod(id));
	const rest = ids.filter((id) => !getGod(id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2",
		children: [known.map((id) => {
			const god = getGod(id);
			if (!god) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => openOverlay({
					type: "god",
					id
				}),
				className: "pressable min-h-11 rounded-full border border-border bg-elevated px-3 text-sm text-fg",
				children: god.name
			}, id);
		}), rest.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex min-h-11 items-center rounded-full border border-border px-3 text-sm text-muted",
			children: name
		}, name))]
	});
}
function SearchOverlay() {
	const open = useArchiveStore((state) => state.searchOpen);
	const query = useArchiveStore((state) => state.searchQuery);
	const setQuery = useArchiveStore((state) => state.setSearchQuery);
	const setOpen = useArchiveStore((state) => state.setSearchOpen);
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	const { render, shown } = usePresence(open);
	const hits = searchArchive(query);
	if (!render) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm transition-opacity duration-200", shown ? "opacity-100" : "opacity-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-[10vh] w-[min(640px,calc(100%-2rem))] rounded-md bg-surface shadow-glass",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search gods, myths, epithets, epics",
						className: "h-14 w-full bg-transparent text-base text-fg outline-none placeholder:text-subtle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close search",
						onClick: () => setOpen(false),
						className: "inline-flex size-11 items-center justify-center text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "max-h-[50vh] overflow-auto p-2",
				children: [hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-3 py-6 text-sm text-muted",
					children: "Nothing in the codex answers that."
				}) : null, hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openOverlay({
						type: hit.kind,
						id: hit.id
					}),
					className: "flex min-h-12 w-full items-center justify-between gap-3 rounded-sm px-3 text-left hover:bg-elevated",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm text-fg",
						children: hit.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: hit.subtitle
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs tracking-kicker text-gold uppercase",
						children: searchLabel(hit.kind)
					})]
				}) }, `${hit.kind}-${hit.id}`))]
			})]
		})
	});
}
function Dossier() {
	const overlay = useArchiveStore((state) => state.overlay);
	const close = useArchiveStore((state) => state.closeOverlay);
	const god = overlay?.type === "god" ? getGod(overlay.id) : void 0;
	const { render, shown } = usePresence(Boolean(god));
	const [epithetId, setEpithetId] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("file");
	(0, import_react.useEffect)(() => {
		setEpithetId(null);
		setTab("file");
	}, [god?.id]);
	if (!render || !god) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("fixed inset-0 z-50 transition-opacity duration-200", shown ? "opacity-100" : "opacity-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close dossier",
			className: "absolute inset-0 bg-bg/70 backdrop-blur-sm",
			onClick: close
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "dossier-title",
			className: cn("absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col bg-bg shadow-glass transition-transform duration-300", shown ? "translate-x-0" : "translate-x-8"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: "Dossier"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, {
						kind: "god",
						id: god.id,
						label: god.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close",
						onClick: close,
						className: "inline-flex size-11 items-center justify-center text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 gap-0 overflow-y-auto md:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 md:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-72 overflow-hidden rounded-md md:h-[420px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: god.image,
								alt: "",
								className: "h-full w-full object-cover",
								style: { objectPosition: god.focus }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/10" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmblemMark, {
								name: god.emblem,
								className: "absolute bottom-4 left-4 size-8 text-gold"
							})
						]
					}), god.epithetIds.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEpithetId(null),
							className: cn("min-h-10 rounded-full px-3 text-xs", !epithetId ? "bg-primary text-primary-fg" : "bg-surface text-muted"),
							children: "Office"
						}), god.epithetIds.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEpithetId(id),
							className: cn("min-h-10 rounded-full px-3 text-xs", epithetId === id ? "bg-primary text-primary-fg" : "bg-surface text-muted"),
							children: epithetMap[id]?.name ?? id
						}, id))]
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tracking-kicker text-muted uppercase",
							children: [
								realmLabel[god.realm],
								" · ",
								god.office
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "dossier-title",
							className: "font-display text-4xl text-fg",
							children: god.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-gold",
							children: epithetId ? epithetMap[epithetId]?.meaning : god.line
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex gap-2",
							children: [
								"file",
								"kin",
								"deeds"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTab(item),
								className: cn("min-h-11 rounded-sm px-3 text-xs tracking-kicker uppercase", tab === item ? "bg-elevated text-fg" : "text-muted"),
								children: item
							}, item))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel-in mt-4 space-y-4",
							children: [
								tab === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-fg/90",
										children: epithetId ? epithetMap[epithetId]?.description : god.story
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: epithetId ? epithetMap[epithetId]?.note : god.nature
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: STAT_KEYS.map(([key, label], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
											label,
											value: god.stats[key],
											delay: index * 40
										}, key))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-subtle",
										children: "Temple measures for the compare table. Not a ranking from any ancient text."
									})
								] }) : null,
								tab === "kin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-xs tracking-kicker text-gold uppercase",
										children: "Allies"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameChips, { ids: god.allies })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-xs tracking-kicker text-gold uppercase",
										children: "Rivals"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameChips, { ids: god.rivals })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1 text-sm text-muted",
										children: god.kin.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: person }, person))
									})
								] }) : null,
								tab === "deeds" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-fg/90",
										children: god.summary
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2 text-sm text-fg",
										children: god.deeds.map((deed) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: deed }, deed))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-subtle",
										children: [
											god.parentage,
											" · ",
											god.status,
											" · ",
											god.age
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: god.symbols.map((symbol) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full border border-border px-3 py-2 text-xs tracking-kicker text-muted uppercase",
											children: symbol
										}, symbol))
									})
								] }) : null
							]
						}, `${tab}-${epithetId ?? "base"}`)
					]
				})]
			})]
		})]
	});
}
function sheetOf(overlay) {
	if (!overlay || overlay.type === "god") return null;
	if (overlay.type === "myth") {
		const myth = mythMap[overlay.id];
		if (!myth) return null;
		return {
			kind: "myth",
			title: myth.name,
			kicker: `${myth.age} · ${myth.span}`,
			image: myth.image,
			focus: myth.focus,
			body: myth.story,
			extra: myth.beats.join(" "),
			chips: myth.gods
		};
	}
	if (overlay.type === "epic") {
		const epic = epicMap[overlay.id];
		if (!epic) return null;
		return {
			kind: "epic",
			title: epic.title,
			kicker: `${epic.voice} · ${epic.year}`,
			image: epic.image,
			focus: epic.focus,
			body: epic.synopsis,
			extra: "A telling, not the only telling.",
			chips: epic.gods
		};
	}
	if (overlay.type === "epithet") {
		const epithet = epithetMap[overlay.id];
		if (!epithet) return null;
		const god = getGod(epithet.god);
		return {
			kind: "epithet",
			title: epithet.name,
			kicker: `${god?.name ?? epithet.god} · ${epithet.meaning}`,
			image: god?.image ?? "/scenes/oracle.jpg",
			focus: god?.focus ?? "center",
			body: epithet.description,
			extra: epithet.note,
			chips: [epithet.god]
		};
	}
	const age = ageMap[overlay.id];
	if (!age) return null;
	return {
		kind: null,
		title: age.name,
		kicker: `${age.tag} · ${age.years}`,
		image: age.image,
		focus: age.focus,
		body: age.story,
		extra: age.summary,
		chips: age.gods
	};
}
function DetailSheet() {
	const overlay = useArchiveStore((state) => state.overlay);
	const close = useArchiveStore((state) => state.closeOverlay);
	const sheet = sheetOf(overlay);
	const { render, shown } = usePresence(Boolean(sheet));
	if (!render || !sheet || !overlay || overlay.type === "god") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("fixed inset-0 z-50 transition-opacity duration-200", shown ? "opacity-100" : "opacity-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			className: "absolute inset-0 bg-bg/70 backdrop-blur-sm",
			onClick: close
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "sheet-title",
			className: cn("absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-lg bg-bg shadow-glass transition-transform duration-300 sm:inset-y-0 sm:left-auto sm:w-full sm:max-w-xl sm:rounded-none", shown ? "translate-y-0 sm:translate-x-0" : "translate-y-6 sm:translate-x-8"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-48 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: sheet.image,
						alt: "",
						className: "h-full w-full object-cover",
						style: { objectPosition: sheet.focus }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-transparent" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 px-5 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-kicker text-gold uppercase",
						children: sheet.kicker
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "sheet-title",
						className: "mt-1 font-display text-4xl text-fg",
						children: sheet.title
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center",
						children: [sheet.kind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, {
							kind: sheet.kind,
							id: overlay.id,
							label: sheet.title
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Close",
							onClick: close,
							className: "inline-flex size-11 items-center justify-center text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 px-5 py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg/90",
							children: sheet.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: sheet.extra
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameChips, { ids: sheet.chips })
					]
				})
			]
		})]
	});
}
function CouncilModal() {
	const open = useArchiveStore((state) => state.councilOpen);
	const setOpen = useArchiveStore((state) => state.setCouncilOpen);
	const sound = useArchiveStore((state) => state.sound);
	const { render, shown } = usePresence(open);
	(0, import_react.useEffect)(() => {
		if (open && sound) playSummon();
	}, [open, sound]);
	if (!render) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-0 z-50 grid place-items-center bg-bg/75 px-4 backdrop-blur-sm transition-opacity duration-200", shown ? "opacity-100" : "opacity-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "council-title",
			className: "panel-in w-full max-w-lg rounded-md bg-surface p-6 shadow-glass",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: "The twelve"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "council-title",
					className: "mt-2 font-display text-4xl text-fg",
					children: "The council sits"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-fg/90",
					children: "Sky, sea, grain, craft, war, desire, the road, the vine, and the mind in armor. Hestia keeps the hearth off to the side, which is how a house survives a meeting like this. Nothing is settled. Everything is in the room."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(false),
					className: "pressable mt-6 inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-sm text-primary-fg",
					children: "Let them argue"
				})
			]
		})
	});
}
function AppShell() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const overlay = useArchiveStore((state) => state.overlay);
	const searchOpen = useArchiveStore((state) => state.searchOpen);
	const councilOpen = useArchiveStore((state) => state.councilOpen);
	const closeOverlay = useArchiveStore((state) => state.closeOverlay);
	const setSearchOpen = useArchiveStore((state) => state.setSearchOpen);
	const setCouncilOpen = useArchiveStore((state) => state.setCouncilOpen);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useArchiveStore.persist.rehydrate()).then(() => {
			useArchiveStore.setState({
				hydrated: true,
				councilOpen: false
			});
		});
	}, []);
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		const locked = Boolean(overlay) || searchOpen || councilOpen;
		document.body.style.overflow = locked ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [
		overlay,
		searchOpen,
		councilOpen
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
			if (event.key === "Escape") {
				if (searchOpen) setSearchOpen(false);
				else if (councilOpen) setCouncilOpen(false);
				else if (overlay) closeOverlay();
			}
			if (event.key === "/" && !typing) {
				event.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		overlay,
		searchOpen,
		councilOpen,
		closeOverlay,
		setSearchOpen,
		setCouncilOpen
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ink-grid min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollProgress, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "page-enter pt-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}, pathname),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchOverlay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dossier, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSheet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouncilModal, {})
		]
	});
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var styles_default = "/assets/styles-BIAJ6-v_.css";
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Aether Codex is a cinematic archive of the Greek gods — dossiers, myths, epithets, epics, and a council you can seat yourself."
			},
			{
				name: "theme-color",
				content: "#110e0b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Outfit:wght@400;500;600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$9 = () => import("./routes-N2W0inEG.mjs");
var Route$9 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./about-lWknix_c.mjs");
var Route$8 = createFileRoute("/about")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./ages-Y2rp9rQt.mjs");
var Route$7 = createFileRoute("/ages")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./compare-DQ9bEvoI.mjs");
var Route$6 = createFileRoute("/compare")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./epics-DjT0YgHR.mjs");
var Route$5 = createFileRoute("/epics")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./epithets-Pg6YC7ra.mjs");
var Route$4 = createFileRoute("/epithets")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./gods-sJaW4LWC.mjs");
var Route$3 = createFileRoute("/gods")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./myths-BArUEbiA.mjs");
var Route$2 = createFileRoute("/myths")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./timeline-Ddeh0Peu.mjs");
var Route$1 = createFileRoute("/timeline")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./votive-DRvznfpx.mjs");
var Route = createFileRoute("/votive")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$9.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	AboutRoute: Route$8.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$10
	}),
	AgesRoute: Route$7.update({
		id: "/ages",
		path: "/ages",
		getParentRoute: () => Route$10
	}),
	CompareRoute: Route$6.update({
		id: "/compare",
		path: "/compare",
		getParentRoute: () => Route$10
	}),
	EpicsRoute: Route$5.update({
		id: "/epics",
		path: "/epics",
		getParentRoute: () => Route$10
	}),
	EpithetsRoute: Route$4.update({
		id: "/epithets",
		path: "/epithets",
		getParentRoute: () => Route$10
	}),
	GodsRoute: Route$3.update({
		id: "/gods",
		path: "/gods",
		getParentRoute: () => Route$10
	}),
	MythsRoute: Route$2.update({
		id: "/myths",
		path: "/myths",
		getParentRoute: () => Route$10
	}),
	TimelineRoute: Route$1.update({
		id: "/timeline",
		path: "/timeline",
		getParentRoute: () => Route$10
	}),
	VotiveRoute: Route.update({
		id: "/votive",
		path: "/votive",
		getParentRoute: () => Route$10
	})
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { playSummon as A, FilterChip as C, TextLink as D, StatRow as E, useArchiveStore as M, cn as O, gods as S, SectionHeader as T, timeline as _, MythCard as a, featuredGods as b, DISCLAIMER as c, epics as d, epithetLines as f, realms as g, oracles as h, GodCard as i, playTone as j, playSeal as k, ages as l, myths as m, AgeCard as n, NameChips as o, epithets as p, EpicCard as r, EmblemMark as s, router_exports as t, constellations as u, STAT_KEYS as v, PageHero as w, getGod as x, THRONES as y };
