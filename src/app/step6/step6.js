(function () {
    'use strict';

    angular
        .module('app.step6')
        .controller('Step6', Step6);

    /* @ngInject */
    function Step6($interval, $stateParams, $state, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        var timer;
        var timerCount;
        vm.answer;
        vm.randomMin;
        vm.randomHour;
        vm.next = next;

        activate();

        function activate() {
            startTimer();
            vm.randomMin = Math.floor((Math.random() * 55));
            vm.randomHour = Math.floor((Math.random() * 11));
            setTime(min, 6 * vm.randomMin)
            setTime(hour, 30 * (vm.randomHour % 12) + vm.randomMin / 2)
        }

        function startTimer() {
            timerCount = 0;;
            timer = $interval(function () {
                timerCount++;
            }, 1000);
        }

        function setTime(el, deg) {
            el.setAttribute('transform', 'rotate(' + deg + ' 50 50)')
        }

        function next() {
            $interval.cancel(timer);
            timer = undefined;

            var step = {
                time: timerCount,
                score: calculateScore()
            };

            appStorage.saveStep($stateParams.id, step, 6);
            $state.go('result', {
                id: $stateParams.id
            });
        }

        function calculateScore() {
            console.log("time in seconds:", timerCount);
            console.log("answer:", vm.answer.hour, vm.answer.minute);
            console.log("correct-answer:", vm.randomHour, vm.randomMin);
            return 0;
        }

    }
})();
