// Seleção de elementos do DOM
// Estas linhas obtêm referências para elementos HTML específicos usando seus IDs
const setupDiv = document.getElementById('setup');
const gameplayDiv = document.getElementById('gameplay');
const playerNameInput = document.getElementById('playerName');
const difficultySelect = document.getElementById('difficulty');
const startGameButton = document.getElementById('startGame');
const backButton = document.getElementById('backButton');
const result = document.getElementById('result');
const scoreDiv = document.getElementById('score');

// Constantes para opções do jogo
// Define um objeto com as opções possíveis do jogo
const GAME_OPTIONS = {
    ROCK: 'rock',
    PAPER: 'paper',
    SCISSORS: 'scissors'
};

// Variáveis do jogo
// Inicializa variáveis globais para armazenar informações do jogo
let playerName = '';
let playerScore = 0;
let computerScore = 0;
let difficulty = 'easy';

// Sons do jogo
// Cria objetos de áudio para diferentes efeitos sonoros do jogo
const buttonSound = new Audio('https://www.soundjay.com/button/button-30.mp3');
const winSound = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-02.mp3');
const loseSound = new Audio('https://www.soundjay.com/misc/sounds/fail-buzzer-03.mp3');
const drawSound = new Audio('https://www.soundjay.com/button/button-43.mp3');

// Event Listeners
// Adiciona ouvintes de eventos para os botões de início e retorno
startGameButton.addEventListener('click', startGame);
backButton.addEventListener('click', goBackToSetup);

// Adiciona event listeners para os botões de escolha
// Itera sobre todos os elementos com a classe 'choice' e adiciona um ouvinte de clique
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', function () {
        playRound(this.dataset.choice);
    });
});

// Função para reproduzir sons
// Toca um som específico, reiniciando-o se já estiver tocando
function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.error("Erro ao reproduzir som:", e));
}

// Função para iniciar o jogo
// Configura o jogo com o nome do jogador e a dificuldade escolhida
function startGame() {
    playSound(buttonSound);
    playerName = playerNameInput.value.toUpperCase() || 'JOGADOR';
    difficulty = difficultySelect.value;
    setupDiv.style.display = 'none';
    gameplayDiv.style.display = 'block';
    playerScore = 0;
    computerScore = 0;
    updateScore();
}

// Função para jogar uma rodada
// Processa a escolha do jogador e do computador para determinar o vencedor
function playRound(playerChoice) {
    if (!playerChoice) {
        console.error('Escolha do jogador não definida');
        return;
    }
    playSound(buttonSound);
    const computerChoice = getComputerChoice();
    const winner = getWinner(playerChoice, computerChoice);
    processResult(winner, playerChoice, computerChoice);
}

// Função para obter a escolha do computador
// Determina a escolha do computador com base na dificuldade selecionada
function getComputerChoice() {
    const choices = Object.values(GAME_OPTIONS);
    if (difficulty === 'easy') {
        return choices[Math.floor(Math.random() * choices.length)];
    } else if (difficulty === 'medium') {
        if (Math.random() < 0.6) {
            const playerLastChoice = getPlayerLastChoice();
            return choices.find(choice => getWinner(choice, playerLastChoice) === 'COMPUTADOR');
        }
        return choices[Math.floor(Math.random() * choices.length)];
    } else {
        const playerLastChoice = getPlayerLastChoice();
        return choices.find(choice => getWinner(choice, playerLastChoice) === 'COMPUTADOR');
    }
}

// Função para simular a última escolha do jogador (pode ser melhorada para usar escolhas reais)
// Retorna uma escolha aleatória para simular a última jogada do jogador
function getPlayerLastChoice() {
    return Object.values(GAME_OPTIONS)[Math.floor(Math.random() * 3)];
}

// Função para determinar o vencedor
// Compara as escolhas do jogador e do computador para decidir quem vence
function getWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'EMPATE';
    const winningCombos = {
        [GAME_OPTIONS.ROCK]: GAME_OPTIONS.SCISSORS,
        [GAME_OPTIONS.PAPER]: GAME_OPTIONS.ROCK,
        [GAME_OPTIONS.SCISSORS]: GAME_OPTIONS.PAPER
    };
    return winningCombos[playerChoice] === computerChoice ? 'JOGADOR' : 'COMPUTADOR';
}

// Função para processar o resultado da rodada
// Atualiza o placar e exibe o resultado da rodada
function processResult(winner, playerChoice, computerChoice) {
    const choices = {
        [GAME_OPTIONS.ROCK]: 'PEDRA',
        [GAME_OPTIONS.PAPER]: 'PAPEL',
        [GAME_OPTIONS.SCISSORS]: 'TESOURA'
    };

    let resultText = `${playerName} ESCOLHEU ${choices[playerChoice]}. COMPUTADOR ESCOLHEU ${choices[computerChoice]}. `;

    if (winner === 'EMPATE') {
        resultText += "EMPATE!";
        displayResult(resultText, drawSound, '#ffffff');
    } else if (winner === 'JOGADOR') {
        playerScore++;
        resultText += `${playerName} VENCE!`;
        displayResult(resultText, winSound, '#00ff00');
    } else {
        computerScore++;
        resultText += `COMPUTADOR VENCE!`;
        displayResult(resultText, loseSound, '#ff0000');
    }
    updateScore();
}

// Função para exibir o resultado na tela
// Mostra o resultado da rodada com efeitos visuais e sonoros
function displayResult(message, sound, color) {
    result.textContent = message;
    result.style.color = color;
    playSound(sound);
    result.classList.add('blink');
    setTimeout(() => {
        result.classList.remove('blink');
        result.style.color = '#ffffff';
    }, 3000);
}

// Função para atualizar o placar
// Atualiza o placar exibido na tela
function updateScore() {
    scoreDiv.textContent = `${playerName}: ${playerScore} | COMPUTADOR: ${computerScore}`;
    scoreDiv.style.color = playerScore > computerScore ? '#00ff00' : (computerScore > playerScore ? '#ff0000' : '#ffffff');
}

// Função para voltar à tela de configuração
// Retorna o jogo para a tela inicial de configuração
function goBackToSetup() {
    playSound(buttonSound);
    setupDiv.style.display = 'block';
    gameplayDiv.style.display = 'none';
    result.textContent = '';
    scoreDiv.textContent = '';
}

// Inicialização do jogo
// Configura a exibição inicial quando o DOM é carregado
document.addEventListener('DOMContentLoaded', () => {
    setupDiv.style.display = 'block';
    gameplayDiv.style.display = 'none';
});

// Configuração do rodapé arcade
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.getElementById('arcade-footer');
    const footerTrigger = document.createElement('div');
    footerTrigger.className = 'footer-trigger';
    document.body.appendChild(footerTrigger);

    let footerTimeout;

    // Adiciona listeners para mostrar/esconder o rodapé com base na posição do mouse
    footerTrigger.addEventListener('mouseenter', () => {
        clearTimeout(footerTimeout);
        footer.classList.add('visible');
    });

    footer.addEventListener('mouseleave', () => {
        footerTimeout = setTimeout(() => {
            footer.classList.remove('visible');
        }, 500);
    });

    document.addEventListener('mousemove', (e) => {
        const mouseY = e.clientY;
        const windowHeight = window.innerHeight;

        if (mouseY > windowHeight - 50) {
            clearTimeout(footerTimeout);
            footer.classList.add('visible');
        } else if (!footer.contains(e.target)) {
            clearTimeout(footerTimeout);
            footerTimeout = setTimeout(() => {
                footer.classList.remove('visible');
            }, 500); // Atraso de 500ms antes de esconder o footer
        }
    });
});