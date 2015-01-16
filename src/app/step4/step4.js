(function () {
    'use strict';

    angular
        .module('app.step4')
        .controller('Step4', Step4);

    /* @ngInject */
    function Step4($interval, $stateParams, $state, appStorage) {
        /*jshint validthis: true */
        var vm = this;
        var timer;
        var timerCount;
        var imgDefinition = ['computer', 'closet', 'door', 'lamp', 'car', 'desk', 'glass', 'chair', 'watch', 'phone'];
        var chosenImages = [];

        vm.answer;
        vm.randomNum;
        vm.img1 = true;
        vm.img2 = false;
        vm.img3 = false;
        vm.finalCalc = false;
        vm.decreasedNumber;
        vm.next = next;

        activate();

        function activate() {
            startTimer();
            vm.decreasedNumber = appStorage.getDecreased();
            vm.randomNum = Math.floor((Math.random() * 10));
            chosenImages.push(imgDefinition[vm.randomNum], imgDefinition[(vm.randomNum + 1) % 10], imgDefinition[(vm.randomNum + 2) % 10]);
        }

        function startTimer() {
            timerCount = 0;;
            timer = $interval(function () {
                timerCount++;
            }, 1000);
        }

        function next() {
            if (vm.img1) {
                vm.img1 = false;
                vm.img2 = true;
            } else if (vm.img2) {
                vm.img2 = false;
                vm.img3 = true;
            } else if (vm.img3) {
                vm.img3 = false;
                vm.finalCalc = true;
            } else {
                $interval.cancel(timer);
                timer = undefined;

                var step = {
                    time: timerCount,
                    score: calculateScore()
                };

                appStorage.saveDecreased(vm.decrease);
                appStorage.saveStep($stateParams.id, step, 4);
                $state.go('step3', {
                    id: $stateParams.id,
                    state: 'ask'
                });
            }
        }

        function calculateScore() {
            console.log("time in seconds:", timerCount);
            console.log("answer:", vm.answer.first, vm.answer.second, vm.answer.third);
            console.log("correct-answer:", chosenImages[0], chosenImages[1], chosenImages[2]);
            console.log(vm.decreasedNumber + " - 7 = ", vm.decrease);
            return 0;
        }

    }
})();
