//  Selectors and declarations
const colorDivs = document.querySelectorAll('.color');
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHextexes = document.querySelectorAll('.color h2');
const copyPopup = document.querySelector('.copy-container');
const adjustBtns = document.querySelectorAll('.adjust');
const lockBtns = document.querySelectorAll('.lock')
const closeAdjustBtns = document.querySelectorAll('.close-adjustment')
const sliderContainer = document.querySelectorAll('.sliders');
// Bottom Panel
const generateBtn = document.querySelector('.generate');


let initialColors;

//  Event Listeners

// get values of slider when user gives input
sliders.forEach(slider => {
    slider.addEventListener('input', sliderControls)
})

// copy hex of color when clicked on text
currentHextexes.forEach(text => {
    text.addEventListener('click', () => {
        coppyToClipboard(text)
    })
})
// remove copy to clipboard after transition completed
copyPopup.addEventListener('transitionend', () => {
    copyPopup.classList.remove('active');
    copyPopup.children[0].classList.remove('active')
})

// open slilders when cliked on adjust icon
adjustBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        openAdjustSlider(index)
    })
})

// closes sliders when click on x
closeAdjustBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        closeAdjustSlider(index)
    })
})

//generate colors when clicked on generate button
generateBtn.addEventListener('click', generateRandomColors);

// lock color feature
lockBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        colorDivs[index].classList.toggle('locked');
        colorDivs[index].classList.contains('locked') ? btn.innerHTML = "<i class='fas fa-lock'></i>" : btn.innerHTML = "<i class='fas fa-lock-open'></i>"
    })
})

// Funtions

// - create random hex
function randomColor() {
    let hexColor = chroma.random();
    return hexColor;
}

// generate hex and asign to the palette
function generateRandomColors() {
    // initial colors set
    initialColors = [];
    colorDivs.forEach(div => {
        let hexText = div.children[0];
        let randomHex = randomColor();
        if (div.classList.contains('locked')) {
            initialColors.push(hexText.innerText);
            randomHex = hexText.innerText;
        } else {
            // add randomhex in initial array
            initialColors.push(randomHex.hex());
        }
        // set color and text props as a hex
        div.style.backgroundColor = randomHex;
        hexText.innerText = randomHex;
        // change text color as per contrast
        checkContrastText(randomHex, hexText);
        // initialize sliders
        const color = chroma(randomHex);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        slidersInputFeature(color, hue, brightness, saturation);
    });
    // set the values of sliders as colors
    setSliderStartValues();
    // change color for different contrast in icons 
    adjustBtns.forEach((btn, index) => {
        console.log(btn, index);
        checkContrastText(initialColors[index], btn);
        checkContrastText(initialColors[index], lockBtns[index]);
    })
}

// sliders background and more
function slidersInputFeature(color, hue, brightness, saturation) {
    // brightness sliser
    let midBright = color.set('hsl.l', 0.5);
    let brightScale = chroma.scale(['black', midBright, 'white']);
    // saturation slider
    let noSat = color.set('hsl.s', 0);
    let maxSat = color.set('hsl.s', 1);
    let satScale = chroma.scale([noSat, color, maxSat]); //scale

    // apply bakcground as scale
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,205,75), rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`
    brightness.style.backgroundImage = `linear-gradient(to right, ${brightScale(0)},${brightScale(0.5)},${brightScale(1)})` //brightness scale
    saturation.style.backgroundImage = `linear-gradient(to right , ${satScale(0)}, ${satScale(1)})`; //saturation scale
}

// check contrast of color and change color of text on it
function checkContrastText(color, text) {
    let luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = 'black';
    } else {
        text.style.color = 'white';
    }

}

// slider controlls
function sliderControls(e) {
    // index of color
    let index = e.target.getAttribute('data-sat') ||
        e.target.getAttribute('data-hue') ||
        e.target.getAttribute('data-bright');
    let sliders = e.target.parentElement.querySelectorAll(`input[type="range"]`);
    let hue = sliders[0];
    let brightness = sliders[1];
    let saturation = sliders[2];
    // change color as per slider
    let BgColor = initialColors[index];
    let color = chroma(BgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);
    colorDivs[index].style.backgroundColor = color;
    let text = colorDivs[index].querySelector('h2');
    text.innerText = color;
    checkContrastText(color, text);
    slidersInputFeature(color, hue, brightness, saturation);

}

// sets values of hsl to the main color
function setSliderStartValues() {
    let sliders = document.querySelectorAll('.sliders input');
    sliders.forEach(slider => {
        if (slider.name === 'hue') {
            let index = slider.getAttribute("data-hue");
            let color = initialColors[index];
            let hueValue = chroma(color).hsl()[0];
            slider.value = Math.floor(hueValue)
        }
        if (slider.name === 'bright') {
            let index = slider.getAttribute("data-bright");
            let color = initialColors[index];
            let BrightValue = chroma(color).hsl()[2];
            slider.value = Math.floor(BrightValue * 100) / 100;
        }
        if (slider.name === 'saturation') {
            let index = slider.getAttribute("data-sat");
            let color = initialColors[index];
            let SatValue = chroma(color).hsl()[1];
            slider.value = Math.floor(SatValue * 100) / 100;
        }
    })
}

// copy to clipboard funtion
function coppyToClipboard(text) {
    let pseudoElement = document.createElement('textarea');
    pseudoElement.value = text.innerText;
    document.body.appendChild(pseudoElement)
    pseudoElement.select();
    document.execCommand('copy')
    document.body.removeChild(pseudoElement);
    // popup animation
    copyPopup.classList.add('active');
    copyPopup.children[0].classList.add('active')
}

// open adjustment slieders
function openAdjustSlider(index) {
    sliderContainer[index].classList.toggle('active')
}

// close adjustment sliders
function closeAdjustSlider(index) {
    sliderContainer[index].classList.remove('active');
}

generateRandomColors();