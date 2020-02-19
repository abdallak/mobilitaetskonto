sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	/**
	 * This controller contains a NavContainer to navigate between the different setting pages.
	 * @class Settings
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Settings", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * 
		 * It will attach the route pattern matcher to reload the current logModel.
		 */
		onInit: function () {
			this.getRouter().getRoute("Settings").attachMatched(this._onRoutePatternMatched, this);

			var logModel = new JSONModel();
			this.setGlobalModel(logModel, "logModel");
		},

		/**
		 * If route pattern matched, this function will reload the logModel.
		 * 
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		_onRoutePatternMatched: function (oEvent) {
			this.getLogData();
		},

		/**
		 * This function hides or shows the SideNavigation.
		 */
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		/**
		 * This function navigates between different NavContainer.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var navContainer = this.byId("navContainer");
			var viewId = this.byId(oItem.getKey());
			navContainer.to(viewId);
		},

		getLogData: function () {
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