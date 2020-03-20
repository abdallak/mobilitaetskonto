/*eslint-disable no-console, no-alert */
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/BusyIndicator"
], function (JSONModel, BaseController, formatter, MessageToast, Fragment, BusyIndicator) {
	"use strict";
	
	/**
	 * This Class simply displays a detailed view of the selected transaction from the table,
	 * providing extra information to the user, which is not shown in the table.
	 * 
	 * @class DetailAdministration
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.DetailAdministration", {
		formatter: formatter,
		/**
		 * A local JSON model which contains the current request details.
		 * 
		 * @typedef detailADModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {integer} BETRAG - Request value
		 * @property {integer} ALTBETRAG - Original request value
		 * @property {integer} MID - Employee id
		 * @property {integer} UID - Request id
		 * @property {integer} STATE - Current request state
		 * @property {string} FEEDBACK - Feedback given to request
		 * @property {integer} NEUBETRAG - Changed request value
		 * @property {integer} RESULTBALANCE - Employee account balance after request would be approved
		 * @property {integer} GUTHABEN - Employee  account balance
		*/
		/**
		 * A local JSON model which contains employee details of request.
		 * 
		 * @typedef detailADUserModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} Vorname - First name of employee
		 * @property {string} NAME - Last name of employee
		 * @property {integer} GUTHABEN - Employee account balance
	
		*/
		onInit: function () {
			this.getRouter().getRoute("DetailAdministration").attachMatched(this._onRoutePatternMatched, this);
			var detailADModel = new JSONModel();
			this.setModel(detailADModel, "detailADModel");
			var detailADUserModel = new JSONModel();
			this.setModel(detailADUserModel, "detailADUserModel");
			var editADModel = new JSONModel();
			this.setModel(editADModel, "editADModel");
	
		},
		/** This Function is called everytime the DetailAdminstration View gets called
		* @param{sap.ui.base.Event} [oEvent] - oEvent
		*/
		_onRoutePatternMatched: function (oEvent) {
			//Alter Betrag reset
			this.byId("FormElementAlt").setVisible(false);
			//ANTRAGSDATEN
			var detail = JSON.parse(oEvent.getParameter("arguments").Detail);
			var detailADModel = this.getModel("detailADModel");
			detailADModel.setData(detail);
			//USERDATEN
			this.performRequestEmployee(detail.MID);
			detailADModel.setProperty("/ALTBETRAG", this.getModel("detailADModel").getProperty("/BETRAG"));

			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			if (jQuery.isEmptyObject(detailADModel.getData())) {
				detailADModel.setData(oStorage.get("adminLocalData"));
			} else {
				oStorage.put("adminLocalData", detailADModel.getData());
			}

			//STATUSAENDERUNGEN VERMEIDEN, WENN ANTRAG NICHT AUSSTEHEND IST
			var submitButton = this.getView().byId("submitButton");
			var rejectButton = this.getView().byId("rejectButton");
			var feedback = this.getView().byId("areaFeedback");
			var edit = this.getView().byId("button0");
			var resBalance = this.getView().byId("resultingBalance");

			if (detail.STATUS !== 1) {
				edit.setEnabled(false);
				resBalance.setVisible(false);
				feedback.setEditable(false);
				feedback.setRequired(false);
				submitButton.setEnabled(false);
				rejectButton.setEnabled(false);
			} else {
				edit.setEnabled(true);
				resBalance.setVisible(true);
				this.calcNewBalance();
				feedback.setEditable(true);
				feedback.setRequired(true);
				submitButton.setEnabled(true);
				rejectButton.setEnabled(true);
			}
			this.byId("warningText").setVisible(false);
			this.testDisableButton();
		},
		/**
		 * Requests xsjs Service from DB to get relevant employee information.
		 * Binds Data to detailADUserModel
		 * @paramm{integer} mid   -- mid of employee
		 */
		performRequestEmployee: function (mid) {
			var params = {};
			params.mid = mid;
			var settings = this.prepareAjaxRequest("/MOB_MITARBEITER_GET", "GET", params);
			var that = this;
			$.ajax(settings).done(function (response) {
				var detailADUserModel = that.getModel("detailADUserModel");
				detailADUserModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},
		/**
		 * Passes updated request data to xsjs from DB to update the data of Request in DB.
		 * @param{integer} state -- integer representation of state(accepted/rejected) of given request
		 */
		performRequestUpdate: function (state) {
			var oRequestData = this.prepareRequestData(state);
			if (!oRequestData.feedback || oRequestData.feedback.trim().length === 0) {
				this.handleEmptyModel(this.getResourceBundle().getText("FeedbackInvalid"));
				return;
			}
			var settings = this.prepareAjaxRequest("/MOB_ANTRAG_HANDLE", "POST", JSON.stringify(oRequestData));
			var that = this;
			$.ajax(settings).done(function (response) {
				BusyIndicator.hide();
				that.onNavBack();
			}).fail(function (jqXHR, exception) {
				BusyIndicator.hide();
				that.handleNetworkError(jqXHR);
			});
		},
		/**
		 * Prepares Request Data to send to XSJS in DB through performRequestUpdate
		 * @param{integer} state -- integer representation of state(accepted/rejected) of given request
		 */
		prepareRequestData: function (state) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var detailADData = this.getModel("detailADModel").getData();
			var oRequestData = {};
			oRequestData.amount = detailADData.BETRAG;
			oRequestData.feedback = detailADData.FEEDBACK;
			oRequestData.midA = dbUserData.MID;
			oRequestData.midE = detailADData.MID;
			oRequestData.uid = detailADData.UID;
			oRequestData.state = state.toString();
			return oRequestData;
		},
		/**
		* Called when the approve Button is pressed. Initiates Request Update with Status "approved" passed
		* @param{sap.ui.base.Event} [oEvent] - oEvent

		 */
		approveRequestPressed: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			BusyIndicator.show();
			oEvent.getSource().focus();
			this.performRequestUpdate(2);
		},
		/**
		 * Called when reject Button is pressed. Initiates Request Update
		* @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		rejectRequestPressed: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			BusyIndicator.show();
			oEvent.getSource().focus();
			this.performRequestUpdate(0);
		},

	/*	_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("Mobilitaetskonto.Mobilitaetskonto.view.Edit");
				this.getView().addDependent(this._oDialog);
				console.log("Hallo");
			}
			return this._oDialog;
		}, Old Function, not needed anymore*/
		/**
		 * Funciton called when edit button is pressed. Gets the edit fragment and opens the dialog
		 */
		onbuttonpress: function () {
			var thisView = this.getView();
			if (!this._oDialog) {
				Fragment.load({
					id: thisView.getId(),
					name: "Mobilitaetskonto.Mobilitaetskonto.view.Edit",
					controller: this
				}).then(function (oDialog) {
					thisView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("openDialog").open();
			}
		},
		/** This function is called when cancel Button is pressed in edit fragment.
		 * Destroys the dialog
		* @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		closeDialog: function (oEvent) {
			this.byId("openDialog").destroy();
		},
		/** This funciton is called when update Button is pressed in edit fragment.
		 * reenables submit and cancel Button should they be disabled.
		 * Updates data in detailADModel with data from Fragment
		* @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		updateDialog: function (oEvent) {
			this.byId("openDialog").destroy();
			this.byId("submitButton").setEnabled(true);
			this.byId("rejectButton").setEnabled(true);
			this.byId("warningText").setVisible(false);

			this.byId("FormElementAlt").setVisible(true);

			//Inlcuding the following line results in automatically updating the 'alter Kontostand' to the previously entered 'Betrag'.
			//Without it, the 'alter Kontostand' value remains as the original one.
			//this.getModel("detailADModel").setProperty("/ALTBETRAG", this.getModel("detailADModel").getProperty("/BETRAG"));
			
			this.getModel("detailADModel").setProperty("/BETRAG", parseFloat(this.getModel("detailADModel").getProperty("/NEUBETRAG")));
			this.getModel("detailADModel").setProperty("/NEUBETRAG", 0);
			this.calcNewBalance();
			this.testDisableButton();
		},
		/** Function to calculate Account Balance after Request would be approved
		 */
		calcNewBalance: function () {

			var accBalance = this.getModel("detailADModel").getData().GUTHABEN;
			var requestValue = this.getModel("detailADModel").getData().BETRAG;
			console.log(requestValue, accBalance);
			var parsedAccBalance = parseFloat(accBalance);
			var parsedRequestValue = parseFloat(requestValue);

			this.getModel("detailADModel").setProperty("/RESULTBALANCE", parsedAccBalance + parsedRequestValue);
			console.log(this.getModel("detailADModel").getProperty("/RESULTBALANCE"));
		},
		/** Function to Download Attachment of Request. Requests XSJS from DB
		* @param{integer} aid - id of attachment to be downloaded
		 */
		performDownloadAttachment: function (aid) {
			// TODO: vielleicht in detailModel speichern als Art Cache, damit nicht immer wieder neu geladen wird?
			BusyIndicator.show();
			var params = {};
			params.aid = aid;

			var settings = this.prepareAjaxRequest("/MOB_ANTRAG_DOWNLOAD", "GET", params);

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					BusyIndicator.hide();
					var oResponse = JSON.parse(response);
					var link = document.createElement("a");
					link.href = oResponse.DATA;
					link.download = oResponse.FILENAME;
					link.click();
					link = null;
				})
				.fail(function (jqXHR, exception) {
					BusyIndicator.hide();
					that.handleNetworkError(jqXHR);
				});
		},
		/** Funcito to check whether Administrator is allowed to approve Request.
		 * If RequestValue > MaxApprovalValue the submit and reject Button will be disabled and a warning text displayed.
		* @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		testDisableButton: function(oEvent) {
			if(Math.abs(this.getModel("detailADModel").getProperty("/BETRAG")) > this.getModel("dbUserModel").getProperty("/FREIGABEWERT"))
			{
			this.byId("submitButton").setEnabled(false);
			this.byId("rejectButton").setEnabled(false);
			this.byId("warningText").setVisible(true);
				
			}
		},
		/** Function to perform Download when attachment is select.
		* @param{sap.ui.base.Event} [oEvent] - oEvent
		 * 
		 */
		onSelectChange: function (oEvent) {
			var aid = oEvent.getParameters().selectedItem.getProperty("documentId");
			this.performDownloadAttachment(aid);
			// deselect item again
			oEvent.getParameters().selectedItem.setSelected();
		},
		/** Function checks whether input in edit fragment is valid
		* @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		handleLiveChange : function(oEvent){
			var oSource = oEvent.getSource();
			var input = oSource.getValue();
			var lastInput = input.slice(-1); //retrieves last character
			
			//Punkt und Komma sind mehrmals möglich
			if(isNaN(lastInput) && !(lastInput === "-" && input.length === 1) && !(lastInput === "." || lastInput === ",") )
			{
				oSource.setValue(input.slice(0, input.length-1));	
			}
		}
	});
});