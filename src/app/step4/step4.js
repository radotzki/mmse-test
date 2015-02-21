(function () {
    'use strict';

    angular
        .module('app.step4')
        .controller('Step4', Step4);

    /* @ngInject */
    function Step4($interval, $stateParams, $state, appStorage, appHelper) {
        /*jshint validthis: true */
        var vm = this;
        var timers = [];
        var timerCount;
        var imgDefinition = ['computer', 'closet', 'door', 'lamp', 'car', 'desk', 'glass', 'chair', 'watch', 'phone'];
        var chosenImages = [];
        var totalTime = 0;

        vm.randomNum;
        vm.next = next;
        vm.currentIndex = 0;

        var sectionsNum = 4;
        vm.sections = {
            first: {index : 0},
            second: {index : 1},
            third: {index : 2},
            calc: {index : 3}
        }

        activate();

        function activate() {
            vm.decreasedNumber = appStorage.getDecreased();
            vm.randomNum = Math.floor((Math.random() * 10));
            chosenImages.push(imgDefinition[vm.randomNum], imgDefinition[(vm.randomNum + 1) % 10], 
            imgDefinition[(vm.randomNum + 2) % 10]);
            vm.data = appHelper.initData(sectionsNum);
            enableSection(0);
        }

        function enableSection(index){
            if (index != 0)
            {
                $interval.cancel(vm.data[index - 1].timer);                
                vm.data[index - 1].timer = undefined;
                
                if (index < sectionsNum)
                {
                    vm.data[index - 1].shown = false;
                }
            }

            if (index < sectionsNum)
            {
                vm.data[index].shown = true;
                appHelper.startTimer(index, vm.data[index]);
            }
        };

        function next() {
            if (vm.currentIndex < sectionsNum)
            {
                vm.currentIndex++;
                enableSection(vm.currentIndex);

                if (vm.currentIndex == sectionsNum)
                {
                    var totalScore = calculateScore();
                    var step = appHelper.getStepData(sectionsNum, vm.data, $stateParams.id, totalTime, totalScore);

                    appStorage.saveDecreased(vm.data[vm.sections.calc.index].value);
                    appStorage.saveStep($stateParams.id, step, 4);
                    $state.go('step3', {
                        id: $stateParams.id,
                        state: 'ask'
                    });
                }
            }
        }

        function getScoreForSection(index)
        {
            var answer = vm.data[index].value;
            var real = chosenImages[index];
            vm.data[index].score = appHelper.compareStrings(answer, real);
            totalTime += vm.data[index].length;     

            return vm.data[index].score;
        }

        function calculateScore() {
            var totalScore = 0;
            totalScore += getScoreForSection(vm.sections.first.index);
            totalScore += getScoreForSection(vm.sections.second.index);
            totalScore += getScoreForSection(vm.sections.third.index);
            
            vm.data[vm.sections.calc.index].score = appHelper.getScoreForCalc(vm.data[vm.sections.calc.index].value, 4);
            totalScore += vm.data[vm.sections.calc.index].score;
            totalTime += vm.data[3].length;

            return totalScore;
        }

    }
})();
