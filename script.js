const jogador1Input = document.getElementById('Jogador1');
const jogador2Input = document.getElementById('Jogador2');
const botoes = document.querySelectorAll('.base button');
const mensagem = document.getElementById('mensagem');
const reiniciarBotao = document.getElementById('reiniciar');
const tabelaPontuacao = document.getElementById('tabela-pontuacao').getElementsByTagName('tbody')[0];
const modoJogoSelect = document.getElementById('modo');
const modoJogoContainer = document.querySelector('.modo-jogo');
const nomesJogadoresContainer = document.querySelector('.nomes-jogadores');

let jogador1;
let jogador2;
let modoJogo;
let turno;
let tabuleiro;
let pontuacaoJogadores = {};

function selecionarModo() {
    modoJogo = modoJogoSelect.value;

    if (modoJogo === 'um-jogador') {
        jogador2Input.value = 'Máquina';
        jogador2Input.disabled = true;
    } else {
        jogador2Input.value = '';
        jogador2Input.disabled = false;
    }

    nomesJogadoresContainer.style.display = 'block';
}

function iniciarJogo() {
    jogador1 = jogador1Input.value.trim();
    jogador2 = modoJogo === 'dois-jogadores' ? jogador2Input.value.trim() : 'Máquina';

    if (modoJogo === 'dois-jogadores' && (jogador1 === '' || jogador2 === '')) {
        alert('Por favor, preencha os nomes dos jogadores.');
        return;
    }

    turno = 1;
    tabuleiro = Array.from(Array(9).keys());

    botoes.forEach(botao => {
        botao.textContent = '';
    });

    botoes.forEach(botao => {
        botao.addEventListener('click', realizarJogada, { once: true });
    });

    mensagem.textContent = `É a vez de ${jogador1}`;

    modoJogoContainer.style.display = 'none';
    nomesJogadoresContainer.style.display = 'none';
}

function realizarJogada(event) {
    const quadrado = event.target;
    const quIndex = parseInt(quadrado.dataset.qu);

    if (typeof tabuleiro[quIndex] !== 'number') {
        return;
    }

    tabuleiro[quIndex] = turno === 1 ? 'X' : 'O';
    quadrado.textContent = tabuleiro[quIndex];

    if (verificarVencedor()) {
        finalizarJogo(false);
    } else if (verificarEmpate()) {
        finalizarJogo(true);
    } else {
        turno *= -1;
        if (modoJogo === 'um-jogador' && turno === -1) {
            setTimeout(jogadaMaquina, 500);
        } else {
            mensagem.textContent = turno === 1 ? `É a vez de ${jogador1}` : `É a vez de ${jogador2}`;
        }
    }
}

function jogadaMaquina() {
    const quadradosVazios = tabuleiro.filter(quadrado => typeof quadrado === 'number');
    const quIndex = quadradosVazios[Math.floor(Math.random() * quadradosVazios.length)];
    const quadrado = botoes[quIndex];

    realizarJogada({ target: quadrado });
}

function verificarVencedor() {
    const linhasVencedoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let linha of linhasVencedoras) {
        if (tabuleiro[linha[0]] !== undefined &&
            tabuleiro[linha[0]] === tabuleiro[linha[1]] &&
            tabuleiro[linha[1]] === tabuleiro[linha[2]]) {
            return true;
        }
    }

    return false;
}

function verificarEmpate() {
    return tabuleiro.every(quadrado => typeof quadrado === 'string');
}

function finalizarJogo(empate) {
    if (empate) {
        mensagem.textContent = 'Empate!';
    } else {
        const vencedor = turno === 1 ? jogador1 : jogador2;
        mensagem.textContent = `Parabéns, ${vencedor} venceu!`;

        atualizarPontuacao(vencedor);
    }

    botoes.forEach(botao => {
        botao.removeEventListener('click', realizarJogada);
    });

    reiniciarBotao.style.display = 'block';

    modoJogoContainer.style.display = 'block';
}

function reiniciarJogo() {
    tabuleiro = Array.from(Array(9).keys());
    botoes.forEach(botao => {
        botao.textContent = '';
    });

    turno = 1;
    mensagem.textContent = `É a vez de ${jogador1}`;

    botoes.forEach(botao => {
        botao.addEventListener('click', realizarJogada, { once: true });
    });

    reiniciarBotao.style.display = 'none';

    modoJogoContainer.style.display = 'none';
}

function atualizarPontuacao(jogador) {
    if (!pontuacaoJogadores[jogador]) {
        pontuacaoJogadores[jogador] = 0;
    }
    pontuacaoJogadores[jogador]++;

    const ranking = Object.entries(pontuacaoJogadores)
        .sort((a, b) => b[1] - a[1]);

    tabelaPontuacao.innerHTML = '';

    ranking.forEach((item, indice) => {
        const linha = tabelaPontuacao.insertRow();
        const colunaJogador = linha.insertCell(0);
        const colunaPontuacao = linha.insertCell(1);

        colunaJogador.textContent = item[0];
        colunaPontuacao.textContent = item[1];
    });

    localStorage.setItem('pontuacaoJogadores', JSON.stringify(pontuacaoJogadores));
}

function carregarPontuacao() {
    const pontuacaoSalva = localStorage.getItem('pontuacaoJogadores');
    if (pontuacaoSalva) {
        pontuacaoJogadores = JSON.parse(pontuacaoSalva);
        atualizarPontuacao();
    }
}

carregarPontuacao();
