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

        $('#searchEnd').fadeIn();
        //load_dados();
    });
    $('#cl_search').click(function () {
        $('#searchModel').removeClass('active');
        $('#searchEnd').fadeOut();
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

}
