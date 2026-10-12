import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as playSummon, E as StatRow, M as useArchiveStore, O as cn, S as gods, f as epithetLines, g as realms, h as oracles, j as playTone, k as playSeal, m as myths, o as NameChips, p as epithets, s as EmblemMark, u as constellations, v as STAT_KEYS, x as getGod, y as THRONES } from "./router-il8cp1Nw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-interactive-B8MqsxbR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MoteField() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		"aria-hidden": true,
		children: Array.from({ length: 18 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mote",
			style: {
				["--i"]: String(index),
				left: `${index * 53 % 100}%`
			}
		}, index))
	});
}
function RealmDial() {
	const [active, setActive] = (0, import_react.useState)(realms[0]?.id ?? "olympus");
	const realm = realms.find((item) => item.id === active) ?? realms[0];
	if (!realm) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[280px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1",
			children: realms.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-pressed": item.id === active,
				onClick: () => setActive(item.id),
				className: cn("pressable min-h-11 rounded-sm border px-3 py-3 text-left transition-colors duration-200", item.id === active ? "border-primary bg-elevated text-fg" : "border-border bg-surface text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs tracking-kicker uppercase",
					children: item.epithet
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl text-fg",
					children: item.name
				})]
			}, item.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel-in relative min-h-80 overflow-hidden rounded-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: realm.image,
					alt: "",
					className: "absolute inset-0 h-full w-full object-cover",
					style: { objectPosition: realm.focus }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex min-h-80 max-w-lg flex-col justify-end p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-kicker text-gold uppercase",
							children: realm.keeper
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-display text-4xl text-fg",
							children: realm.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-fg/90",
							children: realm.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameChips, { ids: realm.gods })
						})
					]
				})
			]
		}, realm.id)]
	});
}
var THRONE_SPOTS = [
	["50%", "8%"],
	["71%", "13.63%"],
	["86.37%", "29%"],
	["92%", "50%"],
	["86.37%", "71%"],
	["71%", "86.37%"],
	["50%", "92%"],
	["29%", "86.37%"],
	["13.63%", "71%"],
	["8%", "50%"],
	["13.63%", "29%"],
	["29%", "13.63%"]
];
function ThroneRing() {
	const seated = useArchiveStore((state) => state.seated);
	const toggleSeat = useArchiveStore((state) => state.toggleSeat);
	const resetSeats = useArchiveStore((state) => state.resetSeats);
	const sound = useArchiveStore((state) => state.sound);
	const [focus, setFocus] = (0, import_react.useState)(THRONES[0]);
	const god = getGod(focus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-center gap-8 lg:grid-cols-[minmax(0,440px)_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto aspect-square w-full max-w-[440px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-[18%] grid place-items-center rounded-full border border-border bg-bg-deep text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-5xl text-gold",
					children: seated.length
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-kicker text-muted uppercase",
					children: "of 12 seated"
				})]
			}), THRONES.map((id, index) => {
				const figure = getGod(id);
				const spot = THRONE_SPOTS[index];
				if (!figure || !spot) return null;
				const on = seated.includes(id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": on,
					"aria-label": `${on ? "Unseat" : "Seat"} ${figure.name}`,
					onClick: () => {
						setFocus(id);
						if (sound) playTone(280 + index * 24, .1, .035);
						toggleSeat(id);
					},
					style: {
						left: spot[0],
						top: spot[1]
					},
					className: cn("pressable absolute grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border sm:size-14", on ? "border-primary bg-primary text-primary-fg shadow-glow" : "border-border bg-surface text-gold"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmblemMark, {
						name: figure.emblem,
						className: "size-5"
					})
				}, id);
			})]
		}), god ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel-in",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: god.epithet
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-display text-4xl text-fg",
					children: god.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: god.office
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-base text-fg/90",
					children: god.line
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-subtle",
					children: "Seat all twelve and the council convenes. Tap a sign to give or take a throne."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: resetSeats,
					className: "pressable mt-4 inline-flex min-h-11 items-center text-xs tracking-kicker text-muted uppercase",
					children: "Clear the hall"
				})
			]
		}, god.id) : null]
	});
}
var SEALS = [
	{
		id: "bolt",
		label: "Bolt"
	},
	{
		id: "tide",
		label: "Tide"
	},
	{
		id: "owl",
		label: "Owl"
	},
	{
		id: "lyre",
		label: "Lyre"
	},
	{
		id: "spear",
		label: "Spear"
	},
	{
		id: "rose",
		label: "Rose"
	}
];
function OracleDrill() {
	const sound = useArchiveStore((state) => state.sound);
	const best = useArchiveStore((state) => state.oracleBest);
	const setBest = useArchiveStore((state) => state.setOracleBest);
	const [sequence, setSequence] = (0, import_react.useState)([]);
	const [step, setStep] = (0, import_react.useState)(0);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [flash, setFlash] = (0, import_react.useState)(null);
	const [shake, setShake] = (0, import_react.useState)(false);
	const start = (length = 3) => {
		const next = Array.from({ length }, () => SEALS[Math.floor(Math.random() * SEALS.length)].id);
		setSequence(next);
		setStep(0);
		setPhase("show");
	};
	(0, import_react.useEffect)(() => {
		if (phase !== "show") return;
		let index = 0;
		const timer = window.setInterval(() => {
			const id = sequence[index];
			setFlash(id ?? null);
			if (sound && id) playTone(340 + index * 36, .08, .03);
			window.setTimeout(() => setFlash(null), 280);
			index += 1;
			if (index > sequence.length) {
				window.clearInterval(timer);
				setPhase("input");
				setStep(0);
			}
		}, 520);
		return () => window.clearInterval(timer);
	}, [
		phase,
		sequence,
		sound
	]);
	const press = (id) => {
		if (phase !== "input") return;
		if (sound) playSeal();
		if (sequence[step] !== id) {
			setPhase("fail");
			setShake(true);
			window.setTimeout(() => setShake(false), 420);
			return;
		}
		const nextStep = step + 1;
		if (nextStep >= sequence.length) {
			const score = sequence.length;
			setBest(score);
			if (sound) playSummon();
			if (score >= 6) {
				setPhase("win");
				return;
			}
			window.setTimeout(() => start(score + 1), 480);
			setPhase("idle");
			return;
		}
		setStep(nextStep);
	};
	const status = phase === "idle" ? "Watch the signs, then repeat them." : phase === "show" ? "The oracle is speaking. Do not answer yet." : phase === "input" ? `Your turn · ${step} / ${sequence.length}` : phase === "win" ? "Six signs. Delphi goes quiet, which is a kind of praise." : "The sequence broke. Reset and listen again.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-md bg-surface p-5 shadow-border sm:p-6", shake && "shake"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: "Oracle drill"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-3xl",
					children: "Repeat the signs"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-right text-xs tracking-kicker text-muted uppercase",
					children: ["Best ", best]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 min-h-6 text-sm text-muted",
				children: status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-3 gap-2",
				children: SEALS.map((seal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => press(seal.id),
					className: cn("pressable min-h-14 rounded-sm border text-sm tracking-kicker uppercase transition-colors duration-150", flash === seal.id ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg text-fg"),
					children: seal.label
				}, seal.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => start(3),
				className: "pressable mt-4 inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-sm text-primary-fg",
				children: phase === "idle" ? "Begin the oracle" : "Reset the oracle"
			})
		]
	});
}
function Libation() {
	const sound = useArchiveStore((state) => state.sound);
	const [level, setLevel] = (0, import_react.useState)(0);
	const [line, setLine] = (0, import_react.useState)(null);
	const holding = (0, import_react.useRef)(false);
	const levelRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => {
			if (!holding.current) return;
			levelRef.current = Math.min(100, levelRef.current + 2.4);
			setLevel(levelRef.current);
			if (levelRef.current >= 100) {
				holding.current = false;
				const next = oracles[Math.floor(Math.random() * oracles.length)] ?? oracles[0];
				setLine(next ?? null);
				if (sound) playSummon();
				window.setTimeout(() => {
					levelRef.current = 0;
					setLevel(0);
				}, 700);
			}
		}, 40);
		return () => window.clearInterval(timer);
	}, [sound]);
	const pour = (on) => {
		holding.current = on;
		if (on) setLine(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface p-5 shadow-border sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-kicker text-gold uppercase",
				children: "Libation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-3xl",
				children: "Hold to pour"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Fill the krater and the codex answers with a line. Release early and nothing is promised."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-end gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-48 w-24 overflow-hidden rounded-b-full border border-border bg-bg-deep",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-x-0 bottom-0 bg-wine transition-[height] duration-75",
						style: { height: `${level}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-24 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tracking-kicker text-muted uppercase",
						children: [Math.round(level), " / 100"]
					}), line ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "panel-in mt-3 font-display text-2xl text-fg",
						children: line
					}, line) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-subtle",
						children: "The cup is waiting."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onPointerDown: () => pour(true),
				onPointerUp: () => pour(false),
				onPointerLeave: () => pour(false),
				onPointerCancel: () => pour(false),
				className: "pressable mt-6 inline-flex min-h-12 items-center rounded-sm border border-primary px-5 text-sm text-gold",
				children: "Pour"
			})
		]
	});
}
function EpithetLadder() {
	const [line, setLine] = (0, import_react.useState)(epithetLines[0] ?? "Sky father");
	const rungs = epithets.filter((epithet) => epithet.line === line).sort((a, b) => a.stage - b.stage);
	const [stage, setStage] = (0, import_react.useState)(rungs[0]?.id ?? "");
	const current = rungs.find((epithet) => epithet.id === stage) ?? rungs[0];
	const god = current ? getGod(current.god) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[240px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 overflow-x-auto lg:flex-col",
			children: epithetLines.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": item === line,
				onClick: () => {
					setLine(item);
					const first = epithets.find((epithet) => epithet.line === item);
					setStage(first?.id ?? "");
				},
				className: cn("pressable min-h-11 shrink-0 rounded-sm border px-3 text-left text-sm", item === line ? "border-primary bg-elevated text-fg" : "border-border bg-surface text-muted"),
				children: item
			}, item))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: rungs.map((rung) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-pressed": rung.id === current?.id,
				onClick: () => setStage(rung.id),
				className: cn("pressable min-h-11 rounded-full px-4 text-sm", rung.id === current?.id ? "bg-primary text-primary-fg" : "bg-surface text-muted"),
				children: [
					rung.stage,
					". ",
					rung.name
				]
			}, rung.id))
		}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel-in mt-5 rounded-md bg-surface p-5 shadow-border sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: [
						god?.name,
						" · ",
						current.meaning
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-display text-4xl text-fg",
					children: current.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-base text-fg/90",
					children: current.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: current.note
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: current.signs.map((sign) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-border px-3 py-2 text-xs tracking-kicker text-muted uppercase",
						children: sign
					}, sign))
				})
			]
		}, current.id) : null] })]
	});
}
function ConstellationMap() {
	const [active, setActive] = (0, import_react.useState)(constellations[0]?.id ?? "lyra");
	const sky = constellations.find((item) => item.id === active) ?? constellations[0];
	const patron = sky ? getGod(sky.patron) : void 0;
	if (!sky) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative min-h-80 overflow-hidden rounded-md border border-border bg-bg-deep",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/scenes/hero.jpg",
					alt: "",
					className: "absolute inset-0 h-full w-full object-cover opacity-30"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 100 100",
					className: "absolute inset-0 h-full w-full",
					"aria-hidden": true,
					children: sky.stars.slice(1).map((star, index) => {
						const prev = sky.stars[index];
						if (!prev) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: prev[0],
							y1: prev[1],
							x2: star[0],
							y2: star[1],
							className: "constellation-line",
							stroke: "var(--color-gold)",
							strokeWidth: "0.6"
						}, `${sky.id}-${index}`);
					})
				}),
				sky.stars.map((star, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-glow",
					style: {
						left: `${star[0]}%`,
						top: `${star[1]}%`
					}
				}, `${sky.id}-star-${index}`)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-3 bottom-3 flex flex-wrap gap-2",
					children: constellations.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": item.id === sky.id,
						onClick: () => setActive(item.id),
						className: cn("pressable min-h-11 rounded-full px-3 text-xs tracking-kicker uppercase", item.id === sky.id ? "bg-primary text-primary-fg" : "bg-bg/70 text-fg"),
						children: item.name
					}, item.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel-in flex flex-col justify-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: patron ? `Claimed by ${patron.name}` : "Unclaimed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-display text-4xl text-fg",
					children: sky.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-base text-fg/90",
					children: sky.myth
				})
			]
		}, sky.id)]
	});
}
function FateLoom() {
	const [id, setId] = (0, import_react.useState)(myths[3]?.id ?? myths[0]?.id ?? "");
	const [step, setStep] = (0, import_react.useState)(0);
	const myth = myths.find((item) => item.id === id) ?? myths[0];
	if (!myth) return null;
	const beat = myth.beats[step] ?? myth.beats[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 overflow-x-auto pb-2",
			children: myths.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": item.id === myth.id,
				onClick: () => {
					setId(item.id);
					setStep(0);
				},
				className: cn("pressable min-h-11 shrink-0 rounded-full px-3 text-xs tracking-kicker uppercase", item.id === myth.id ? "bg-primary text-primary-fg" : "bg-surface text-muted"),
				children: item.name
			}, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 rounded-md bg-surface p-5 shadow-border sm:p-6 lg:grid-cols-[1fr_auto]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: [
						"Beat ",
						step + 1,
						" / ",
						myth.beats.length
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-3xl text-fg",
					children: beat
				})]
			}, `${myth.id}-${step}`), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStep((value) => Math.max(0, value - 1)),
					className: "pressable inline-flex min-h-11 items-center rounded-sm border border-border px-4 text-sm text-fg",
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStep((value) => Math.min(myth.beats.length - 1, value + 1)),
					className: "pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-sm text-primary-fg",
					children: "Next beat"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex gap-1",
			children: myth.beats.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Beat ${index + 1}`,
				onClick: () => setStep(index),
				className: cn("h-2 flex-1 rounded-full", index <= step ? "bg-primary" : "bg-elevated")
			}, item))
		})
	] });
}
var LOTS = [
	{
		prompt: "Where do you stand when the weather turns?",
		options: [
			{
				label: "On the high ridge",
				weights: {
					zeus: 2,
					apollo: 1
				}
			},
			{
				label: "In the surf",
				weights: {
					poseidon: 2,
					aphrodite: 1
				}
			},
			{
				label: "At a threshold",
				weights: {
					hecate: 2,
					hermes: 1
				}
			},
			{
				label: "By the fire",
				weights: {
					hestia: 2,
					hephaestus: 1
				}
			}
		]
	},
	{
		prompt: "What do you refuse to surrender?",
		options: [
			{
				label: "A guest",
				weights: {
					zeus: 2,
					hera: 1
				}
			},
			{
				label: "A secret",
				weights: {
					hades: 2,
					persephone: 1
				}
			},
			{
				label: "The hunt",
				weights: {
					artemis: 2,
					apollo: 1
				}
			},
			{
				label: "A making",
				weights: {
					hephaestus: 2,
					athena: 2
				}
			}
		]
	},
	{
		prompt: "What do you trust when the room goes quiet?",
		options: [
			{
				label: "An oath",
				weights: {
					hera: 2,
					zeus: 1
				}
			},
			{
				label: "A song",
				weights: {
					apollo: 2,
					dionysus: 1
				}
			},
			{
				label: "A thread",
				weights: {
					athena: 2,
					hermes: 1
				}
			},
			{
				label: "The dark",
				weights: {
					hades: 1,
					persephone: 2
				}
			}
		]
	}
];
function DrawLot() {
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const step = answers.length;
	const done = step >= LOTS.length;
	const winner = (0, import_react.useMemo)(() => {
		if (!done) return void 0;
		const scores = {};
		answers.forEach((choice, index) => {
			const option = LOTS[index]?.options[choice];
			if (!option) return;
			Object.entries(option.weights).forEach(([id, weight]) => {
				scores[id] = (scores[id] ?? 0) + weight;
			});
		});
		const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
		return best ? getGod(best[0]) : void 0;
	}, [answers, done]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface p-5 shadow-border sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-kicker text-gold uppercase",
				children: "The lot"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-3xl",
				children: done ? "The lot falls" : `Question ${step + 1}`
			}),
			!done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-in mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base text-fg",
					children: LOTS[step]?.prompt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-2",
					children: LOTS[step]?.options.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setAnswers((current) => [...current, index]),
						className: "pressable min-h-12 rounded-sm border border-border bg-bg px-3 text-left text-sm text-fg",
						children: option.label
					}, option.label))
				})]
			}, step) : winner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-in mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-kicker text-gold uppercase",
						children: winner.epithet
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-4xl text-fg",
						children: winner.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm text-muted",
						children: winner.line
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => openOverlay({
								type: "god",
								id: winner.id
							}),
							className: "pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-sm text-primary-fg",
							children: "Open the dossier"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAnswers([]),
							className: "pressable inline-flex min-h-11 items-center px-3 text-sm text-muted",
							children: "Draw again"
						})]
					})
				]
			}) : null
		]
	});
}
function CompareLab() {
	const leftId = useArchiveStore((state) => state.compareLeft);
	const rightId = useArchiveStore((state) => state.compareRight);
	const setCompare = useArchiveStore((state) => state.setCompare);
	const left = getGod(leftId) ?? gods[0];
	const right = getGod(rightId) ?? gods[1];
	if (!left || !right) return null;
	const leads = STAT_KEYS.reduce((count, [key]) => count + (left.stats[key] === right.stats[key] ? 0 : left.stats[key] > right.stats[key] ? 1 : 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface p-4 shadow-border sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodSelect, {
					label: "Left",
					value: left.id,
					onChange: (id) => setCompare("left", id)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodSelect, {
					label: "Right",
					value: right.id,
					onChange: (id) => setCompare("right", id)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					left.name,
					" leads in ",
					leads,
					" of ",
					STAT_KEYS.length,
					". These bars are temple measures for play, not a canon."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 font-display text-2xl",
					children: left.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: STAT_KEYS.map(([key, label], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label,
						value: left.stats[key],
						delay: index * 40
					}, key))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 font-display text-2xl",
					children: right.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: STAT_KEYS.map(([key, label], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label,
						value: right.stats[key],
						delay: index * 40,
						bar: "var(--color-wine)"
					}, key))
				})] })]
			}, `${left.id}-${right.id}`)
		]
	});
}
function GodSelect({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-xs tracking-kicker text-muted uppercase",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (event) => onChange(event.target.value),
			className: "mt-2 h-12 w-full rounded-sm border border-border bg-bg px-3 text-base text-fg normal-case",
			children: gods.map((god) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: god.id,
				children: god.name
			}, god.id))
		})]
	});
}
function TimelineList({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "relative space-y-6 border-l border-border pl-6",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 -left-[1.7rem] size-2.5 rounded-full bg-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tracking-kicker text-gold uppercase",
					children: [
						item.age,
						" · ",
						item.when
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-2xl text-fg",
					children: item.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: item.description
				})
			]
		}, item.id))
	});
}
//#endregion
export { FateLoom as a, OracleDrill as c, TimelineList as d, EpithetLadder as i, RealmDial as l, ConstellationMap as n, Libation as o, DrawLot as r, MoteField as s, CompareLab as t, ThroneRing as u };
