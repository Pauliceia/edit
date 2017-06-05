<article class="draw_form inserirDado">
        <form action="" name="create_form" method="post" enctype="multipart/form-data">
        <input type="hidden" name="callback" value="Draw">
        <input type="hidden" name="callback_action" value="draw_insert">
        <input type="hidden" name="geom" id="clearForm">

        <div class="callback_return" style="margin-bottom: -10px;">
            <?php
            if (!empty($_SESSION['trigger_login'])):
                echo $_SESSION['trigger_login'];
                unset($_SESSION['trigger_login']);
            endif;
            ?>
        </div>

        <!--- fomrulario -->

        <div class="clear"></div>

        <a class="closeForm icon-cancel-circle icon-notext" style="color: #333; cursor: pointer; bottom: 20px;"></a>
        <img class="form_load" style="float: right; margin-top: 25px; margin-left: 10px; position: relative; display: none;" alt="Enviando Requisição!" title="Enviando Requisição!" src="images/load.gif"/>
        <button class="btn">Inserir</button>
        </form>
        <div class="clear"></div>
</article>