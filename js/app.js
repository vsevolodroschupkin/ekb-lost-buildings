import { heritageObjects } from './data.js';
import { initSlider } from './slider.js';

// Глобальные переменные приложения
let map;
let objectManager;
let allLostObjects = [];
const detailsPanel = document.getElementById('details-panel');
const detailsContent = document.getElementById('details-content');
const closeDetailsBtn = document.getElementById('close-details');

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
    setupDetailsPanel();
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
        zoom: 15,
        minZoom:15,
        maxZoom: 18
    });
}

// Инициализация менеджера объектов
function initObjectManager() {
    objectManager = new ymaps.ObjectManager({
        clusterize: false,
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

    // Создаем свою иконку
    const lostIconLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="custom-marker">' +
            '<img src="images/demolition.png" alt="" style="width: 32px; height: 32px;">' +
            '<div class="custom-marker-date">{{ properties.yearDemolished }}</div>' +
        '</div>',
        {
            // Дополнительные методы для обработки
            build: function() {
                this.constructor.superclass.build.call(this);
                this._element = this.getParentElement().querySelector('.custom-marker');
            },
            clear: function() {
                this.constructor.superclass.clear.call(this);
            }
        }
    );
    
    objectManager.objects.options.set({
        iconLayout: lostIconLayout, // Используем наш кастомный layout
        iconShape: { // Область клика
            type: 'Circle',
            coordinates: [0, 0],
            radius: 16
        },
        // Отключаем стандартные пресеты
        iconWidth: 32,
        iconHeight: 32,
        preset: 'islands#transparentIcon',
        iconOffset: [-16, -16] // Центрирование иконки
    });
}

// функция показа информации
// Обновляем функцию показа информации
function showObjectInfo(object) {
    const detailsHtml = `
        <h2>${object.properties.name}</h2>
        <div class="details-grid">
            <div class="detail-item">
                <span class="detail-label">Описание:</span>
                <span>${object.properties.description || 'не указан'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Год постройки:</span>
                <span>${object.properties.yearBuilt || 'не указан'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Адрес:</span>
                <span>${object.properties.address || 'не указан'}</span>
            </div>
            <!-- остальные поля -->
        </div>
        ${object.properties.photo ? 
            `<img src="${object.properties.photo}" class="building-photo" alt="${object.properties.name}">` : ''}
    `;
    
    detailsContent.innerHTML = detailsHtml;
    
    // Показываем панель и overlay
    document.getElementById('overlay').style.display = 'block';
    detailsPanel.style.display = 'block';
    
    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
}

// Обработчик закрытия
function setupDetailsPanel() {
    const closeDetails = () => {
        document.getElementById('overlay').style.display = 'none';
        detailsPanel.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    document.getElementById('close-details').addEventListener('click', closeDetails);
    document.getElementById('overlay').addEventListener('click', closeDetails);
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDetails();
    });
}

// Обработчик клика по объектам
function setupObjectClickHandler() {
    objectManager.objects.events.add('click', function(e) {
        const objectId = e.get('objectId');
        const object = objectManager.objects.getById(objectId);
        showObjectInfo(object);
        
        // Центрируем карту на объекте
        map.setCenter(object.geometry.coordinates);
    });
}

//Обработчик закрытия панели
closeDetailsBtn.addEventListener('click', () => {
    detailsPanel.style.display = 'none';
});

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