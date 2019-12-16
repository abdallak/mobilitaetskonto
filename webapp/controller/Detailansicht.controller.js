/* eslint-disable no-console, no-alert */
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Detailansicht", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Detailansicht
		 */
		onInit: function () {
			var detailModel = sap.ui.getCore().getModel("detailModel");
			console.log(detailModel);
			
			var datum = this.getView().byId("datumId");
			datum.setModel(detailModel, "detailModel");
			
			var betrag = this.getView().byId("betragId");
			betrag.setModel(detailModel, "detailModel");
			
			var art = this.getView().byId("artId");
			art.setModel(detailModel, "detailModel");
			
			var beschreibung = this.getView().byId("beschreibungId");
			beschreibung.setModel(detailModel, "detailModel");
			
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Detailansicht
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Detailansicht
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Detailansicht
		 */
		//	onExit: function() {
		//
		//	}

	});

});