(function () {
    'use strict';

    angular
        .module('app.step5')
        .controller('Step5', Step5);

    /* @ngInject */
    function Step5($interval, $stateParams, $state, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        var timer;
        var timerCount;
        vm.answer;
        vm.decreasedNumber;
        vm.next = next;

        activate();

        function activate() {
            startTimer();
            vm.decreasedNumber = appStorage.getDecreased();
        }

        function startTimer() {
            timerCount = 0;;
            timer = $interval(function () {
                timerCount++;
            }, 1000);
        }

        function next() {
            $interval.cancel(timer);
            timer = undefined;

            var step = {
                time: timerCount,
                score: calculateScore()
            };

            appStorage.saveDecreased(vm.decrease);
            appStorage.saveStep($stateParams.id, step, 5);
            $state.go('step6', {
                id: $stateParams.id
            });
        }

        function calculateScore() {
            console.log("time in seconds:", timerCount);
            console.log("answer:", vm.answer.hour, vm.answer.minute);
            console.log("correct-answer:", '16', '25');
            console.log(vm.decreasedNumber + " - 7 = ", vm.decrease);
            return 0;
        }

    }
})();
