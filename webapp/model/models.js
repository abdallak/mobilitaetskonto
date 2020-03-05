sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/MessageBox"
], function (JSONModel, Device, MessageBox) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		setupGlobalModels: function (component) {
			// getOrCreateUser and set Model dbUserModel
			this.getOrCreateUser(component);
		},

		getOrCreateUser: function (component) {
			var settings = {
				"url": "/services/userapi/currentUser",
				"method": "GET",
				"timeout": 0
			};

			var that = this;
			var oUserModel = component.getModel("userModel");
			oUserModel.attachEventOnce("modelUpdated", function (oEvent) {
				// FIXME: kein controller, weil in component.js noch kein controller existiert
				that.updateUserModel(undefined, component);
			}, this);

			$.ajax(settings)
				.done(function (response) {
					oUserModel.setData(response);
					oUserModel.fireEvent("modelUpdated");
				})
				.fail(function (jqXHR, exception) {
					var sErrorMessage = "Ein Fehler beim Laden des SAP Benutzerprofils ist aufgetreten";
					var sDetailMessage = jqXHR.responseText + " (" + jqXHR.status + ")";

					MessageBox.error(sErrorMessage, {
						title: "Error",
						id: "componentError",
						details: sDetailMessage
					});
				});
		},

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

		updateUserModel: function (controller, component) {
			var oUserModel = component.getModel("userModel");

			// wenn keine Daten in userModel, dann error anzeigen
			if (oUserModel.getData().name === undefined) {
				this.onNavMessagePageWorkaround(component, "", "SAP Benutzerdaten wurden nicht gefunden.");
				return;
			}

			var settings = {
				"url": "/MOB_MITARBEITER_GETCREATE",
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
					roleData.verwalter = response.FREIGABEWERT > 0;
					// FIXME: Keine Ahnung warum hier der Boolean der String "TRUE" ist statt 1 oder true..
					// In XSJS Service gibt es scheinbar kein BOOLEAN Typ und wird auch nicht als Integer erkannt.
					roleData.mitarbeiter = response.AKTIV === "TRUE";

					roleModel.refresh(true);

					if (response.AKTIV !== "TRUE") {
						that.onNavMessagePageWorkaround(component, "message-warning", "Keine Berechtigung",
							"Evtl. sind Sie noch nicht für dieses Programm freigeschaltet worden.\n\nBitte wenden Sie sich an den jeweiligen Ansprechpartner bzw. Verwalter.",
							false);
					}
				})
				.fail(function (jqXHR, exception) {
					controller.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
				});
		}

	};
});