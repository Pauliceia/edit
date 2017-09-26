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

    var featSelect;
    $('#sltStrReverse').click(function(){
        clearInteraction('point');
        clearInteraction('line');
        selectLine = new ol.interaction.Select({
            style: styleFunction
        });
        map.addInteraction(selectLine);

        selectLine.getFeatures().on('add', function(e) {
            if(e.element.get("tabName") == 'tb_street'){
                featSelect = e.element;

                $('#strReverse').attr('disabled', false);
                $('#reverseStr input[name="name_street"]').val(featSelect.get('name'));
                $('#reverseStr input[name="first_year"]').val(featSelect.get('first_year'));
                $('#reverseStr input[name="last_year"]').val(featSelect.get('last_year'));

                var sizeStreet = 0;
                if(featSelect.get('perimeter')==0){
                    //MultiLineString
                    for(var i=0; i<featSelect.getGeometry().getLineStrings().length; i++){
                        sizeStreet += LengthLineString(featSelect.getGeometry().getCoordinates()[i]);
                    }
                }else{
                    sizeStreet = featSelect.get('perimeter');
                }
                sizeStreet = sizeStreet>=1000 ? parseFloat((sizeStreet/1000).toFixed(2))+"km" : (parseFloat(sizeStreet).toFixed(2))+"m";
                $('#reverseStr input[name="length_street"]').val(sizeStreet);
                $('#reverseStr input[name="id"]').val(featSelect.get('id'));
            }
        });
        
        return false;
    });

    $('#strReverse').click(function(){
        clearInteraction('point');
        var newLine = [];
        var lineStringsArray = featSelect.getGeometry().getLineStrings();

        for(var i=lineStringsArray.length-1; i>=0 ;i--){
            newLine[i] = featSelect.getGeometry().getCoordinates()[i].reverse();
        }
        featSelect.getGeometry().setCoordinates(newLine);

        generationWkt(featSelect, "reverse");
        $('#btnStrReverseSave').prop("disabled", false);
        
        return false;
    });

    function getStreetLine(type){
        map.addInteraction(selectLine);  

        selectLine.getFeatures().on('add', function(e) {
            if(featSelect!=null){
                featSelect.setStyle(styleStreetSlc);
            }

            if(e.element.get("tabName") == 'tb_street'){
                featSelect = e.element;

                var idStreet = featSelect.get("id");
                var nameStreet = featSelect.get("name");

                $('#'+type+' input[name="id_street"]').val(idStreet);
                $('#'+type+' input[name="street"]').val(nameStreet);
            }
        });
    }
}
