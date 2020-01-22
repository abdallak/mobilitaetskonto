sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "Sales";
	Opa5.createPageObjects({
		onTheSalesPage: {

			actions: {},

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
				}
			}
		}
	});

});