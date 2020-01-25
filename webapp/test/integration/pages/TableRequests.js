sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";

	var sViewName = "TableRequests";
	var sTableId = "requestTableId";

	Opa5.createPageObjects({
		onTheRequestTablePage: {

			actions: {},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The TableRequests view is displayed");
						},
						errorMessage: "Did not find the TableRequests view"
					});
				},

				iShouldSeeTheTable: function () {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The requestTable table is displayed");
						},
						errorMessage: "Did not find requestTable table"
					});
				},

				iShouldSeeTheColumn: function (sId) {
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The requestTable table " + sId + " is displayed");
						},
						errorMessage: "Did not find requestTable table" + sId
					});
				},

				iShouldSeeTheColumnListItem: function () {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "A column list item is displayed");
						}
					});
				},

				iShouldSeeTheActionSelect: function (sId) {
					return this.waitFor({
						controlType: "sap.m.ActionSelect",
						id: sId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "A ActionSelect is displayed");
						}
					});
				},

				iShouldSeeTheSearchField: function (sId) {
					return this.waitFor({
						controlType: "sap.m.SearchField",
						id: sId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "A SearchField item is displayed");
						}
					});

				}
			}
		}
	});

});