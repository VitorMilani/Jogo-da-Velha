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

