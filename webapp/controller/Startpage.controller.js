sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";

	/**
	 * Die Startpage ist der erste View der von dieser App geladen wird.
	 * Er zeigt je nach Rolle nur die Mitarbeiter Kacheln an oder auch die der Verwaltung.
	 * @class Startpage
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {
		/**
		 * Globales JSON Model mit den aktuellen Mitarbeiter Daten aus der Datenbank
		 * @typedef dbUserModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {number} GUTHABEN - Guthaben des aktuellen Nutzers
		 */

		/**
		 * Globales JSON Model mit den Rollen des aktuellen Nutzers
		 * @typedef roleModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {boolean} mitarbeiter Ist aktueller Nutzer ein Mitarbeiter
		 * @property {boolean} verwalter Ist aktueller Nutzer ein Verwalter
		 */

		/**
		 * oEvent Objekt des Routers
		 * @typedef oEvent
		 * @type {sap.ui.base.Event}
		 */

		/**
		 * Diese Funktion wird gerufen, nachdem der View erstellt wurde.
		 */
		onInit: function () {
			this.getRouter().getRoute("Startpage").attachMatched(this._onRoutePatternMatched, this);
		},

		/**
		 * Wenn die Seite erneut aufgerufen wird, dann wird diese Funktion ausgeführt.
		 * Sie aktualsiert das dbUserModel, damit der angezeigte Kontostand aktuell ist.
		 * 
		 * @param {oEvent} oEvent - Das oEvent des Routers
		 */
		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
		},

		/**
		 * Diese Funktion wird über eine Kachel gerufen und navigiert zur Umsatzübersicht des Mitarbeiters.
		 */
		onNavToSales: function () {
			this.getRouter().navTo("TableSales", {
				Target: "TableSales"
			});
		},

		/**
		 * Diese Funktion wird über eine Kachel gerufen und navigiert zu den gestellten Anträgen des Mitarbeiters.
		 */
		onNavToSubmittedRequests: function () {
			this.getRouter().navTo("TableSales", {
				Target: "SubmittedRequests"
			});
		},

		/**
		 * Diese Funktion wird über eine Kachel gerufen und navigiert zu einem neuen Antrag.
		 */
		onNavToRequest: function () {
			this.getRouter().navTo("Request");
		},

		/**
		 * Diese Funktion wird über eine Kachel gerufen und navigiert zu der Übersicht der Anträge für die Verwaltung.
		 */
		onNavToRequestTable: function () {
			this.getRouter().navTo("TableRequests");
		},

		/**
		 * Diese Funktion wird über eine Kachel gerufen und navigiert zu der Liste der aktiven Mitarbeiter.
		 */
		onNavToTableEmployees: function () {
			this.getRouter().navTo("TableEmployees");
		},

		/**
		 * Diese Funktion wird über eine Kachel gerufen und navigiert zu den Konfigurationsmöglichkeiten für den Verwalter.
		 */
		onNavToSettings: function () {
			this.getRouter().navTo("Settings");
		}

	});
});