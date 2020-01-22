sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (Opa5, Press) {
	"use strict";

	var sViewName = "Sales";
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
				}
			}
		}
	});
});