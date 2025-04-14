import { heritageObjects } from './data.js';
import { initSlider } from './slider.js';

// Глобальные переменные приложения
let map;
let objectManager;
let allLostObjects = [];

// Инициализация приложения
export function initApp() {
    initMap();
    initObjectManager();
    initSlider();    
    setupControls();
    // Фильтруем только утраченные объекты
    allLostObjects = heritageObjects.features.filter(
        obj => obj.properties.status === 'lost'
    );
    
    // Начальное состояние - 1991 год, объектов нет
    filterObjects(1991); // Инициализация с текущим годом
}

// Функция фильтрации объектов по году
export function filterObjectsByYear(year) {
    if (!objectManager) return;
    
    // Фильтруем объекты, которые были снесены к выбранному году
    const filteredObjects = allLostObjects.filter(
        obj => obj.properties.yearDemolished <= year
    );
    
    // Обновляем карту
    objectManager.removeAll();
    objectManager.add({
        type: "FeatureCollection",
        features: filteredObjects
    });
    
    console.log(`Показано объектов: ${filteredObjects.length} из ${allLostObjects.length}`);
}

// Инициализация карты
function initMap() {
    map = new ymaps.Map('map', {
        center: [56.838011, 60.597465], // Екатеринбург
        zoom: 13
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
    const safeStyleGetter = (feature, property, defaultValue) => {
        return feature?.properties?.[property] ?? defaultValue;
    };

    objectManager.objects.options.set({
        preset: feature => {
            const status = safeStyleGetter(feature, 'status', 'existing');
            return status === 'existing' ? 'islands#greenDotIcon' : 'islands#redDotIcon';
        },
        iconColor: feature => {
            const status = safeStyleGetter(feature, 'status', 'existing');
            return status === 'existing' ? '#0E4779' : '#FF0000';
        },
        strokeColor: feature => {
            const status = safeStyleGetter(feature, 'status', 'existing');
            return status === 'existing' ? '#0E4779' : '#FF0000';
        },
        fillColor: feature => {
            const status = safeStyleGetter(feature, 'status', 'existing');
            return status === 'existing' 
                ? 'rgba(14, 71, 121, 0.3)' 
                : 'rgba(255, 0, 0, 0.3)';
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
    if (!objectManager) return;
    
    // Фильтруем объекты, которые были снесены к выбранному году
    const filteredObjects = allLostObjects.filter(
        obj => obj.properties.yearDemolished <= year
    );
    
    // Обновляем карту
    objectManager.removeAll();
    objectManager.add({
        type: "FeatureCollection",
        features: filteredObjects
    });
    
    console.log(`Показано объектов: ${filteredObjects.length} из ${allLostObjects.length}`);
}

// Настройка элементов управления картой
function setupControls() {
    map.controls.remove('geolocationControl');
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    
    map.controls.add('zoomControl');
    map.controls.add('rulerControl');
    
    //map.behaviors.enable('scrollZoom');
}

// Инициализация приложения после загрузки API Яндекс.Карт
ymaps.ready(initApp);