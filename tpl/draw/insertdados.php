<article class="boxToobar form_draw" id="insertData"> 
    <header class="row">
        <h1 class="page-header"> <span class="glyphicon glyphicon-pencil"></span> Insert Data</h1>    
    </header>
    <div class="content">
        <form action="" name="create_form" method="post" enctype="multipart/form-data">
        <input type="hidden" name="callback" value="Draw">
        <input type="hidden" name="callback_action" value="draw_insert">
        <input type="hidden" name="geom" required id="clearForm">
        <input type="hidden" name="id_user" class="inF" value="<?= $Admin['id'] ?>">

        <div class="callback_return" style="margin-bottom: -10px;">
            <?php
            if (!empty($_SESSION['trigger_login'])):
                echo $_SESSION['trigger_login'];
                unset($_SESSION['trigger_login']);
            endif;
            ?>
        </div>

        <div class="form-group">
            <label for="name">&#10143; Name:</label>
            <input type="text" name="name" class="form-control inF" placeholder="name " id="clearForm">
        </div>
        <div class="form-group">
            <label for="street">&#10143; Street:</label>
            <input type="hidden" name="id_street" value="515" class="inF">
            <input type="text" name="street" class="form-control" disabled>
        </div>
        <div class="form-group">
            <label for="number">&#10143; * Number:</label>
            <input type="number" name="number" class="form-control inF" required id="clearForm">
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
            <label for="source">&#10143; * Source:</label>
            <input type="text" name="source" class="form-control inF" placeholder="fonte" required id="clearForm">
        </div>

        <button type="button" class="btn btn-default cl_form"><span class="glyphicon glyphicon-remove"></span> Close</button>
        <button class="btn btn-success" id="enviar_form">Inserir</button>
        <img class="form_load" style="margin-left: 10px; display:none;" alt="Enviando Requisição!" title="Enviando Requisição!" src="images/load.gif"/>
        </form>
    </div>
</article>