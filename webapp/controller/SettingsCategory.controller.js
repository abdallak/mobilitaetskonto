sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/m/Dialog",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/ButtonType",
	"sap/m/Input",
	"sap/m/Label",
	"sap/m/Text",
	"sap/m/MessageToast",
	"sap/m/Button",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Dialog, HorizontalLayout, VerticalLayout, ButtonType, Input, Label, Text, MessageToast, Button, JSONModel) {
	"use strict";

	/**
	 * This controller manages deleting, renaming and adding categories.
	 * @class SettingsCategory
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsCategory", {

		/**
		 * A local JSON model which contains all active categories.
		 * 
		 * @typedef dbCategoryModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {integer} KID - Category id
		 * @property {string} BEZEICHNUNG - Category name
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * 
		 * It will set an empty dbCategoryModel and triggers a model update.
		 */
		onInit: function () {
			// FIXME: Funktioniert für den NavContainer nicht
			// this.getRouter().getRoute("SettingsCategory").attachMatched(this._onRoutePatternMatched, this);
			this.setModel(new JSONModel(), "dbCategoryModel");
			this.changeCategory("get");
		},

		/**
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		_onRoutePatternMatched: function (oEvent) {},

		/**
		 * This is a helper function which will prepare and perform the network requests.
		 * 
		 * @param{string} sType - Operation type: add, delete, edit, get
		 * @param{string} name - New category name
		 * @param{(integer|string)} kid - Category id
		 */
		changeCategory: function (sType, name, kid) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();

			var settings;
			var data = {
				type: sType,
				name: name,
				kid: kid,
				amid: dbUserData.MID
			};

			switch (sType) {
			case "add":
				settings = this.prepareAjaxRequest("/MOB_KATEGORIE_CHANGE", "GET", data);
				break;
			case "delete":
				settings = this.prepareAjaxRequest("/MOB_KATEGORIE_CHANGE", "GET", data);
				break;
			case "edit":
				settings = this.prepareAjaxRequest("/MOB_KATEGORIE_CHANGE", "GET", data);
				break;
			case "get":
				settings = this.prepareAjaxRequest("/MOB_KATEGORIE_CHANGE", "GET", data);
				break;
			default:
				break;
			}

			if (settings === undefined) {
				this.handleEmptyModel("Error: changeCategory settings === undefined");
				return;
			}

			var that = this;
			$.ajax(settings).done(function (response) {
				var dbCategoryModel = that.getModel("dbCategoryModel");
				dbCategoryModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		/**
		 * This function will show a confirmation Dialog and call changeCategory afterwards.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onDeletePressed: function (oEvent) {
			var kid = oEvent.getParameter("listItem").data("KID");

			if (kid === "0") {
				this.handleEmptyModel("Kategorie \"Sonstiges\" kann nicht gelöscht werden.");
				return;
			}

			var that = this;
			var oDialog = new Dialog({
				title: "Bestätigen",
				type: "Message",
				content: new Label({
					text: "Sind Sie sich sicher, dass Sie die Kategorie löschen möchten?"
				}),
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: "Löschen",
					press: function () {
						that.changeCategory("delete", undefined, kid);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: "Abbrechen",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			oDialog.open();
		},

		/**
		 * This function will show a Dialog with an Input item to change the categories name and call changeCategory afterwards.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onEditPressed: function (oEvent) {
			var kid = oEvent.getSource().data("KID");

			if (kid === "0") {
				this.handleEmptyModel("Kategorie \"Sonstiges\" kann nicht geändert werden.");
				return;
			}

			var that = this;
			var oDialog = new Dialog({
				title: "Kategorie Namen ändern",
				type: "Message",
				content: [
					new Input("newCategoryNameInput", {
						width: "100%",
						placeholder: "Neuer Name der Kategorie"
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: "Ändern",
					press: function () {
						var sText = sap.ui.getCore().byId("newCategoryNameInput").getValue();
						that.changeCategory("edit", sText, kid);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: "Abbrechen",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			oDialog.open();
		},

		/**
		 * This function will show a Dialog with an Input item to insert the new name and call changeCategory afterwards.
		 * 
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		onAddPressed: function (oEvent) {
			var that = this;
			var oDialog = new Dialog({
				title: "Kategorie hinzufügen",
				type: "Message",
				content: [
					new Input("newCategoryNameInput", {
						width: "100%",
						placeholder: "Name der neuen Kategorie"
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: "Hinzufügen",
					press: function () {
						var sText = sap.ui.getCore().byId("newCategoryNameInput").getValue();
						that.changeCategory("add", sText);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: "Abbrechen",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			oDialog.open();
		}
	});
});