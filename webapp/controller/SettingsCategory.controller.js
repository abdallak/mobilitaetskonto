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

		changeCategory: function (type, kid) {
			// TODO network request

			switch (type) {
			case "add":
				break;
			case "delete":
				break;
			case "edit":
				break;
			default:
				break;
			}

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
			var kid = oEvent.getSource().data("KID");

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
						this.changeCategory("delete", null, kid);
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
						this.changeCategory("edit", sText, kid);
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
						this.changeCategory("add", sText);
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