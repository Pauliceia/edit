// ===========================
//configurações de mostragem do mapa
function rendMap(){

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

	map = new ol.Map({
		target: 'mapafixo',
		controls: ol.control.defaults().extend([
			new ol.control.ScaleLine(),
			new ol.control.ZoomSlider()
		]),
		renderer: 'canvas',
		layers: [openstreetmap, bingRoad, bases],
		view: view
	});
}


