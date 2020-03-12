sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/m/Dialog",
	"sap/m/ButtonType",
	"sap/m/Input",
	"sap/m/Label",
	"sap/m/Button",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (BaseController, Dialog, ButtonType, Input, Label, Button, JSONModel, BusyIndicator) {
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
			this.setModel(new JSONModel(), "dbCategoryModel");
			this.getEventBus().subscribe("manageCategories", "show", this.onBeforeShow, this);
		},

		/**
		 * This is a workaround to update the navigation containers everytime the view appears
		 * The main settings view sends an EventBus event to the viewId e.g. "showLog" with a "show" message.
		 * 
		 * @param{string} evt - viewId
		 */
		onBeforeShow: function (evt) {
			this.changeCategory("get");
		},

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
				this.handleEmptyModel()(this.getResourceBundle().getText("settingsCategoryError"));
				return;
			}

			var that = this;
			$.ajax(settings).done(function (response) {
				BusyIndicator.hide();
				var dbCategoryModel = that.getModel("dbCategoryModel");
				dbCategoryModel.setData(response);
			}).fail(function (jqXHR, exception) {
				BusyIndicator.hide();
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
				title: that.getResourceBundle().getText("settingsCategoryDeleteDialogTitle"),
				type: "Message",
				content: new Label({
					text: that.getResourceBundle().getText("settingsCategoryDeleteDialogText")
				}),
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: that.getResourceBundle().getText("settingsCategoryDeleteDialogBegin"),
					press: function () {
						BusyIndicator.show();
						that.changeCategory("delete", undefined, kid);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: that.getResourceBundle().getText("settingsCategoryDeleteDialogEnd"),
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
		 * This function will show a Dialog with an Input to change the categories name and call changeCategory afterwards.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onEditPressed: function (oEvent) {
			var kid = oEvent.getSource().data("KID");

			if (kid === "0") {
				this.handleEmptyModel(this.getResourceBundle().getText("settingsCategoryOnEditPressedError"));
				return;
			}

			var that = this;
			var oDialog = new Dialog({
				title: that.getResourceBundle().getText("settingsCategoryEditDialogTitle"),
				type: "Message",
				content: [
					new Input("newCategoryNameInput", {
						width: "100%",
						placeholder: that.getResourceBundle().getText("settingsCategoryEditDialogPlaceholder")
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: that.getResourceBundle().getText("settingsCategoryEditDialogBegin"),
					press: function () {
						BusyIndicator.show();
						var sText = sap.ui.getCore().byId("newCategoryNameInput").getValue();
						that.changeCategory("edit", sText, kid);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: that.getResourceBundle().getText("settingsCategoryEditDialogEnd"),
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
		 * This function will show a Dialog with an Input item to set the new name and call changeCategory afterwards.
		 * 
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		onAddPressed: function (oEvent) {
			var that = this;
			var oDialog = new Dialog({
				title: that.getResourceBundle().getText("settingsCategoryAddDialogTitle"),
				type: "Message",
				content: [
					new Input("newCategoryNameInput", {
						width: "100%",
						placeholder: that.getResourceBundle().getText("settingsCategoryAddDialogPlaceholder")
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: that.getResourceBundle().getText("settingsCategoryAddDialogBegin"),
					press: function () {
						BusyIndicator.show();
						var sText = sap.ui.getCore().byId("newCategoryNameInput").getValue();
						that.changeCategory("add", sText);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: that.getResourceBundle().getText("settingsCategoryAddDialogEnd"),
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