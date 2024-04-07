document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

const accessToken = 'ba2fc45ae1992145acae386264167665fbaf3578'; // Substitua pelo seu token real

let currentDate = new Date();
let dataSelecionada = null;

function inicializarApp() {
    document.getElementById('formTarefa').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede a recarga da página
        adicionarTarefa();
    });
    carregarTarefas();
}


async function adicionarTarefa() {
    const inputTarefa = document.getElementById('inputTarefa');
    const inputData = document.getElementById('inputData');
    const inputEtiqueta = document.getElementById('inputEtiqueta'); 
    const textoTarefa = inputTarefa.value.trim();
    const dataTarefa = inputData.value;
    const etiquetas = inputEtiqueta.value.split(',').map(etiqueta => etiqueta.trim());



    if (!textoTarefa) {
        alert('Por favor, insira o texto da tarefa!');
        return;
    }

    if (!dataTarefa) {
        alert('Por favor, selecione uma data para a tarefa!');
        return;
    }
    const tarefa = {
        content: textoTarefa,
        due_date: dataTarefa,
        labels: etiquetas 
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
    inputTarefa.value = '';
    inputData.value = '';
}


document.querySelectorAll('.days-grid div').forEach(day => {
    day.addEventListener('click', () => {
        dataSelecionada = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + day.innerText).slice(-2)}`;
        carregarTarefas();
    });
});
async function carregarTarefas() {
    const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const tarefas = await response.json();
    const lista = document.getElementById('listaTarefas');
    lista.innerHTML = '';

    tarefas.forEach(tarefa => {
        if (!dataSelecionada || (tarefa.due && tarefa.due.date === dataSelecionada)) {
            exibirTarefaNaLista(tarefa);
        }
    });
}

function exibirTarefaNaLista(tarefa) {
    const lista = document.getElementById('listaTarefas');
    const item = document.createElement('li');
    item.setAttribute('data-id', tarefa.id);

    const etiquetas = tarefa.labels ? `Etiquetas: ${tarefa.labels.join(', ')}` : '';
    const dataFormatada = tarefa.due ? new Date(tarefa.due.date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Sem data';

    item.innerHTML = `
        <span>${tarefa.content} - ${etiquetas}</span>
        <span>${dataFormatada}</span>
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

function configurarCalendario() {
    const mesAno = document.getElementById('mesAno');
    const btnMesAnterior = document.getElementById('btnMesAnterior');
    const btnMesSeguinte = document.getElementById('btnMesSeguinte');

    btnMesAnterior.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        atualizarCalendario();
    });

    btnMesSeguinte.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        atualizarCalendario();
    });

    atualizarCalendario();
}

