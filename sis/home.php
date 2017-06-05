<?php
$AdminLevel = 1;
if (empty($DashboardLogin) || empty($Admin) || $Admin['level'] < $AdminLevel):
    die('<div style="text-align: center; margin: 5% 0; color: #C54550; font-size: 1.6em; font-weight: 400; background: #fff; float: left; width: 100%; padding: 30px 0;"><b>ACESSO NEGADO:</b> Você não esta logado<br>ou não tem permissão para acessar essa página!</div>');
endif;
?>

<section class="home page-weapper">
    <div class="container">
        <header class="row">
           <h1 class="page-header">Dashboard</h1>    
        </header>

        <div class="row">
            <article class="box col-lg-3 col-md-4 col-sm-5">
                <img src="images/icons/EditInfo.png" alt="[edit info]" title="edit info"/>
                <center><a href="dashboard.php?p=info/home" title="editar informações pessoais" class="blue icon-user">My Profile</a></center>
            </article>

            <?php if($Admin['level']==3){ ?>
                <article class="box col-lg-3 col-md-4 col-sm-5">
                    <img src="images/icons/addUser.png" alt="[adicionar user]" title="adicionar user"/>
                    <center><a href="dashboard.php?p=info/add" title="adicionar usuários" class="red icon-wrench">Add Users</a></center>
                </article>
            <?php } ?>

            <?php if($Admin['level']==2){ ?>
                <article class="box col-lg-3 col-md-4 col-sm-5">
                    <img src="images/icons/maps2.png" alt="[maps draw]" title="maps draw"/>
                    <center><a href="dashboard.php?p=draw/home" title="criar mapas" class="red icon-pencil">Edit Maps</a></center>
                </article>
            <?php } ?>

            <?php if($Admin['level']==3){ ?>
                <article class="box col-lg-3 col-md-4 col-sm-5">
                    <img src="images/icons/delUser.png" alt="[del user]" title="del user"/>
                    <center><a href="dashboard.php?p=info/del" title="excluir usuários" class="green icon-warning">Delete Users</a></center>
                </article>
            <?php } ?>
        </div>
    </div>
</section>