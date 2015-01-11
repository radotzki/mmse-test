(function () {
    'use strict';

    angular
        .module('app.storage')
        .factory('appStorage', appStorage);

    /* @ngInject */
    function appStorage() {
        var service = {
            saveNewUser: saveNewUser,
            saveStep: saveStep,
            saveNouns: saveNouns,
            getNouns: getNouns
        };
        return service;

        function saveNewUser(id) {
            var user = {
                id: id,
                startTime: new Date()
            };

            localStorage.setItem(id, JSON.stringify(user));
        }

        function saveStep(id, newStep, stepNum) {
        	var user = JSON.parse(localStorage.getItem(id));
        	user[stepNum] = newStep;
        	localStorage.setItem(id, JSON.stringify(user));
        }

        function saveNouns (id, nouns) {
            sessionStorage.setItem('nouns', JSON.stringify(nouns));   
        }

        function getNouns (id) {
            var nouns = JSON.parse(sessionStorage.getItem('nouns'));
            sessionStorage.removeItem('nouns');
            return nouns;
        }

    }
})();
