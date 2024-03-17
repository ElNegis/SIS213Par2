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
        let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
        task = datosLS;
        agregarHTML();
    })
})()

function generarOpciones() {
    var select = document.getElementById("opcion");
    select.innerHTML = ""; // Limpiar opciones existentes
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

/* FUNCIONES */
function validarFormulario(e) {
    e.preventDefault();
    //validar los campos
    const tarea = document.querySelector("#tarea").value;
    if (tarea.trim().length === 0) {
        console.log('vacio');
        return
    }

    //creamos el objeto tarea
    const objTarea = { id: Date.now(), tarea: tarea, estado: false };
    //agregamos al array sin mutar dicho arreglo
    task = [...task, objTarea];
    formulario.reset();

    //agregamos al HTML
    agregarHTML();

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
                    <button class="eliminar w3-button" data-id="${item.id}">x</button>
                    <button class="completada w3-button" data-id="${item.id}">✓</button>
                </div>
            `
            tareas.appendChild(elemento)
        });

    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "~SIN TAREAS~"
        tareas.appendChild(mensaje)
    }

    let totalTareas = task.length;
    let tareasCompletas = task.filter(item => item.estado === true).length;

    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Tareas Completadas: ${tareasCompletas}`;

    //persistir los datos con localStorage
    localStorage.setItem("tareas", JSON.stringify(task))

    generarInforme();

}

function eliminarTarea(e) {
    if (e.target.classList.contains("eliminar")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        //eliminamos con el array method filter
        const nuevasTareas = task.filter((item) => item.id !== tareaID);
        task = nuevasTareas;
        agregarHTML();
    }
}


//completar tarea
function completarTarea(e) {
    if (e.target.classList.contains("completada")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.map(item => {
            if (item.id === tareaID) {
                item.estado = !item.estado;
                return item;
            } else {
                return item
            }
        })

        //editamos el arreglo
        task = nuevasTareas;
        agregarHTML();
    }
}

const generarInformeBtn = document.getElementById("generarInformeBtn");

generarInformeBtn.addEventListener("click", () => {
    const informeRealizadas = task.filter(item => item.estado === true);
    const informeNoRealizadas = task.filter(item => item.estado === false);

    const informeTexto = `
Informe de Tareas Realizadas:
${informeRealizadas.map(item => `- ${item.tarea}`).join('\n')}

Informe de Tareas No Realizadas:
${informeNoRealizadas.map(item => `- ${item.tarea}`).join('\n')}
    `;

    const blob = new Blob([informeTexto], { type: 'text/plain' });
    const enlaceDescarga = document.createElement('a');

    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = 'InformeTareas.txt';

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
});
