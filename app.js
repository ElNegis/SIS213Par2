const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
let task = [];
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
            elemento.classList.add('w3-light-blue');
            

            elemento.innerHTML = `
                <p>${item.estado ? (
                    `<span class='completa'>${item.tarea}</span>`
                ) : (
                    `<span>${item.tarea}</span>`
                )}</p>
                <div class="botones w3-padding">
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
