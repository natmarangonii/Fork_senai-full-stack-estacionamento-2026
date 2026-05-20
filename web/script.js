const urlAuto = 'http://localhost:3000/automovel';
const urlEstadia = 'http://localhost:3000/estadia';
let automovelAtual = null;
let estadiaAtual = null;
const automoveis = [];
const estadias = [];

if (document.querySelector('title').textContent.includes('Automóveis')) {
    carregarAutomoveis();

    document.getElementById('ano').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    document.getElementById('anoEdit').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    document.querySelector('#formCad').addEventListener('submit', function (e) {
        e.preventDefault();
        const novoAuto = {
            placa: placa.value.toUpperCase(),
            proprietario: proprietario.value,
            tipo: tipo.value,
            modelo: modelo.value,
            marca: marca.value || null,
            cor: cor.value || null,
            ano: ano.value ? Number(ano.value) : null,
            telefone: telefone.value,
            imagem: imagem.value || null
        };

        fetch(urlAuto + '/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoAuto)
        })
        .then(res => {
            if (!res.ok) return res.json().then(err => { throw err });
            return res.json();
        })
        .then((data) => {
            if (imagem.value != "") {
                localStorage.setItem("img_auto_" + data.placa, imagem.value);
            }
            alert("Automóvel adicionado com sucesso!");
            cadastro.classList.add('oculto');
            formCad.reset();
            carregarAutomoveis();
        })
        .catch(err => alert(err.error || "Erro ao salvar automóvel"));
    });

    imgEdit?.addEventListener("input", () => {
        imgAuto.src = imgEdit.value;
    });
}

function carregarAutomoveis() {
    fetch(urlAuto + '/listar')
        .then(res => res.json())
        .then(data => {
            automoveis.length = 0;
            automoveis.push(...data);
            listarAutomoveis();
        })
        .catch(() => alert('Problemas com a conexão da API'));
}

function listarAutomoveis() {
    const container = document.querySelector('main');
    container.innerHTML = '';

    if (automoveis.length === 0) {
        container.innerHTML = '<div class="msg-vazia"><p>Nenhum veículo cadastrado.</p></div>';
        return;
    }

    automoveis.forEach(auto => {
        const card = document.createElement('div');
        card.classList.add('card');

        const linkImg = localStorage.getItem("img_auto_" + auto.placa);
        let imagemHtml = "";
        if (linkImg && linkImg != "") {
            imagemHtml = '<img src="' + linkImg + '" alt="' + auto.modelo + '" onerror="this.src=\'https://via.placeholder.com/200x180/A67B5B/FFFFFF?text=Sem+Imagem\'">';
        } else {
            imagemHtml = '<img src="https://via.placeholder.com/200x180/A67B5B/FFFFFF?text=Sem+Imagem" alt="' + auto.modelo + '">';
        }

        card.innerHTML = `
            ${imagemHtml}
            <h3>${auto.placa}</h3>
            <p><b>Modelo:</b> ${auto.modelo}</p>
            <p><b>Proprietário:</b> ${auto.proprietario}</p>
            <p><b>Tipo:</b> ${auto.tipo}</p>
        `;
        card.onclick = () => abrirAutomovel(auto);
        container.appendChild(card);
    });
}

function abrirAutomovel(auto) {
    automovelAtual = auto;
    tituloAuto.innerHTML = auto.placa;
    placaEdit.value = auto.placa;
    proprietarioEdit.value = auto.proprietario;
    tipoEdit.value = auto.tipo;
    modeloEdit.value = auto.modelo;
    marcaEdit.value = auto.marca || '';
    corEdit.value = auto.cor || '';
    anoEdit.value = auto.ano || '';
    telefoneEdit.value = auto.telefone;

    const img = localStorage.getItem("img_auto_" + auto.placa);
    if (img) {
        imgAuto.src = img;
        imgEdit.value = img;
    } else {
        imgEdit.value = "";
    }
    detalhes.classList.remove('oculto');
}

function salvarEdicao() {
    const autoEditado = {
        proprietario: proprietarioEdit.value,
        tipo: tipoEdit.value,
        modelo: modeloEdit.value,
        marca: marcaEdit.value || null,
        cor: corEdit.value || null,
        ano: anoEdit.value ? Number(anoEdit.value) : null,
        telefone: telefoneEdit.value,
        imagem: imgEdit.value || null
    };

    fetch(urlAuto + '/atualizar/' + automovelAtual.placa, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoEditado)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {
        if (imgEdit.value != "") {
            localStorage.setItem("img_auto_" + automovelAtual.placa, imgEdit.value);
        } else {
            localStorage.removeItem("img_auto_" + automovelAtual.placa);
        }
        alert("Automóvel atualizado com sucesso!");
        detalhes.classList.add('oculto');
        carregarAutomoveis();
    })
    .catch(() => alert("Erro ao editar automóvel"));
}

