/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Umsatz", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		onInit: function () {
			this.getRouter().getRoute("Umsatz").attachMatched(this._onRoutePatternMatched, this);

			var dbUserModel = this.getGlobalModel("dbUserModel");
			this.setModel(dbUserModel, "dbUserModel");

			var umsatzModel = new sap.ui.model.json.JSONModel();
			this.setModel(umsatzModel, "umsatzModel");

			this._onRoutePatternMatched(null);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},

		onNavToDetailansicht: function () {
			this.getRouter().navTo("Detailansicht");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		// onBeforeRendering: function () {
		// },

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		//	onAfterRendering: function() {
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		//	onExit: function() {
		//	}
		, */

		getTableData: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var umsatzModel = this.getModel("umsatzModel");

			var params = {};
			params.mid = dbUserData.MID;

			umsatzModel.loadData("/MOB_UMSATZ", params);

			console.log("UmsatzModel:", umsatzModel); //nach oben packen:eslint-disable no-console, no-alert
		},

		detailFunc: function (oEvent) {

			var context = oEvent.getSource().getBindingContext("umsatzModel");
			var path = context.getPath();

			var umsatzModel = this.getModel("umsatzModel");
			var detailModel = this.getGlobalModel("detailModel");
			detailModel.setData(umsatzModel.getProperty(path));

			this.onNavToDetailansicht();
		}

	});
});