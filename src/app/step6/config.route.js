(function() {

	'use strict';

	angular.module('app.step6')
	.config(function ($stateProvider) {
		$stateProvider

		.state('step6', {
			url: '/step6/:id',
			templateUrl: 'app/step6/index.html',
			controller: 'Step6 as vm'
		});

	});
})();