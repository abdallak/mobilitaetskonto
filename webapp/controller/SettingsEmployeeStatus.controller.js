sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsEmployeeStatus", {

		onInit: function () {
			var employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");
			this.getEmployeeData();
		},

		getEmployeeData: function (target) {
			var params = {};
			params.mid = null;

			var settings = this.prepareAjaxRequest("/MOB_MITARBEITER_GET", "GET", params);

			var that = this;
			$.ajax(settings).done(function (response) {
				var employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		setEmployeeStatus: function (oSelectedItems, status) {
			var paramData = [];

			for (var i = 0; i < oSelectedItems.length; i++) {
				var context = oSelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();

				var employeeStatus = {};
				employeeStatus.status = status;
				employeeStatus.mid = context.getProperty(path).MID;
				paramData.push(employeeStatus);
			}

			var settings = this.prepareAjaxRequest("/MOB_STATUS_AENDERN", "POST", JSON.stringify(paramData));

			var that = this;
			$.ajax(settings).done(function (response) {
				var employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		onAktivPressed: function (oEvent) {
			var oList = this.byId("list0");
			var oSelectedItems = oList.getSelectedItems();
			this.setEmployeeStatus(oSelectedItems, true);
		},

		onInaktivPressed: function (oEvent) {
			var oList = this.byId("list0");
			var oSelectedItems = oList.getSelectedItems();
			this.setEmployeeStatus(oSelectedItems, false);
		},

		onDeletePressed: function (oEvent) {
			sap.m.MessageToast.show("Leider noch nicht implementiert.");
		}
	});
});