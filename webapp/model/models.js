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

		getOrCreateUser: function () {
			var oUserModel = new JSONModel(this.sUserPath);

			oUserModel.attachRequestCompleted(function (oEvent) {
				var oDbUserModel = new JSONModel();
				oDbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", oEvent.getSource().getData());
				sap.ui.getCore().setModel(oDbUserModel, "dbUserModel");
			});

			oUserModel.loadData(this.sUserPath);
			sap.ui.getCore().setModel(oUserModel, "userModel");
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