import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as useArchiveStore, p as epithets, w as PageHero, x as getGod } from "./router-il8cp1Nw.mjs";
import { i as EpithetLadder } from "./home-interactive-B8MqsxbR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/epithets-Pg6YC7ra.js
var import_jsx_runtime = require_jsx_runtime();
function EpithetsPage() {
	const openOverlay = useArchiveStore((state) => state.openOverlay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		kicker: "Names",
		title: "Epithets",
		subtitle: "A god addressed under another title is doing another job."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpithetLadder, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-12 divide-y divide-border border-y border-border",
			children: epithets.map((epithet) => {
				const god = getGod(epithet.god);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openOverlay({
						type: "epithet",
						id: epithet.id
					}),
					className: "pressable flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-2xl text-fg",
						children: epithet.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [
							god?.name,
							" · ",
							epithet.meaning
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs tracking-kicker text-gold uppercase",
						children: epithet.line
					})]
				}) }, epithet.id);
			})
		})]
	})] });
}
//#endregion
export { EpithetsPage as component };
