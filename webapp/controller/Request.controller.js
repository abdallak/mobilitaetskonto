sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Request", {

		onInit: function () {
			this.getRouter().getRoute("Request").attachMatched(this._onRoutePatternMatched, this);
			this.resetRequest();
		},

		_onRoutePatternMatched: function (oEvent) {
			// this.resetRequest();
		},

		cancelButton: function (oEvent) {
			this.resetRequest();
			this.onNavBack();
		},

		resetRequest: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var defaultRequest = {
				"MID": dbUserData.MID,
				"art": 0,
				"betrag": null,
				"beschreibung": null
			};
			var oRequestModel = new JSONModel(defaultRequest);
			this.setModel(oRequestModel, "oRequestModel");
		},

		submitRequest: function (oEvent) {
			// FIXME workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();

			var oRequestData = this.getModel("oRequestModel").getData();
			if (!oRequestData.betrag) {
				this.handleEmptyModel("Bitte Betrag eingeben!");
				return;
			}
			if (!oRequestData.beschreibung || oRequestData.beschreibung.trim().length === 0) {
				this.handleEmptyModel("Bitte Beschreibung eingeben!");
				return;
			}

			var oRequestResponseModel = new JSONModel();
			var that = this;
			oRequestResponseModel.attachEventOnce("requestCompleted", function (oEvent1) {
				that.getRouter().navTo("Sales");
				that.resetRequest();
			}).loadData("/MOB_ANTRAG", oRequestData);
		},

		onValueChanged: function (oEvent) {
			var oResourceBundle = this.getResourceBundle();
			var sValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();

			var betragValue = parseFloat(sValue);
			if (!isNaN(betragValue)) {
				oSource.setValueState("Success");
				oSource.setValueStateText(null);
			} else {
				oSource.setValueState("Error");
				oSource.setValueStateText(oResourceBundle.getText("errorEmptyBetrag"));
			}
		}
	});
});