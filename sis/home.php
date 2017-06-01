<?php
$AdminLevel = 1;
if (empty($DashboardLogin) || empty($Admin) || $Admin['level'] < $AdminLevel):
    die('<div style="text-align: center; margin: 5% 0; color: #C54550; font-size: 1.6em; font-weight: 400; background: #fff; float: left; width: 100%; padding: 30px 0;"><b>ACESSO NEGADO:</b> Você não esta logado<br>ou não tem permissão para acessar essa página!</div>');
endif;
?>

<section class="home">
            <div class="container">

            <article class="box box3">
                <img src="images/icons/EditInfo.png" alt="[edit info]" title="edit info"/>
                <center><a href="dashboard.php?p=info/home" title="editar informações pessoais" class="blue icon-user">Informações Pessoais</a></center>
            </article>

            <?php if($Admin['level']==3){ ?>
                <article class="box box3">
                    <img src="images/icons/addUser.png" alt="[adicionar user]" title="adicionar user"/>
                    <center><a href="dashboard.php?p=info/add" title="adicionar usuários" class="red icon-wrench">Adicionar Usuários</a></center>
                </article>
            <?php } ?>

            <?php if($Admin['level']==2){ ?>
                <article class="box box3">
                    <img src="images/icons/maps2.png" alt="[maps draw]" title="maps draw"/>
                    <center><a href="dashboard.php?p=draw/home" title="criar mapas" class="red icon-pencil">Desenhar Mapas</a></center>
                </article>
            <?php } ?>

            <?php if($Admin['level']==3){ ?>
                <article class="box box3">
                    <img src="images/icons/delUser.png" alt="[del user]" title="del user"/>
                    <center><a href="dashboard.php?p=info/del" title="excluir usuários" class="green icon-warning">Excluir Responsável</a></center>
                </article>
            <?php } ?>

            </div>
</section>