//colorindo os places duplicados
function editPlaceDuplic(dadosDuplic){

    var styleDuplic = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'orange'
            })
        })
    });

    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == "places") {
                sublayer.getSource().getFeatures().forEach(function(feat){

                    dadosDuplic.forEach(function(res){
                        var pontos = res.substr(res.indexOf('(')+1);
                        pontos = pontos.substr(0,pontos.indexOf(')'));
                        var listPoints = pontos.split(' ');

                        if(feat.getGeometry().getCoordinates()[0]==listPoints[0] && feat.getGeometry().getCoordinates()[1]==listPoints[1]){
                            feat.setStyle(styleDuplic);
                        }
                    });

                });
            }
        });
    }

}

//liberando as ações por evento
function activeActions(){

    //OPEN / CLOSE TOOBAR LAYERS
    $('#layersModel').click(function () {
        clearInteraction('points');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        $('.form_draw').fadeOut();
        $('#searchEnd').fadeOut();
        $('#searchModel').removeClass('active');
        arrowLine('remove');

        $('#layers').fadeIn();
    });
    $('#cl_layers').click(function () {
        $('#layersModel').removeClass('active');
        $('#layers').fadeOut();
    });

    // CLOSE TOOBAR DE FORMULARIOS
    $('.cl_form').click(function () {
        clearInteraction('points');
        $('.form_draw').fadeOut();
        $('.btn_edit .btn').removeClass('activeOptions');
    });

    //OPEN / CLOSE TOOBAR SEARCH
    $('#searchModel').click(function () {
        clearInteraction('points');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        $('.form_draw').fadeOut();
        $('#layersModel').removeClass('active');
        $('#layers').fadeOut();
        $('.selectCamadas').fadeOut();
        arrowLine('remove');

        $('#searchEnd').fadeIn();
        //load_dados();
    });
    $('#cl_search').click(function () {
        $('#searchModel').removeClass('active');
        $('#searchEnd').fadeOut();
    });

    //OPEN / CLOSE TOOBAR REVERSE
    $('#reverseModel').click(function () {
        clearInteraction('points');
        clearInteraction('line');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        arrowLine('');
    });
    $('#cl_reverse').click(function () {
        arrowLine('remove');
    });


    //btn RECARREGAMENTO de PÁGINA
    $('#recEditModel').click(function () {
        var viewCenter = map.getView().getCenter();
        var viewZoom = map.getView().getZoom();

        $.cookie("saveViewCenter", viewCenter);
        $.cookie("saveViewZoom", viewZoom);

        location.reload();
    });
    $('#recDefModel').click(function () {
        $.removeCookie("saveViewCenter");
        $.removeCookie("saveViewZoom");

        location.reload();
    });

    //btn SELECT DE FEATURES EM DETERMINADO TEMPO (DATE)
    $('.selectCam').click(function () {
        $('.selectCamadas input[name="featureName"]').val($(this).attr('name'));
        
        var refMap = $('#layers span.period.'+$(this).attr('name')).text().substr(2, 11).split(' - ');
        $('.selectCamadas input[name="first_year"]').val(refMap[0]);
        $('.selectCamadas input[name="last_year"]').val(refMap[1]);
    
        $('.selectCamadas').fadeIn();
    });
    $('#cl_selectC').click(function () {
        $('.selectCamadas').fadeOut();
    });
    $('#applyCamadas').click(function () {
	    var emptyStyle = new ol.style.Style({ display: 'none' });

        var featName = $('.selectCamadas input[name="featureName"]').val();
        var anoFirst = $('.selectCamadas input[name="first_year"]').val();
        var anoLast = $('.selectCamadas input[name="last_year"]').val();

        if(!anoFirst) anoFirst=1868;
        if(!anoLast) anoLast=1940;

        if (bases instanceof ol.layer.Group){
            bases.getLayers().forEach(function(sublayer){
                if (sublayer.get('name') == featName) {
                    sublayer.getSource().getFeatures().forEach( function(feat){
                        var visibleStyle = sublayer.getStyle();

                        if(feat.get('first_year')==null){
                            if (feat.get('last_year') <= anoLast) feat.setStyle(visibleStyle);
                            else feat.setStyle(emptyStyle);
                        }else if(feat.get('last_year')==null){
                            if (feat.get('first_year') >= anoFirst) feat.setStyle(visibleStyle);
                            else feat.setStyle(emptyStyle);
                        }else{
                            if ((feat.get('first_year') >= anoFirst && feat.get('first_year') <= anoLast) 
                                    || (feat.get('last_year') >= anoFirst && feat.get('last_year') <= anoLast) ) feat.setStyle(visibleStyle);
                            else feat.setStyle(emptyStyle);
                        }             
                    });
                }
            });
        }

        $('#layers span.period.'+featName).html('( '+anoFirst+' - '+anoLast+' )');
    });


    // ===========================
    //ações de mostragem dos mapas fixos ONLINE
    $('.layersMap input[type=radio]').change(function() {
        var layer = $(this).val();

        map.getLayers().getArray().forEach(function(e) {
            var name = e.get('name');
            if(name == layer){
                if(!e.get('visible')){
                    e.setVisible(true);
                }
            }else if(name != 'bases'){
                e.setVisible(false);
            }
        });
    });
    //ações de mostragem dos mapas NATIVOS (geoserver ou banco de dados)
    $('.layersMap input[type=checkbox]').click(function() {
        var layerselect = $(this).val();

        if (bases instanceof ol.layer.Group){
            bases.getLayers().forEach(function(sublayer){
                if (sublayer.get('name') == layerselect) {
                    if(!sublayer.get('visible')){
                        sublayer.setVisible(true);
                    }else{
                        sublayer.setVisible(false);
                    }
                }
            });
        }

    });

    //btn SEARCH (GEOCODIFICAÇÃO DE ENDEREÇOS)
        //inicia-se a função de GEOLOCALIZAÇÃO
        $(".searchEnd input[name='searchInput']").keyup(function(){
            load_dados();
        });

        $(".searchEnd .years").keyup(function(){
            if($('.searchEnd input[name="first_year"]').val()>=1868 
                && $('.searchEnd input[name="first_year"]').val()<=1940
                && $('.searchEnd input[name="last_year"]').val()>=1868
                && $('.searchEnd input[name="last_year"]').val()<=1940
                && $('.searchEnd input[name="first_year"]').val() <= $('.searchEnd input[name="last_year"]').val()){
                load_dados();
            }
        });

        //função que carrega os dados do formulário para o ajax
        var firstFeature;
        function load_dados(){
            var form = $('#searchForm_end');

            var consulta = form.find('input[name="searchInput"]').val();
            var first_year = form.find('input[name="first_year"]').val();
            var last_year = form.find('input[name="last_year"]').val();

            var callback = form.find('input[name="callback"]').val();
            var callback_action = form.find('input[name="callback_action"]').val();

            var defaultStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 6, 
                    color: [0, 102, 255, 0.8]
                })
            });
            
            var selectStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 6, 
                    color: [0, 0, 153, 0.9]
                })
            });            

            form.ajaxSubmit({
                type: 'POST',
                data: {callback_action: callback_action},
                dataType: 'json',
                url: 'ajax/' + callback + '.ajax.php',
                success: function(msg){
                    var res = msg.sucess;
                    $("#searchResposta").html(res).fadeIn();

                    //ao clicar no botão de visualizar a rua
                    $(".searchResposta p button").click(function(){
                        var idRua = $(this).attr('id');
                            
                        //centraliza o mapa na rua selecionada
                        var extent = ol.extent.createEmpty();
                        bases.getLayers().forEach(function(layer) {
                            if(layer.get('name') == "street"){

                                layer.setStyle(defaultStyle);
                                if(firstFeature) firstFeature.setStyle(defaultStyle);

                                var ruaSelect = layer.getSource().getFeatureById(idRua);
                                ruaSelect.setStyle(selectStyle);
                                firstFeature = ruaSelect;

                                ol.extent.extend(extent, ruaSelect.getGeometry().getExtent());
                            }
                        });
                        map.getView().fit(extent, map.getSize());
                        
                    });
                }
            });
        }

    // função que adiciona e remove os arrows das ruas
    function arrowLine(actionType){
        if(actionType=='remove'){
            $('#reverseModel').removeClass('active');
            $('#reverseStr').fadeOut();
            $('#strReverse').attr('disabled', true);
        }else{
            $('.form_draw').fadeOut();
            $('#layersModel').removeClass('active');
            $('#layers').fadeOut();
            $('.selectCamadas').fadeOut();
            $('#searchEnd').fadeOut();
            $('#searchModel').removeClass('active');

            $('#reverseStr').fadeIn();
        }
        return;
    }

}