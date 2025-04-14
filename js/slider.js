import { filterObjects } from './app.js';

export function initSlider() {
    const yearSlider = document.getElementById('year-slider');
    const yearValue = document.getElementById('year-value');
    
    noUiSlider.create(yearSlider, {
        start: [1999],
        connect: [true, false],
        range: {
            'min': 1999,
            'max': 2025
        },
        step: 1,
        tooltips: [true],
        format: {
            to: function(value) {
                return Math.round(value);
            },
            from: function(value) {
                return value;
            }
        }
    });

    yearSlider.noUiSlider.on('update', function(values) {
        const year = Math.round(values[0]);
        yearValue.textContent = `Год: ${year}`;
        filterObjects(year);
    });

    /*
    document.getElementById('show-existing').addEventListener('change', function() {
        const year = Math.round(yearSlider.noUiSlider.get());
        filterObjects(year);
    });
    */
}