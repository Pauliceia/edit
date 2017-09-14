var styleStreet = new ol.style.Style({
    stroke: new ol.style.Stroke({
        width: 6, 
        color: [0, 102, 255, 0.8]
    })
});

var styleStreetSlc = new ol.style.Style({
    stroke: new ol.style.Stroke({
        width: 6, 
        color: [0, 0, 153, 0.9]
    })
});

var styleMyPlaces = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'red'
        })
    })
});

var stylePlaces = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: '#ff9999'
        })
    })
});

var styleMyDuplic = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: '#ffa600'
        })
    })
});

var styleDuplic = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: '#ffe4b3'
        })
    })
});

var styleSelects = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        stroke: new ol.style.Stroke({
            color: '#666',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: '#0066ff'
        })
    })
});

function generateStylePlaces(type){
    $color = "#33cc33"; //default => green
   
    if(type == 'wait') $color = "#ccc";
    else if(type == 'duplic') $color = "#e69500";
    
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 3
            }),
            fill: new ol.style.Fill({
                color: $color
            })
        })
    });
}