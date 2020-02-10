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

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsCategory", {

		onInit: function () {
			// FIXME: Funktioniert für den NavContainer nicht
			// this.getRouter().getRoute("SettingsCategory").attachMatched(this._onRoutePatternMatched, this);
			var dbCategoryModel = new JSONModel();
			this.setModel(dbCategoryModel, "dbCategoryModel");
			this.fetchCategories();
		},

		_onRoutePatternMatched: function (oEvent) {},

		changeCategory: function (type, name, kid) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();

			var settings;
			var data = {
				type: type,
				name: name,
				kid: kid,
				amid: dbUserData.MID
			};

			switch (type) {
			case "add":
				settings = this.prepareAjaxRequest("/MOB_KATEGORIE_CHANGE", "GET", data);
				break;
			case "delete":
				settings = this.prepareAjaxRequest("/MOB_KATEGORIE_CHANGE", "GET", data);
				break;
			case "edit":
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

		fetchCategories: function () {
			var settings = this.prepareAjaxRequest("/MOB_KATEGORIE", "GET");
			var that = this;
			$.ajax(settings).done(function (response) {
				var dbCategoryModel = that.getModel("dbCategoryModel");
				dbCategoryModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

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