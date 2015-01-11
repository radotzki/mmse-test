(function() {

	'use strict';

	angular.module('app.step1')
	.config(function ($stateProvider) {
		$stateProvider

		.state('step1', {
			url: '/step1/:id',
			templateUrl: 'app/step1/index.html',
			controller: 'Step1 as vm'
		});

	});
})();