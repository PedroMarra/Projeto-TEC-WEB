

const dbUsuarios = JSON.parse(localStorage.getItem('bd_usuarios')) || [];
const dbReceitas = JSON.parse(localStorage.getItem('bd_receitas')) || [];
let usuarioLogado = JSON.parse(localStorage.getItem('sessao_atual')) || null;


function atualizarSessao(usuario) {
    usuarioLogado = usuario;
    localStorage.setItem('sessao_atual', JSON.stringify(usuario));
    window.location.reload(); 
}


const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => atualizarSessao(null));
}



const modalLogin = document.getElementById('modal-login');
const btnAbrirLogin = document.getElementById('btn-abrir-login');
const btnFecharLogin = document.getElementById('btn-fechar-login');
const formLogin = document.getElementById('form-login');

if (modalLogin) {
   
    btnAbrirLogin.addEventListener('click', () => modalLogin.showModal());
    btnFecharLogin.addEventListener('click', () => modalLogin.close());

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        const msgErro = document.getElementById('msg-login-erro');

        const usuarioEncontrado = dbUsuarios.find(u => u.email === email && u.senha === senha);

        if (usuarioEncontrado) {
            atualizarSessao(usuarioEncontrado);
        } else {
            msgErro.textContent = "Email ou senha incorretos!";
        }
    });
}



const formCadastroUser = document.getElementById('form-cadastro-usuario');

if (formCadastroUser) {
    formCadastroUser.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('reg-nome').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const senha = document.getElementById('reg-senha').value;
        const msgStatus = document.getElementById('msg-reg-status');

  
        if (dbUsuarios.some(u => u.email === email)) {
            msgStatus.textContent = "Este e-mail já está cadastrado!";
            msgStatus.className = "erro";
            return;
        }

     
        const novoUsuario = { id: Date.now(), nome, email, senha };
        dbUsuarios.push(novoUsuario);
        localStorage.setItem('bd_usuarios', JSON.stringify(dbUsuarios));

        msgStatus.textContent = "Usuário cadastrado! Redirecionando para login...";
        msgStatus.className = "sucesso";
        formCadastroUser.reset();

        // Redireciona para a home após 2 segundos
        setTimeout(() => window.location.href = "index.html", 2000);
    });
}



const modalReceita = document.getElementById('modal-receita');
const btnAbrirModalReceita = document.getElementById('btn-nova-receita');
const btnFecharModalReceita = document.getElementById('btn-fechar-receita');
const formReceita = document.getElementById('form-receita');
const listaReceitasUI = document.getElementById('lista-receitas');
const avisoLoginUI = document.getElementById('aviso-login-receita');

if (listaReceitasUI) {
   
    if (usuarioLogado) {
        avisoLoginUI.style.display = 'none'; // Esconde aviso
        btnAbrirModalReceita.addEventListener('click', () => modalReceita.showModal());
        btnFecharModalReceita.addEventListener('click', () => modalReceita.close());
    } else {
        btnAbrirModalReceita.style.display = 'none'; // Esconde botão se não logado
    }

   
    if (formReceita) {
        formReceita.addEventListener('submit', (e) => {
            e.preventDefault();
            const novaReceita = {
                id: Date.now(),
                titulo: document.getElementById('rec-titulo').value.trim(),
                ingredientes: document.getElementById('rec-ingredientes').value.trim(),
                autor: usuarioLogado.nome // Vincula a receita ao usuário logado!
            };

            dbReceitas.push(novaReceita);
            localStorage.setItem('bd_receitas', JSON.stringify(dbReceitas));
            
            formReceita.reset();
            modalReceita.close();
            renderizarReceitas(); 
        });
    }

   
    function renderizarReceitas() {
        listaReceitasUI.innerHTML = '';
        if (dbReceitas.length === 0) {
            listaReceitasUI.innerHTML = "<li><p>Nenhuma receita cadastrada ainda.</p></li>";
            return;
        }

        dbReceitas.forEach(receita => {
            const li = document.createElement('li');
            li.innerHTML = `
                <article class="receita-card">
                    <h3>${receita.titulo}</h3>
                    <p><strong>Ingredientes:</strong> ${receita.ingredientes}</p>
                    <p class="autor-tag">👩‍🍳 Publicado por: ${receita.autor}</p>
                </article>
            `;
            listaReceitasUI.appendChild(li);
        });
    }
    renderizarReceitas();
}


window.addEventListener('DOMContentLoaded', () => {
    const areaLogin = document.getElementById('area-login-nav');
    const areaLogout = document.getElementById('area-logout-nav');
    const nomeUsuarioUI = document.getElementById('nome-usuario-logado');

    if (usuarioLogado) {
        if(areaLogin) areaLogin.style.display = 'none';
        if(areaLogout) areaLogout.style.display = 'inline';
        if(nomeUsuarioUI) nomeUsuarioUI.textContent = usuarioLogado.nome;
    } else {
        if(areaLogin) areaLogin.style.display = 'inline';
        if(areaLogout) areaLogout.style.display = 'none';
    }
});