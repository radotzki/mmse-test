(function () {
    'use strict';

    angular
        .module('app.step1')
        .controller('Step1', Step1);

    /* @ngInject */
    function Step1($interval, $stateParams, $state, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        var timer;
        vm.date;
        vm.season;
        vm.timerCount;
        vm.next = next;

        activate();

        function activate() {
            startTimer();
        }

        function startTimer() {
            vm.timerCount = 0;;
            timer = $interval(function () {
                vm.timerCount++;
            }, 1000);
        }

        function next() {
            $interval.cancel(timer);
            timer = undefined;

            var step = {
                time: vm.timerCount,
                score: calculateScore()
            };

            appStorage.saveDecreased(vm.decrease);
            appStorage.saveStep($stateParams.id, step, 1);
            $state.go('step2', {
                id: $stateParams.id
            });
        }

        function calculateScore() {
            var season = '';
            switch (new Date().getMonth() + 1) {
                case 12:
                case 1:
                case 2:
                    season = 'winter';
                    break;
                case 3:
                case 4:
                case 5:
                    season = 'spring';
                    break;
                case 6:
                case 7:
                case 8:
                    season = 'summer';
                    break;
                case 9:
                case 10:
                case 11:
                    season = 'fall';
                    break;
            }

            console.log("time in seconds:", vm.timerCount);
            console.log("answer:", vm.date, vm.season);
            console.log("correct-answer:", new Date(), season);
            console.log("100 - 7 = ",vm.decrease);
            return 0;
        }

    }
})();
