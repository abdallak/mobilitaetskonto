/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (BaseController, formatter, JSONModel, Fragment) {
	"use strict";
	var employeeTableModel;
	var insertModel;

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableEmployees", {
		formatter: formatter,
		onInit: function () {
			employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");

			var staticModel = new JSONModel();
			this.setModel(staticModel, "staticModel");

			this.getRouter().getRoute("TableEmployees").attachMatched(this._onRoutePatternMatched, this);
		},

		//////MODELL INITIALISIEREN ODER SO??????
		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},

		getTableData: function (target) {
			var params = {};
			params.mid = null;
			var settings = this.prepareAjaxRequest("/MOB_MITARBEITER_GET", "GET", params);
			var that = this;
			$.ajax(settings).done(function (response) {
				employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		setRequest: function (mid) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var staticModel = this.getModel("staticModel").getData();
			var betr = staticModel.betrag;
			var besch = staticModel.beschreibung;

			console.log(staticModel);
			console.log(staticModel.betrag);
			//var betr = 1;
			//var besch = "test";

			var defaultRequest = {
				"MID": mid,
				"art": 2,
				"betrag": betr,
				"beschreibung": besch,
				"kid": 1, //nicht schön
				"state": 2,
				"MIDV": dbUserData.MID

			};
			insertModel = new JSONModel(defaultRequest);
			this.setModel(insertModel, "insertModel");
			console.log(insertModel);
		},

		makeRequest: function (oEvent) {
			var insertData = this.getModel("insertModel").getData();
			console.log(insertData);

			var settings = this.prepareAjaxRequest("/MOB_ANTRAG", "POST", JSON.stringify(insertData));
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					that.getTableData();
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("employeeTableModel");
			var path = context.getPath();
			var detail = JSON.stringify(context.getProperty(path));
			this.getRouter().navTo("DetailEmployee", {
				DetailEmployee: detail
			});
		},

		dialogButton: function (oEvent, dialogId) {
			//var dialogId = "AbschlussDialog";
			var thisView = this.getView();
			// create dialog lazily
			if (!this.byId(dialogId)) {
				// load asynchronous XML fragment
				Fragment.load({
					id: thisView.getId(),
					name: "Mobilitaetskonto.Mobilitaetskonto.view.".concat(dialogId),
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					thisView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId(dialogId).open();

			}
		},

		onAbortCloseDialog: function (oEvent, dialogId) {
			this.byId(dialogId).close();
		},

		onExecuteAndCloseDialog: function () {
			//TODO FEHLERMELDUNG bei keinen angewählten?
			var thisView = this.getView();
			var SelectedItems = thisView.byId("table0").getSelectedItems();

			var SelectedMID = []; //so lang machen wie selecteditems
			for (var i = 0; i < SelectedItems.length; i++) {

				var context = SelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();
				SelectedMID.push(context.getProperty(path).MID);

			}

			for (var j = 0; j < SelectedMID.length; j++) {
				this.setRequest(SelectedMID[j]);
				this.makeRequest();
			}
			//closing the dialog box
			this.byId("GuthabenDialog").close();

		}
	});
});