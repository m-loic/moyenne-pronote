/*
 * Ce fichier fait partie de l'extension Moyenne Pronote.
 * Copyright (C) [2025] [Loïc]
 *
 * Ce programme est distribué sous la licence GNU General Public License version 3.
 * Pour plus de détails, consultez le fichier LICENSE.
 */
(function() {
    'use strict';

    const pageScript = function() {
        function findAllTitles() {
            const elements = document.querySelectorAll('.ie-titre-gros');
            const contents = [];
            elements.forEach(element => {
                const content = element.textContent.trim();
                if (content !== '') {
                    contents.push(content);
                }
            });
            return contents;
        }

        function extractNumericValues(contents) {
            const numericValues = contents
                .map(content => {
                    const match = content.match(/^(\d+,\d+|\d+)$/);
                    return match ? parseFloat(match[0].replace(',', '.')) : null;
                })
                .filter(value => value !== null);
            return numericValues;
        }

        function calculateAverage(numbers) {
            if (numbers.length === 0) return 0;
            const sum = numbers.reduce((total, num) => total + num, 0);
            return sum / numbers.length;
        }

        function displayAverage(average) {
            if (average === 0) {
                let averageContainer = document.getElementById('average-display');
                if (averageContainer) {
                    averageContainer.remove();
                }
                return;
            }

            let averageContainer = document.getElementById('average-display');
            if (!averageContainer) {
                averageContainer = document.createElement('div');
                averageContainer.id = 'average-display';
                averageContainer.style.position = 'fixed';
                averageContainer.style.bottom = '40px';
                averageContainer.style.left = '0px';
                averageContainer.style.padding = '10px 40px';
                averageContainer.style.backgroundColor = '#fff';
                averageContainer.style.color = '#000';
                averageContainer.style.fontSize = '25px';
                averageContainer.style.borderRadius = '5px';
                averageContainer.style.zIndex = '9999';
                averageContainer.style.border = '2px solid #d9dbdc';
                averageContainer.style.height = 'auto';

                const targetElement = document.querySelector('.liste_cont_btnscroll.AlignementGauche.InlineBlock.AlignementHaut');
                if (targetElement) {
                    const targetRect = targetElement.getBoundingClientRect();
                    averageContainer.style.width = `${targetRect.left}px`;
                } else {
                    averageContainer.style.width = '100%';
                }

                document.body.appendChild(averageContainer);
            }

            averageContainer.textContent = `Moyenne générale : ${average.toFixed(2)}`;
        }

        function logResults(contents) {
            const numericValues = extractNumericValues(contents);
            const average = calculateAverage(numericValues);
            displayAverage(average);
            window.__customContentResults = {
                contents,
                numericValues,
                average
            };
        }

        const observer = new MutationObserver(() => {
            const contents = findAllTitles();
            logResults(contents);
        });

        observer.observe(document.body, { childList: true, subtree: true });

        logResults(findAllTitles());
    };

    pageScript();
})();
