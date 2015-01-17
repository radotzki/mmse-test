(function() {
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
            vm.randomHour = Math.floor((Math.random() * 10)) + 1;
            setTime();
        }

        function startTimer() {
            timerCount = 0;;
            timer = $interval(function() {
                timerCount++;
            }, 1000);
        }

        function setTime() {
            var hdegree = vm.randomHour * 30 + (vm.randomMin / 2);
            var hrotate = "rotate(" + hdegree + "deg)";
            var mdegree = vm.randomMin * 6;
            var mrotate = "rotate(" + mdegree + "deg)";

            $("#hour").css({
                "-moz-transform": hrotate,
                "-webkit-transform": hrotate
            });

            $("#min").css({
                "-moz-transform": mrotate,
                "-webkit-transform": mrotate
            });
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
