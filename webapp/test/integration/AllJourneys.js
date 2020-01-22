sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./StartpageJourney"
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		viewNamespace: "Mobilitaetskonto.Mobilitaetskonto.view.",
		autoWait: true
	});
});