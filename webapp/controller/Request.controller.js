/*eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/FileSizeFormat",
	"sap/m/upload/Uploader",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, FileSizeFormat, Uploader, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Request", {

		onInit: function () {
			this.getRouter().getRoute("Request").attachMatched(this._onRoutePatternMatched, this);
			this.resetRequest();
		},

		_onRoutePatternMatched: function (oEvent) {
			this.fetchCategories();
		},

		cancelButton: function (oEvent) {
			this.resetRequest();
			this.onNavBack();
		},

		fetchCategories: function () {
			var data = {
				type: "get"
			};

			var settings = this.prepareAjaxRequest("/MOB_KATEGORIE_CHANGE", "GET", data);

			if (settings === undefined) {
				this.handleEmptyModel("Error: changeCategory settings === undefined");
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

		onChange: function (oEvent) {
			var files = oEvent.getParameter("files");
			for (var i = 0; i < files.length; i++) {
				this.addAttachment(files[i]);
			}
			MessageToast.show("Event change triggered");
		},

		// onDelete ist komisch, deswegen muss der workaround genommen werden..
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

		addAttachment: function (file) {
			var name = file.name;
			var reader = new FileReader();

			var that = this;
			reader.onload = function (e) {
				var oRequestData = that.getModel("oRequestModel").getData();
				var raw = e.target.result;
				var fileItem = {};

				fileItem.uid = 2;
				fileItem.name = name;
				fileItem.data = raw;

				oRequestData.attachments.push(fileItem);

				console.log(name + " binary string: " + raw);
			};

			reader.onerror = function (e) {
				// FIXME: ordentliche Fehlermeldung
				sap.m.MessageToast.show("error");
			};

			reader.readAsDataURL(file);
		},

		onFilenameLengthExceed: function (oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		}
	});

});