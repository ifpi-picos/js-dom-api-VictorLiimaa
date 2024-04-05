document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

const accessToken = 'ba2fc45ae1992145acae386264167665fbaf3578'; // Substitua pelo seu token real

function inicializarApp() {
    document.getElementById('btnAdicionar').addEventListener('click', adicionarTarefa);
    carregarTarefas();
}

async function adicionarTarefa() {
    const input = document.getElementById('inputTarefa');
    const textoTarefa = input.value.trim();

    if (!textoTarefa) {
        alert('Por favor, insira o texto da tarefa!');
        return;
    }

    const tarefa = {
        content: textoTarefa
    };

    await fetch('https://api.todoist.com/rest/v2/tasks', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarefa)
    });

    carregarTarefas();
    input.value = ''; // Limpar o campo de entrada
}

async function carregarTarefas() {
    const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const tarefas = await response.json();
    const lista = document.getElementById('listaTarefas');
    lista.innerHTML = ''; // Limpar lista existente antes de recarregar

    tarefas.forEach(tarefa => {
        exibirTarefaNaLista(tarefa);
    });
}

function exibirTarefaNaLista(tarefa) {
    const lista = document.getElementById('listaTarefas');
    const item = document.createElement('li');
    item.setAttribute('data-id', tarefa.id);

    if (tarefa.completed) {
        item.classList.add('completed');
    }

    item.innerHTML = `
        <span>${tarefa.content}</span>
        <button class="tarefa-btn btn-concluir">Concluir</button>
        <button class="tarefa-btn btn-remover">Remover</button>
    `;

    const btnConcluir = item.querySelector('.btn-concluir');
    btnConcluir.addEventListener('click', () => concluirTarefa(tarefa.id));

    const btnRemover = item.querySelector('.btn-remover');
    btnRemover.addEventListener('click', () => removerTarefa(tarefa.id, item));

    lista.appendChild(item);
}

async function concluirTarefa(id) {
    await fetch(`https://api.todoist.com/rest/v2/tasks/${id}/close`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    carregarTarefas();
}

async function removerTarefa(id, item) {
    await fetch(`https://api.todoist.com/rest/v2/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    item.remove();
}
