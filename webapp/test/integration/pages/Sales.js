sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (Opa5, Press) {
	"use strict";

	var sViewName = "Sales";
	var sTableId = "table0";
	var sBackButtonId = "backButton";
	Opa5.createPageObjects({
		onTheSalesPage: {

			actions: {

				iClickOnTheBackButton: function () {
					return this.waitFor({
						id: sBackButtonId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "back button cannot be pressed"
					});
				},
				iClickOnTheColumnListItem: function () {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "column list item cannot be pressed"
					});
				}
				
			},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Sales view is displayed");
						},
						errorMessage: "Did not find the Sales view"
					});
				},
				
				iShouldSeeTheTable: function () {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Sales table is displayed");
						},
						errorMessage: "Did not find Sales table"
					});
				},
				
				iShouldSeeTheColumn: function (sId) {
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Sales table " + sId + " is displayed");
						},
						errorMessage: "Did not find Sales table" + sId
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
				}
			}
		}
	});
});