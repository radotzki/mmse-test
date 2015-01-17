(function() {
    'use strict';

    angular
        .module('app.result')
        .controller('Result', Result);

    /* @ngInject */
    function Result($stateParams, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        vm.user;
        vm.previousTests;
        vm.total = {
            score: 0,
            time: 0
        };

        activate();

        function activate() {
            vm.user = appStorage.getUser($stateParams.id);
            calcTotal();
            getPrevious().then(function(){
                appStorage.saveUserToDB(vm.user);
            });
            
        }

        function getPrevious() {
            return appStorage.getAllUsers().then(function(resp) {
                vm.previousTests = _.filter(resp, function(user) {
                    return user.id && user.id == $stateParams.id;
                });
            });
        }

        function calcTotal() {
            vm.user.totalScore = 0;
            vm.user.totalTime = 0;

            for (var i = 1; i < 7; i++) {
                vm.user.totalScore += vm.user[i].score;
                vm.user.totalTime += vm.user[i].time;
            }
        }

    }
})();
