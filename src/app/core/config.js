(function() {
	'use strict';

	angular
	.module('app.core')
	.config(configState)

	/* @ngInject */
	function configState ($urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/landing');
	}
	

})();