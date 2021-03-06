sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (JSONModel, BaseController, formatter) {
	"use strict";

	/**
	 * This Class simply displays a detailed view of the selected transaction from the table,
	 * providing extra information to the user, which is not shown in the table.
	 * 
	 * @class DetailEmployee
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.DetailEmployee", {
		formatter: formatter,

		/**
		 * A global JSON model which contains the current users details.
		 * 
		 * @typedef dbUserModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} VORNAME - Employee firstname
		 * @property {string} NAME - Employee lastname
		 * @property {string} MID - Employee id
		 */

		/**
		 * A local JSON model which contains all request details.
		 * 
		 * @typedef detailModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {integer} uid - umsatzid
		 * @property {integer} mid - mitarbeiterid
		 * @property {string} vorname - vorname
		 * @property {string} name - name
		 * @property {(string|integer)} art - art
		 * @property {number} betrag - betrag
		 * @property {integer} state - status
		 * @property {integer} kid - kid
		 * @property {date} date - datum + zeit
		 * @property {string} beschreibung - beschreibung
		 * @property {string} feedback - feedback
		 * @property {string} verwalter - verwalter
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function () {
			this.getRouter().getRoute("DetailEmployee").attachMatched(this._onRoutePatternMatched, this);

			var detailModel = new JSONModel();
			this.setModel(detailModel, "detailModel");

			var dbUserModel = this.getGlobalModel("dbUserModel");
			this.setModel(dbUserModel, "dbUserModel");
		},

		/**
		 * This function is called by the router everytime the view is accessed.
		 * The selected data from previous table view is set as model data here.
		 * The data is also stored.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvents
		 */
		_onRoutePatternMatched: function (oEvent) {
			//ANTRAGSDATEN 
			var decodedVal = decodeURIComponent(oEvent.getParameter("arguments").Detail); //retrieving the passed transaction data from the table
			var detail = JSON.parse(decodedVal);

			var detailModel = this.getModel("detailModel");
			detailModel.setData(detail);

			//storing the data during the session in case of a connectionlost resulting in a pagereload
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);

			if (jQuery.isEmptyObject(detailModel.getData())) {
				detailModel.setData(oStorage.get("employeeLocalData"));
			} else {
				oStorage.put("employeeLocalData", detailModel.getData());
			}
		},

		/**
		 * This function downloads the specific attachment to the given id
		 * and allows to user to store or open it on his device.
		 * 
		 * @param{int} aid Attachment-ID
		 */
		performDownloadAttachment: function (aid) {
			// TODO: vielleicht in detailModel speichern als Art Cache, damit nicht immer wieder neu geladen wird?
			var params = {};
			params.aid = aid;

			var settings = this.prepareAjaxRequest("/MOB_REQUEST_DOWNLOADATTACH", "GET", params);

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var oResponse = JSON.parse(response);
					var link = document.createElement("a");
					link.href = oResponse.DATA;
					link.download = oResponse.FILENAME;
					link.click();
					link = null;
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		/**
		 * This function passes the id of the selected attachment to the performDownloadAttachment method.
		 * It also marks the clicked file as selected.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onSelectChange: function (oEvent) {
			var aid = oEvent.getParameters().selectedItem.getProperty("documentId");
			this.performDownloadAttachment(aid);
			// deselect item again
			oEvent.getParameters().selectedItem.setSelected();
		}
	});

});