(function () {
    'use strict';

    angular
        .module('app.step1')
        .controller('Step1', Step1);

    /* @ngInject */
    function Step1($interval, $stateParams, $state, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        vm.next = next;
        vm.enableSection = enableSection;

        vm.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        vm.days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        vm.seasons = ['Winter','Autumn','Summer','Spring'];
        vm.sections = ['day','month','year','season','calculation'];
        
        var totalTime = 0;

        vm.data = {};
        for (var i = 0; i < vm.sections.length; i++) {
            vm.data[vm.sections[i]] = {disabled:true, length:0, score:0};
        };

        activate();

        function activate() {
            //startTimer();
        }

        function startTimer(name) {
            var timer = $interval(function () {
                //vm.timerCount++;
                vm.data[name].length++;
            }, 1000);

            vm.data[name].timer = timer;
        }

        function next() {
            $interval.cancel(vm.data['calculation'].timer);
            vm.data['calculation'].timer = undefined;

            var sections = {};
            var totalScore = calculateScore();
            for (var i = 0; i < vm.sections.length; i++) {
                var currentSection = vm.data[vm.sections[i]];
                sections[i] = {time:currentSection.length, score:currentSection.score};
            };

            var step = {date:appStorage.getCurrentDate(), time:appStorage.getCurrentTime(), id:$stateParams.id, totalScore:totalScore, totalTime:totalTime, sections:sections};

            appStorage.saveDecreased(vm.data['calculation'].value);
            appStorage.saveStep($stateParams.id, step, 1);
            $state.go('step2', {
                id: $stateParams.id
            });
        }

        function enableSection(name){
            var index = vm.sections.indexOf(name);
            if (index != 0)
            {
                var before = vm.sections[index - 1];
                $interval.cancel(vm.data[before].timer);                
                vm.data[before].timer = undefined;
                if (vm.data[before].timer > 10)
                {
                    vm.data[before].isAfterTime = true;
                }
            }

            vm.data[name].disabled = false;
            startTimer(name);
        };

        function getScoreForSection(sectionName, realValue, sectionArr){
            if (!vm.data[sectionName].isAfterTime)
            {
                var chosen = vm.data[sectionName].value;
                var indexOfChosen = sectionArr.indexOf(chosen);

                if (realValue == indexOfChosen)
                {
                    vm.data[sectionName].score++;
                }
                else if (realValue + 1 == indexOfChosen || realValue - 1 == indexOfChosen)
                {
                    vm.data[sectionName].score += 0.5;
                }
            }

            totalTime += vm.data[sectionName].length;
            console.log("Score for " + sectionName + " ", vm.data[sectionName].score);
            return vm.data[sectionName].score;
        }

        function getScoreForYear(currentYear){
            if (!vm.data['year'].isAfterTime)
            {
                var chosen = vm.data['year'].value;

                if (currentYear == chosen)
                {
                    vm.data['year'].score++;
                }
                else if (currentYear + 1 == chosen || currentYear - 1 == chosen)
                {
                    vm.data['year'].score += 0.5;
                }
                else if (currentYear + 2 == chosen || currentYear - 2 == chosen)
                {
                    vm.data['year'].score += 0.25;
                }
            }

            totalTime += vm.data['year'].length;
            
            return vm.data['year'].score;
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

        function getScoreForSeason(currentMonth){
            if (!vm.data['season'].isAfterTime)
            {
                var chosen = vm.data['season'].value;
                var realSeason = getCurrentSeason(currentMonth);

                var indexOfChosen = vm.seasons[chosen];
                var indexOfReal = vm.seasons[realSeason];

                if (indexOfChosen == indexOfReal)
                {
                    vm.data['season'].score++;
                }
                else if (indexOfReal + 1 == chosen || indexOfReal - 1 == chosen)
                {
                    vm.data['season'].score += 0.25;
                }
            }

            totalTime += vm.data['season'].length;
            return vm.data['season'].score;
        }

        function calculateScore() {
            for (var i = 0; i < vm.sections.length; i++) {
                console.log("value:", vm.data[vm.sections[i]].value);
                console.log("time:", vm.data[vm.sections[i]].length);
            };

            var score = 0;
            var date = new Date();
            var currentDay = date.getDay();
            var currentMonth = date.getMonth();
            var currentYear = date.getFullYear();
            
            score += getScoreForSection('day', currentDay, vm.days);
            score += getScoreForSection('month', currentMonth, vm.months);
            score += getScoreForYear(currentYear);
            score += getScoreForSeason(currentMonth);
            score += appStorage.getScoreForCalc(vm.data['calculation']);
            totalTime += vm.data['calculation'].length;

            console.log("Score  ", score);
        
            return score;
        }

    }
})();
