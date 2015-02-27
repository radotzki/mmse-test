(function () {
    'use strict';

    angular
        .module('app.step1')
        .controller('Step1', Step1);

    /* @ngInject */
    function Step1($interval, $stateParams, $state, appStorage, appHelper) {
        /*jshint validthis: true */
        var vm = this;
        vm.next = next;
        vm.enableSection = enableSection;

        vm.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        vm.days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        vm.seasons = ['Winter','Fall','Summer','Spring'];
        var sectionsNum = 5;
        vm.sections = {
            day: {index : 0},
            month: {index : 1},
            year: {index : 2},
            season: {index : 3},
            calc: {index : 4}
        }

        var totalTime = 0;

        activate();

        function activate() {
            vm.data = appHelper.initData(sectionsNum);
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
            appStorage.saveStep($stateParams.id, step, 1);
            $state.go('step2', {
                id: $stateParams.id
            });
        }


        function getScoreForSection(index, realValue, sectionArr)
        {
            var chosen = vm.data[index].value;
            var indexOfChosen = sectionArr.indexOf(chosen);

            // Correct answer
            if (realValue == indexOfChosen)
            {
                vm.data[index].score++;
            }
            // Mistake by 1
            else if (realValue + 1 == indexOfChosen || realValue - 1 == indexOfChosen || ((indexOfChosen == sectionArr.length - 1) && (realValue = 0)) 
                || ((indexOfChosen == 0) && (realValue = sectionArr.length - 1)))
            {
                vm.data[index].score += 0.5;
            }

            totalTime += vm.data[index].length;
            return vm.data[index].score;
        }

        function getScoreForYear(currentYear)
        {
            var chosen = vm.data[vm.sections.year.index].value;

            // Correct answer
            if (currentYear == chosen)
            {
                vm.data[vm.sections.year.index].score++;
            }
            // Mistake by 1 year
            else if (currentYear + 1 == chosen || currentYear - 1 == chosen)
            {
                vm.data[vm.sections.year.index].score += 0.5;
            }
            // Mistake by 2 years
            else if (currentYear + 2 == chosen || currentYear - 2 == chosen)
            {
                vm.data[vm.sections.year.index].score += 0.25;
            }

            totalTime += vm.data[vm.sections.year.index].length;
            
            return vm.data[vm.sections.year.index].score;
        }

        function getCurrentSeason(month){
            var season;

            switch (month + 1) {
                case 12:
                case 1:
                case 2:
                    season = 'Winter';
                    break;
                case 3:
                case 4:
                case 5:
                    season = 'Spring';
                    break;
                case 6:
                case 7:
                case 8:
                    season = 'Summer';
                    break;
                case 9:
                case 10:
                case 11:
                    season = 'Fall';
                    break;
            }

            return season;
        }

        function getScoreForSeason(currentMonth)
        {
            var chosen = vm.data[vm.sections.season.index].value;
            var realSeason = getCurrentSeason(currentMonth);

            var indexOfChosen = vm.seasons.indexOf(chosen);
            var indexOfReal = vm.seasons.indexOf(realSeason);

            if (indexOfChosen === -1){
                vm.data[vm.sections.season.index].score = 0;   
            }
            // Correct answer
            else if (indexOfChosen == indexOfReal)
            {
                vm.data[vm.sections.season.index].score++;
            }
            // Mistake by 1 index
            else if (indexOfReal + 1 == indexOfChosen || indexOfReal - 1 == indexOfChosen || (indexOfChosen == 3 && indexOfReal == 0)
                || (indexOfChosen == 0 && indexOfReal == 3))
            {
                vm.data[vm.sections.season.index].score += 0.25;
            }

            totalTime += vm.data[vm.sections.season.index].length;
            return vm.data[vm.sections.season.index].score;
        }

        function calculateScore() {
            var score = 0;
            var date = new Date();
            var currentDay = date.getDay();
            var currentMonth = date.getMonth();
            var currentYear = date.getFullYear();
            
            score += getScoreForSection(vm.sections.day.index, currentDay, vm.days);
            score += getScoreForSection(vm.sections.month.index, currentMonth, vm.months);
            score += getScoreForYear(currentYear);
            score += getScoreForSeason(currentMonth);

            vm.data[vm.sections.calc.index].score = appHelper.getScoreForCalc(vm.data[vm.sections.calc.index].value, 1);
            score += vm.data[vm.sections.calc.index].score;
            totalTime += vm.data[vm.sections.calc.index].length;

            return score;
        }

    }
})();
