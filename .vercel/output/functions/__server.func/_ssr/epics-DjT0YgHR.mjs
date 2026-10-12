import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as epics, r as EpicCard, w as PageHero } from "./router-il8cp1Nw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/epics-DjT0YgHR.js
var import_jsx_runtime = require_jsx_runtime();
function EpicsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		kicker: "Poems",
		title: "Epics",
		subtitle: "The texts that kept the gods in circulation. Ovid is filed as a Roman lens, not a Greek rite."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:grid-cols-4",
		children: epics.map((epic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpicCard, { epic }, epic.id))
	})] });
}
//#endregion
export { EpicsPage as component };
