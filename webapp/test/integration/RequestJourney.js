/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Startpage",
	"./pages/Request",
	"./pages/TableSales"
], function (opaTest) {
	"use strict";

	QUnit.module("Request Journey");

	var validDescriptionValues = [""];
	var invalidDescriptionValues = [" ", null, ""];
	var validAmountValues = [""];
	var invalidAmountValues = ["Request", ",2s", "dhfakjwe", "489ru3", "-1,2", "-1.2", "3i2", "12,.2"];

	opaTest("The request view should be reachable", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		//Assertions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("It should not be possible to send an empty request", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();

		When.onTheRequestPage.iClickOnTheSubmitButton();

		// Assertions & Cleanup
		// FIXME: schauen, ob rote error Felder
		// Then.onTheRequestPage.iShouldSeeInputErrorMessage("amount");
		// Then.onTheRequestPage.iShouldSeeInputErrorMessage("description");
		Then.onTheRequestPage.iShouldSeeAnErrorMessage();
		When.onTheRequestPage.iCloseTheErrorMessage();
		Then.onTheRequestPage.iTeardownMyApp();
	});

	opaTest("It should not be possible to send a request with an empty amount field", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();

		When.onTheRequestPage.iClickOnTheTypeButton("0")
			.and.iSelectACategory("1")
			.and.iEnterTextForDescription("valid 1ct test")
			.and.iClickOnTheSubmitButton();

		// Assertions & Cleanup
		// Then.onTheRequestPage.iShouldSeeInputErrorMessage("amount");
		Then.onTheRequestPage.iShouldSeeAnErrorMessage();
		When.onTheRequestPage.iCloseTheErrorMessage();
		Then.onTheRequestPage.iTeardownMyApp();
	});

	opaTest("It should not be possible to send a request with an invalid amount field", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();

		invalidAmountValues.forEach(function (entry) {

			When.onTheRequestPage.iClickOnTheTypeButton("0")
				.and.iSelectACategory("1")
				.and.iEnterTextForAmount(entry)
				.and.iEnterTextForDescription("test")
				.and.iClickOnTheSubmitButton();

			// Assertions & Cleanup
			// Then.onTheRequestPage.iShouldSeeInputErrorMessage("amount");
			Then.onTheRequestPage.iShouldSeeAnErrorMessage();
			When.onTheRequestPage.iCloseTheErrorMessage();
		});

		Then.onTheRequestPage.iTeardownMyApp();
	});

	opaTest("It should not be possible to send a request with an empty description field", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();

		When.onTheRequestPage.iClickOnTheTypeButton("0")
			.and.iSelectACategory("1")
			.and.iEnterTextForAmount("0.01")
			.and.iClickOnTheSubmitButton();

		// Assertions & Cleanup
		// Then.onTheRequestPage.iShouldSeeInputErrorMessage("description");
		Then.onTheRequestPage.iShouldSeeAnErrorMessage();
		When.onTheRequestPage.iCloseTheErrorMessage();
		Then.onTheRequestPage.iTeardownMyApp();
	});

	opaTest("It should not be possible to send a request with an invalid description field", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();

		invalidDescriptionValues.forEach(function (entry) {

			When.onTheRequestPage.iClickOnTheTypeButton("0")
				.and.iSelectACategory("1")
				.and.iEnterTextForAmount("0.01")
				.and.iEnterTextForDescription(entry)
				.and.iClickOnTheSubmitButton();

			// Assertions & Cleanup
			// Then.onTheRequestPage.iShouldSeeInputErrorMessage("description");
			Then.onTheRequestPage.iShouldSeeAnErrorMessage();
			When.onTheRequestPage.iCloseTheErrorMessage();
		});

		Then.onTheRequestPage.iTeardownMyApp();
	});

	opaTest("It should be possible to send a valid request", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();

		When.onTheRequestPage.iClickOnTheTypeButton("1")
			.and.iSelectACategory("1")
			.and.iEnterTextForAmount("0.01")
			.and.iEnterTextForDescription("valid 1ct test")
			.and.iClickOnTheSubmitButton();

		// Assertions & Cleanup
		Then.onTheSalesPage.iShouldSeeTheApp()
			.and.iTeardownMyApp();
	});

});