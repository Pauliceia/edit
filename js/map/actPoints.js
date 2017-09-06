$('#pointsModel').click(function() {
    clearInteraction('points');
    if (!$(this).hasClass('active')) {
        $('#pointsModel').addClass('active');
        $('#pointsOptions').fadeIn();
    }else{
        $('#pointsModel').removeClass('active');
        $('#pointsOptions').fadeOut();
    }
});

//VARIAVEIS (OBJETOS) -> Point - PARA A INTERAÇÃO COM O MAPA
var erasePoint = new ol.interaction.Select();
var editPoint = new ol.interaction.Select();
var duplicPoint = new ol.interaction.Select();
var wkt = new ol.format.WKT();
var statusDraw = 0;
var drawPoints;

function actPoint(){

    var styleTypeActual, featActual;

    var drawPoints = new ol.interaction.Draw({
        source: places,
        type: 'Point',
        style: new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 29],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 0.85,
                src: 'images/iconLocation.png'
            }))
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
    })

    //AO CLICAR NO BOTÃO [ ]
    $('#panPoint').click(function(){
        clearInteraction('points');
        if(featActual!=null) featActual.setStyle(styleTypeActual);
        clearInteraction('line');
        $(this).addClass('activeOptions');
    
        setColorDefault('street');
        
        return false;
    });

    //AO CLICAR NO BOTÃO DE DESENHAR
    $('#drawPoint').click(function(){
        if($('#insertData input[name="id_street"]').val()!=""){
            clearInteraction('points');
            if(featActual!=null) featActual.setStyle(styleTypeActual);
            clearInteraction('line');

            $(this).addClass('activeOptions');
            $('#layersModel').removeClass('active');
            $('#layers').fadeOut();
            $('.selectCamadas').fadeOut();
            $('#searchEnd').fadeOut();
            $('#searchModel').removeClass('active');
            $('#editData').fadeOut();
            $('#duplicData').fadeOut();
            $('#insertData').fadeIn();

            if (bases instanceof ol.layer.Group){
                bases.getLayers().forEach(function(sublayer){
                    if (sublayer.get('name') == 'places') {
                        sublayer.getSource().forEachFeature(function(f) {
                            if(f.get('id') == 'waitingCheck'){
                                statusDraw=1;
                            }
                        });
                    }
                });

                if(statusDraw==0){
                    map.addInteraction(drawPoints);
                    drawPoints.on('drawend', function(e) {
                        addFeature(e.feature);
                        generationWkt(e.feature, "insert");

                        map.removeInteraction(drawPoints);
                    });
                }
                return false;
            }
        }else{
            alert('Select a street, please!');
        }
    });

    //AO CLICAR NO BOTÃO EDIÇÃO
    $('#editPoint').click(function(){
        clearInteraction('points');
        if(featActual!=null) featActual.setStyle(styleTypeActual);
        clearInteraction('line');
        $(this).addClass('activeOptions');
        map.addInteraction(editPoint);

        editPoint.getFeatures().on('add', function(e) {
            var featSelect = e.element;
            if(featSelect.get("id")!='waitingCheck' && featSelect.get("id")!=null && featSelect.get("tabName") == 'tb_places'){
                if(featActual!=null) featActual.setStyle(styleTypeActual);
                
                featActual = featSelect;
                styleTypeActual = featSelect.getStyle();

                featSelect.setStyle(styleSelects);

                $('#layersModel').removeClass('active');
                $('#layers').fadeOut();
                $('.selectCamadas').fadeOut();
                $('#searchEnd').fadeOut();
                $('#searchModel').removeClass('active');
                $('#insertData').fadeOut();
                $('#duplicData').fadeOut();
                $('#editData').fadeIn();

                getAttribs(featSelect, "editData");
            }
        });
    });

    //AO CLICAR NO BOTÃO PARA DUPLICAR FEATURE
    $('#duplicPoint').click(function(){
        clearInteraction('points');
        if(featActual!=null) featActual.setStyle(styleTypeActual);
        clearInteraction('line');
        $(this).addClass('activeOptions');
        map.addInteraction(duplicPoint);

        duplicPoint.getFeatures().on('add', function(e) {
            var featSelect = e.element;
            if(featSelect.get("id")!='waitingCheck' && featSelect.get("id")!=null && featSelect.get("tabName") == 'tb_places'){
                if(featActual!=null) featActual.setStyle(styleTypeActual);
                
                featActual = featSelect;
                styleTypeActual = featSelect.getStyle();

                featSelect.setStyle(styleSelects);

                $('#layersModel').removeClass('active');
                $('#layers').fadeOut();
                $('.selectCamadas').fadeOut();
                $('#searchEnd').fadeOut();
                $('#searchModel').removeClass('active');
                $('#insertData').fadeOut();
                $('#editData').fadeOut();
                $('#duplicData').fadeIn();

                getAttribs(featSelect, "duplicData");
            }
        });

        return false;
    });

    //AO CLICAR NO BOTÃO DE EXCLUSÃO
    $('#erasePoint').click(function(){
        clearInteraction('points');
        if(featActual!=null) featActual.setStyle(styleTypeActual);
        clearInteraction('line');
        $(this).addClass('activeOptions');
        map.addInteraction(erasePoint);

        $('#layersModel').removeClass('active');
        $('#layers').fadeOut();
        $('#searchEnd').fadeOut();
        $('.selectCamadas').fadeOut();
        $('#searchModel').removeClass('active');
        $('#insertData').fadeOut();
        $('#editData').fadeOut();
        $('#duplicData').fadeOut();

        erasePoint.getFeatures().on('add', function(e) {
            if(e.element.getGeometry().getType() == 'Point'){
                if(e.target.getArray().length !== 0){
                    if(featActual!=null) featActual.setStyle(styleTypeActual);

                    var featSelect = e.element;

                    featActual = featSelect;
                    styleTypeActual = featSelect.getStyle();

                    featSelect.setStyle(styleSelects);

                    confirme = confirm("Do you want to delete this Place?");
                    if(confirme){
                        statusDraw=0;
                        excluiFeature(e.element);
                        featActual = featSelect;
                        styleTypeActual = featSelect.getStyle();
                    }
                    
                }                  
            }
        });
        return false;
    });

}
