import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as TextLink, M as useArchiveStore, T as SectionHeader, _ as timeline, a as MythCard, b as featuredGods, d as epics, i as GodCard, j as playTone, l as ages, m as myths, n as AgeCard, r as EpicCard } from "./router-il8cp1Nw.mjs";
import { a as FateLoom, c as OracleDrill, d as TimelineList, i as EpithetLadder, l as RealmDial, n as ConstellationMap, o as Libation, r as DrawLot, s as MoteField, t as CompareLab, u as ThroneRing } from "./home-interactive-B8MqsxbR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-N2W0inEG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const sound = useArchiveStore((state) => state.sound);
	const [shift, setShift] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [flash, setFlash] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative min-h-[calc(100svh-4rem)] overflow-hidden",
			onPointerMove: (event) => {
				if (event.pointerType !== "mouse") return;
				const rect = event.currentTarget.getBoundingClientRect();
				const dx = (event.clientX - rect.left) / rect.width - .5;
				const dy = (event.clientY - rect.top) / rect.height - .5;
				setShift({
					x: dx * -16,
					y: dy * -12
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-[-4%]",
					style: { transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/scenes/hero.jpg",
						alt: "Marble colonnade of Olympus above a storm-lit sea",
						className: "kenburns h-full w-full object-cover"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" }),
				flash > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "storm-flash pointer-events-none absolute inset-0 bg-fg" }, flash) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoteField, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-4 pt-16 pb-16 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stagger-in text-xs tracking-kicker text-gold uppercase",
							children: "Myth archive · The bright court"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "stagger-in mt-3 max-w-4xl font-display text-display text-fg uppercase",
							style: { ["--d"]: "90ms" },
							children: "Aether Codex"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stagger-in mt-4 max-w-xl text-base text-fg/85 sm:text-lg",
							style: { ["--d"]: "170ms" },
							children: "Gods, wars, and the stories that still move — told as a hall you can walk. Seat the twelve, pour a libation, and put two powers on the same measure."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stagger-in mt-8 flex flex-wrap gap-3",
							style: { ["--d"]: "250ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#thrones",
								className: "pressable inline-flex min-h-12 items-center rounded-sm bg-primary px-5 text-sm text-primary-fg",
								children: "Seat the twelve"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setFlash((value) => value + 1);
									if (sound) playTone(196, .18, .04);
								},
								className: "pressable inline-flex min-h-12 items-center rounded-sm border border-fg/30 bg-bg/40 px-5 text-sm text-fg backdrop-blur-sm",
								children: "Stir the storm"
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6",
			id: "ages",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "001 / Ages",
				title: "Four weathers of the same sky",
				subtitle: "From a gap with no name to the last generation that dined with gods.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
					to: "/ages",
					children: "All ages"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: ages.map((age) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgeCard, { age }, age.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "002 / Realms",
				title: "Pick a country of the gods",
				subtitle: "The dial changes the room without leaving the page."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RealmDial, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-20 sm:px-6",
			id: "gods",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "003 / Dossiers",
				title: "Figures of the court",
				subtitle: "Open a file for the story, the kin, and the temple measures.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
					to: "/gods",
					children: "Full pantheon"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: featuredGods.map((god, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodCard, {
					god,
					index
				}, god.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6",
			id: "thrones",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "004 / Council",
				title: "Seat the twelve",
				subtitle: "Hestia keeps the hearth. Dionysus takes the public chair. Fill the ring."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThroneRing, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-12 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "005 / Fate",
				title: "Walk a myth one beat at a time",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
					to: "/myths",
					children: "All myths"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FateLoom, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-20 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "006 / Myths",
				title: "Stories worth naming"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: myths.slice(0, 6).map((myth) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MythCard, { myth }, myth.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
			id: "epithets",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "007 / Epithets",
				title: "Climb a name",
				subtitle: "The same god, addressed differently, is a different power.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
					to: "/epithets",
					children: "Every epithet"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpithetLadder, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "008 / Sky",
				title: "Name a constellation",
				subtitle: "Tap a figure. The lines draw themselves."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConstellationMap, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 py-12 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-6 xl:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OracleDrill, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Libation, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawLot, {})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "009 / Epics",
				title: "The poems that kept them",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
					to: "/epics",
					children: "Epic shelf"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: epics.slice(0, 4).map((epic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpicCard, { epic }, epic.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-12 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "010 / Time",
				title: "The long order",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
					to: "/timeline",
					children: "Full timeline"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineList, { items: timeline.slice(0, 6) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl scroll-mt-20 px-4 py-20 pb-24 sm:px-6",
			id: "measure",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "011 / Measure",
				title: "Set two gods on one bar",
				subtitle: "Unofficial temple measures. Choosing the same name swaps them.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
					to: "/compare",
					children: "Full measure"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareLab, {})]
		})
	] });
}
//#endregion
export { Home as component };
