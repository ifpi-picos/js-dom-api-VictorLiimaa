document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

function inicializarApp() {
    document.getElementById('btnAdicionar').addEventListener('click', adicionarTarefa);
    carregarTarefas();
}

function adicionarTarefa() {
    const input = document.getElementById('inputTarefa');
    const textoTarefa = input.value.trim();

    if (!textoTarefa) {
        alert('Por favor, insira o texto da tarefa!');
        return;
    }

    const tarefa = {
        id: Date.now(),
        texto: textoTarefa,
        concluida: false
    };

    salvarTarefa(tarefa);
    exibirTarefaNaLista(tarefa);
    input.value = ''; // Limpar o campo de entrada
}

function salvarTarefa(tarefa) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push(tarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.forEach(tarefa => exibirTarefaNaLista(tarefa));
}

function exibirTarefaNaLista(tarefa) {
    const lista = document.getElementById('listaTarefas');
    const item = document.createElement('li');
    item.setAttribute('data-id', tarefa.id);

    if (tarefa.concluida) {
        item.classList.add('completed');
    }

    item.innerHTML = `
        <span>${tarefa.texto}</span>
        <button class="tarefa-btn btn-concluir">Concluir</button>
        <button class="tarefa-btn btn-remover">Remover</button>
    `;

    const btnConcluir = item.querySelector('.btn-concluir');
    btnConcluir.addEventListener('click', () => concluirTarefa(tarefa.id));

    const btnRemover = item.querySelector('.btn-remover');
    btnRemover.addEventListener('click', () => removerTarefa(tarefa.id, item));

    lista.appendChild(item);
}

function concluirTarefa(id) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const tarefaIndex = tarefas.findIndex(tarefa => tarefa.id === id);
    tarefas[tarefaIndex].concluida = !tarefas[tarefaIndex].concluida;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    document.querySelector(`[data-id="${id}"]`).classList.toggle('completed');
}

function removerTarefa(id, item) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const novasTarefas = tarefas.filter(tarefa => tarefa.id !== id);
    localStorage.setItem('tarefas', JSON.stringify(novasTarefas));

    item.remove();
}
