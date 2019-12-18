/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Antrag", {

		// FIXME wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen

		onInit: function () {
			this.getRouter().getRoute("Antrag").attachMatched(this._onRoutePatternMatched, this);

			var dbUserModel = this.getGlobalModel("dbUserModel").getData();

			var defaultAntrag = {};
			defaultAntrag.MID = dbUserModel.MID;
			defaultAntrag.art = "auszahlung";
			defaultAntrag.betrag = null;
			defaultAntrag.beschreibung = null;

			var oAntragModel = new sap.ui.model.json.JSONModel(defaultAntrag);
			this.setModel(oAntragModel, "oAntragModel");
		},

		_onRoutePatternMatched: function (oEvent) {
			var dbUserModel = this.getGlobalModel("dbUserModel").getData();

			var defaultAntrag = {};
			defaultAntrag.MID = dbUserModel.MID;
			defaultAntrag.art = "auszahlung";
			defaultAntrag.betrag = null;
			defaultAntrag.beschreibung = null;

			var oAntragModel = new sap.ui.model.json.JSONModel(defaultAntrag);
			this.setModel(oAntragModel, "oAntragModel");
		},

		antragStellen: function (oEvent) {
			var oAntragModel = this.getModel("oAntragModel");
			var oAntragData = oAntragModel.getData();
			console.log("oAntragModel " + oAntragData);

			if (oAntragData.betrag === null) {
				sap.m.MessageToast.show("Bitte Betrag eingeben!");
				return;
			}

			var oAntragResponseModel = new sap.ui.model.json.JSONModel();
			oAntragResponseModel.loadData("/MOB_ANTRAG", oAntragData);

			var that = this;
			oAntragResponseModel.attachRequestCompleted(function (oEvent1) {
				that.getRouter().navTo("Umsatz");
			});
		},

		onBetragChanged: function (oEvent) {
			var oResourceBundle = this.getResourceBundle();
			var sValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();

			if (sValue && sValue.trim().length > 0) {
				oSource.setValueState("Success");
				oSource.setValueStateText(null);
			} else {
				oSource.setValueState("Error");
				oSource.setValueStateText(oResourceBundle.getText("errorEmptyBetrag"));
			}
		}
	});
});