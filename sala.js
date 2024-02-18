class Tarea {
    constructor(text) {
        this.text = text;
        this.completed = false;
    }

    marcaCompletada() {
        this.completed = true;
    }
}

const tareas = [];

function agregarTarea(tareaText) {
    const nuevaTarea = new Task(tareaText);
    tasks.push(nuevaTarea);
    console.log(`Tarea "${tareaText}" agregada correctamente.`);
}

function marcaCompletada(index) {
    if (index >= 0 && index < tareas.length) {
        tareas[index].marcaCompletada();
        console.log(`Tarea "${tareas[index].text}" marcada como completada.`);
    } else {
        console.log("Índice inválido. Introduce un índice válido.");
    }
}

function eliminarTarea(index) {
    if (index >= 0 && index < tareas.length) {
        const eliminarTarea = tareas.splice(index, 1)[0];
        console.log(`Tarea "${eliminarTarea.text}" eliminada correctamente.`);
    } else {
        console.log("Índice inválido. Introduce un índice válido.");
    }
}

function Estado() {
    console.log("\n--- Lista de Tareas ---");
    tareas.forEach((Tarea, index) => {
        const status = Tarea.completed ? "Completada" : "Pendiente";
        console.log(`${index}: ${Tarea.text} (${status})`);
    });
}

function getUserInput(prompt) {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main() {
    const tareaText = await getUserInput("Ingresa una nueva tarea: ");
    addTask(tareaText);

    markTaskAsCompleted(0);
    deleteTask(1);
    displayTasks();
}

main();
