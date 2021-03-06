sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
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
			// FIXME: ersten view irgendwie auch von hier aus aktualisieren - vllt. eigenes event erstellen und an onItemSelect senden
			this.getRouter().getRoute("Settings").attachMatched(this._onRoutePatternMatched, this);
		}, 

		/**
		 * If route pattern matched, this function will reload the logModel.
		 * 
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		_onRoutePatternMatched: function (oEvent) {},

		/**
		 * This function hides or shows the SideNavigation.
		 */
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		/**
		 * This function navigates between different setting pages.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var navContainer = this.byId("navContainer");
			var viewId = this.byId(oItem.getKey());
			this.getEventBus().publish(oItem.getKey(), "show", {});
			navContainer.to(viewId);
		}

	});

});