(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngSanitize',
        /*
         * Our reusable cross app code modules
         */
         // 'blocks.logger', 'blocks.exception',
        /*
         * 3rd Party modules
         */
        'ui.router', 'ui.bootstrap'
    ]);
})();
