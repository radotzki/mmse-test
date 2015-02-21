(function() {
    'use strict';

    angular
        .module('app.step6')
        .controller('Step6', Step6);

    /* @ngInject */
    function Step6($interval, $stateParams, $state, appStorage, appHelper) {
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

            vm.data = {};
            vm.data[0] = {score : calculateScore(), length: timerCount};
            
            // Max score for the time section is 2
            vm.data[0].max = 2;

            var step = appHelper.getStepData(1, vm.data, $stateParams.id, vm.data[0].length, vm.data[0].score);

            appStorage.saveStep($stateParams.id, step, 6);
            $state.go('result', {
                id: $stateParams.id
            });
        }

        function calculateScore() {
            var real = {};
            real.hour = vm.randomHour;
            real.minute = vm.randomMin;
            var totalScore = appHelper.getTimeScore(real, vm.answer);
            return totalScore;
        }

    }
})();
