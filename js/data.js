// Данные об объектах культурного наследия
export const heritageObjects = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "id": 1,
            "geometry": {
                "type": "Point",
                "coordinates": [56.835, 60.612]
            },
            "properties": {
                "name": "Дом Севастьянова",
                "description": "Памятник архитектуры федерального значения",
                "yearBuilt": 1866,
                "yearDemolished": null,
                "status": "existing",
                "preservation": "Отличное",
                "address": "пр. Ленина, 35",
                "type": "architecture"
            }
        },
        {
            "type": "Feature",
            "id": 2,
            "geometry": {
                "type": "Point",
                "coordinates": [56.842, 60.605]
            },
            "properties": {
                "name": "Усадьба Расторгуева-Харитонова",
                "description": "Памятник архитектуры федерального значения",
                "yearBuilt": 1794,
                "yearDemolished": null,
                "status": "existing",
                "preservation": "Хорошее",
                "address": "ул. К. Либкнехта, 44",
                "type": "architecture"
            }
        },
        {
            "type": "Feature",
            "id": 3,
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [56.83, 60.59], [56.83, 60.595], 
                    [56.835, 60.595], [56.835, 60.59], [56.83, 60.59]
                ]]
            },
            "properties": {
                "name": "Исчезнувшая усадьба (пример)",
                "description": "Утраченный памятник архитектуры",
                "yearBuilt": 1880,
                "yearDemolished": 1975,
                "status": "lost",
                "preservation": "Утрачен",
                "address": "ул. Примерная, 10 (не сохранился)",
                "type": "architecture"
            }
        },
        {
            "type": "Feature",
            "id": 4,
            "geometry": {
                "type": "Point",
                "coordinates": [56.825, 60.615]
            },
            "properties": {
                "name": "Церковь Вознесения Господня",
                "description": "Памятник архитектуры регионального значения",
                "yearBuilt": 1818,
                "yearDemolished": null,
                "status": "existing",
                "preservation": "Удовлетворительное",
                "address": "ул. Клары Цеткин, 11",
                "type": "religion"
            }
        },
        {
            "type": "Feature",
            "id": 5,
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [56.84, 60.58], [56.84, 60.585], 
                    [56.845, 60.585], [56.845, 60.58], [56.84, 60.58]
                ]]
            },
            "properties": {
                "name": "Деревянный театр (пример)",
                "description": "Утраченный памятник культуры",
                "yearBuilt": 1895,
                "yearDemolished": 1962,
                "status": "lost",
                "preservation": "Утрачен",
                "address": "ул. Театральная, 5 (не сохранился)",
                "type": "culture"
            }
        }
    ]
};