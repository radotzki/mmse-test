(function() {

	'use strict';

	angular.module('app.step2')
	.config(function ($stateProvider) {
		$stateProvider

		.state('step2', {
			url: '/step2/:id',
			templateUrl: 'app/step2/index.html',
			controller: 'Step2 as vm'
		});

	});
})();