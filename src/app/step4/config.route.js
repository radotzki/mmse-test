(function() {

	'use strict';

	angular.module('app.step4')
	.config(function ($stateProvider) {
		$stateProvider

		.state('step4', {
			url: '/step4/:id',
			templateUrl: 'app/step4/index.html',
			controller: 'Step4 as vm'
		});

	});
})();