(function() {
    'use strict';

    angular
        .module('app.storage')
        .factory('appStorage', appStorage);

    /* @ngInject */
    function appStorage($firebase) {
        var service = {
            getAllUsers: getAllUsers,
            saveUserToDB: saveUserToDB,
            saveNewUser: saveNewUser,
            getUser: getUser,
            saveStep: saveStep,
            saveNouns: saveNouns,
            getNouns: getNouns,
            saveDecreased: saveDecreased,
            getDecreased: getDecreased,
            getCurrentDate: getCurrentDate,
            getCurrentTime: getCurrentTime,
            getScoreForCalc: getScoreForCalc,
            getStepData: getStepData
        };
        return service;

        function getAllUsers() {
            var ref = new Firebase("https://mmse-test.firebaseio.com/");
            var sync = $firebase(ref);
            return sync.$asArray().$loaded();
        }

        function saveUserToDB (user) {
            var ref = new Firebase("https://mmse-test.firebaseio.com/");
            var sync = $firebase(ref);
            sync.$push(user);
        }

        function saveNewUser(id) {
            var user = {
                id: id,
                startTime: new Date()
            };

            localStorage.setItem(id, JSON.stringify(user));
        }

        function getUser(id) {
            return JSON.parse(localStorage.getItem(id));
        }

        function saveStep(id, newStep, stepNum) {
            var user = JSON.parse(localStorage.getItem(id));
            user[stepNum] = newStep;
            localStorage.setItem(id, JSON.stringify(user));
        }

        function saveNouns(nouns) {
            localStorage.setItem('nouns', JSON.stringify(nouns));
        }

        function getNouns() {
            var nouns = JSON.parse(localStorage.getItem('nouns'));
            return nouns;
        }

        function saveDecreased(number) {
            localStorage.setItem('decreasedNumber', number);
        }

        function getDecreased() {
            return 93;
            var num = localStorage.getItem('decreasedNumber');
            return num;
        }

        function getCurrentDate(){
            var date = new Date();
            return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        }

        function getCurrentTime(){
            var date = new Date();
            return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }

        function getScoreForCalc(calcJson){
            if (!calcJson.isAfterTime)
            {
                var chosen = calcJson.value;
                var realCalcResult = 93;

                if (chosen == realCalcResult)
                {
                    calcJson.score++;
                }
                else if (realCalcResult + 1 == chosen || realCalcResult - 1 == chosen)
                {
                    calcJson.score += 0.5;
                }
                else if (realCalcResult + 2 == chosen || realCalcResult - 2 == chosen)
                {
                    calcJson.score += 0.25;
                }
            }

            //totalTime += calcJson.length;
            return calcJson.score;
        }

        function getStepData(sectionsNames, stepData, id, totalTime, totalScore){
            var sections = {};
            for (var i = 0; i < sectionsNames.length; i++) {
                var currentSection = stepData[sectionsNames[i]];
                sections[i] = {time:currentSection.length, score:currentSection.score};
            };

            var step = {date:getCurrentDate(), time:getCurrentTime(), id:id, 
                totalScore:totalScore, totalTime:totalTime, sections:sections};

            return step;
        }
    }
})();
