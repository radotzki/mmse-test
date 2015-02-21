(function() {
	'use strict';

	angular.module('mmse', [
        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */ 
         'app.core',

        /*
         * Feature areas
         */
         'app.landing',
         'app.result',
         'app.storage',
         'app.helper',
         'app.step1',
         'app.step2',
         'app.step3',
         'app.step4',
         'app.step5',
         'app.step6'
         ]);

})();