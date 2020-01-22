	/*global QUnit*/

	sap.ui.define([
		"sap/ui/test/opaQunit",
		"./pages/Startpage",
		"./pages/Request",
		"./pages/Sales",
		"./pages/Detail"
	], function (opaTest) {
		"use strict";

		QUnit.module("Navigation Journey");

		opaTest("Should see the initial page of the app", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Assertions
			Then.onTheStartpage.iShouldSeeTheApp();
			Then.onTheStartpage.iShouldSeeTheRequestTile();
			Then.onTheStartpage.iShouldSeeTheSalesTile();
			Then.onTheStartpage.iShouldSeeTheCurrentBalance();

			//Cleanup
			Then.iTeardownMyApp();
		});

		opaTest("There should be a clickable request tile on the startpage", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Assertions
			Then.onTheStartpage.iShouldSeeTheApp();
			Then.onTheStartpage.iShouldSeeTheRequestTile();

			//Actions
			When.onTheStartpage.iClickOnTheRequestTile();

			// Assertions
			Then.onTheRequestPage.iShouldSeeTheApp();

			//Cleanup
			Then.iTeardownMyApp();
		});

		opaTest("There should be a clickable sales tile on the startpage", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Assertions
			Then.onTheStartpage.iShouldSeeTheApp();
			Then.onTheStartpage.iShouldSeeTheSalesTile();

			//Actions
			When.onTheStartpage.iClickOnTheSalesTile();

			// Assertions
			Then.onTheSalesPage.iShouldSeeTheApp();

			//Cleanup
			Then.iTeardownMyApp();
		});

	});