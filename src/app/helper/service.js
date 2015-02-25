(function() {
    'use strict';

    angular
        .module('app.helper')
        .factory('appHelper', appHelper);

    /* @ngInject */
    function appHelper(appStorage, $interval) {
        var similar = 
        {
            'a':['u','e','h','o'],
            'b':['v'],
            'c':['s','k','q'],
            'e':['a','u','h'],
            'f':['ph'],
            'g':['j'],
            'h':['a','u','e','o'],
            'i':['y', 'ee', 'ea'],
            'j':['g'],
            'k':['c','q'],
            'l':['ll'],
            'o':['h','u','oo'],
            'p':['f'],
            'q':['k','c'],
            's':['c', 'ss'],
            'u':['oo','w'],
            'v':['b'],
            'w':['u'],
            'x':['ks','cs'],
            'y':['i','ee','ie']
        };

        var service = {
            getCurrentDate: getCurrentDate,
            getCurrentTime: getCurrentTime,
            getScoreForCalc: getScoreForCalc,
            getStepData: getStepData,
            compareStrings: compareStrings,
            getTimeScore: getTimeScore,
            initData: initData,
            enableSection: enableSection,
            startTimer: startTimer
        };
        return service;

        function getCurrentDate(){
            var date = new Date();
            return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        }

        function getCurrentTime(){
            var date = new Date();
            return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }

        function getScoreForCalc(value, stepIndex){
            var score;
            var realCalcResult = 93;

            if (stepIndex != 1)
            {
                realCalcResult = appStorage.getDecreased() - 7;
            }

            if (value == realCalcResult)
            {
                score = 1;
            }
            // Mistake by 1
            else if (realCalcResult + 1 == value || realCalcResult - 1 == value)
            {
                score = 0.5;
            }
            // Mistake by 2
            else if (realCalcResult + 2 == value || realCalcResult - 2 == value)
            {
                score = 0.25;
            }

            return score;
        }

        function getStepData(sectionsNum, stepData, id, totalTime, totalScore){
            var sections = {};
            for (var i = 0; i < sectionsNum; i++) {
                var currentSection = stepData[i];
                sections[i] = {time:currentSection.length, score:currentSection.score, max:currentSection.max};
            }

            var step = {date:getCurrentDate(), time:getCurrentTime(), id:id, 
                totalScore:totalScore, totalTime:totalTime, sections:sections};

            return step;
        }

        function compareStrings(first, second)
        {
            var score = 0;

            if (first == second){
                score = 1;
            }
            else
            {
                var firstLength = first.length;
                var secondLength = second.length;
                var bigMistakes = 0;
                var smallMistakes = 0;

                // first string supposed to be smaller
                if (firstLength > secondLength)
                {
                    return compareStrings(second, first);
                }
                else
                {
                    var j = 0;
                    for (var i = 0; i < firstLength; i++) {
                        // current letter is different
                        if (first[i] != second[j])
                        {
                            // getting similar letters for current letter
                            var similarLetters = similar[first[i]];
                            
                            // The letter has similar letters
                            if (similarLetters != undefined)
                            {
                                // the matching letter in the second string is in the similar letters
                                if (similarLetters.indexOf(second[j]) != -1)
                                {
                                    smallMistakes++;
                                }
                                // maybe theres a two letters mismatch
                                else if (i != firstLength - 1)
                                {
                                    // getting next two letters in the second string
                                    var compareWitNext = second[j] + second[j + 1];

                                    // the two letters from the second string is in the similar letters
                                    // for example: u - oo
                                    if (similarLetters.indexOf(compareWitNext) != -1)
                                    {
                                        j++;
                                        smallMistakes++;

                                    }
                                    else
                                    {
                                        bigMistakes++;
                                    }
                                }
                                else
                                {
                                    bigMistakes++;
                                }
                            }
                            else
                            {
                                bigMistakes++;
                            }
                        }

                        j++;
                    }

                    var letterWeight = 1 / first.length;
                    var substractSmall = letterWeight;
                    var substractBig = letterWeight * 1.5;
                    var toSubstract = smallMistakes * substractSmall + bigMistakes * substractBig;
                    
                    // second string contains first string but not the same
                    if (toSubstract == 0 && firstLength != secondLength)
                    {
                        toSubstract = (secondLength - firstLength) * substractSmall;
                    }


                    if (toSubstract > 1)
                    {
                        score = 0;
                    }
                    else
                    {
                        score = 1 - toSubstract;
                    }
                }
            }

            return score;
        }

        function getTimeScore(real, answer)
        {
            var hourScore = 0;
            var minuteScore = 0;
            var didMixHoursAndMinutes = false;

            // The corrent answer
            if (answer.hour == real.hour)
            {
                hourScore = 1;
            }
            // Missed one hour before or after
            else if (answer.hour == real.hour + 1 || answer.hour == real.hour - 1)
            {
                hourScore = 0.5;
            }
            else if (answer.hour == real.minute)
            {
                hourScore = 0.75;
                didMixHoursAndMinutes = true;
            }
            else if (real.hourInHalf != undefined) 
            {
                // Comfused am with pm or  hours and minutes
                if (answer.hour == ('0' + real.hourInHalf))
                {
                    hourScore = 0.75;
                }
                // Missed one hour and am pm
                else if (answer.hour == ('0' + (real.hourInHalf + 1)) || answer.hour == ('0' + (real.hourInHalf - 1)))
                {
                    hourScore = 0.25;
                }
            }
            
            // The corrent answer
            if (answer.minute == real.minute)
            {
                minuteScore = 1;
            }
            // Comfused hours and minutes
            else if ((didMixHoursAndMinutes) && 
                     (answer.minute == real.hour || ((answer.hourInHalf != undefined) && (answer.minute == ('0' + real.hourInHalf)))))
            {
                minuteScore = 0.75;
            }
            // Missed one minute before or after
            else if (answer.minute == real.minute + 1 || answer.minute == real.minute - 1)
            {
                minuteScore = 0.5;
            }

            return hourScore + minuteScore;
        }

        function initData(sectionsNum)
        {
            var data = {};
            for (var i = 0; i < sectionsNum; i++) {
                data[i] = {disabled:false, length:0, score:0, max:1, shown:false};
            };
            return data;
        }

        function startTimer(index, section) {
            var timer = $interval(function () {
                section.length++;
            }, 1000);

            section.timer = timer;
        }

        function enableSection(index, data){
            if (index != 0)
            {
                $interval.cancel(data[index - 1].timer);                
                data[index - 1].timer = undefined;
                data[index- 1].disabled = true;
            }

            data[index].shown = true;
            startTimer(index, data[index]);
        };
    }
})();
