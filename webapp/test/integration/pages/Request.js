sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (Opa5, Press) {
	"use strict";

	var sViewName = "Request";
	var sCancelButtonId = "cancelButton";

	Opa5.createPageObjects({
		onTheRequestPage: {

			actions: {

				iClickOnTheCancelButton: function () {
					return this.waitFor({
						id: sCancelButtonId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "cancel button cannot be pressed"
					});
				}

			},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Request view is displayed");
						},
						errorMessage: "Did not find the Request view"
					});
				}
			}
		}
	});
});