import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as FilterChip, S as gods, i as GodCard, w as PageHero } from "./router-il8cp1Nw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gods-sJaW4LWC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var realms = [
	"all",
	"olympus",
	"sky",
	"sea",
	"earth",
	"underworld",
	"tartarus",
	"wild"
];
var tags = [
	"all",
	"olympian",
	"chthonic",
	"titan",
	"wild",
	"hearth"
];
var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function GodsPage() {
	const [letter, setLetter] = (0, import_react.useState)("all");
	const [realm, setRealm] = (0, import_react.useState)("all");
	const [tag, setTag] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const list = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return gods.filter((god) => {
			if (letter !== "all" && !god.name.toLowerCase().startsWith(letter.toLowerCase())) return false;
			if (realm !== "all" && god.realm !== realm) return false;
			if (tag !== "all" && !god.tags.includes(tag)) return false;
			if (!needle) return true;
			return god.name.toLowerCase().includes(needle) || god.aliases.some((alias) => alias.toLowerCase().includes(needle)) || god.domain.toLowerCase().includes(needle);
		});
	}, [
		letter,
		realm,
		tag,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		kicker: "Pantheon",
		title: "Gods",
		subtitle: "Filter by letter, realm, or the role the poets would not let them leave."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "Name, title, or domain",
				className: "h-12 w-full rounded-sm border border-border bg-surface px-4 text-sm text-fg outline-none placeholder:text-subtle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-1 overflow-x-auto pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					on: letter === "all",
					onClick: () => setLetter("all"),
					children: "All"
				}), letters.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					on: letter === item,
					onClick: () => setLetter(item),
					children: item
				}, item))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: realms.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					on: realm === item,
					onClick: () => setRealm(item),
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: tags.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					on: tag === item,
					onClick: () => setTag(item),
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-xs tracking-kicker text-muted uppercase",
				children: [list.length, " dossiers"]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "No god under that seal. Clear a filter."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: list.map((god, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodCard, {
					god,
					index
				}, god.id))
			})
		]
	})] });
}
//#endregion
export { GodsPage as component };
