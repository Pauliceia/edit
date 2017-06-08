if($.cookie("saveViewCenter") && $.cookie("saveViewCenter") != ''){
	var long = parseFloat($.cookie("saveViewCenter"));
	var lat = $.cookie("saveViewCenter").lastIndexOf(",");
	lat = $.cookie("saveViewCenter").substr(lat+1);
	lat = parseFloat(lat);

	var centerMap = [long, lat];
	var zoomMap = $.cookie("saveViewZoom");
}else{
	var centerMap = [-5432905.961580031, -2530559.233689207];
	var zoomMap = '7';
}
view = new ol.View({
	center: centerMap,
	zoom: zoomMap,
	maxZoom: 25,
	minZoom: 2
});

// ===========================
//configurações de mostragem do mapa
var map = new ol.Map({
	target: 'mapafixo',
	controls: ol.control.defaults().extend([
		new ol.control.ScaleLine(),
		new ol.control.ZoomSlider()
	]),
	renderer: 'canvas',
	layers: [openstreetmap, bingRoad, bases],
	view: view
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



