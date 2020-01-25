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
			this.fetchCategories();
		},

		cancelButton: function (oEvent) {
			this.resetRequest();
			this.onNavBack();
		},

		fetchCategories: function () {
			var settings = this.prepareAjaxRequest("/MOB_KATEGORIE", "GET");
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var dbCategoryModel = new JSONModel();
					dbCategoryModel.setData(response);
					that.insertCategories(dbCategoryModel.getData());
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		insertCategories: function (oCategoryData) {
			var oCategorySelect = this.getView().byId("categorySelect");
			var previousItems = oCategorySelect.getItems();

			// remove previous items from select
			previousItems.forEach(function (oldItem) {
				oCategorySelect.removeItem(oldItem);
			});

			// add category items from db
			oCategoryData.forEach(function (newItemDb) {
				var newItem = new sap.ui.core.Item({
					key: newItemDb.KID.toString(),
					text: newItemDb.BEZEICHNUNG
				});
				oCategorySelect.addItem(newItem);
			});
		},

		resetRequest: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var defaultRequest = {
				"MID": dbUserData.MID,
				"art": "0",
				"betrag": null,
				"beschreibung": null,
				"kid": null
			};
			var oRequestModel = new JSONModel(defaultRequest);
			this.setModel(oRequestModel, "oRequestModel");
		},

		submitRequest: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();
			var oResourceBundle = this.getResourceBundle();

			var oRequestData = this.getModel("oRequestModel").getData();
			if (!oRequestData.betrag || oRequestData.betrag === "0" || oRequestData.betrag.includes("-") || oRequestData.betrag.includes("e")) {
				this.handleEmptyModel(oResourceBundle.getText("requestInvalidBetrag"));
				return;
			}
			if (!oRequestData.beschreibung || oRequestData.beschreibung.trim().length === 0) {
				this.handleEmptyModel(oResourceBundle.getText("requestInvalidBeschreibung"));
				return;
			}

			var settings = this.prepareAjaxRequest("/MOB_ANTRAG", "POST", oRequestData);
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					that.getRouter().navTo("TableSales", {
						Target: "SubmittedRequests"
					});
					that.resetRequest();
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
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