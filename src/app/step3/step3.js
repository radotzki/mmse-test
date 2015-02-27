(function () {
    'use strict';

    angular
        .module('app.step3')
        .controller('Step3', Step3);

    /* @ngInject */
    function Step3($interval, $stateParams, $state, appStorage, appHelper) {
        /*jshint validthis: true */
        var vm = this;
        var timer;
        var timerCount;
        var totalTime = 0;
        vm.answer;
        vm.nouns = ['ball', 'book', 'banana', 'bead', 'ghost', 'pie', 'milk', 'kiss', 'glove', 'mailbox', 'ball', 'book'];
        vm.index = 0;
        vm.state;
        vm.decreasedNumber;
        vm.next = next;
        vm.show = show;
        vm.enableSection = enableSection;

        var sectionsNum = 4;
        vm.sections = {
            first: {index : 0},
            second: {index : 1},
            third: {index : 2},
            calc: {index : 3}
        }
        
        activate();

        function activate() {
            vm.state = $stateParams.state;
            if ($stateParams.state != 'show') {
                vm.nouns = appStorage.getNouns();
                vm.decreasedNumber = appStorage.getDecreased();
                vm.data = appHelper.initData(sectionsNum);
            }
        }

        function enableSection(index){
            appHelper.enableSection(index, vm.data)
        };

        function show() {
            var num = Math.floor((Math.random() * 10));
            vm.nouns = vm.nouns.slice(num, num + 3);
            appStorage.saveNouns(vm.nouns);

            var stepTimer = $interval(function () {
                // finished showing 3 images
                if (vm.index === 2) {
                    $interval.cancel(stepTimer);
                    $state.go('step4', {
                        id: $stateParams.id
                    });
                } else {
                    vm.index++;
                }
            }, 1000 * 10);
        }


        function next() {
            // Cancel calc timer
            $interval.cancel(vm.data[vm.sections.calc.index].timer);
            vm.data[vm.sections.calc.index].timer = undefined;

            var totalScore = calculateScore();
            var step = appHelper.getStepData(sectionsNum, vm.data, $stateParams.id, totalTime, totalScore);

            appStorage.saveDecreased(vm.data[vm.sections.calc.index].value);
            appStorage.saveStep($stateParams.id, step, 3);
            $state.go('step5', {
                id: $stateParams.id
            });
        }

        function getScoreForSection(index){
            // Users answer
            var answer = vm.data[index].value;

            // Corrent answer
            var real = vm.nouns[index];

            // Comparing the two answers
            vm.data[index].score = appHelper.compareStrings(answer, real);
            totalTime += vm.data[index].length;

            return vm.data[index].score;
        }

        function calculateScore() {
            var totalScore = 0;
            totalScore += getScoreForSection(vm.sections.first.index);
            totalScore += getScoreForSection(vm.sections.second.index);
            totalScore += getScoreForSection(vm.sections.third.index);

            vm.data[vm.sections.calc.index].score = appHelper.getScoreForCalc(vm.data[vm.sections.calc.index].value, 3);
            totalScore += vm.data[vm.sections.calc.index].score;
            totalTime += vm.data[vm.sections.calc.index].length;

            return totalScore;
        }

    }
})();
