sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";

<<<<<<< HEAD
	return Opa5.extend("mobilitaetskonto.mobilitaetskonto.test.integration.arrangements.Startup", {

		iStartMyApp: function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			// start the app with a minimal delay to make tests fast but still async to discover basic timing issues
			oOptions.delay = oOptions.delay || 50;

			// start the app UI component
			this.iStartMyUIComponent({
				componentConfig: {
					name: "mobilitaetskonto.mobilitaetskonto",
=======
<<<<<<< HEAD
	return Opa5.extend("mobilitaetskonto.mobilitaetskonto.test.integration.arrangements.Startup", {

		iStartMyApp: function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			// start the app with a minimal delay to make tests fast but still async to discover basic timing issues
			oOptions.delay = oOptions.delay || 50;

			// start the app UI component
			this.iStartMyUIComponent({
				componentConfig: {
					name: "mobilitaetskonto.mobilitaetskonto",
=======
	return Opa5.extend("Mobilitaetskonto.Mobilitaetskonto.test.integration.arrangements.Startup", {

		iStartMyApp: function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			// start the app with a minimal delay to make tests fast but still async to discover basic timing issues
			oOptions.delay = oOptions.delay || 50;

			// start the app UI component
			this.iStartMyUIComponent({
				componentConfig: {
					name: "Mobilitaetskonto.Mobilitaetskonto",
>>>>>>> refs/heads/master
>>>>>>> refs/heads/master
					async: true
				},
				hash: oOptions.hash,
				autoWait: oOptions.autoWait
			});
		}
	});
});