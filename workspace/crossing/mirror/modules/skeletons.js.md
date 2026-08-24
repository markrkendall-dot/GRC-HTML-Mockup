/* GRC modules/skeletons.js v1.3.0 2026-08-23 */
/* All five RCSA-tab capabilities are now built. This module survives only
   to keep the old skeleton routes alive as redirects, so links from
   earlier releases and demo scripts never break. */
(function () {
  "use strict";
  GRC.register({
    id: "skeletons", version: "1.3.0", tab: "RCSA",
    caps: {},
    routes: {
      "cap3": function (el, ctx) { ctx.go("inherent"); },
      "cap4": function (el, ctx) { ctx.go("controls"); },
      "cap5": function (el, ctx) { ctx.go("rcsa"); }
    }
  });
})();
