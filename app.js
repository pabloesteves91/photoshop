let canvas = document.getElementById('editorCanvas');
let ctx = canvas.getContext('2d');
let currentTool = 'brush';
let isDrawing = false;
let startX, startY;

// Tool aktivieren
function activateTool(tool) {
  currentTool = tool;
}

// Bild hochladen und anzeigen
function loadImage(event) {
  let image = new Image();
  image.onload = function() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
  image.src = URL.createObjectURL(event.target.files[0]);
}

// Speichern des bearbeiteten Bildes
function saveImage() {
  let link = document.createElement('a');
  link.download = 'image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Pinselwerkzeug zeichnen
canvas.addEventListener('mousedown', function(e) {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener('mousemove', function(e) {
  if (isDrawing && currentTool === 'brush') {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    startX = e.offsetX;
    startY = e.offsetY;
  }
});

canvas.addEventListener('mouseup', function() {
  isDrawing = false;
});

// Filter anwenden
function applyFilter(filter) {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  switch (filter) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      break;
    case 'sepia':
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = (r * .393) + (g * .769) + (b * .189);
        data[i + 1] = (r * .349) + (g * .686) + (b * .168);
        data[i + 2] = (r * .272) + (g * .534) + (b * .131);
      }
      break;
    case 'invert':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      break;
    // Weitere Filter hier hinzufügen
  }

  ctx.putImageData(imageData, 0, 0);
}

// Leere Leinwand
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Speichern des Projekts als .webps
function saveProject() {
  let projectData = canvas.toDataURL();
  let link = document.createElement('a');
  link.download = 'project.webps';
  link.href = projectData;
  link.click();
}

// Projekt laden
function loadProject() {
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = '.webps';
  input.onchange = function(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
      let img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}
