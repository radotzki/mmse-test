(function () {
    'use strict';

    angular
        .module('app.step2')
        .controller('Step2', Step2);

    /* @ngInject */
    function Step2($interval, $stateParams, $state, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        var timer;
        var timerCount;
        vm.answer;
        vm.next = next;

        activate();

        function activate() {
            startTimer();
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

            appStorage.saveStep($stateParams.id, step, 2);
            $state.go('step3', {
                id: $stateParams.id,
                state: 'show'
            });
        }

        function calculateScore() {
            console.log(timerCount, vm.answer.conutry, vm.answer.city, vm.answer.floor);
            return 0;
        }

    }
})();