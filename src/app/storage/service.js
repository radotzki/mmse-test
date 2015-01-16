(function () {
    'use strict';

    angular
        .module('app.storage')
        .factory('appStorage', appStorage);

    /* @ngInject */
    function appStorage() {
        var service = {
            saveNewUser: saveNewUser,
            getUser: getUser,
            saveStep: saveStep,
            saveNouns: saveNouns,
            getNouns: getNouns,
            saveDecreased: saveDecreased,
            getDecreased: getDecreased
        };
        return service;

        function saveNewUser(id) {
            var user = {
                id: id,
                startTime: new Date()
            };

            localStorage.setItem(id, JSON.stringify(user));
        }

        function getUser (id) {
            return JSON.parse(localStorage.getItem(id));
        }

        function saveStep(id, newStep, stepNum) {
        	var user = JSON.parse(localStorage.getItem(id));
        	user[stepNum] = newStep;
        	localStorage.setItem(id, JSON.stringify(user));
        }

        function saveNouns (nouns) {
            sessionStorage.setItem('nouns', JSON.stringify(nouns));   
        }

        function getNouns () {
            var nouns = JSON.parse(sessionStorage.getItem('nouns'));
            sessionStorage.removeItem('nouns');
            return nouns;
        }

        function saveDecreased (number) {
            sessionStorage.setItem('decreasedNumber', number);   
        }

        function getDecreased () {
            var num = sessionStorage.getItem('decreasedNumber');
            sessionStorage.removeItem('decreasedNumber');
            return num;
        }

    }
})();
