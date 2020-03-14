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
		 */
		_onRoutePatternMatched: function (oEvent) {
			//ANTRAGSDATEN
			var detail = JSON.parse(oEvent.getParameter("arguments").Detail); //retrieving the passed transaction data from the table
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
		 * @param aid Attachment-ID
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
		 */
		onSelectChange: function (oEvent) {
			var aid = oEvent.getParameters().selectedItem.getProperty("documentId");
			this.performDownloadAttachment(aid);
			// deselect item again
			oEvent.getParameters().selectedItem.setSelected();
		}
	});

});