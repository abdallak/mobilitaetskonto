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

	opaTest("It should be possible to send a valid request", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTile();

		Then.onTheRequestPage.iShouldSeeTheApp();
		/* TODO
				When.onTheRequestPage.iClickOnTheTypeButton("0")
					.and.iSelectACategory("1")
					.and.iEnterTextForAmount("0.01")
					.and.iEnterTextForDescription("valid 1ct test")
					.and.iClickOnTheSubmitButton();
		*/
		
		// FIXME: ist scheinbar ok auch wenn oben auskommentiert und auf falschem view
		// Assertions & Cleanup
		Then.onTheStartpage.iShouldSeeTheApp()
			.and.iTeardownMyApp();
	});

});