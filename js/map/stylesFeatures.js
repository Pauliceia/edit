var emptyStyle = new ol.style.Style({ display: 'none' });

var styleStreet = new ol.style.Style({
    stroke: new ol.style.Stroke({
        width: 6, 
        color: [0, 102, 255, 0.8]
    })
});

var styleStreetRef = new ol.style.Style({
    stroke: new ol.style.Stroke({
        width: 6, 
        color: [0, 153, 51, 0.8]
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

var stylePointZero = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: [0, 0, 153, 0.9]
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

var styleFunction = function(feature) {
    var geometry = feature.getGeometry();
    var styles = [
        styleStreetSlc
    ];

    var lineStringsArray = geometry.getLineStrings();
    for(var i=0;i<lineStringsArray.length;i++){
        lineStringsArray[i].forEachSegment(function(start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            styles.push(new ol.style.Style({
                geometry: new ol.geom.Point(end),
                image: new ol.style.Icon({
                    src: 'images/arrow.png',
                    rotateWithView: false,
                    rotation: -rotation
                })
            }));
        });
    }

    return styles;
};

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