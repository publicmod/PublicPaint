const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 720; // Ancho del lienzo
canvas.height = 1080; // Alto del lienzo

let painting = false;
let brushSize = 5;
let eraserSize = 10;
let currentColor = '#000000';
let undoStack = [];
let redoStack = [];

// Función para iniciar la posición del dibujo
function startPosition(e) {
    painting = true;
    draw(e);
}

// Función para finalizar la posición del dibujo
function endPosition() {
    painting = false;
    ctx.beginPath();
    // Guardar el estado del lienzo en el stack de deshacer
    saveState();
}

// Función para dibujar en el lienzo
function draw(e) {
    if (!painting) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

// Guardar el estado del lienzo para deshacer
function saveState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 10) {
        undoStack.shift(); // Limitar el tamaño del stack
    }
    redoStack = []; // Limpiar el stack de rehacer al hacer un nuevo cambio
}

// Deshacer la última acción
document.getElementById('undoButton').addEventListener('click', () => {
    if (undoStack.length > 0) {
        // Guardar el estado actual en el stack de rehacer antes de deshacer
        redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(undoStack.pop(), 0, 0);
    }
});

// Rehacer la última acción
document.getElementById('redoButton').addEventListener('click', () => {
    if (redoStack.length > 0) {
        // Guardar el estado actual en el stack de deshacer antes de rehacer
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(redoStack.pop(), 0, 0);
    }
});

// Cambiar el color del pincel
document.getElementById('colorButton').addEventListener('click', () => {
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.click();
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Cambiar el tamaño del pincel
document.getElementById('brushSizeButton').addEventListener('click', () => {
    const brushSizeInput = document.getElementById('brushSize');
    brushSizeInput.style.display = brushSizeInput.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

// Cambiar a la goma de borrar
document.getElementById('eraserButton').addEventListener('click', () => {
    const eraserSizeInput = document.getElementById('eraserSize');
    eraserSizeInput.style.display = eraserSizeInput.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('eraserSize').addEventListener('input', (e) => {
    eraserSize = e.target.value;
});

// Función para borrar el lienzo con la goma de borrar
canvas.addEventListener('mousedown', (e) => {
    if (eraserSize > 0) {
        painting = true;
        ctx.lineWidth = eraserSize;
        ctx.strokeStyle = '#FFFFFF'; // Color blanco para la goma de borrar
        draw(e);
    }
});

// Guardar el lienzo como imagen
document.getElementById('saveButton').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});

// Bote de pintura
document.getElementById('bucketButton').addEventListener('click', () => {
    // Función para llenar el lienzo con el color seleccionado
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Agregar eventos a mouse y touch para el dibujo
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Evitar el comportamiento de desplazamiento
    startPosition(e.touches[0]);
});
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Evitar el comportamiento de desplazamiento
    draw(e.touches[0]);
});
