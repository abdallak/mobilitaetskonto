sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {
		sUserPath: "/services/userapi/currentUser",

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		setupGlobalModels: function (component) {
			// getOrCreateUser and set Model dbUserModel
			this.getOrCreateUser(component);

			this.createRole(component);
		},

		getOrCreateUser: function (component) {
			var oUserModel = component.getModel("userModel");
			var oDbUserModel = component.getModel("dbUserModel");

			oUserModel.attachRequestCompleted(function (oEvent) {
				oDbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", oEvent.getSource().getData());
			});

			/*
			oUserModel.attachRequestFailed(function (oEvent) {
				sap.m.MessageBox.error("error " + oEvent.getParameter("statusCode") + " " + oEvent.getParameter("statusText") + " " + oEvent.getParameter(
					"message") + " " + oEvent.getParameter("responseText"));
			});

			oDbUserModel.attachRequestFailed(function (oEvent) {
				sap.m.MessageBox.error("error " + oEvent.getParameter("statusCode") + " " + oEvent.getParameter("statusText") + " " + oEvent.getParameter(
					"message") + " " + oEvent.getParameter("responseText"));
			});
			*/

			oUserModel.loadData(this.sUserPath);
		},

		createRole: function (component) {
			var oUserModel = component.getModel("userModel");
			oUserModel.loadData();
		}

	};
});