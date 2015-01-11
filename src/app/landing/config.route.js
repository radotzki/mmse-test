(function() {

	'use strict';

	angular.module('app.landing')
	.config(function ($stateProvider) {
		$stateProvider

		.state('landing', {
			url: '/landing',
			templateUrl: 'app/landing/index.html',
			controller: 'Landing as vm'
		});

	});
})();