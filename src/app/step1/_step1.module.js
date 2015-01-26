(function() {
	'use strict';

var step1 = angular
	.module('app.step1', []);

step1.filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<=max; i++)
      input.push(i);
    return input;
  };
});

})();