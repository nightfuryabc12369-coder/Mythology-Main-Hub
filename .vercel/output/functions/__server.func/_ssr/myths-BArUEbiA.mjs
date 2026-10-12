import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as SectionHeader, a as MythCard, m as myths, w as PageHero } from "./router-il8cp1Nw.mjs";
import { a as FateLoom } from "./home-interactive-B8MqsxbR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/myths-BArUEbiA.js
var import_jsx_runtime = require_jsx_runtime();
function MythsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		kicker: "Myths",
		title: "Myths",
		subtitle: "Nine stories you can open, or walk one beat at a time."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				kicker: "Thread",
				title: "The fate loom",
				subtitle: "Pick a myth. Advance the beat. The room changes with the line."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FateLoom, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: myths.map((myth) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MythCard, { myth }, myth.id))
			})
		]
	})] });
}
//#endregion
export { MythsPage as component };
