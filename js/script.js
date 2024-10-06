const card = document.querySelectorAll(".card");
const btnEasy = document.querySelector(".btn-easy");
const btnHard = document.querySelector(".btn-hard");
const pontuacao = document.querySelector(".tentativas");
const pontos = document.querySelector(".pontos");
const cardsContainer = document.querySelector(".cards");
const rankingDisplay = document.getElementById("ranking-display");
const rankingSection = document.querySelector(".ranking");
const btnRestart = document.querySelector(".btn-restart");

let cartasViradas = [];
let bloquearCliques = false;
let jogadorNome = "Jogador Anônimo";
let nivelAtual = 12;

// Array com as cartas (24 cartas)
const cartasArray = [
  "carta1", "carta2", "carta3", "carta4", "carta6", "carta7", 
  "carta8", "carta9", "carta10", "carta11", "carta12", "carta15"
];

function obterNomeJogador() {
  const nome = prompt("Digite seu nome:");
  jogadorNome = nome ? nome : "Jogador Anônimo"; // Se o nome não for fornecido, usa 'Jogador Anônimo'
}

function reiniciarJogo() {
  location.reload();
}

function iniciarJogo(nivel) {
  nivelAtual = nivel;
  obterNomeJogador();

  cartasViradas = [];
  bloquearCliques = false;

  document.querySelector(".content").style.display = "none";
  document.querySelector(".cards").style.display = "grid"; 
  document.querySelector(".points").style.display = "flex"; 

  const numeroCartas = nivel; // 12 ou 24
  const cartasSorteadas = cartasArray.slice(0, numeroCartas / 2);
  const cartasDuplicadas = [...cartasSorteadas, ...cartasSorteadas];

  shuffle(cartasDuplicadas);

  card.forEach((item, i) => {
    if (i < numeroCartas) {
      item.classList.add(cartasDuplicadas[i]);
      item.addEventListener("click", function () {
        if (!bloquearCliques) {
          virarCarta(item);
        }
      });
      item.classList.add("fundo2");
    } else {
      item.style.display = "none";
    }
  });

  cardsContainer.classList.remove("easy", "hard");
  cardsContainer.classList.add(nivel === 12 ? "easy" : "hard");
  
  pontuacao.innerHTML = nivel === 12 ? 12 : 24;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para virar a carta
function virarCarta(cartaClicada) {
  if (cartasViradas.length < 2) {
    cartasViradas.push(cartaClicada);
    cartaClicada.classList.remove("fundo2");
    if (cartasViradas.length === 2) {
      bloquearCliques = true;
      setTimeout(verificarCompatibilidade, 1000);
    }
  }
}

function verificarCompatibilidade() {
  if (cartasViradas[0].className !== cartasViradas[1].className) {
    cartasViradas.forEach((carta) => {
      setTimeout(() => {
        carta.classList.add("fundo2");
      }, 500);
    });
    pontuacao.innerHTML = parseInt(pontuacao.innerHTML) - 1;
  } else {
    cartasViradas.forEach((carta) => {
      carta.classList.add("find");
    });
    pontos.innerHTML = parseInt(pontos.innerHTML) + 1;
  }
  cartasViradas = [];
  bloquearCliques = false;

  if (parseInt(pontuacao.innerHTML) === 0) {
    alert(`Que pena, ${jogadorNome}. Você PERDEU! Sua pontuação final foi ${parseInt(pontos.innerHTML)}.`);

    setTimeout(() => {
      mostrarRanking(); // Mostrar ranking ao perder
    }, 500);
  } else if ((nivelAtual === 12 && parseInt(pontos.innerHTML) === 6) || (nivelAtual === 24 && parseInt(pontos.innerHTML) === 12)) {
    alert(`Parabéns, ${jogadorNome}! Você GANHOU com ${parseInt(pontuacao.innerHTML)} tentativas restantes!`);
    salvarRanking(jogadorNome, pontuacao); // Salvar ranking
    mostrarRanking(); // Mostrar ranking ao ganhar
  }
}

// LocalStorage
function salvarRanking(nome, pontuacao) {
  const tentativasRestantes = parseInt(pontuacao.innerHTML);
  const totalPontos = parseInt(pontos.innerHTML) + tentativasRestantes;

  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ nome, pontuacao: totalPontos });
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 10))); // Salvar apenas os 10 melhores
}

function mostrarRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  rankingDisplay.innerHTML = ""; // Limpar exibição anterior do ranking
  ranking.forEach((item, index) => {
    rankingDisplay.innerHTML += `${index + 1}. ${item.nome}\n`;
  });

  rankingSection.style.display = "block";
}

btnRestart.addEventListener("click", reiniciarJogo);

btnEasy.addEventListener("click", () => iniciarJogo(12));
btnHard.addEventListener("click", () => iniciarJogo(24));