// Usa eventos de Astro para la inicialización
document.addEventListener('astro:after-swap', () => {
    if (!window.hangmanAppInitialized) {
      window.hangmanAppInitialized = true;
      
      // Tu código de inicialización aquí
      window.hangmanApp = {
        spanVidas: document.querySelector(".spanVidas"),
        spanPuntos: document.querySelector(".spanPuntos"),
        spanVerbo: document.querySelector(".spanVerbo"),
        spanPista: document.querySelector(".spanPista"),
        divHangman: document.getElementById("divHangman"),
        divBotones: document.getElementById("divBotones"),
        divAdivinaPasadoTipo: document.getElementById("divAdivinaPasadoTipo"),
        resultTabla: document.getElementById("resultTabla"),
        nombre: document.getElementById("txtNombre")?.value,
        verboJuega: null,
        pasadoUsr: document.getElementById("txtPasado"),
        tipoUsr: document.getElementsByName("tipoV"),
        vidas: 3,
        pistaDespuesDe: 3,
        perdioLasVidas: false,
        seRindio: false,
        errores: 0,
        aciertos: 0,
        intentos: 6,
        verbos: [],
        verboDashes: [],
        verboArray: [],
        datosjuego: [],
        puntos: 0,
        //spinner: null,
        modalNombre: null,
  
        /*init() {
            // Initialize elements that might not be available at load time
            this.spanVidas = document.querySelector(".spanVidas");
            this.spanPuntos = document.querySelector(".spanPuntos");
            this.spanVerbo = document.querySelector(".spanVerbo");
            this.spanPista = document.querySelector(".spanPista");
            this.pasadoUsr = document.getElementById("txtPasado");
            this.tipoUsr = document.getElementsByName("tipoV");
            this.resultTabla = document.getElementById("resultTabla");
            this.spinner = document.getElementById("loading");
  
            // Set up event listeners
            document
              .getElementById("btnRendirse")
              ?.addEventListener("click", () => this.rendir());
            document
              .getElementById("formulario")
              ?.addEventListener("submit", (e) => {
                e.preventDefault();
                this.revisarPasado();
              });
  
            // If name modal form exists
            const nameForm = document.querySelector("#modalNombre form");
            if (nameForm) {
              nameForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.aJugar();
              });
            }
  
            // Initialize game if elements are present
            if (this.spanVidas && this.spanPuntos) {
              this.spanPuntos.innerHTML = "0";
            }
          },*/
  
        randomKey(max) {
          return Math.floor(Math.random() * max);
        },
  
        async leerVerbos() {
          try {
            const data = await fetch(`${window.API_URL}/api/words`);
            const verbos = await data.json();
            this.verbos = verbos.data;
            console.log("verbos", this.verbos);
            this.iniciar();
          } catch (error) {
            console.error("Error loading verbs:", error);
          }
        },
  
        seleccionaVerbo() {
          const n = this.verbos.length;
  
          if (n === 0) {
            this.terminar(); // Llama a terminar si ya no quedan verbos
            return null;
          }
  
          const key = this.randomKey(n);
          const verbo = this.verbos[key];
          this.verbos.splice(key, 1);
  
          // Verifica si después de eliminar este verbo ya no quedan más
          if (this.verbos.length === 0) {
            // Asegura que el juego termine si este era el último verbo
            setTimeout(() => this.terminar(), 500); // pequeño delay opcional para UX
          }
  
          return verbo;
        },
  
        iniciar() {
          // Reset hangman images
          for (let i = 2; i <= 7; i++) {
            document.getElementById(`img${i}`).style.visibility = "hidden";
          }
  
          this.verboJuega = this.seleccionaVerbo();
          this.errores = 0;
          this.aciertos = 0;
          this.intentos = 6;
          this.spanVidas.innerHTML = "♥".repeat(this.vidas);
          this.verboArray = this.verboJuega["word"].split("");
          this.verboDashes = Array(this.verboArray.length).fill("_");
  
          this.spanVerbo.innerHTML = this.verboDashes.join("   ");
          this.spanPista.classList.add("oculto");
          this.spanPista.innerHTML = this.verboJuega["clue"];
  
          this.crearBotones();
          this.divBotones.classList.remove("d-none");
          this.divAdivinaPasadoTipo.classList.add("oculto");
          //this.spinner.classList.add("d-none");
          document.getElementById("divPrincipal").classList.remove("oculto");
        },
  
        crearBotones() {
          const contenedor = document.getElementById("divBotones");
          contenedor.innerHTML = "";
          const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
          alfabeto.split("").forEach((letra) => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.id = letra;
            boton.textContent = letra;
            boton.className = "botonLetra btn btn-outline-primary m-1";
  
            boton.addEventListener("click", (e) => {
              this.procesarLetra(letra, e.target);
            });
  
            contenedor.appendChild(boton);
          });
        },
  
        procesarLetra(letra, boton) {
          const sonido = new Audio("/songs/mech-keyboard.mp3");
          sonido.play();
  
          if (this.verboArray.includes(letra)) {
            // Correct letter
            this.verboArray.forEach((car, ind) => {
              if (car === letra) {
                this.verboDashes[ind] = car;
                this.aciertos++;
                this.puntos += 10;
              }
            });
  
            this.spanVerbo.innerHTML = this.verboDashes.join("   ");
            this.spanPuntos.innerHTML = this.puntos;
  
            if (this.aciertos === this.verboArray.length) {
              const winSound = new Audio("/songs/adivinar.mp3");
              winSound.play();
              this.adivinarPasado();
            }
          } else {
            // Incorrect letter
            this.intentos--;
            this.errores++;
            this.puntos = Math.max(0, this.puntos - 1);
            this.spanPuntos.innerHTML = this.puntos;
  
            // Update hangman image
            const imgId = 7 - this.intentos;
            if (imgId >= 2 && imgId <= 7) {
              document.getElementById(`img${imgId}`).style.visibility = "visible";
            }
  
            // Show clue after certain number of errors
            if (this.errores === this.pistaDespuesDe) {
              this.spanPista.classList.remove("oculto");
            }
  
            // Game over if no more attempts
            if (this.errores === 6) {
              this.creaFeedback();
              this.vidas--;
              this.perdio();
            }
          }
  
          // Remove the button
          boton.disabled = true;
          boton.classList.remove("btn-outline-primary");
          boton.classList.add("btn-secondary");
        },
  
        adivinarPasado() {
          const verbo = this.verboJuega["word"];
          this.divBotones.classList.add("d-none");
          document.getElementById("helpId").textContent =
            `Escribe el pasado simple del verbo ${verbo.toLowerCase()}`;
          this.divAdivinaPasadoTipo.classList.remove("d-none");
          this.divAdivinaPasadoTipo.classList.add("visible");
        },
  
        revisarPasado() {
          const form = document.getElementById("formulario");
          this.divAdivinaPasadoTipo.classList.add("d-none");
  
          const tipoOk = this.verboJuega["type"].toLowerCase().trim();
          const pasadoOk = this.verboJuega["simplepast"].toLowerCase().trim();
          const pasadoTest = this.pasadoUsr.value.toLowerCase().trim();
  
          let tipoTest = "r"; // Default to regular
          for (const tipo of this.tipoUsr) {
            if (tipo.checked) {
              tipoTest = tipo.value;
              break;
            }
          }
  
          this.creaFeedback();
  
          if (tipoTest === tipoOk && pasadoTest === pasadoOk) {
            this.puntos += 15;
            this.gano();
          } else {
            this.vidas--;
            this.puntos = Math.max(0, this.puntos - 10);
            this.perdio();
          }
  
          form.reset();
        },
  
        gano() {
          const winSound = new Audio("/songs/win.mp3");
          winSound.play();
          document.getElementById("modalTitleId2").textContent = "¡Correcto :) !";
          const modalResult = new bootstrap.Modal(
            document.getElementById("modalResult"),
          );
          modalResult.show();
        },
  
        perdio() {
          const loseSound = new Audio("/songs/lose.mp3");
          loseSound.play();
          document.getElementById("modalTitleId2").textContent =
            "¡Incorrecto :( !";
          const modalResult = new bootstrap.Modal(
            document.getElementById("modalResult"),
          );
          modalResult.show();
        },
  
        valida() {
          if (this.vidas === 0) {
            this.spanVidas.innerHTML = "";
            this.perdioLasVidas = true;
            this.terminar();
          } else {
            this.iniciar();
          }
        },
  
        creaFeedback() {
          const resultado = `
          <tr>
            <td>Verbo:</td>
            <td>${this.verboJuega["word"].toLowerCase()}</td>
          </tr>
          <tr>
            <td>Tipo:</td>
            <td>${this.verboJuega["type"].toLowerCase() === "r" ? "regular" : "irregular"}</td>
          </tr>
          <tr>
            <td>Pasado:</td>
            <td>${this.verboJuega["simplepast"].toLowerCase()}</td>
          </tr>
          <tr>
            <td>Ejemplo:</td>
            <td>${this.verboJuega["example"]}</td>
          </tr>
        `;
          this.resultTabla.innerHTML = resultado;
        },
  
        async insertarJuego() {
          const datosEnviar = { nombre: this.nombre };
          try {
            const response = await fetch(
              `${window.API_URL}/api/arenagame/nuevo`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(datosEnviar),
              },
            );
            this.datosjuego = await response.json();
          } catch (error) {
            console.error("Error starting game:", error);
          }
        },
  
        async terminar() {
          this.spinner.classList.remove("d-none");
          document.getElementById("vidas").style.display = "none";
          document.getElementById("rendirse").style.display = "none";
          document.getElementById("verbo").style.display = "none";
          document.getElementById("pista").style.display = "none";
          document.getElementById("divHangman").style.display = "none";
          document.getElementById("puntos").style.display = "none";
          this.divBotones.classList.add("d-none");
  
          const idSend = this.datosjuego[0]?.id || 0;
          const rindioSend = this.seRindio ? 1 : 0;
          const puntosSend = this.seRindio ? 0 : this.puntos;
          const datosEnviar = {
            id: idSend,
            puntos: puntosSend,
            rindio: rindioSend,
          };
  
          try {
            await fetch(`${window.API_URL}/api/arenagame/fin`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosEnviar),
            });
            window.location.href = "/tablageneral";
          } catch (error) {
            console.error("Error ending game:", error);
          }
        },
  
        aJugar() {
          this.nombre = document.getElementById("txtNombre").value;
          this.modalNombre.hide();
          this.insertarJuego();
          this.leerVerbos();
        },
  
        rendir() {
          this.seRindio = confirm("¿De verdad deseas rendirte?");
          if (this.seRindio) {
            const loseSound = new Audio("/songs/lose.mp3");
            loseSound.play();
            this.terminar();
          }
        },
  
        // 2. Método para configurar todos los event listeners
        setupEventListeners() {
          // Listener para el formulario de nombre
          const nameForm = document.querySelector("#modalNombre form");
          if (nameForm) {
            nameForm.addEventListener("submit", (e) => {
              e.preventDefault();
              this.aJugar();
            });
          }
  
          // Listener para el botón Cancelar
          const cancelBtn = document.querySelector(
            "#modalNombre [data-bs-dismiss='modal']",
          );
          if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
              window.location.href = "/";
            });
          }
  
          // Listener para el botón Ok de resultados
          const resultOkBtn = document.querySelector(
            "#modalResult button[data-bs-dismiss='modal']",
          );
          if (resultOkBtn) {
            resultOkBtn.addEventListener("click", () => {
              this.valida();
            });
          }
  
          // Listener para el botón Rendirse
          const surrenderBtn = document.getElementById("btnRendirse");
          if (surrenderBtn) {
            surrenderBtn.addEventListener("click", () => {
              this.rendir();
            });
          }
  
          // Listener para el formulario de pasado simple
          const pastForm = document.getElementById("formulario");
          if (pastForm) {
            pastForm.addEventListener("submit", (e) => {
              e.preventDefault();
              this.revisarPasado();
            });
          }
        },
  
        // 3. Modificamos el método init para incluir los listeners
        init() {
          // Initialize elements that might not be available at load time
          this.spanVidas = document.querySelector(".spanVidas");
          this.spanPuntos = document.querySelector(".spanPuntos");
          this.spanVerbo = document.querySelector(".spanVerbo");
          this.spanPista = document.querySelector(".spanPista");
          this.pasadoUsr = document.getElementById("txtPasado");
          this.tipoUsr = document.getElementsByName("tipoV");
          this.resultTabla = document.getElementById("resultTabla");
          //this.spinner = document.getElementById("loading");
          // Configuramos todos los event listeners
          this.setupEventListeners();
  
          // Initialize game if elements are present
          if (this.spanVidas && this.spanPuntos) {
            this.spanPuntos.innerHTML = "0";
          }
        },
      };
  
      // Inicialización controlada
      try {
        hangmanApp.modalNombre = new bootstrap.Modal(
          document.getElementById("modalNombre")
        );
        hangmanApp.modalNombre.show();
        hangmanApp.init();
      } catch (error) {
        console.error("Error en inicialización:", error);
      }
    }
  });