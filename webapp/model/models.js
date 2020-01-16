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

		getOrCreateUser: function (component) {
			var oUserModel = component.getModel("userModel");

			oUserModel.attachRequestCompleted(function (oEvent) {
				var oDbUserModel = component.getModel("dbUserModel");
				oDbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", oEvent.getSource().getData());
			});

			oUserModel.loadData(this.sUserPath);
		},

		createSales: function () {
			var oDetailModel = new JSONModel();
			return oDetailModel;
		},

		createRole: function () {
			//configure roles here
			var roles = {
				verwalter: false,
				mitarbeiter: true
			};
			var oRoleModel = new JSONModel(roles);
			return oRoleModel;
		}

	};
});