import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as timeline, w as PageHero } from "./router-il8cp1Nw.mjs";
import { d as TimelineList } from "./home-interactive-B8MqsxbR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timeline-Ddeh0Peu.js
var import_jsx_runtime = require_jsx_runtime();
function TimelinePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		kicker: "Order",
		title: "Time",
		subtitle: "Not a history with dates. A mythic sequence, from the gap to the backward glance."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-10 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineList, { items: timeline })
	})] });
}
//#endregion
export { TimelinePage as component };
