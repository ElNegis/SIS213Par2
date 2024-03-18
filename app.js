const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
let task = [];
var opciones = ["Opción 1", "Opción 2", "Opción 3"];
/* EVENTOS */
(() => {
    formulario.addEventListener('submit', validarFormulario);
    tareas.addEventListener("click", eliminarTarea);
    tareas.addEventListener("click", completarTarea);
    document.addEventListener("DOMContentLoaded", () => {
        mostrarDiasRestantesEnNotificacion();
        let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
        task = datosLS;
        inicializarEstadisticas();
        generarResumenCategorias();
        agregarHTML();
        
    })
})()

let nivel = 1; // El nivel inicia en 1
let experiencia = 0;
let oro = 0; // Oro inicial
let tareasCompletadas = 0;
let vida = 50;

function generarOpciones() {
    var select = document.getElementById("opcion");
    select.innerHTML = "";
    opciones.forEach(function(opcion, index) {
      var nuevaOpcion = document.createElement("option");
      nuevaOpcion.text = opcion;
      nuevaOpcion.value = "opcion" + (index + 1);
      select.appendChild(nuevaOpcion);
    });
  }

function mostrarFormulario() {
    var formulario = document.getElementById("formularioap");
    formulario.style.display = "block";
  }

  function ocultarFormulario() {
    var formulario = document.getElementById("formularioap");
    formulario.style.display = "none";
  }

  function agregarOpcion() {
    var nuevaOpcion = prompt("Ingrese la nueva opción:");
    if (nuevaOpcion) {
      opciones.push(nuevaOpcion);
      generarOpciones();
    }
  }

  function validarFormulario(e) {
    e.preventDefault();
    const tareaInput = document.querySelector("#tarea");
    const fechaInput = document.querySelector("#fechaTarea");
    const categoriaSelect = document.querySelector("#categoria");
    const tarea = tareaInput.value;
    const fecha = fechaInput.value;
    const categoria = categoriaSelect.value;
    if (tarea.trim() === '' || fecha.trim() === '' || categoria.trim() === '') {
        console.log('Todos los campos son obligatorios.');
        return;
    }
    const objTarea = { id: Date.now(), tarea, estado: false, fecha, categoria };
    task.push(objTarea);
    localStorage.setItem("tareas", JSON.stringify(task));
    formulario.reset();
    agregarHTML();
    generarResumenCategorias();
}



function agregarHTML() {


    while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild)
    }

    if (task.length > 0) {
        task.forEach(item => {
            const elemento = document.createElement('div');
            elemento.classList.add('w3-col');
            elemento.classList.add('l2');
            elemento.classList.add('m6');
            elemento.classList.add('w3-margin-bottom');
            elemento.classList.add('w3-margin');
            elemento.classList.add('w3-panel');
            elemento.classList.add('w3-pale-blue');
            elemento.classList.add('w3-leftbar');
            elemento.classList.add('w3-rightbar');
            elemento.classList.add('w3-border-blue');
            elemento.classList.add('w3-border-blue');
            elemento.innerHTML = `
            
                <h4 class="w3-cursive">${item.estado ? (
                    `<span class='completa'>${item.tarea}</span>`
                ) : (
                    `<span>${item.tarea}</span>`
                )}</h4>
                <div class="botones w3-padding w3-half">
                    <h4><small>${item.fecha}</small></h4>
                    <h4 class="w3-cursive">${item.categoria}</h4>
                    <button class="editar w3-button" onclick="editarTarea(${item.id})">Editar</button>
                    <button class="eliminar w3-button" data-id="${item.id}">x</button>
                    <button class="completada w3-button" data-id="${item.id}">✓</button>
                </div>
                
            `
            tareas.appendChild(elemento)
        });

    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "~SIN TAREAS PENDIENTES~"
        tareas.appendChild(mensaje)
    }

    let totalTareas = task.length;
    let tareasCompletas = task.filter(item => item.estado === true).length;

    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Tareas Completadas: ${tareasCompletas}`;
    localStorage.setItem("tareas", JSON.stringify(task))

    actualizarEstadisticasDeTareas();

}
function editarTarea(id) {
    const tareaNombre = document.getElementById(`tarea-nombre-${id}`);
    const tareaFecha = document.getElementById(`tarea-fecha-${id}`);
    const tareaCategoria = document.getElementById(`tarea-categoria-${id}`);
    const botonEditar = document.querySelector(`.editar[onclick="editarTarea(${id})"]`);

    // Verifica si la tarea ya está en modo edición
    if (botonEditar.textContent === 'Guardar') {
        const tareaIndex = task.findIndex(tarea => tarea.id === id);
        task[tareaIndex].tarea = tareaNombre.textContent;
        task[tareaIndex].fecha = tareaFecha.textContent;
        task[tareaIndex].categoria = tareaCategoria.textContent;
        localStorage.setItem("tareas", JSON.stringify(task));
        botonEditar.textContent = 'Editar';
        tareaNombre.contentEditable = "false";
        tareaFecha.contentEditable = "false";
        tareaCategoria.contentEditable = "false";
        mostrarNotificacion("Tarea actualizada");
    } else {
        botonEditar.textContent = 'Guardar';
        tareaNombre.contentEditable = "true";
        tareaFecha.contentEditable = "true";
        tareaCategoria.contentEditable = "true";
    }
}

function obtenerDiasRestantes(fecha) {
    const fechaActual = new Date();
    const fechaLimite = new Date(fecha);
    const tiempoRestante = fechaLimite - fechaActual;
    return Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24));
}

function eliminarTarea(e) {
    if (e.target.classList.contains("eliminar")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.filter((item) => item.id !== tareaID);
        experiencia -= 50; 
        oro -= 1;
        experiencia = Math.max(0, experiencia);
        oro = Math.max(0, oro);

        task = nuevasTareas;
        localStorage.setItem("tareas", JSON.stringify(task));
        agregarHTML();
        generarResumenCategorias();
        actualizarEstadisticasDeTareas();

        mostrarNotificacion("Tarea eliminada con éxito. Se te restaron puntos y experiencia.");
    }
}
function completarTarea(e) {
    if (e.target.classList.contains("completada")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const tareaCompletada = task.find(item => item.id === tareaID);
        if (!tareaCompletada.estado) { 
            experiencia += 100;
            oro += 2; 
            if (experiencia >= 1000) { 
                experiencia -= 1000; 
                nivel++;
            }
            tareaCompletada.estado = !tareaCompletada.estado; 
            mostrarNotificacion("Tarea completada! +100 XP y +2 de oro");
        }
        localStorage.setItem("tareas", JSON.stringify(task));
        agregarHTML();
        actualizarEstadisticasDeTareas();
    }
}
function actualizarEstadisticasDeTareas() {
    document.getElementById("avatar-level").textContent = "Level " + nivel;
    document.getElementById("$au").textContent = oro;
    document.getElementById("$av").textContent = "0"; 
    const porcentajeXP = (experiencia / 1000) * 100;
    document.getElementById("xp").style.width = `${porcentajeXP}%`;

}
function mostrarNotificacion(mensaje) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notificationContainer.style.display = 'block';

    setTimeout(() => {
        notificationContainer.style.display = 'none'; 
    }, 3000);
}


const generarInformeBtn = document.getElementById("generarInformeBtn");

generarInformeBtn.addEventListener("click", () => {
    const informeRealizadas = task.filter(item => item.estado === true);
    const informeNoRealizadas = task.filter(item => item.estado === false);

    const informeTexto = `
