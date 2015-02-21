(function () {
    'use strict';

    angular
        .module('app.step2')
        .controller('Step2', Step2);

    /* @ngInject */
    function Step2($interval, $stateParams, $state, appStorage, appHelper) {
        /*jshint validthis: true */
        var vm = this;
        vm.answer;
        vm.decreasedNumber;
        vm.next = next;
        vm.enableSection = enableSection;
        var totalTime = 0;
        vm.countries = ['Afganistan', 'Australia', 'Austria', 'Brazil', 'Bulgaria', 'China', 'Cyprus', 'Denmark', 'Estonia', 'France', 'Greece', 'Guatamala',
        'Hungary', 'Israel', 'Italy', 'Japan', 'Jordan', 'Lebanon', 'Malta', 'Mexico', 'Nepal', 'Netherlands', 'Poland', 'Portugal', 'Russia', 'Spain', 'Sweden', 
        'Thailand', 'Turkey', 'United Kingdom', 'United States', 'Vietnam'];

        vm.cities = ['Kabul', 'Herat', 'Sydney', 'Orange', 'Brasiléia', 'Itatim', 'Sofia', 'Varna', 'Beijing', 'Hong Kong', 'Kyrenia', 'Limassol', 
        'Copenhagen', 'Tallinn', 'Paris', 'Lyon', 'Athens', 'Thessaloniki', 'Mixco', 'Budapest', 'Tel Aviv', 
        'Rishon Lezion', 'Jerusalem', 'Rome', 'Milan', 'Nagoya', 'Toyohashi', 'Amman', 'Zarqa', 'Baabda', 'Hammana', 'Valletta', 
        'Mexico City', 'Kathmandu', 'Amsterdam', 'Kraków', 'Lisbon', 'Moscow', 'Madrid', 'Barcelona', 'Stockholm', 'Bangkok', 'Istanbul', 
        'Birmingham', 'London', 'Los Angeles', 'Miami', 'Washington', 'Hà Nội'];

        var sectionsNum = 4;
        vm.sections = {
            county: {index : 0},
            city: {index : 1},
            floor: {index : 2},
            calc: {index : 3}
        }

        activate();

        function activate() {
            vm.decreasedNumber = appStorage.getDecreased();
            vm.data = appHelper.initData(sectionsNum);
            vm.data[vm.sections.county.index].correct = 'Israel';
            vm.data[vm.sections.city.index].correct = 'Tel Aviv';
            vm.data[vm.sections.floor.index].correct = '2';
        }

        function enableSection(index){
            appHelper.enableSection(index, vm.data);
        }

        function next() {
            // Cancel calc timer
            $interval.cancel(vm.data[vm.sections.calc.index].timer);
            vm.data[vm.sections.calc.index].timer = undefined;

            var totalScore = calculateScore();
            var step = appHelper.getStepData(sectionsNum, vm.data, $stateParams.id, totalTime, totalScore);

            appStorage.saveDecreased(vm.data[vm.sections.calc.index].value);
            appStorage.saveStep($stateParams.id, step, 2);

            $state.go('step3', {
                id: $stateParams.id,
                state: 'show'
            });
        }

        function calculateScore() {
            var totalScore = 0;
            
            for (var i = 0; i < 3; i++) {
                if (vm.data[i].value == vm.data[i].correct)
                {
                    vm.data[i].score = 1;
                    totalScore++;
                }

                totalTime += vm.data[i].length;
            };

            vm.data[vm.sections.calc.index].score = appHelper.getScoreForCalc(vm.data[vm.sections.calc.index].value, 2);
            totalScore += vm.data[vm.sections.calc.index].score;
            totalTime += vm.data[vm.sections.calc.index].length;

            return totalScore;
        }

    }
})();
