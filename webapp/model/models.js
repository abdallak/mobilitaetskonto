sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		getOrCreateUser: function () {
			var oUserModel = new sap.ui.model.json.JSONModel(this.sUserPath);

			oUserModel.attachRequestCompleted(function (oEvent) {
				var oDbUserModel = new sap.ui.model.json.JSONModel();
				oDbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", oEvent.getData());
				sap.ui.getCore().setModel(this.oDbUserModel, "dbUserModel");
			});

			oUserModel.loadData(this.sUserPath);
		},

		createSales: function () {
			var oDetailModel = new sap.ui.model.json.JSONModel();
			return oDetailModel;
		},

		createRole: function () {
			//configure roles here
			var roles = {
				verwalter: false,
				mitarbeiter: true
			};
			var oRoleModel = new sap.ui.model.json.JSONModel(roles);
			return oRoleModel;
		}

	};
});