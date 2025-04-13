import { heritageObjects } from './data.js';
import { initSlider } from './slider.js';

// Глобальные переменные приложения
let map;
let objectManager;

// Инициализация приложения
export function initApp() {
    initMap();
    initSlider();
    initObjectManager();
    setupControls();
    filterObjects(2020); // Инициализация с текущим годом
}

// Инициализация карты
function initMap() {
    map = new ymaps.Map('map', {
        center: [56.838011, 60.597465], // Екатеринбург
        zoom: 12
    });
}

// Инициализация менеджера объектов
function initObjectManager() {
    objectManager = new ymaps.ObjectManager({
        clusterize: true,
        gridSize: 32,
        clusterDisableClickZoom: true
    });

    map.geoObjects.add(objectManager);
    objectManager.add(heritageObjects);

    configureObjectStyles();
    setupObjectClickHandler();
}

// Настройка стилей объектов
function configureObjectStyles() {
    objectManager.objects.options.set({
        preset: function(feature) {
            return feature.properties.status === 'existing' ? 
                'islands#greenDotIcon' : 'islands#redDotIcon';
        },
        iconGlyphSize: 30,
        iconColor: function(feature) {
            return feature.properties.status === 'existing' ? '#0E4779' : '#FF0000';
        },
        strokeColor: function(feature) {
            return feature.properties.status === 'existing' ? '#0E4779' : '#FF0000';
        },
        strokeWidth: 2,
        fillColor: function(feature) {
            return feature.properties.status === 'existing' ? 
                'rgba(14, 71, 121, 0.3)' : 'rgba(255, 0, 0, 0.3)';
        }
    });
}

// Обработчик клика по объектам
function setupObjectClickHandler() {
    objectManager.objects.events.add('click', function(e) {
        const objectId = e.get('objectId');
        const object = objectManager.objects.getById(objectId);
        showObjectInfo(object);
    });
}

// Показать информацию об объекте
function showObjectInfo(object) {
    let infoHtml = `
        <strong>${object.properties.name}</strong><br>
        <em>${object.properties.description}</em><br>
        Год постройки: ${object.properties.yearBuilt}<br>
        Адрес: ${object.properties.address}<br>
        Состояние: ${object.properties.preservation}
    `;
    
    if (object.properties.yearDemolished) {
        infoHtml += `<br>Год сноса: ${object.properties.yearDemolished}`;
    }
    
    document.getElementById('object-info').innerHTML = infoHtml;
}

// Функция фильтрации объектов
export function filterObjects(year) {
    const showExisting = document.getElementById('show-existing').checked;
    const features = heritageObjects.features;
    const filteredFeatures = [];
    
    for (const feature of features) {
        if (feature.properties.status === 'existing') {
            if (showExisting) {
                filteredFeatures.push(feature);
            }
        } 
        else if (feature.properties.yearDemolished && feature.properties.yearDemolished <= year) {
            filteredFeatures.push(feature);
        }
    }
    
    objectManager.removeAll();
    objectManager.add({
        "type": "FeatureCollection",
        "features": filteredFeatures
    });
}

// Настройка элементов управления картой
function setupControls() {
    map.controls.remove('geolocationControl');
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    
    map.controls.add('zoomControl');
    map.controls.add('rulerControl');
    
    map.behaviors.enable('scrollZoom');
}

// Инициализация приложения после загрузки API Яндекс.Карт
ymaps.ready(initApp);