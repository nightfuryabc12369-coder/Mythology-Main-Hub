import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as useArchiveStore, S as gods, d as epics, m as myths, p as epithets, w as PageHero } from "./router-il8cp1Nw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/votive-DRvznfpx.js
var import_jsx_runtime = require_jsx_runtime();
var groups = [
	{
		kind: "god",
		label: "Gods"
	},
	{
		kind: "myth",
		label: "Myths"
	},
	{
		kind: "epithet",
		label: "Epithets"
	},
	{
		kind: "epic",
		label: "Epics"
	}
];
function titleFor(kind, id) {
	if (kind === "god") return gods.find((god) => god.id === id)?.name ?? id;
	if (kind === "myth") return myths.find((myth) => myth.id === id)?.name ?? id;
	if (kind === "epithet") return epithets.find((epithet) => epithet.id === id)?.name ?? id;
	return epics.find((epic) => epic.id === id)?.title ?? id;
}
function VotivePage() {
	const hydrated = useArchiveStore((state) => state.hydrated);
	const favorites = useArchiveStore((state) => state.favorites);
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	const total = groups.reduce((sum, group) => sum + favorites[group.kind].length, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		kicker: "Saved",
		title: "Votive",
		subtitle: "Whatever you marked stays on this shelf, in this browser."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-10 sm:px-6",
		children: [
			!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Opening the shelf…"
			}) : null,
			hydrated && total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Nothing set aside yet. Mark a god, a myth, an epithet, or an epic."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-8",
				children: groups.map((group) => {
					const ids = favorites[group.kind];
					if (!hydrated || ids.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs tracking-kicker text-gold uppercase",
						children: group.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border border-y border-border",
						children: ids.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => openOverlay({
								type: group.kind,
								id
							}),
							className: "pressable flex min-h-14 w-full items-center text-left font-display text-2xl text-fg",
							children: titleFor(group.kind, id)
						}) }, id))
					})] }, group.kind);
				})
			})
		]
	})] });
}
//#endregion
export { VotivePage as component };
