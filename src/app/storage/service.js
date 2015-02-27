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
            getDecreased: getDecreased
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
                startTime: new Date(),
                steps: {}
            };

            localStorage.setItem(id, JSON.stringify(user));
        }

        function getUser(id) {
            return JSON.parse(localStorage.getItem(id));
        }

        function saveStep(id, newStep, stepNum) {
            var user = JSON.parse(localStorage.getItem(id));
            user.steps[stepNum] = newStep;
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
            number = number ? number : 0;
            localStorage.setItem('decreasedNumber', number);
        }

        function getDecreased() {
            var num = localStorage.getItem('decreasedNumber');
            return num;
        }
    }
})();
