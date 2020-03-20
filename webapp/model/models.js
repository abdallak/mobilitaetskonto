sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/MessageBox"
], function (JSONModel, Device, MessageBox) {
	"use strict";

	/**
	 * This class defines most global models
	 * @class models
	 */
	return {

		/**
		 * A global JSON model which contains the current users sap user details.
		 * 
		 * @typedef userModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {number} name - user id
		 * @property {number} firstName - firstname
		 * @property {number} lastName - lastname
		 * @property {number} email - email
		 * @property {number} displayName - firstname + lastname + user id
		 */

		/**
		 * A global JSON model which contains the current users details.
		 * 
		 * @typedef dbUserModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} VORNAME - firstname
		 * @property {string} NAME - lastname
		 * @property {string} MID - employee id
		 * @property {string} MAIL - employee mail
		 * @property {number} GUTHABEN - current balance
		 * @property {boolean} AKTIV - isActive
		 * @property {integer} FREIGABEWERT - administration value
		 * @property {string} JAHRESABSCHLUSS - expired balance date
		 */

		/**
		 * A global JSON model which contains the current users roles.
		 * 
		 * @typedef roleModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {boolean} mitarbeiter - is current user an employee
		 * @property {boolean} verwalter - is current user an administration 
		 */

		/**
		 * This is some kind of predefined function from SAP
		 * 
		 * @return {sap.ui.model.json.JSONModel} device model
		 */
		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		/**
		 * This function will be called from Component.js.
		 * 
		 * It will execute the getOrCreateUser dunction
		 * 
		 * @param {object} component - context of component.js
		 */
		setupGlobalModels: function (component) {
			// getOrCreateUser and set Model dbUserModel
			this.getOrCreateUser(component);
		},

		/**
		 * This function will get the current users details (e.g. email, name, firstname) from the SAP user service.
		 * Those information will be stored inside the global userModel.
		 * Afterwards it will call our DB to get or create a new user.
		 * 
		 * @param {object} component - context of component.js
		 */
		getOrCreateUser: function (component) {
			var settings = {
				"url": "/services/userapi/currentUser",
				"method": "GET",
				"timeout": 0
			};

			var that = this;
			var oUserModel = component.getModel("userModel");
			oUserModel.attachEventOnce("modelUpdated", function (oEvent) {
				// kein controller, weil in component.js noch kein controller existiert
				that.updateUserModel(undefined, component);
			}, this);

			$.ajax(settings)
				.done(function (response) {
					oUserModel.setData(response);
					oUserModel.fireEvent("modelUpdated");
				})
				.fail(function (jqXHR, exception) {
					var sErrorMessage = this.getResourceBundle().getText("sapErrorMessage");
					var sDetailMessage = jqXHR.responseText + " (" + jqXHR.status + ")";
					this.onNavMessagePageWorkaround(component, "", sErrorMessage, sDetailMessage);
				});
		},

		/**
		 * This is a workaround function which will display the MessagePage.
		 * 
		 * Usually it would call the BaseController function but since there is no view at this point, it needs this workaround.
		 * 
		 * The sIconPath parameter must not contain the sap:// prefix since '/' is reserved according to the sap router docs.
		 * Just call it with "message-information" instead of "sap-icon://message-information".
		 * Therefore this does only work with SAP build-in icons.
		 * 
		 * @param {object} component - context of component.js
		 * @param {string} sIconPath - SAP Icon without prefix
		 * @param {string} sErrorMessage - Error message
		 * @param {string} sErrorDescription - Error detail or description
		 * @param {boolean} bStartpageButton - Show button to navigate to Startpage
		 */
		onNavMessagePageWorkaround: function (component, sIconPath, sErrorMessage, sErrorDescription, bStartpageButton) {
			var oError = {};
			oError.sIconPath = sIconPath;
			oError.sErrorDescription = sErrorDescription;
			oError.sErrorMessage = sErrorMessage;
			oError.bStartpageButton = bStartpageButton;
			var sError = JSON.stringify(oError);

			component.getRouter().navTo("MessagePage", {
				error: sError
			}, true);
		},

		/**
		 * This function sets the dbUserModel and roleModel model.
		 * 
		 * It will call our GetCreate backend endpoint. As the name suggests, it creates a new user if necessary and returns the dbUserModel data.
		 * It will set the rolesModel mitarbeiter and verwalter properties.
		 * 
		 * @param {object} controller - context of controller
		 * @param {object} component - context of component.js
		 */
		updateUserModel: function (controller, component) {
			var oUserModel = component.getModel("userModel");

			// wenn keine Daten in userModel, dann error anzeigen
			if (oUserModel.getData().name === undefined) {
				// FIXME: Wird manchmal angezeigt obwohl Daten da
				this.onNavMessagePageWorkaround(component, "", this.getResourceBundle().getText("sapErrorMessageUpdateUserModel"),
					this.getResourceBundle().getText("sapErrorDetailUpdateUserModel"));
				return;
			}

			var settings = {
				"url": "/MOB_EMPLOYEE_GETCREATE",
				"method": "GET",
				"timeout": 0,
				"data": oUserModel.getData()
			};

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var dbUserModel = component.getModel("dbUserModel");
					dbUserModel.setData(response);

					var roleModel = component.getModel("roleModel");
					var roleData = roleModel.getData();

					// Keine Ahnung warum hier der Boolean der String "TRUE" ist statt 1 oder true..
					// In XSJS Service gibt es scheinbar kein BOOLEAN Typ und wird auch nicht als Integer erkannt.
					roleData.mitarbeiter = response.AKTIV === "TRUE";
					roleData.verwalter = response.FREIGABEWERT > 0 && roleData.mitarbeiter;

					roleModel.refresh(true);

					if (response.AKTIV !== "TRUE") {
						that.onNavMessagePageWorkaround(component, "message-warning", this.getResourceBundle().getText("sapErrorMessageUpdateUserModelAjax"),
							this.getResourceBundle().getText("sapErrorDetailUpdateUserModelAjax"),
							false);
					}
				})
				.fail(function (jqXHR, exception) {
					controller.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
				});
		}

	};
});