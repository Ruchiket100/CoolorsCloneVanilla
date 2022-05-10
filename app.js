//  Selectors and declarations
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHextexes = document.querySelectorAll('.color h2')
let initialColors;


// Funtions

// - genearate hex
function randomColor() {
    let hexColor = chroma.random();
    return hexColor;
}

function generateRandomColors() {
    colorDivs.forEach(div => {
        let hexText = div.children[0];
        let randomHex = randomColor();
        div.style.backgroundColor = randomHex;
        hexText.innerText = randomHex;
    })
}


generateRandomColors()