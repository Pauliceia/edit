<article class="boxToobar searchEnd" id="searchEnd"> 
    <header class="row">
        <h1 class="page-header"> <span class="glyphicon glyphicon-search"></span> Search address</h1>    
    </header>
    <div class="content">
        <form name="searchForm_end" id="searchForm_end" method="post">
            <input type="hidden" name="callback" value="Search" />
            <input type="hidden" name="callback_action" value="search_end" />
            
            <div class="form-group">
                <label>&#10143; First / Last (year):</label>
                <br>
                <div class="col-lg-6">
                    <input type="number" name="first_year" class="form-control years" min="1868" max="1940" placeholder="year" id="clearForm">
                </div>
                <div class="col-lg-6">
                    <input type="number" name="last_year" class="form-control years" min="1868" max="1940" placeholder="year" id="clearForm">
                </div>
                <div class="clear"></div>
            </div>
            <hr>
            <center> 
                <input type="radio" name="camada" class="camada" value="street" checked/> STREET
                <input type="radio" name="camada" class="camada" value="myplaces" style="margin-left: 15px"/> MY PLACES
                <input type="radio" name="camada" class="camada" value="places" style="margin-left: 15px"/> OTHER PLACES
            </center>
            <hr>
            <div class="form-group">
                <input type="text" name="searchInput" value="" class="form-control" tabindex="1" placeholder="street or place... " />
            </div>
            <div class="clear"></div>
        </form>

        <div id="searchResposta" class="searchResposta"></div>

        <button type="button" class="btn btn-default" id="cl_search" style="float:right;"><span class="glyphicon glyphicon-remove"></span> Close</button>
    </div>
</article>