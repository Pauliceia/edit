<article class="boxToobar reverseStr" id="reverseStr"> 
    <header class="row">
        <h1 class="page-header"> <span class="glyphicon glyphicon-sort"></span> Reverse Street</h1>    
    </header>
    <div class="content">
        <form action="" name="create_form" method="post" enctype="multipart/form-data">
            <div class="callback_return">
                <?php
                if (!empty($_SESSION['trigger_login'])):
                    echo $_SESSION['trigger_login'];
                    unset($_SESSION['trigger_login']);
                endif;
                ?>
            </div>
            
            <input type="hidden" name="callback" value="Draw">
            <input type="hidden" name="callback_action" value="draw_reverse">
            <input type="hidden" name="geom">
            <input type="hidden" name="id">
            
            <div class="form-group">
                <label for="name_street">&#10143; * NAME:</label>
                <input type="text" name="name_street" class="form-control" disabled/>
            </div>
            
            <div class="form-group">
                <label for="length_street">&#10143; * LENGTH:</label>
                <input type="text" name="length_street" class="form-control" disabled/>
            </div>

            <div class="form-group">
                <label>&#10143; First / Last (year):</label>
                <br>
                <div class="col-lg-6">
                    <input type="number" name="first_year" class="form-control years" disabled>
                </div>
                <div class="col-lg-6">
                    <input type="number" name="last_year" class="form-control years" disabled>
                </div>
                <div class="clear"></div>
            </div>

            <br>
            <img class="form_load" style="display:none; position: relative; margin: 0;" alt="Enviando Requisição!" title="Enviando Requisição!" src="images/load.gif"/>
            <center>
                <button type="button" class="btn btn-info" id="sltStrReverse"><b>SELECT</b></button>
                <button type="button" class="btn btn-warning" id="strReverse" disabled><span class="glyphicon glyphicon-sort"></span> <b>REVERSE</b></button>
                
                <button type="submit" class="btn btn-danger" id="btnStrReverseSave" disabled><b>SALVAR</b></button>
            </center>            
        </form>

        <div class="clear"></div><br>
      
        <button type="button" class="btn btn-default" id="cl_reverse" style="float:right;"><span class="glyphicon glyphicon-remove"></span> Close</button>
    </div>
</article>