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
			$.ajax(settings)
				.done(function (response) {
					var oUserModel = component.getModel("userModel");
					oUserModel.setData(response);
					that.updateUserModel(component);
				})
				.fail(function (jqXHR, exception) {
					var sErrorMessage = "Ein Fehler beim Laden des Benutzerprofils ist aufgetreten";
					var sDetailMessage = jqXHR.responseText + " (" + jqXHR.status + ")";

					MessageBox.error(sErrorMessage, {
						title: "Error",
						id: "componentError",
						details: sDetailMessage
					});
				});
		},

		updateUserModel: function (baseContoller, component) {
			var oUserModel = component.getModel("userModel");

			var settings = {
				"url": "/MOB_MITARBEITER_GETCREATE",
				"method": "GET",
				"timeout": 0,
				"data": oUserModel.getData()
			};

			$.ajax(settings)
				.done(function (response) {
					var dbUserModel = component.getModel("dbUserModel");
					dbUserModel.setData(response);

					var roleModel = component.getModel("roleModel");
					var roleData = roleModel.getData();
					roleData.verwalter = response.VERWALTER !== 0;
					// FIXME: Keine Ahnung warum hier der Boolean der String "TRUE" ist statt 1 oder true..
					// In XSJS Service gibt es scheinbar kein BOOLEAN Typ und wird auch nicht als Integer erkannt.
					roleData.mitarbeiter = response.AKTIV === "TRUE";

					roleModel.refresh(true);
				})
				.fail(function (jqXHR, exception) {
					baseContoller.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
				});
		}

	};
});