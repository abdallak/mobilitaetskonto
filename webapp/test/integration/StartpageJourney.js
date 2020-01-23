	/*global QUnit*/

	sap.ui.define([
		"sap/ui/test/opaQunit",
		"./pages/Startpage",
		"./pages/Request",
		"./pages/Sales"
	], function (opaTest) {
		"use strict";

		QUnit.module("Startpage Journey");

		opaTest("Should see the startpage with all tiles", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			//Assertions
			Then.onTheStartpage.iShouldSeeTheApp();
			Then.onTheStartpage.iShouldSeeTheRequestTile();
			Then.onTheStartpage.iShouldSeeTheSalesTile();
			Then.onTheStartpage.iShouldSeeTheCurrentBalance();

			// Cleanup
			Then.iTeardownMyApp();
		});

		opaTest("There should be a clickable request tile on the startpage", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Actions
			When.onTheStartpage.iClickOnTheRequestTile();

			// Assertions & Cleanup
			Then.onTheRequestPage.iShouldSeeTheApp()
				.and.iTeardownMyApp();
		});

		opaTest("The back button of the request view should lead back to the startpage", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Actions
			When.onTheStartpage.iClickOnTheRequestTile();

			Then.onTheRequestPage.iShouldSeeTheApp();

			When.onTheRequestPage.iClickOnTheCancelButton();

			// Assertions & Cleanup
			Then.onTheStartpage.iShouldSeeTheApp()
				.and.iTeardownMyApp();
		});

		opaTest("There should be a clickable sales tile on the startpage", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Actions
			When.onTheStartpage.iClickOnTheSalesTile();

			// Assertions & Cleanup
			Then.onTheSalesPage.iShouldSeeTheApp()
				.and.iTeardownMyApp();
		});

		opaTest("The back button of the sales view should lead back to the startpage", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Actions
			When.onTheStartpage.iClickOnTheSalesTile();

			Then.onTheStartpage.iShouldSeeTheApp();

			When.onTheSalesPage.iClickOnTheBackButton();

			// Assertions & Cleanup
			Then.onTheStartpage.iShouldSeeTheApp()
				.and.iTeardownMyApp();
		});

	});