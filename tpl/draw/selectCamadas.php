
<article class='boxToobar selectCamadas'>
    <header class="row">
        <h1 class="page-header"><span class=" glyphicon glyphicon-check"></span> Select Features (date)</h1>    
    </header>

    <div class="content">
            
        <div class="form-group">
            <input type="text" name="featureName" class="form-control" value="" disabled/>
            <br>
            <label>&#10143; First / Last (year):</label>
            <br>
            <div class="col-lg-6">
                <input type="number" name="first_year" class="form-control" min="1868" max="1940" placeholder="year" value="1868">
            </div>
            <div class="col-lg-6">
                <input type="number" name="last_year" class="form-control" min="1868" max="1940" placeholder="year" value="1940">
            </div>
            <div class="clear"></div>
        </div>
        <div class="clear"></div>

        <center>
            <button type="button" class="btn btn-success" id="applyCamadas">Apply</button>
            <button type="button" class="btn btn-default" id="cl_selectC"><span class="glyphicon glyphicon-remove"></span> Close</button>
        </center>
    </div>
</article>