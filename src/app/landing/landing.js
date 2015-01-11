(function () {
    'use strict';

    angular
        .module('app.landing')
        .controller('Landing', Landing);

    /* @ngInject */
    function Landing($state, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        vm.userId;
        vm.start = start;

        function start() {
            appStorage.saveNewUser(vm.userId);
            $state.go('step1', {
                id: vm.userId
            });
        }

    }
})();
