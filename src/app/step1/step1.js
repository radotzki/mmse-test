(function () {
    'use strict';

    angular
        .module('app.step1')
        .controller('Step1', Step1);

    /* @ngInject */
    function Step1($interval, $stateParams, $state ,appStorage) {
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

            appStorage.saveStep($stateParams.id, step, 1);
            $state.go('step2', {id: $stateParams.id});
        }

        function calculateScore () {
        	console.log(vm.timerCount, vm.date, vm.season);
        	return 0;
        }

    }
})();
