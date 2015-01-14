(function() {

	'use strict';

	angular.module('app.step5')
	.config(function ($stateProvider) {
		$stateProvider

		.state('step5', {
			url: '/step5/:id',
			templateUrl: 'app/step5/index.html',
			controller: 'Step5 as vm'
		});

	});
})();