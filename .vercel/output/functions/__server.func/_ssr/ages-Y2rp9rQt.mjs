import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ages, n as AgeCard, w as PageHero } from "./router-il8cp1Nw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ages-Y2rp9rQt.js
var import_jsx_runtime = require_jsx_runtime();
function AgesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		kicker: "Ages",
		title: "Ages",
		subtitle: "The same cosmos, told as four weathers. Open any of them."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2",
		children: ages.map((age) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgeCard, { age }, age.id))
	})] });
}
//#endregion
export { AgesPage as component };