function excluirAutomovel() {
    if (!confirm("Deseja excluir o automóvel?")) return;
    localStorage.removeItem("img_auto_" + automovelAtual.placa);
    fetch(urlAuto + '/excluir/' + automovelAtual.placa, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) return res.json().then(err => { throw err });
        return res.json();
    })
    .then(() => {
        alert("Automóvel excluído com sucesso!");
        detalhes.classList.add('oculto');
        carregarAutomoveis();
    })
    .catch(err => alert(err.error || "Erro ao excluir automóvel"));
}


if (document.querySelector('title').textContent.includes('Estadias')) {
    carregarEstadias();
    carregarPlacasSelect();

    document.querySelector('#formEstadia').addEventListener('submit', function (e) {
        e.preventDefault();
        const novaEstadia = {
            placa: placaEstadia.value,
            valorHora: Number(valorHora.value)
        };

        fetch(urlEstadia + '/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaEstadia)
        })
        .then(res => {
            if (!res.ok) return res.json().then(err => { throw err });
            return res.json();
        })
        .then(() => {
            alert("Entrada registrada com sucesso!");
            cadastroEstadia.classList.add('oculto');
            formEstadia.reset();
            carregarEstadias();
        })
        .catch(err => alert(err.error || "Erro ao registrar entrada"));
    });
}

function carregarEstadias() {
    fetch(urlEstadia + '/listar')
        .then(res => res.json())
        .then(data => {
            estadias.length = 0;
            estadias.push(...data);
            listarEstadias();
        })
        .catch(() => alert('Erro ao carregar estadias'));
}

function listarEstadias() {
    const container = document.getElementById('mainEstadias');
    container.innerHTML = '';

    if (estadias.length === 0) {
        container.innerHTML = '<div class="msg-vazia"><p>Nenhuma estadia registrada.</p></div>';
        return;
    }

    estadias.forEach(est => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const status = est.saida ? 'Finalizada' : 'Ativa';
        const entrada = new Date(est.entrada).toLocaleString('pt-BR');

        card.innerHTML = `
            <h3>${est.placa}</h3>
            <p><b>Modelo:</b> ${est.automovel.modelo}</p>
            <p><b>Entrada:</b> ${entrada}</p>
            <p><b>Valor/Hora:</b> R$ ${est.valorHora.toFixed(2)}</p>
            <p><b>Status:</b> ${status}</p>
            ${est.valorTotal ? `<p><b>Total:</b> R$ ${est.valorTotal.toFixed(2)}</p>` : ''}
        `;
        card.onclick = () => abrirEstadia(est);
        container.appendChild(card);
    });
}

function carregarPlacasSelect() {
    fetch(urlAuto + '/listar')
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('placaEstadia');
            if (!select) return;
            
            select.innerHTML = '<option value="">Selecione...</option>';
            data.forEach(auto => {
                const opt = document.createElement('option');
                opt.value = auto.placa;
                opt.textContent = `${auto.placa} - ${auto.modelo}`;
                select.appendChild(opt);
            });
        });
}

function abrirEstadia(est) {
    estadiaAtual = est;
    tituloEstadia.innerHTML = `Estadia #${est.id}`;
    estPlaca.value = est.placa;
    estProprietario.value = est.automovel.proprietario;
    estEntrada.value = new Date(est.entrada).toLocaleString('pt-BR');
    estSaida.value = est.saida ? new Date(est.saida).toLocaleString('pt-BR') : '-';
    estValorHora.value = 'R$ ' + est.valorHora.toFixed(2);
    estValorTotal.value = est.valorTotal ? 'R$ ' + est.valorTotal.toFixed(2) : '-';
    
    document.getElementById('btnFinalizar').style.display = est.saida ? 'none' : 'inline-block';
    detalhesEstadia.classList.remove('oculto');
}

function finalizarEstadia() {
    if (!confirm("Deseja finalizar esta estadia?")) return;
    
    fetch(urlEstadia + '/atualizar/' + estadiaAtual.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then((data) => {
        alert(`Estadia finalizada! Total: R$ ${data.valorTotal.toFixed(2)}`);
        detalhesEstadia.classList.add('oculto');
        carregarEstadias();
    })
    .catch(() => alert("Erro ao finalizar estadia"));
}

function excluirEstadia() {
    if (!confirm("Deseja excluir esta estadia?")) return;
    
    fetch(urlEstadia + '/excluir/' + estadiaAtual.id, {
        method: 'DELETE'
    })
    .then(() => {
        alert("Estadia excluída com sucesso!");
        detalhesEstadia.classList.add('oculto');
        carregarEstadias();
    })
    .catch(() => alert("Erro ao excluir estadia"));
}