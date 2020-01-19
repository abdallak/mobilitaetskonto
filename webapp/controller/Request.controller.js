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
				"art": "0",
				"betrag": null,
				"beschreibung": null,
				"kid": "0" // TODO: wenn dynamisch, dann wieder Wert null
			};
			var oRequestModel = new JSONModel(defaultRequest);
			this.setModel(oRequestModel, "oRequestModel");
		},

		submitRequest: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();
			var oResourceBundle = this.getResourceBundle();

			var oRequestData = this.getModel("oRequestModel").getData();
			if (!oRequestData.betrag || oRequestData.betrag === "0" || oRequestData.betrag.includes("-")) {
				this.handleEmptyModel(oResourceBundle.getText("requestInvalidBetrag"));
				return;
			}
			if (!oRequestData.beschreibung || oRequestData.beschreibung.trim().length === 0) {
				this.handleEmptyModel(oResourceBundle.getText("requestInvalidBeschreibung"));
				return;
			}

			var settings = {
				"url": "/MOB_ANTRAG",
				"method": "POST",
				"timeout": 0,
				"data": JSON.stringify(oRequestData)
			};

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					that.getRouter().navTo("Sales");
					that.resetRequest();
				})
				.fail(function (jqXHR, exception) {
					that.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
				});

			// FIXME: Auskommentiert, weil bei mir sonst View nicht geladen wird
			// var oRequestResponseModel = new JSONModel();
			// oRequestResponseModel.loadData("/MOB_ANTRAG_INSERT", oRequestData);
		},

		onValueChanged: function (oEvent) {
			var oResourceBundle = this.getResourceBundle();
			var sValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();

			var betragValue = parseFloat(sValue);
			if (!isNaN(betragValue) && betragValue > 0.0) {
				oSource.setValueState("Success");
				oSource.setValueStateText(null);
			} else {
				oSource.setValueState("Error");
				oSource.setValueStateText(oResourceBundle.getText("errorEmptyBetrag"));
			}
		}
	});
});