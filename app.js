//  Selectors and declarations
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHextexes = document.querySelectorAll('.color h2')
let initialColors;


// Funtions

// - create random hex
function randomColor() {
    let hexColor = chroma.random();
    return hexColor;
}

// generate hex and asign to the palette
function generateRandomColors() {
    colorDivs.forEach(div => {
        let hexText = div.children[0];
        let randomHex = randomColor();
        // set color and text props as a hex
        div.style.backgroundColor = randomHex;
        hexText.innerText = randomHex;
        // change text color as per contrast
        checkContrastText(randomHex, hexText)
    })
}

// check contrast of color and change color of text on it
function checkContrastText(color, text) {
    let luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = 'black';
    } else {
        text.style.color = 'white'
    }
}

generateRandomColors();