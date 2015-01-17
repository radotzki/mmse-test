(function() {
    'use strict';

    angular
        .module('app.landing')
        .controller('Landing', Landing);

    /* @ngInject */
    function Landing($state, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        vm.userId;
        vm.previousTests;
        vm.start = start;
        vm.history = history;

        function start() {
            appStorage.saveNewUser(vm.userId);
            $state.go('step1', {
                id: vm.userId
            });
        }

        function history() {
            appStorage.getAllUsers().then(function(resp) {
                vm.previousTests = _.filter(resp, function(user) {
                    return user.id && user.id == vm.userId;
                });
            });
        }

    }
})();
