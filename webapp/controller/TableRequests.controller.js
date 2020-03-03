/*eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (BaseController, formatter, Filter, FilterOperator, JSONModel, BusyIndicator) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableRequests", {
		formatter: formatter,

		onInit: function () {
			var requestTableModel = new JSONModel();
			this.setModel(requestTableModel, "requestTableModel");
			this.filterTable(); //pre-filtering the table - the default selected status is 'pending(ausstehend)'
			
			var picker = this.getView().byId("rangepicker0");
			picker.setMaxDate(new Date()); //declares the maximum date as todays date

			this.getRouter().getRoute("TableRequests").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.getTableData();
		},


		/**
		* This function simply retrieves all available transactions and displays them in the table
		* with the help of the model.
		*/
		getTableData: function () {
			var settings = this.prepareAjaxRequest("/MOB_ANTRAG_TABELLE", "GET");

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var requestTableModel = that.getModel("requestTableModel");
					requestTableModel.setData(response);
					console.log(requestTableModel);
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},
		
		
		
		/**
		* This function is used for navigation and parameter passing between the actual view and the administration's detail view.
		* The function will be triggered after selecting a single transaction inside the table.
		* The data related to the selected transactions is passed as stringified JSON Object through the router.
		*/
		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("requestTableModel");
			var path = context.getPath();
			var detail = JSON.stringify(context.getProperty(path));

			this.getRouter().navTo("DetailAdministration", {
				Detail: detail
			});
		},

		/**
		* The Function simply calls a confirmation dialog.
		* After accepting, the function sets the status of the previously marked transactions to 'carried out (durchgeführt)'.
		* Afterwards the table content is refreshed.
		* In case of declining the confirmation dialog, the selected checkboxes will be resetted.
		*/
		onMarkAsTransacted: function () {
			var oTab = this.byId("requestTableId");
			var aSelected = [];

			oTab.getItems().forEach(function (item) { // loop over all the items in the table
				var oCheckBoxCell = item.getCells()[6]; //fetch the cell which holds the checkbox for that row.
				if (oCheckBoxCell.getSelected()) {
					var iUID = oCheckBoxCell.getBindingContext("requestTableModel").getProperty("UID");
					aSelected.push(iUID);
				}
			});
			if (aSelected.length === 0) {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtLeastOne"));
				return;
			}

			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var oSelected = {
				selection: aSelected,
				midA: dbUserData.MID
			};

			sap.m.MessageBox.show(this.getResourceBundle().getText("markAsTransactedMessageBox"), {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === "YES") {
						var settings = this.prepareAjaxRequest("/MOB_ANTRAG_DURCHGEFUEHRT", "POST", JSON.stringify(oSelected));

						var that = this;
						$.ajax(settings)
							.done(function (response) {
								that._onRoutePatternMatched(null);
							})
							.fail(function (jqXHR, exception) {
								that.handleNetworkError(jqXHR);
							});

					} else {
						this.resetSelection();
					}
				}.bind(this)
			});
		},
		
		/**
		* This Function is called after declining the JahresabschlussPopUp.
		* After execution, all checked checkboxes are deselected.
		*/
		resetSelection: function () {
			var oTab = this.byId("requestTableId");

			oTab.getItems().forEach(function (item) { // loop over all the items in the table
				var oCheckBoxCell = item.getCells()[6]; //fetch the cell which holds the checkbox for that row.
				oCheckBoxCell.setSelected(false);
			});
		},

		/**
		* This Function is used by the three filter controls of the UI. The SearchBar, the DateRangePicker and the ActionSelect.
		* Everytime one of these is used, this method gets called.
		* The method provides a final filter consisting of several others, related to the input given by the controls.
		*/
		filterTable: function () {

			var dateRangePicker = this.getView().byId("rangepicker0");
			var minDate = dateRangePicker.getDateValue();
			var maxDate = dateRangePicker.getSecondDateValue();
			var sSearchQuery = this.getView().byId("searchField0").getProperty("value");
			var sStateKey = this.getView().byId("select0").getProperty("selectedKey");

			var filters = [];
			var singleFilters = [];
			var oFoState = FilterOperator.EQ;

			//STATUS FILTER
			//This is a special case, where the '-' in the ActionSelect is selected, a different Operator is required to show all the data. 
			if (sStateKey === "4") {
				oFoState = FilterOperator.LE; // LE = Lesser or equal
			}
			var oStateFilter = new Filter("STATUS", oFoState, sStateKey);
			singleFilters.push(oStateFilter);

			//SEARCHBAR FILTER
			if (sSearchQuery !== "") {

				var oSearchFilter = new Filter([
						new Filter("NAME", FilterOperator.Contains, sSearchQuery),
						new Filter("VORNAME", FilterOperator.Contains, sSearchQuery),
						new Filter("BETRAG", FilterOperator.EQ, parseFloat(sSearchQuery))
					],
					false);

				singleFilters.push(oSearchFilter);
			}

			//DATE FILTER
			if (minDate !== null && maxDate !== null) {
				var oDateFilter = new Filter("DATUM", FilterOperator.BT, minDate.toISOString(), maxDate.toISOString());
				singleFilters.push(oDateFilter);
			}

			var oFinalFilter = new Filter(singleFilters, true);
			filters.push(oFinalFilter);

			this.bindFilters(filters);
		},

		bindFilters: function (filterArr) {
			var list = this.getView().byId("requestTableId");
			var binding = list.getBinding("items");
			binding.filter(filterArr);
		}
	});
});