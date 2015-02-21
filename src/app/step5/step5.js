(function () {
    'use strict';

    angular
        .module('app.step5')
        .controller('Step5', Step5);

    /* @ngInject */
    function Step5($interval, $stateParams, $state, appStorage, appHelper) {
        /*jshint validthis: true */
        var vm = this;
        var totalTime = 0;
        vm.decreasedNumber;
        vm.next = next;
        vm.enableSection = enableSection;

        activate();

        function activate() {
            vm.decreasedNumber = appStorage.getDecreased();
            vm.data = appHelper.initData(2);
            vm.data[0].max = 2;
            enableSection(0);
        }

        function enableSection(index){
            appHelper.enableSection(index, vm.data)
        };

        function next() {
            $interval.cancel(vm.data[1].timer);
            vm.data[1].timer = undefined;

            var totalScore = calculateScore();
            var step = appHelper.getStepData(2, vm.data, $stateParams.id, totalTime, totalScore);

            appStorage.saveDecreased(vm.data[1].value);
            appStorage.saveStep($stateParams.id, step, 5);

            $state.go('step6', {
                id: $stateParams.id
            });
        }

        function calculateScore() {
            var real = {};
            real.hour = 16;
            real.hourInHalf = 4;
            real.minute = 25;
            var totalScore = appHelper.getTimeScore(real, vm.data[0].value);
            vm.data[0].score = totalScore;
            vm.data[1].score = appHelper.getScoreForCalc(vm.data[1].value, 5);
            totalScore += vm.data[1].score;
            totalTime += vm.data[0].length + vm.data[1].length;

            return totalScore;
        }

    }
})();
