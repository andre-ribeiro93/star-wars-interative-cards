let currentPageUrl = 'https://swapi.dev/api/people/';

document.getElementById('loading-animation').style.visibility = "visible";

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert ('Erro no carregamento dos cards');
    }

    document.getElementById('loading-animation').style.visibility = "hidden";

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', loadPreviousPage);

    const nextButton = document.getElementById('next-button');
    nextButton.addEventListener('click', loadNextPage);
};

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Lê o conteúdo presente no elemento 'main-content' e limpa os resultados anteriores devido a igualdade com a 'string vazia'.

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
            card.className = "cards";

            const characterNameBG = document.createElement("div");
            characterNameBG.className = "character-name-bg";

            const characterName = document.createElement("span");
            characterName.className = "character-name";
            characterName.innerText = `${character.name}`;

            characterNameBG.appendChild(characterName);
            card.appendChild(characterNameBG);

            card.onclick = async () => {
                const modal = document.getElementById('modal');
                modal.style.visibility = "visible";

                const modalContent = document.getElementById('modal-content');
                modalContent.innerHTML = '';

                const characterImage = document.createElement("div");
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
                characterImage.className = "character-image";

                const name = document.createElement("span");
                name.className = "character-details";
                name.innerText = `Nome: ${character.name}`

                const characterHeight = document.createElement("span");
                characterHeight.className = "character-details";
                characterHeight.innerText = `Altura: ${covertHeight(character.height)}`

                const characterMass = document.createElement("span");
                characterMass.className = "character-details";
                characterMass.innerText = `Peso: ${convertMass(character.mass)}`

                const hairColor = document.createElement("span");
                hairColor.className = "character-details";
                hairColor.innerText = `Cor do cabelo: ${covertAllColor(character.hair_color)}`

                const eyeColor = document.createElement("span");
                eyeColor.className = "character-details";
                eyeColor.innerText = `Cor dos olhos: ${covertAllColor(character.eye_color)}`

                const birthYear = document.createElement("span");
                birthYear.className = "character-details";
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                const spinnerCard = document.createElement("div");
                spinnerCard.className = "spinner-card";
                spinnerCard.style.visibility = "visible"

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(characterHeight);
                modalContent.appendChild(characterMass);
                modalContent.appendChild(hairColor);
                modalContent.appendChild(eyeColor);
                modalContent.appendChild(birthYear);
                modalContent.appendChild(spinnerCard)

                const planetLink = character.homeworld;

                try {
                    const response = await fetch(planetLink);
                    const planetName = await response.json();

                    const planet = document.createElement("span");
                    planet.className = "character-details";
                    planet.innerText = `Planeta Natal: ${convertPlanet(planetName.name)}`
                    modalContent.appendChild(planet);
                    
                } catch (error) {
                    console.log(`falha no carregamento dos dados dos planetas ${error}`);
                }

                spinnerCard.style.visibility = "hidden";
            }
            
            mainContent.appendChild(card);
        });

        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');
        
        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;

        backButton.style.visibility = responseJson.previous? "visible" : "hidden";

        currentPageUrl = url;

    } catch (error) {
        throw new Error('Erro no carregamento dos personagens');
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    document.getElementById('loading-animation').style.visibility = "visible";

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.next);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página');
    }

    document.getElementById('loading-animation').style.visibility = "hidden";
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    document.getElementById('loading-animation').style.visibility = "visible";

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.previous);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior');
    }

    document.getElementById('loading-animation').style.visibility = "hidden";
}

const page1 = document.getElementById('page-1');
const page2 = document.getElementById('page-2');
const page3 = document.getElementById('page-3');
const page4 = document.getElementById('page-4');
const page5 = document.getElementById('page-5');
const page6 = document.getElementById('page-6');
const page7 = document.getElementById('page-7');
const page8 = document.getElementById('page-8');
const page9 = document.getElementById('page-9');

function loadPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <=9) {

        document.getElementById('loading-animation').style.visibility = "visible";

        const url = `https://swapi.dev/api/people/?page=${pageNumber}`;
        
        loadCharacters (url).then(() =>{
            document.getElementById('loading-animation').style.visibility = "hidden";
        });
    }
    
    else {
        console.log (error);
        alert('Erro ao carregar a página solicitada');
    }
}

page1.addEventListener('click', () => loadPage(1));
page2.addEventListener('click', () => loadPage(2));
page3.addEventListener('click', () => loadPage(3));
page4.addEventListener('click', () => loadPage(4));
page5.addEventListener('click', () => loadPage(5));
page6.addEventListener('click', () => loadPage(6));
page7.addEventListener('click', () => loadPage(7));
page8.addEventListener('click', () => loadPage(8));
page9.addEventListener('click', () => loadPage(9));

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.visibility = "hidden";
}

function covertAllColor(allColor) {
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        gold: "dourado",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avelã",
        unknown: "desconhecido",
        blond: "loiro",
        grey: "cinza",
        white: "branco",
        auburn: "castanho avermelhado",
        none: "N/A",
        "blue-gray": "azul acizentado",
        "auburn, white": "castanho avermelhado, branco",
        "auburn, grey": "castanho avermelhado, cinza",
        "brown, grey": "castanho, cinza",
        "red, blue": "vermelho e azul",
        "green, yellow": "verde e amarelo"
    }

    return cores[allColor.toLowerCase()] || allColor;
}

function covertHeight(height) {
    if (height === "unknown") {
        return "desconhecida"
    }

    return `${(height / 100).toFixed(2)} metros`;
}


function convertMass(mass) {

    if (mass === "unknown") {
        return "desconhecido"
    }

    return `${mass} kg`;
}

function convertBirthYear(birth_year) {
    if (birth_year === "unknown") {
        return "desconhecida";
    }

    return birth_year;
}

function convertPlanet(PlanetName) {
    if (PlanetName === "unknown") {
        return "desconhecido";
    }

    return PlanetName;
}