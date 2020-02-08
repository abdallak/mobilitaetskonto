/*eslint-disable no-console, no-alert */
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (JSONModel, BaseController, formatter, MessageToast, Fragment) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.DetailAdministration", {
		formatter: formatter,
		onInit: function () {
			this.getRouter().getRoute("DetailAdministration").attachMatched(this._onRoutePatternMatched, this);
			var detailADModel = new JSONModel();
			this.setModel(detailADModel, "detailADModel");
			var detailADUserModel = new JSONModel();
			this.setModel(detailADUserModel, "detailADUserModel");
			var editADModel = new JSONModel();
			this.setModel(editADModel, "editADModel");
			

		},

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
				detailADModel.setData(oStorage.get("requestTableLocalData"));
			} else {
				oStorage.put("requestTableLocalData", detailADModel.getData());
			}

			//STATUSAENDERUNGEN VERMEIDEN, WENN ANTRAG NICHT AUSSTEHEND IST
			var acc = this.getView().byId("submitButton");
			var cnc = this.getView().byId("cancelButton");
			var fb = this.getView().byId("areaFeedback");
			var edit = this.getView().byId("button0");
			var resBalance = this.getView().byId("resultingBalance");

			if (detail.STATUS !== 1) {
				edit.setEnabled(false);
				resBalance.setVisible(false);
				fb.setBlocked(true);
				fb.setRequired(false);
				acc.setEnabled(false);
				cnc.setEnabled(false);
			} else {
				edit.setEnabled(true);
				resBalance.setVisible(true);
				this.calcNewBalance();
				fb.setBlocked(false);
				fb.setRequired(true);
				acc.setEnabled(true);
				cnc.setEnabled(true);
			}
		},
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
		performRequestUpdate: function (state) {
			var oRequestData = this.prepareRequestData(state);
			if (!oRequestData.feedback || oRequestData.feedback.trim().length === 0) {
				this.handleEmptyModel("Feedback Feld ung\xFCltig.");
				return;
			}
			var settings = this.prepareAjaxRequest("/MOB_ANTRAG_HANDLE", "POST", JSON.stringify(oRequestData));
			var that = this;
			$.ajax(settings).done(function (response) {
				that.onNavBack();
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},
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
		approveRequestPressed: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();
			this.performRequestUpdate(2);
		},
		rejectRequestPressed: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();
			this.performRequestUpdate(0);
		},
		/**
		 *@memberOf Mobilitaetskonto.Mobilitaetskonto.controller.DetailAdministration
		 */
		_getDialog : function () {
         if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment("Mobilitaetskonto.Mobilitaetskonto.view.Edit");
            this.getView().addDependent(this._oDialog);
            console.log("Hallo");
         }
         return this._oDialog;
      },
      onbuttonpress : function () {
         var thisView = this.getView();
          if (!this._oDialog) {
          	Fragment.load({	
          		id: thisView.getId(),
          		name: "Mobilitaetskonto.Mobilitaetskonto.view.Edit",
          		controller: this
      }).then(function (oDialog){
      	thisView.addDependent(oDialog);
      	oDialog.open();
      });}
      else {
      	this.byId("openDialog").open();
      }
      },

   
		
		closeDialog : function (oEvent) {
			this.byId("openDialog").destroy();
		},
		
		updateDialog : function (oEvent) {
			this.byId("openDialog").destroy();
		

			this.byId("FormElementAlt").setVisible(true);
		
			this.getModel("detailADModel").setProperty("/ALTBETRAG", this.getModel("detailADModel").getProperty("/BETRAG"));
			this.getModel("detailADModel").setProperty("/BETRAG", this.getModel("detailADModel").getProperty("/NEUBETRAG"));
			this.getModel("detailADModel").setProperty("/NEUBETRAG", 0);
			this.calcNewBalance();

		},
		
		calcNewBalance : function(){

			var accBalance = this.getModel("detailADModel").getData().GUTHABEN;
			var val = this.getModel("detailADModel").getData().BETRAG;
			console.log(val, accBalance);
			var a = parseFloat(accBalance);
			var b = parseFloat(val);
			
			this.getModel("detailADModel").setProperty("/RESULTBALANCE", a + b);
			console.log(this.getModel("detailADModel").getProperty("/RESULTBALANCE"));
		},

		performDownloadAttachment: function (aid) {
			// TODO: vielleicht in detailModel speichern als Art Cache, damit nicht immer wieder neu geladen wird?
			var params = {};
			params.aid = aid;

			var settings = this.prepareAjaxRequest("/MOB_ANTRAG_DOWNLOAD", "GET", params);

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

		onSelectChange: function (oEvent) {
			var aid = oEvent.getParameters().selectedItem.getProperty("documentId");
			this.performDownloadAttachment(aid);
			// deselect item again
			oEvent.getParameters().selectedItem.setSelected();
		}
	});
});
 
