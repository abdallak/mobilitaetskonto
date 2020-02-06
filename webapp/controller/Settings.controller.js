sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Settings", {

		onInit: function () {
			this.getRouter().getRoute("Settings").attachMatched(this._onRoutePatternMatched, this);
			
			var logModel = new JSONModel();
			this.setGlobalModel(logModel, "logModel");
		},

		_onRoutePatternMatched: function (oEvent) {
			this.getLogData();
		},

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var navContainer = this.byId("navContainer");
			var viewId = this.byId(oItem.getKey());
			navContainer.to(viewId);
		},
		
		getLogData: function() {
			var settings = this.prepareAjaxRequest("/MOB_LOG_GET", "GET", null);

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var logModel = that.getGlobalModel("logModel");
					logModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		}

	});

});