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
		
		setupGlobalModels: function(component) {
			// getOrCreateUser and set Model dbUserModel
			this.getOrCreateUser(component);

			// set salesModel
			// component.setModel(this.createSales(), "salesModel");

			this.createRole(component);
		},

		getOrCreateUser: function (component) {
			var oUserModel = component.getModel("userModel");

			oUserModel.attachRequestCompleted(function (oEvent) {
				var oDbUserModel = component.getModel("dbUserModel");
				oDbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", oEvent.getSource().getData());
			});

			oUserModel.loadData(this.sUserPath);
		},

		createRole: function (component) {
			var oUserModel = component.getModel("userModel");
			oUserModel.loadData();
		}

	};
});