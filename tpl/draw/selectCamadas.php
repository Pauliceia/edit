
<article class='boxToobar selectCamadas'>
    <header class="row">
        <h1 class="page-header"><span class=" glyphicon glyphicon-check"></span> Select Features (date)</h1>    
    </header>

    <div class="content">
        <input type="hidden" name="featureName" value="" />
            
        <div class="form-group">
            <label>&#10143; First / Last (year):</label>
            <br>
            <div class="col-lg-6">
                <input type="number" name="first_year" class="form-control" min="1868" max="1940" placeholder="year">
            </div>
            <div class="col-lg-6">
                <input type="number" name="last_year" class="form-control" min="1868" max="1940" placeholder="year">
            </div>
            <div class="clear"></div>
        </div>
        <div class="clear"></div>
        </form>
        <center>
            <button type="button" class="btn btn-success" id="applyCamadas">Apply</button>
            <button type="button" class="btn btn-default" id="cl_selectC"><span class="glyphicon glyphicon-remove"></span> Close</button>
        </center>
    </div>
</article>