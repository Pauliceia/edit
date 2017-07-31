var styleFunction = function(feature) {
    var geometry = feature.getGeometry();
    var styles = [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 6, 
                color: [0, 0, 153, 0.9]
            })
        })
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
    
//VARIAVEIS (OBJETOS) -> line - PARA A INTERAÇÃO COM O MAPA
var selectLine = new ol.interaction.Select({
    style: styleFunction
});

//AO CLICAR NO BOTÃO PARA DUPLICAR FEATURE
function actLine(){
    $('#selectStLine').click(function(){
        clearInteraction('point');
        $(this).addClass('activeOptions');
        getStreetLine('insertData');
        return false;
    });
    
    $('#alterStLine').click(function(){
        clearInteraction('point');
        getStreetLine('editData');
        return false;
    });

    function getStreetLine(type){
        map.addInteraction(selectLine);

        selectLine.getFeatures().on('add', function(e) {
            var featSelect = e.element;
            if(featSelect.get("tabName") == 'tb_street'){
                var idStreet = featSelect.get("id");
                var nameStreet = featSelect.get("name");

                $('#'+type+' input[name="id_street"]').val(idStreet);
                $('#'+type+' input[name="street"]').val(nameStreet);
            }
        });
    }
}
