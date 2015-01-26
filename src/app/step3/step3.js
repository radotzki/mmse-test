(function () {
    'use strict';

    angular
        .module('app.step3')
        .controller('Step3', Step3);

    /* @ngInject */
    function Step3($interval, $stateParams, $state, appStorage) {
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
        activate();

        function activate() {
            vm.state = $stateParams.state;
            if ($stateParams.state != 'show') {
                vm.nouns = appStorage.getNouns();
                vm.decreasedNumber = appStorage.getDecreased();
                //startTimer();
            }
        }

        vm.sections = ['noun1','noun2','noun3','calculation'];
        
        vm.data = {};
        for (var i = 0; i < vm.sections.length; i++) {
            vm.data[vm.sections[i]] = {disabled:true, length:0, score:0};
        };

        function startTimer(name) {
            var timer = $interval(function () {
                //vm.timerCount++;
                vm.data[name].length++;
            }, 1000);

            vm.data[name].timer = timer;
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

        

        function show() {
            var num = Math.floor((Math.random() * 10));
            vm.nouns = vm.nouns.slice(num, num + 3);
            appStorage.saveNouns(vm.nouns);

            var stepTimer = $interval(function () {
                if (vm.index === 2) {
                    $interval.cancel(stepTimer);
                    // $state.go('step4', {
                    //     id: $stateParams.id
                    // });
            $state.go('step3', {
                    id: $stateParams.id,
                    state: 'ask'
                });
                } else {
                    vm.index++;
                }
            }, 1000 * 2);
        }

        // function startTimer() {
        //     timerCount = 0;;
        //     timer = $interval(function () {
        //         timerCount++;
        //     }, 1000);
        // }

        function next() {
            $interval.cancel(vm.data['calculation'].timer);
            vm.data['calculation'].timer = undefined;

            var totalScore = calculateScore();
            var step = appStorage.getStepData(vm.sections, vm.data, $stateParams.id, totalTime, totalScore);

            appStorage.saveDecreased(vm.data['calculation'].value);
            appStorage.saveStep($stateParams.id, step, 3);
            // $state.go('step5', {
            //     id: $stateParams.id
            // });
        }

        function getScoreForSection(number){
            var currentSection = vm.sections[number];
            if (!vm.data[currentSection].isAfterTime)
            {
                var first = vm.data[currentSection].value;
                var real = vm.nouns[number];

                if (first == real)
                {
                    vm.data[currentSection].score++;
                }
                else if (first.length == real.length)
                {
                    var mistakesCount = 0;

                    for (var i = 0; i < first.length; i++) {
                        if (first[i] != real[i])
                        {
                            mistakesCount++;
                        }
                    };


                    if (mistakesCount <= first.length / 2)
                    {
                        var substractPerMistake = 1 / first.length;
                        var toSubstract = mistakesCount * substractPerMistake;
                        vm.data[currentSection].score = 1 - toSubstract;
                    }
                }

                totalTime += currentSection.length;
            }

            return vm.data[currentSection].score;
        }

        function calculateScore() {
            for (var i = 0; i < vm.sections.length; i++) {
                console.log("value:", vm.data[vm.sections[i]].value);
                console.log("time:", vm.data[vm.sections[i]].length);
            };

            var totalScore = 0;
            totalScore += getScoreForSection(0);
            totalScore += getScoreForSection(1);
            totalScore += getScoreForSection(2);
            totalScore += appStorage.getScoreForCalc(vm.data['calculation']);
            totalTime += vm.data['calculation'].length;

            console.log("time in seconds:", timerCount);
            console.log("answer:", vm.answer.noun1, vm.answer.noun2, vm.answer.noun3);
            console.log("correct-answer:", vm.nouns[0], vm.nouns[1], vm.nouns[2]);
            console.log(vm.decreasedNumber + " - 7 = ", vm.decrease);
            return totalScore;
        }

    }
})();
