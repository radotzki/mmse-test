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
        vm.answer;
        vm.nouns = ['ball', 'book', 'banana', 'bead', 'ghost', 'pie', 'milk', 'kiss', 'glove', 'mailbox', 'ball', 'book'];
        vm.index = 0;
        vm.state;
        vm.next = next;
        vm.show = show;


        activate();

        function activate() {
            vm.state = $stateParams.state;
            if ($stateParams.state != 'show') {
                vm.nouns = appStorage.getNouns($stateParams.id);
                startTimer();
            }
        }

        function show() {
            var num = Math.floor((Math.random() * 10));
            vm.nouns = vm.nouns.slice(num, num + 3);
            appStorage.saveNouns($stateParams.id, vm.nouns);

            var stepTimer = $interval(function () {
                if (vm.index === 2) {
                    $interval.cancel(stepTimer);
                    $state.go('step4', {
                        id: $stateParams.id
                    });
                } else {
                    vm.index++;
                }
            }, 1000 * 2);
        }

        function startTimer() {
            timerCount = 0;;
            timer = $interval(function () {
                timerCount++;
            }, 1000);
        }

        function next() {
            $interval.cancel(timer);
            timer = undefined;

            var step = {
                time: timerCount,
                score: calculateScore()
            };

            appStorage.saveStep($stateParams.id, step, 3);
            $state.go('step5', {
                id: $stateParams.id
            });
        }

        function calculateScore() {
            console.log(timerCount, vm.nouns, vm.answer.noun1, vm.answer.noun2, vm.answer.noun3);
            return 0;
        }

    }
})();