document.addEventListener('DOMContentLoaded', function() {

    const linkCarros = 'http://localhost:3000/automovel';
    const linkEstadias = 'http://localhost:3000/estadia';
    let carroAberto = null;
    let estadiaAberta = null;
    const listaCarros = [];
    const listaEstadias = [];

    const telaCadastro = document.getElementById('cadastro');
    const formularioCadastro = document.getElementById('formCad');
    const telaDetalhes = document.getElementById('detalhes');
    const telaCadastroEstadia = document.getElementById('cadastroEstadia');
    const formularioEstadia = document.getElementById('formEstadia');
    const telaDetalhesEstadia = document.getElementById('detalhesEstadia');

    const campoPlaca = document.getElementById('placa');
    const campoDono = document.getElementById('proprietario');
    const campoTipo = document.getElementById('tipo');
    const campoModelo = document.getElementById('modelo');
    const campoMarca = document.getElementById('marca');
    const campoCor = document.getElementById('cor');
    const campoAno = document.getElementById('ano');
    const campoTelefone = document.getElementById('telefone');

    const tituloCarro = document.getElementById('tituloAuto');
    const campoPlacaEditar = document.getElementById('placaEdit');
    const campoDonoEditar = document.getElementById('proprietarioEdit');
    const campoTipoEditar = document.getElementById('tipoEdit');
    const campoModeloEditar = document.getElementById('modeloEdit');
    const campoMarcaEditar = document.getElementById('marcaEdit');
    const campoCorEditar = document.getElementById('corEdit');
    const campoAnoEditar = document.getElementById('anoEdit');
    const campoTelefoneEditar = document.getElementById('telefoneEdit');

    // PÁGINA DE CARROS
    if (document.querySelector('title').textContent.includes('Automóveis')) {
        buscarCarros();

        campoAno?.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        campoAnoEditar?.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        formularioCadastro?.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const carroNovo = {
                placa: campoPlaca.value.toUpperCase(),
                proprietario: campoDono.value,
                tipo: campoTipo.value,
                modelo: campoModelo.value,
                marca: campoMarca.value || null,
                cor: campoCor.value || null,
                ano: campoAno.value ? Number(campoAno.value) : null,
                telefone: campoTelefone.value
            };

            fetch(linkCarros + '/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carroNovo)
            })
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw err });
                return res.json();
            })
            .then(() => {
                alert("Carro adicionado com sucesso!");
                telaCadastro.classList.add('oculto');
                formularioCadastro.reset();
                buscarCarros();
            })
            .catch(err => alert(err.error || "Deu erro ao salvar o carro"));
        });
    }

    function buscarCarros() {
        fetch(linkCarros + '/listar')
            .then(res => res.json())
            .then(data => {
                listaCarros.length = 0;
                listaCarros.push(...data);
                mostrarCarrosNaTela();
            })
            .catch(() => alert('Não consegui conectar com a API'));
    }

    function mostrarCarrosNaTela() {
        const areaDosCards = document.querySelector('main');
        areaDosCards.innerHTML = '';

        if (listaCarros.length === 0) {
            areaDosCards.innerHTML = '<div class="msg-vazia"><p>Nenhum carro cadastrado.</p></div>';
            return;
        }

        listaCarros.forEach(carro => {
            const cartao = document.createElement('div');
            cartao.classList.add('card');

            cartao.innerHTML = `
                <h3>${carro.placa}</h3>
                <p><b>Modelo:</b> ${carro.modelo}</p>
                <p><b>Dono:</b> ${carro.proprietario}</p>
                <p><b>Tipo:</b> ${carro.tipo}</p>
                <p><b>Marca:</b> ${carro.marca || '-'}</p>
                <p><b>Cor:</b> ${carro.cor || '-'}</p>
            `;
            cartao.onclick = () => abrirCarro(carro);
            areaDosCards.appendChild(cartao);
        });
    }

    function abrirCarro(carro) {
        carroAberto = carro;
        tituloCarro.innerHTML = carro.placa;
        campoPlacaEditar.value = carro.placa;
        campoDonoEditar.value = carro.proprietario;
        campoTipoEditar.value = carro.tipo;
        campoModeloEditar.value = carro.modelo;
        campoMarcaEditar.value = carro.marca || '';
        campoCorEditar.value = carro.cor || '';
        campoAnoEditar.value = carro.ano || '';
        campoTelefoneEditar.value = carro.telefone;
        telaDetalhes.classList.remove('oculto');
    }

    window.salvarEdicao = function() {
        if (!carroAberto) return;

        const carroEditado = {
            proprietario: campoDonoEditar.value,
            tipo: campoTipoEditar.value,
            modelo: campoModeloEditar.value,
            marca: campoMarcaEditar.value || null,
            cor: campoCorEditar.value || null,
            ano: campoAnoEditar.value ? Number(campoAnoEditar.value) : null,
            telefone: campoTelefoneEditar.value
        };

        fetch(linkCarros + '/atualizar/' + carroAberto.placa, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carroEditado)
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            alert("Carro atualizado com sucesso!");
            telaDetalhes.classList.add('oculto');
            buscarCarros();
        })
        .catch(() => alert("Deu erro ao editar o carro"));
    }

    window.excluirAutomovel = function() {
        if (!carroAberto || !confirm("Quer apagar esse carro mesmo?")) return;
        
        fetch(linkCarros + '/excluir/' + carroAberto.placa, {
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) return res.json().then(err => { throw err });
            return res.json();
        })
        .then(() => {
            alert("Carro apagado com sucesso!");
            telaDetalhes.classList.add('oculto');
            buscarCarros();
        })
        .catch(err => alert(err.error || "Deu erro ao apagar o carro"));
    }

    // PÁGINA DE ESTADIAS
    if (document.querySelector('title').textContent.includes('Estadias')) {
        carregarEstadias();
        carregarPlacasSelect();

        formularioEstadia?.addEventListener('submit', function (e) {
            e.preventDefault();
            const novaEstadia = {
                placa: document.getElementById('placaEstadia').value,
                valorHora: Number(document.getElementById('valorHora').value)
            };

            fetch(linkEstadias + '/cadastrar', {
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
                telaCadastroEstadia.classList.add('oculto');
                formularioEstadia.reset();
                carregarEstadias();
            })
            .catch(err => alert(err.error || "Erro ao registrar entrada"));
        });
    }

    function carregarEstadias() {
        fetch(linkEstadias + '/listar')
            .then(res => res.json())
            .then(data => {
                listaEstadias.length = 0;
                listaEstadias.push(...data);
                listarEstadias();
            })
            .catch(() => alert('Erro ao carregar estadias'));
    }

    function listarEstadias() {
        const container = document.getElementById('mainEstadias');
        container.innerHTML = '';

        if (listaEstadias.length === 0) {
            container.innerHTML = '<div class="msg-vazia"><p>Nenhuma estadia registrada.</p></div>';
            return;
        }

        listaEstadias.forEach(est => {
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
        fetch(linkCarros + '/listar')
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

    window.abrirEstadia = function(est) {
        estadiaAberta = est;
        document.getElementById('tituloEstadia').innerHTML = `Estadia #${est.id}`;
        document.getElementById('estPlaca').value = est.placa;
        document.getElementById('estProprietario').value = est.automovel.proprietario;
        document.getElementById('estEntrada').value = new Date(est.entrada).toLocaleString('pt-BR');
        document.getElementById('estSaida').value = est.saida ? new Date(est.saida).toLocaleString('pt-BR') : '-';
        document.getElementById('estValorHora').value = 'R$ ' + est.valorHora.toFixed(2);
        document.getElementById('estValorTotal').value = est.valorTotal ? 'R$ ' + est.valorTotal.toFixed(2) : '-';
        
        document.getElementById('btnFinalizar').style.display = est.saida ? 'none' : 'inline-block';
        telaDetalhesEstadia.classList.remove('oculto');
    }

    window.finalizarEstadia = function() {
        if (!estadiaAberta || !confirm("Deseja finalizar esta estadia?")) return;
        
        fetch(linkEstadias + '/atualizar/' + estadiaAberta.id, {
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
            telaDetalhesEstadia.classList.add('oculto');
            carregarEstadias();
        })
        .catch(() => alert("Erro ao finalizar estadia"));
    }

    window.excluirEstadia = function() {
        if (!estadiaAberta || !confirm("Deseja excluir esta estadia?")) return;
        
        fetch(linkEstadias + '/excluir/' + estadiaAberta.id, {
            method: 'DELETE'
        })
        .then(() => {
            alert("Estadia excluída com sucesso!");
            telaDetalhesEstadia.classList.add('oculto');
            carregarEstadias();
        })
        .catch(() => alert("Erro ao excluir estadia"));
    }

});