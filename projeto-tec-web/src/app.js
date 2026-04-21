// app.js

// 1. Gerenciamento de Estado em Memória (Array de Objetos)
// Carrega os dados portáteis do navegador ou inicia um array vazio.
let estadoReceitas = JSON.parse(localStorage.getItem('bancoReceitas')) || [];

// 2. Lógica de Validação e Cadastro
const formReceita = document.getElementById('form-receita');

if (formReceita) {
    formReceita.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento

        const titulo = document.getElementById('titulo').value.trim();
        const ingredientes = document.getElementById('ingredientes').value.trim();
        const tempo = document.getElementById('tempo').value.trim();
        const msgStatus = document.getElementById('mensagem-status');

        // Validação
        if (!titulo || !ingredientes || !tempo) {
            msgStatus.textContent = "Erro: Todos os campos devem ser preenchidos.";
            msgStatus.className = "erro";
            return;
        }

        if (isNaN(tempo) || Number(tempo) <= 0) {
            msgStatus.textContent = "Erro: O tempo de preparo deve ser um número válido e maior que zero.";
            msgStatus.className = "erro";
            return;
        }

        // Criando a estrutura JS (Objeto)
        const novaReceita = {
            id: Date.now(),
            titulo: titulo,
            ingredientes: ingredientes,
            tempo: tempo
        };

        // Adiciona ao estado em memória e salva
        estadoReceitas.push(novaReceita);
        localStorage.setItem('bancoReceitas', JSON.stringify(estadoReceitas));

        // Feedback Acessível (aria-live fará o leitor de tela falar isso automaticamente)
        msgStatus.textContent = "Receita publicada com sucesso!";
        msgStatus.className = "sucesso";
        formReceita.reset();

        setTimeout(() => { msgStatus.textContent = ""; }, 4000);
    });
}

// 3. Lógica de Listagem Dinâmica
const listaReceitasUI = document.getElementById('lista-receitas');

if (listaReceitasUI) {
    function renderizarReceitas() {
        listaReceitasUI.innerHTML = ''; // Limpa a lista HTML

        if (estadoReceitas.length === 0) {
            const aviso = document.createElement('li');
            aviso.innerHTML = "<p>O forno está vazio. Nenhuma receita cadastrada ainda!</p>";
            listaReceitasUI.appendChild(aviso);
            return;
        }

        // Renderização Múltipla sem usar <div>
        estadoReceitas.forEach(receita => {
            const itemLista = document.createElement('li');
            
            // Usamos <article> para definir conteúdo independente de forma semântica
            itemLista.innerHTML = `
                <article class="receita-card">
                    <h3>${receita.titulo}</h3>
                    <p><strong>Tempo de preparo:</strong> ${receita.tempo} minutos</p>
                    <p><strong>Ingredientes principais:</strong> ${receita.ingredientes}</p>
                </article>
            `;
            listaReceitasUI.appendChild(itemLista);
        });
    }

    renderizarReceitas();
}