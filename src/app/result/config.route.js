(function() {

	'use strict';

	angular.module('app.result')
	.config(function ($stateProvider) {
		$stateProvider

		.state('result', {
			url: '/result/:id',
			templateUrl: 'app/result/index.html',
			controller: 'Result as vm'
		});

	});
})();