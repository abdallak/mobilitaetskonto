sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/FileSizeFormat",
	"sap/m/upload/Uploader",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, FileSizeFormat, Uploader, MessageToast, MessageBox) {
	"use strict";

	/**
	 * This controller provides a form to perform a request.
	 * @class Request
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Request", {

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
		 * @typedef oRequestModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {(string|integer)} art - art
		 * @property {number} betrag - betrag
		 * @property {integer} state - status
		 * @property {string} beschreibung - beschreibung
		 * @property {integer} kid - kid
		 * @property {object} attachments - attachments
		 */

		/**
		 * A temporary object which contains the current categories.
		 * 
		 * @typedef dbCategoryModelData
		 * @type {object}
		 * @property {integer} KID - Category id
		 * @property {string} BEZEICHNUNG - Category name
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * 
		 * It will reset the input values to their default values and attach the route pattern matcher to always reload the currently available categories.
		 */
		onInit: function () {
			this.getRouter().getRoute("Request").attachMatched(this._onRoutePatternMatched, this);
			this.resetRequest();
		},

		/**
		 * If the route pattern matched, this function will reload the available categories.
		 * 
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		_onRoutePatternMatched: function (oEvent) {
			this.fetchCategories();
		},

		/**
		 * If the user selects the cancel button, the resetRequest function will be called and onNavBack.
		 * 
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		cancelButton: function (oEvent) {
			this.resetRequest();
			this.onNavBack();
		},

		/**
		 * This function will get all active categories and calls "insertCategories" to insert them into the view afterwards.
		 */
		fetchCategories: function () {
			var data = {
				type: "get"
			};

			var settings = this.prepareAjaxRequest("/MOB_KATEGORIE_CHANGE", "GET", data);

			if (settings === undefined) {
				this.handleEmptyModel("Error: fetchCategory settings === undefined");
				return;
			}

			var that = this;
			$.ajax(settings).done(function (response) {
				var dbCategoryModel = new JSONModel();
				dbCategoryModel.setData(response);
				that.insertCategories(dbCategoryModel.getData());
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		/**
		 * This function will remove all categories from the Select UI element and replaces them with the currently fetched ones.
		 * 
		 * @param{dbCategoryModelData} oCategoryData - Object which contains current categories
		 */
		insertCategories: function (oCategoryData) {
			var oCategorySelect = this.getView().byId("categorySelect");
			var previousItems = oCategorySelect.getItems();

			// remove previous items from select
			previousItems.forEach(function (oldItem) {
				oCategorySelect.removeItem(oldItem);
			});

			// add category items from db
			oCategoryData.forEach(function (newItemDb) {
				var newItem = new sap.ui.core.Item({
					key: newItemDb.KID.toString(),
					text: newItemDb.BEZEICHNUNG
				});
				oCategorySelect.addItem(newItem);
			});
		},

		/**
		 * This function will reset the view / form to its default values.
		 */
		resetRequest: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var defaultRequest = {
				"MID": dbUserData.MID,
				"art": "0",
				"betrag": null,
				"state": 1,
				"beschreibung": null,
				"kid": null,
				"attachments": []
			};
			var oRequestModel = new JSONModel(defaultRequest);
			this.setModel(oRequestModel, "oRequestModel");

			var oUploadCollection = this.byId("UploadCollection");
			for (var i = 0; i < oUploadCollection.getItems().length; i++) {
				oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
			}
		},

		/**
		 * This function will submit the request to the backend if it is valid.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		submitRequest: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();

			var oResourceBundle = this.getResourceBundle();
			var oRequestData = this.getModel("oRequestModel").getData();

			this.checkAttachments(oRequestData);

			if (!oRequestData.betrag || oRequestData.betrag === "0" || oRequestData.betrag.includes("-") || oRequestData.betrag.includes("e")) {
				this.handleEmptyModel(oResourceBundle.getText("requestInvalidBetrag"));
				return;
			}
			if (!oRequestData.beschreibung || oRequestData.beschreibung.trim().length === 0) {
				this.handleEmptyModel(oResourceBundle.getText("requestInvalidBeschreibung"));
				return;
			}

			this.performRequestSubmit(oRequestData);
		},

		/**
		 * This function performs the network request to send the request data to its backend.
		 * Afterwards it will navigate to the tableSales view.
		 * 
		 * @param{object} oRequestData - Data of oRequestModel
		 */
		performRequestSubmit: function (oRequestData) {
			var settings = this.prepareAjaxRequest("/MOB_ANTRAG", "POST", JSON.stringify(oRequestData));
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					that.getRouter().navTo("TableSales", {
						Target: "SubmittedRequests"
					});
					that.resetRequest();
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		/**
		 * This function gets called if there is an change inside the amount input.
		 * It will check if the given value is valid or not.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onValueChanged: function (oEvent) {
			var oResourceBundle = this.getResourceBundle();
			var sValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();

			var betragValue = parseFloat(sValue);
			if (!isNaN(betragValue) && betragValue > 0.0) {
				oSource.setValueState("Success");
				oSource.setValueStateText(null);
			} else {
				oSource.setValueState("Error");
				oSource.setValueStateText(oResourceBundle.getText("errorEmptyBetrag"));
			}
		},

		/* UPLOAD COLLECTION https://sapui5.hana.ondemand.com/#/entity/sap.m.UploadCollection/sample/sap.m.sample.UploadCollectionForPendingUpload */

		/**
		 * This function will add an selected attachment to oRequestModel.attachments.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onChange: function (oEvent) {
			var files = oEvent.getParameter("files");
			for (var i = 0; i < files.length; i++) {
				this.addAttachment(files[i]);
			}
		},

		/**
		 * This is a helper function which will check if the already saved files inside the oRequestModel.attachments array are still inside the uploadcollection.
		 * 
		 * Since we do not upload the attachments as soon as they are selected and the onDelete function is very strange, we need this strange workaround.
		 * 
		 * @param{object} oRequestData - Data of oRequestModel
		 */
		checkAttachments: function (oRequestData) {
			var oUploadCollection = this.byId("UploadCollection");

			// Art dict mit key -> Filename value -> object
			var previouslySavedAttachments = {};
			oRequestData.attachments.forEach(function (attachmentObject) {
				previouslySavedAttachments[attachmentObject.name] = attachmentObject;
			});

			var remainingAttachments = [];
			var items = oUploadCollection.getItems();
			items.forEach(function (itemObject) {
				var attachment = previouslySavedAttachments[itemObject.getFileName()];
				remainingAttachments.push(attachment);
			});

			oRequestData.attachments = remainingAttachments;
		},

		/**
		 * This is a helper function which will save the file as base64 String into oRequestModel.attachments.
		 * 
		 * @param{object} file - according to the sap documentation a simple object
		 */
		addAttachment: function (file) {
			var name = file.name;
			var reader = new FileReader();

			var that = this;
			reader.onload = function (e) {
				var oRequestData = that.getModel("oRequestModel").getData();
				var raw = e.target.result;
				var fileItem = {};

				fileItem.uid = 2; // FIXME: warum hier 2?
				fileItem.name = name;
				fileItem.data = raw;

				oRequestData.attachments.push(fileItem);
			};

			reader.onerror = function (e) {
				// FIXME: ordentliche Fehlermeldung
				sap.m.MessageToast.show("error");
			};

			reader.readAsDataURL(file);
		},

		/**
		 * This function gets called if the filename of the selected file is too long.
		 * It will show a MessageToast with an error message.
		 * 
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		onFilenameLengthExceed: function (oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		}
	});

});