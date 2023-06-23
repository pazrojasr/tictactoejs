document.addEventListener("DOMContentLoaded", function () {
  const casillas = document.querySelectorAll(".casilla");
  const reiniciarBtn = document.querySelector(".reiniciar");
  const nivelesSelect = document.querySelector("#niveles");

  let jugadorActual = "X";
  let juegoTerminado = false;
  let nivelDificultad = "facil"; // Nivel de dificultad predeterminado

  // Agregar evento de clic a cada casilla
  casillas.forEach(function (casilla) {
    casilla.addEventListener("click", function () {
      if (!juegoTerminado && !casilla.textContent) {
        casilla.textContent = jugadorActual;
        casilla.classList.add(jugadorActual === "X" ? "x" : "o");

        if (verificarGanador(jugadorActual)) {
          mostrarMensajeGanador(jugadorActual);
          juegoTerminado = true;
        } else if (tableroCompleto()) {
          mostrarMensajeEmpate();
          juegoTerminado = true;
        } else {
          cambiarTurno();
        }

        if (!juegoTerminado && jugadorActual === "O") {
          // Si es el turno de la IA, hacer su movimiento
          setTimeout(function () {
            hacerMovimientoIA();
          }, 500);
        }
      }
    });
  });

  // Reiniciar el juego al hacer clic en el botón de reinicio
  reiniciarBtn.addEventListener("click", reiniciarJuego);

  // Cambiar el turno entre los jugadores
  function cambiarTurno() {
    jugadorActual = jugadorActual === "X" ? "O" : "X";
  }

  // Verificar si hay un ganador
  function verificarGanador(jugador) {
    const combinacionesGanadoras = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return combinacionesGanadoras.some(function (combinacion) {
      return combinacion.every(function (indice) {
        return casillas[indice].textContent === jugador;
      });
    });
  }

  // Verificar si el tablero está completo (empate)
  function tableroCompleto() {
    return [...casillas].every(function (casilla) {
      return casilla.textContent !== "";
    });
  }

  // Mostrar mensaje de ganador
  function mostrarMensajeGanador(jugador) {
    const ganadorTexto = document.querySelector(".ganador-texto");
    const textoX = document.querySelector(".texto-x");
    const textoO = document.querySelector(".texto-o");

    ganadorTexto.classList.remove("oculto");
    if (jugador === "X") {
      textoX.classList.remove("oculto");
    } else {
      textoO.classList.remove("oculto");
    }
  }

  // Mostrar mensaje de empate
  function mostrarMensajeEmpate() {
    const empateTexto = document.querySelector(".empate");
    empateTexto.classList.remove("oculto");
  }

  // Reiniciar el juego
  function reiniciarJuego() {
    casillas.forEach(function (casilla) {
      casilla.textContent = "";
      casilla.classList.remove("x", "o");
    });

    const ganadorTexto = document.querySelector(".ganador-texto");
    const textoX = document.querySelector(".texto-x");
    const textoO = document.querySelector(".texto-o");
    const empateTexto = document.querySelector(".empate");

    ganadorTexto.classList.add("oculto");
    textoX.classList.add("oculto");
    textoO.classList.add("oculto");
    empateTexto.classList.add("oculto");

    jugadorActual = "X";
    juegoTerminado = false;
  }

  // Hacer el movimiento de la IA
  function hacerMovimientoIA() {
    if (nivelDificultad === "facil") {
      hacerMovimientoIAFacil();
    } else if (nivelDificultad === "medio") {
      hacerMovimientoIAMedio();
    } else if (nivelDificultad === "dificil") {
      hacerMovimientoIADificil();
    } else if (nivelDificultad === "invencible") {
      hacerMovimientoIAInvencible();
    }
  }

  // Movimiento de la IA en el nivel fácil (aleatorio)
  function hacerMovimientoIAFacil() {
    const casillasDisponibles = obtenerCasillasDisponibles();

    if (casillasDisponibles.length > 0) {
      const indiceAleatorio = Math.floor(
        Math.random() * casillasDisponibles.length
      );
      const casillaSeleccionada = casillasDisponibles[indiceAleatorio];

      casillaSeleccionada.textContent = jugadorActual;
      casillaSeleccionada.classList.add(jugadorActual === "X" ? "x" : "o");

      if (verificarGanador(jugadorActual)) {
        mostrarMensajeGanador(jugadorActual);
        juegoTerminado = true;
      } else if (tableroCompleto()) {
        mostrarMensajeEmpate();
        juegoTerminado = true;
      } else {
        cambiarTurno();
      }
    }
  }

  // Movimiento de la IA en el nivel medio (bloqueo o aleatorio)
  function hacerMovimientoIAMedio() {
    const casillasDisponibles = obtenerCasillasDisponibles();

    // Verificar si la IA puede ganar en el siguiente movimiento
    for (let i = 0; i < casillasDisponibles.length; i++) {
      const casilla = casillasDisponibles[i];
      casilla.textContent = jugadorActual;

      if (verificarGanador(jugadorActual)) {
        casilla.classList.add(jugadorActual === "X" ? "x" : "o");

        mostrarMensajeGanador(jugadorActual);
        juegoTerminado = true;
        return;
      }

      casilla.textContent = ""; // Deshacer el movimiento
    }

    // Verificar si el jugador humano puede ganar en el siguiente movimiento y bloquearlo
    for (let i = 0; i < casillasDisponibles.length; i++) {
      const casilla = casillasDisponibles[i];
      casilla.textContent = jugadorActual === "X" ? "O" : "X";

      if (verificarGanador(jugadorActual === "X" ? "O" : "X")) {
        casilla.textContent = jugadorActual;
        casilla.classList.add(jugadorActual === "X" ? "x" : "o");

        if (verificarGanador(jugadorActual)) {
          mostrarMensajeGanador(jugadorActual);
          juegoTerminado = true;
        } else if (tableroCompleto()) {
          mostrarMensajeEmpate();
          juegoTerminado = true;
        } else {
          cambiarTurno();
        }
        return;
      }

      casilla.textContent = ""; // Deshacer el movimiento
    }

    // Si no se pueden bloquear ni ganar en el siguiente movimiento, realizar un movimiento aleatorio
    hacerMovimientoIAFacil();
  }

  // Movimiento de la IA en el nivel difícil (estrategia basada en minimax)
  function hacerMovimientoIADificil() {
    const mejorMovimiento = minimax(jugadorActual, 0).movimiento;

    const casillaSeleccionada = casillas[mejorMovimiento];
    casillaSeleccionada.textContent = jugadorActual;
    casillaSeleccionada.classList.add(jugadorActual === "X" ? "x" : "o");

    if (verificarGanador(jugadorActual)) {
      mostrarMensajeGanador(jugadorActual);
      juegoTerminado = true;
    } else if (tableroCompleto()) {
      mostrarMensajeEmpate();
      juegoTerminado = true;
    } else {
      cambiarTurno();
    }
  }

  // Movimiento de la IA en el nivel invencible (estrategia basada en minimax con poda alfa-beta)
  function hacerMovimientoIAInvencible() {
    const mejorMovimiento = minimaxAlfaBeta(
      jugadorActual,
      0,
      -Infinity,
      Infinity
    ).movimiento;

    const casillaSeleccionada = casillas[mejorMovimiento];
    casillaSeleccionada.textContent = jugadorActual;
    casillaSeleccionada.classList.add(jugadorActual === "X" ? "x" : "o");

    if (verificarGanador(jugadorActual)) {
      mostrarMensajeGanador(jugadorActual);
      juegoTerminado = true;
    } else if (tableroCompleto()) {
      mostrarMensajeEmpate();
      juegoTerminado = true;
    } else {
      cambiarTurno();
    }
  }

  // Obtener las casillas disponibles en el tablero
  function obtenerCasillasDisponibles() {
    return [...casillas].filter(function (casilla) {
      return casilla.textContent === "";
    });
  }

  // Función Minimax (estrategia de búsqueda en árbol)
  function minimax(jugador, profundidad) {
    const jugadorMaximo = jugadorActual;
    const jugadorMinimo = jugadorActual === "X" ? "O" : "X";

    if (verificarGanador(jugadorMaximo)) {
      return { puntuacion: 10 - profundidad };
    } else if (verificarGanador(jugadorMinimo)) {
      return { puntuacion: profundidad - 10 };
    } else if (tableroCompleto()) {
      return { puntuacion: 0 };
    }

    const movimientos = [];
    const casillasDisponibles = obtenerCasillasDisponibles();

    for (let i = 0; i < casillasDisponibles.length; i++) {
      const movimiento = {};
      movimiento.indice = casillasDisponibles[i].dataset.indice;
      casillasDisponibles[i].textContent = jugador;

      if (jugador === jugadorMaximo) {
        const resultado = minimax(jugadorMinimo, profundidad + 1);
        movimiento.puntuacion = resultado.puntuacion;
      } else {
        const resultado = minimax(jugadorMaximo, profundidad + 1);
        movimiento.puntuacion = resultado.puntuacion;
      }

      casillasDisponibles[i].textContent = ""; // Deshacer el movimiento
      movimientos.push(movimiento);
    }

    let mejorMovimiento;
    if (jugador === jugadorMaximo) {
      let mejorPuntuacion = -Infinity;
      for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].puntuacion > mejorPuntuacion) {
          mejorPuntuacion = movimientos[i].puntuacion;
          mejorMovimiento = i;
        }
      }
    } else {
      let mejorPuntuacion = Infinity;
      for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].puntuacion < mejorPuntuacion) {
          mejorPuntuacion = movimientos[i].puntuacion;
          mejorMovimiento = i;
        }
      }
    }

    return movimientos[mejorMovimiento];
  }

  // Función Minimax con poda Alfa-Beta
  function minimaxAlfaBeta(jugador, profundidad, alfa, beta) {
    const jugadorMaximo = jugadorActual;
    const jugadorMinimo = jugadorActual === "X" ? "O" : "X";

    if (verificarGanador(jugadorMaximo)) {
      return { puntuacion: 10 - profundidad };
    } else if (verificarGanador(jugadorMinimo)) {
      return { puntuacion: profundidad - 10 };
    } else if (tableroCompleto()) {
      return { puntuacion: 0 };
    }

    const movimientos = [];
    const casillasDisponibles = obtenerCasillasDisponibles();

    for (let i = 0; i < casillasDisponibles.length; i++) {
      const movimiento = {};
      movimiento.indice = casillasDisponibles[i].dataset.indice;
      casillasDisponibles[i].textContent = jugador;

      if (jugador === jugadorMaximo) {
        const resultado = minimaxAlfaBeta(
          jugadorMinimo,
          profundidad + 1,
          alfa,
          beta
        );
        movimiento.puntuacion = resultado.puntuacion;
        alfa = Math.max(alfa, movimiento.puntuacion);
      } else {
        const resultado = minimaxAlfaBeta(
          jugadorMaximo,
          profundidad + 1,
          alfa,
          beta
        );
        movimiento.puntuacion = resultado.puntuacion;
        beta = Math.min(beta, movimiento.puntuacion);
      }

      casillasDisponibles[i].textContent = ""; // Deshacer el movimiento
      movimientos.push(movimiento);

      if (beta <= alfa) {
        break; // Poda alfa-beta
      }
    }

    let mejorMovimiento;
    if (jugador === jugadorMaximo) {
      let mejorPuntuacion = -Infinity;
      for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].puntuacion > mejorPuntuacion) {
          mejorPuntuacion = movimientos[i].puntuacion;
          mejorMovimiento = i;
        }
      }
    } else {
      let mejorPuntuacion = Infinity;
      for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].puntuacion < mejorPuntuacion) {
          mejorPuntuacion = movimientos[i].puntuacion;
          mejorMovimiento = i;
        }
      }
    }

    return movimientos[mejorMovimiento];
  }

  // Cambiar el nivel de dificultad seleccionado
  nivelesSelect.addEventListener("change", function (event) {
    nivelDificultad = event.target.value;
    reiniciarJuego();
  });
});
