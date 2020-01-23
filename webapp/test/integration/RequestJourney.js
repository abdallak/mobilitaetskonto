/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Startpage",
	"./pages/Request",
	"./pages/Sales"
], function (opaTest) {
	"use strict";

	QUnit.module("Request Journey");

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

		// TODO schauen, ob rote error Felder

		// Assertions & Cleanup
		Then.onTheRequestPage.iShouldSeeAnErrorMessage();
		When.onTheRequestPage.iCloseTheErrorMessage();
		Then.onTheRequestPage.iTeardownMyApp();
	});

	opaTest("It should be possible to send a valid request", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();

		When.onTheRequestPage.iClickOnTheTypeButton("0")
			.and.iSelectACategory("1")
			.and.iEnterTextForAmount("0.01")
			.and.iEnterTextForDescription("valid 1ct test")
			.and.iClickOnTheSubmitButton();

		// Assertions & Cleanup
		Then.onTheSalesPage.iShouldSeeTheApp()
			.and.iTeardownMyApp();
	});

});