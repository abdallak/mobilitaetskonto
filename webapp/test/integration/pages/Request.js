sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/Ancestor"
], function (Opa5, Press, EnterText, Properties, Ancestor) {
	"use strict";

	var sViewName = "Request";
	var sCancelButtonId = "cancelButton";
	var sSubmitButtonId = "submitButton";

	var sTypePayoutButtonId = "payout";
	var sTypeCreditButtonId = "credit";
	var sCategorySelectId = "select0";
	var sAmountInputId = "amount";
	var sDescriptionInputId = "description";

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
				},

				iClickOnTheSubmitButton: function () {
					return this.waitFor({
						id: sSubmitButtonId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "submit button cannot be pressed"
					});
				},

				iClickOnTheTypeButton: function (sTypeKey) {
					return this.waitFor({
						id: sTypeKey === "1" ? sTypeCreditButtonId : sTypePayoutButtonId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: sTypeKey === "1" ? sTypeCreditButtonId : sTypePayoutButtonId + " button cannot be pressed"
					});
				},

				iSelectACategory: function (categoryKey) {
					return this.waitFor({
						id: sCategorySelectId,
						viewName: sViewName,
						actions: new Press(),
						success: function (oSelect) {
							this.waitFor({
								controlType: "sap.ui.core.Item",
								matchers: [
									new Ancestor(oSelect),
									new Properties({
										key: categoryKey
									})
								],
								actions: new Press(),
								errorMessage: "Cannot select category: " + categoryKey
							});
						},
						errorMessage: "Could not find category select view"
					});
				},

				iEnterTextForAmount: function (sText) {
					return this.waitFor({
						id: sAmountInputId,
						viewName: sViewName,
						actions: [new EnterText({
							text: sText,
							clearTextFirst: true
						})],
						errorMessage: "The amount text cannot be entered"
					});
				},

				iEnterTextForDescription: function (sText) {
					return this.waitFor({
						id: sDescriptionInputId,
						viewName: sViewName,
						actions: [new EnterText({
							text: sText,
							clearTextFirst: true
						})],
						errorMessage: "The decription text cannot be entered"
					});
				},

				iCloseTheErrorMessage: function () {
					return this.waitFor({
						searchOpenDialogs: true,
						id: "errorMessageBox",

						autoWait: false,
						actions: [new Press()]

					});
				}

			},

			/*
			success: function (oMessageBox) {
										oMessageBox.close();
										Opa5.assert.ok(true, "The MessageBox was closed");
									}
									*/
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
				},

				iShouldSeeAnErrorMessage: function () {
					return this.waitFor({
						id: "errorMessageBox",
						searchOpenDialogs: true,
						success: function () {
							Opa5.assert.ok(true, "Error Message Box is shown");
						},
						errorMessage: "Did not find the Error Message Box"
					});
				},

				iShouldSeeErrorMessage: function (inputId) {
					return this.waitFor({
						id: inputId,
						controlType: "sap.m.Input",
						matchers: new sap.ui.test.matchers.Properties({
							ValueState: "Error"
						}),
						success: function () {
							Opa5.assert.ok(true, "The Error message is displayed");
						},
						errorMessage: "Did not see the error message"
					});
				}
			}
		}
	});
});