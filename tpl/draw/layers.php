<article class='boxToobar layersMap' id="layers">
    <header class="row">
        <h1 class="page-header"> <span class=" glyphicon glyphicon-check"></span> Select Layers</h1>    
    </header>
    <div class="content">
        <li><input type="checkbox" name="layers" value="places" checked>
            <b> Places</b> 
            <span style='font-size: 0.9em; color: #666;' class='period places'>( 1868 - 1940 )</span>
            <span style='float: right; cursor:pointer; color: #0066ff;' class='glyphicon glyphicon-cog selectCam' name='places'></span>
        </li>
        <li><input type="checkbox" name="layers" value="street" checked> 
            Street 
            <span style='font-size: 0.9em; color: #666;' class='period street'>( 1868 - 1940 )</span>
            <span style='float: right; cursor:pointer; color: #0066ff;' class='glyphicon glyphicon-cog selectCam' name='street'></span>
        </li>
        <li><input type="checkbox" name="layers" value="sara" checked> Sara Brasil</li>
        <br>
        <li><input type="radio" name="layerbase" value="openstreetmap" checked> OpenStreetMap</li>
        <li><input type="radio" name="layerbase" value="bingRoad"> Esri</li>
        <li><input type="radio" name="layerbase" value="none"> Blank</li>
        
        <button type="button" class="btn btn-default" id="cl_layers" style="display:block; margin: 30px auto 0 auto;">
            <span class="glyphicon glyphicon-remove"></span> Close
        </button>
    </div>
</article>
