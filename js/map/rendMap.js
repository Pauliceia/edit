// ===========================
//configurações de mostragem do mapa
function rendMap(bases, osm){

	if($.cookie("saveViewCenter") && $.cookie("saveViewCenter") != ''){
		var long = parseFloat($.cookie("saveViewCenter"));
		var lat = $.cookie("saveViewCenter").lastIndexOf(",");
		lat = $.cookie("saveViewCenter").substr(lat+1);
		lat = parseFloat(lat);

		var centerMap = [long, lat];
		var zoomMap = $.cookie("saveViewZoom");
	}else{
		var centerMap = [-46.63665134071729, -23.543103484961193];
		var zoomMap = '15';
	}

	view = new ol.View({
		projection: 'EPSG:4326',
		center: centerMap,
		zoom: zoomMap,
		maxZoom: 21,
		minZoom: 2
	});

	map = new ol.Map({
		target: 'mapafixo',
		controls: ol.control.defaults().extend([
			new ol.control.ScaleLine(),
			new ol.control.ZoomSlider()
		]),
		renderer: 'canvas',
		layers: [osm, bases],
		view: view
	});
}


