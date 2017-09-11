<article class="boxToobar form_draw" id="insertData"> 
    <header class="row">
        <h1 class="page-header"> <span class="glyphicon glyphicon-pencil"></span> Insert Data</h1>    
    </header>
    <div class="content">
        <div id="dialog-confirm" style="display:none;"></div>

        <form action="" name="create_form" method="post" enctype="multipart/form-data">
        <input type="hidden" name="callback" value="Draw">
        <input type="hidden" name="callback_action" value="draw_insert">
        <input type="hidden" name="geom" required id="clearForm">
        <input type="hidden" name="termo" id="clearForm">
        <input type="hidden" name="id_user" class="inF" value="<?= $Admin['id'] ?>">

        <div class="form-group">
            <label>&#10143; * LAT / LONG:</label>
            <br>
            <div class="col-lg-6">
                <input type="text" name="lat" class="form-control" placeholder="lat" id="clearForm" disabled>
            </div>
            <div class="col-lg-6">
                <input type="text" name="long" class="form-control" placeholder="long" id="clearForm" disabled>
            </div>
            <div class="clear"></div>
        </div>
        <div class="form-group">
            <label for="name">&#10143; Name:</label>
            <input type="text" name="name" class="form-control inF" placeholder="name " id="clearForm">
        </div>
        <div class="form-group">
            <label for="street">&#10143; Street:</label>
            <input type="hidden" name="id_street" class="inF">
            <input type="text" name="street" class="form-control" disabled>
        </div>
        <div class="form-group">
            <label for="number">&#10143; * Number:</label>  
            <input type="number" name="number" class="form-control inF" step="0.01" required id="clearForm">
        </div>
        <div class="form-group">
            <label for="original_number">&#10143; Original Number:</label>
            <input type="text" name="original_number" class="form-control inF" placeholder="full number" id="clearForm">
        </div>
        <div class="form-group">
            <label>&#10143; First date (dd/mm/yyyy):</label>
            <br>
            <div class="col-lg-4">
                <input type="number" name="first_day" class="form-control inF" min="1" max="31" placeholder="day" id="clearForm">
            </div>
            <div class="col-lg-4">
                <input type="number" name="first_month" class="form-control inF" min="1" max="12" placeholder="month" id="clearForm">
            </div>
            <div class="col-lg-4">
                <input type="number" name="first_year" class="form-control inF" min="1868" max="1940" placeholder="year" id="clearForm">
            </div>
            <div class="clear"></div>
        </div>
        <div class="form-group">
            <label>&#10143; Last date (dd/mm/yyyy):</label>
            <br>
            <div class="col-lg-4">
                <input type="number" name="last_day" class="form-control inF" min="1" max="31" placeholder="day" id="clearForm">
            </div>
            <div class="col-lg-4">
                <input type="number" name="last_month" class="form-control inF" min="1" max="12" placeholder="month" id="clearForm">
            </div>
            <div class="col-lg-4">
                <input type="number" name="last_year" class="form-control inF" min="1868" max="1940" placeholder="year" id="clearForm">
            </div>
            <div class="clear"></div>
        </div>  
        <div class="form-group">
            <label for="source">&#10143; Discrete date ?</label><br>
            <input type="checkbox" name="disc_date" style="height: 20px; width: 20px; margin:10px 5px 0 10px;" value="true"> <b style="font-size: 1.3em;">YES</b>
        </div>      
        <div class="form-group">
            <label for="source">&#10143; Description:</label>
            <textarea name="description" class="form-control" id="clearForm"></textarea>
        </div>
        <div class="form-group">
        <label for="source">&#10143; * Source:</label>
        <input type="text" name="source" class="form-control inF" placeholder="fonte" required id="clearForm">
    </div>

        <div class="callback_return">
            <?php
            if (!empty($_SESSION['trigger_login'])):
                echo $_SESSION['trigger_login'];
                unset($_SESSION['trigger_login']);
            endif;
            ?>
        </div>

        <button type="button" class="btn btn-default cl_form"><span class="glyphicon glyphicon-remove"></span> Close</button>
        <button class="btn btn-success" id="enviar_form">Insert</button>
        
        <div class="clear"></div>
        <img class="form_load" style="float: right; position:relative; display:none;" alt="Enviando Requisição!" title="Enviando Requisição!" src="images/load.gif"/>
        </form>
    </div>
</article>