Informe de Tareas Realizadas:
${informeRealizadas.map(item => `- ${item.tarea}`).join('\n')}
${informeRealizadas.map(item => `- ${item.fecha}`).join('\n')}

Informe de Tareas No Realizadas:
${informeNoRealizadas.map(item => `- ${item.tarea}`).join('\n')}
${informeNoRealizadas.map(item => `- ${item.fecha}`).join('\n')}
    `;

    const blob = new Blob([informeTexto], { type: 'text/plain' });
    const enlaceDescarga = document.createElement('a');

    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = 'InformeTareas.txt';

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
});

function generarResumenCategorias() {
    const resumen = document.getElementById('resumenCategorias');
    const categorias = ['Deportes', 'Casa', 'Salud', 'Escuela'];
    let tareasPorCategoria = {
        'Deportes': [],
        'Casa': [],
        'Salud': [],
        'Escuela': []
    };

    task.forEach(tarea => {
        if (!tarea.estado && tareasPorCategoria.hasOwnProperty(tarea.categoria)) {
            tareasPorCategoria[tarea.categoria].push(tarea);
        }
    });

    let contenidoHTML = '<div class="w3-row">';
    categorias.forEach(categoria => {
        contenidoHTML += `<div class="w3-col l3 m6 w3-margin-bottom">
                              <div class="w3-container w3-card w3-white w3-padding-16">
                                  <h3>${categoria}</h3>
                                  <ul>`;
        tareasPorCategoria[categoria].forEach(tarea => {
            contenidoHTML += `<li>${tarea.tarea} - ${tarea.fecha}</li>`;
        });
        contenidoHTML += `   </ul>
                              </div>
                          </div>`;
    });
    contenidoHTML += '</div>';

    resumen.innerHTML = contenidoHTML; 
}
function inicializarEstadisticas() {
    nivel = 1;
    oro = 0;
    tareasCompletadas = 0; 
    vida = 50;
    actualizarEstadisticasDeTareas();
}
function toggleDarkMode() {
    var body = document.body;
    body.classList.toggle("dark-mode");

    var button = document.getElementById('dark-mode-button');
    if (body.classList.contains("dark-mode")) {
        button.textContent = "Modo Claro";
    } else {
        button.textContent = "Modo Oscuro";
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleDarkMode();
    }
});
function calcularDiasHastaFechaDefinida() {
    var fechaDefinida = new Date('2024-04-01'); // Fecha definida
    var fechaActual = new Date(); // Fecha actual
    var diferenciaMilisegundos = fechaDefinida.getTime() - fechaActual.getTime();
    var diferenciaDias = Math.ceil(diferenciaMilisegundos / (1000 * 3600 * 24));
    return diferenciaDias;
}

function mostrarDiasRestantesEnNotificacion() {
    var diasRestantes = calcularDiasHastaFechaDefinida();
    var mensaje = `Días restantes hasta la fecha definida: ${diasRestantes}`;
    mostrarNotificacion(mensaje);
}