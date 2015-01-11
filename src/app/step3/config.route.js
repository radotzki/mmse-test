(function() {

	'use strict';

	angular.module('app.step3')
	.config(function ($stateProvider) {
		$stateProvider

		.state('step3', {
			url: '/step3/:id/:state',
			templateUrl: 'app/step3/index.html',
			controller: 'Step3 as vm'
		});

	});
})();