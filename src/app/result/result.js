(function () {
    'use strict';

    angular
        .module('app.result')
        .controller('Result', Result);

    /* @ngInject */
    function Result($stateParams, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        vm.user;
        vm.total = {score: 0, time: 0};

        activate();

        function activate() {
            vm.user = appStorage.getUser($stateParams.id);
            calcTotal();
            console.log(vm.user);
        }

        function calcTotal () {
        }

    }
})();
