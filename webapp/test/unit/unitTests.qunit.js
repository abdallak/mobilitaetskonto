/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
<<<<<<< HEAD
		"mobilitaetskonto/mobilitaetskonto/test/unit/AllTests"
=======
<<<<<<< HEAD
		"mobilitaetskonto/mobilitaetskonto/test/unit/AllTests"
=======
		"Mobilitaetskonto/Mobilitaetskonto/test/unit/AllTests"
>>>>>>> refs/heads/master
>>>>>>> refs/heads/master
	], function () {
		QUnit.start();
	});
});