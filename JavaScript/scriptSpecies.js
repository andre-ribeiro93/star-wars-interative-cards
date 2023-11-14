let currentPageUrl = 'https://swapi.dev/api/species/';


document.getElementById('loading-animation').style.visibility = "visible";

window.onload = async () => {
    try {
        await loadSpecies(currentPageUrl);
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

async function loadSpecies(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Lê o conteúdo presente no elemento 'main-content' e limpa os resultados anteriores devido a igualdade com a 'string vazia'.

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((species) => {
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/species/${species.url.replace(/\D/g, "")}.jpg')`;
            card.className = "cards";

            const speciesNameBG = document.createElement("div");
            speciesNameBG.className = "specie-name-bg";

            const speciesName = document.createElement("span");
            speciesName.className = "specie-name";
            speciesName.innerText = `${species.name}`;

            speciesNameBG.appendChild(speciesName);
            card.appendChild(speciesNameBG);

            card.onclick = async () => {
                const modal = document.getElementById('modal');
                modal.style.visibility = "visible";

                const spinnerCard = document.getElementById('spinner-card');

                    
                const modalContent = document.getElementById('modal-content');
                modalContent.innerHTML = '';
    
                const specieImage = document.createElement("div");
                specieImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/species/${species.url.replace(/\D/g, "")}.jpg')`;
                specieImage.className = "specie-image";
    
                const name = document.createElement("span");
                name.className = "specie-details";
                name.innerText = `Nome: ${species.name}`
    
                const classification = document.createElement("span");
                classification.className = "specie-details";
                classification.innerText = `Classe: ${covertClass(species.classification)}`
    
                const averageHeight = document.createElement("span");
                averageHeight.className = "specie-details";
                averageHeight.innerText = `Altura média: ${covertHeight(species.average_height)}`
    
                const skinColor = document.createElement("span");
                skinColor.className = "specie-details";
                skinColor.innerText = `Cor da pele: ${covertAllColor(species.skin_colors)}`
    
                const hairColor = document.createElement("span");
                hairColor.className = "specie-details";
                hairColor.innerText = `Cor do cabelo: ${covertAllColor(species.hair_colors)}`
    
                const eyeColor = document.createElement("span");
                eyeColor.className = "specie-details";
                eyeColor.innerText = `Cor dos olhos: ${covertAllColor(species.eye_colors)}`
    
                const lifespan = document.createElement("span");
                lifespan.className = "specie-details";
                lifespan.innerText = `Espectativa de vida: ${convertLifespan(species.average_lifespan)}`
    
                const language = document.createElement("span");
                language.className = "specie-details";
                language.innerText = `Idioma: ${species.language}`
    
                modalContent.appendChild(specieImage);
                modalContent.appendChild(name);
                modalContent.appendChild(classification);
                modalContent.appendChild(averageHeight);
                modalContent.appendChild(skinColor);
                modalContent.appendChild(hairColor);
                modalContent.appendChild(eyeColor);
                modalContent.appendChild(lifespan);
                modalContent.appendChild(language);
                    

                const planetLink = species.homeworld;

                spinnerCard.style.visibility = 'visible';
                    
                try {
                    if (planetLink) {

                        const response = await fetch(planetLink);
                        const planetName = await response.json();
        
                        const planet = document.createElement("span");
                        planet.className = "specie-details";
                        planet.innerText = `Planeta Natal: ${convertPlanet(planetName.name)}`;
                        
                        modalContent.appendChild(planet);
                    }
                    else {
                        
                        const noPlanet = document.createElement("span");
                        noPlanet.className = "specie-details";
                        noPlanet.innerText = 'Planeta Natal: não possui';

                        modalContent.appendChild(noPlanet);
                    }
    
                } catch (error) {
                    
                    console.log(`Falha no carregamento dos dados do planeta ${error}`);
                }

                spinnerCard.style.visibility = 'hidden';
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

        await loadSpecies(responseJson.next);

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

        await loadSpecies(responseJson.previous);

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

function loadPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <=9) {

        document.getElementById('loading-animation').style.visibility = "visible";

        const url = `https://swapi.dev/api/species/?page=${pageNumber}`;
        
        loadSpecies (url).then(() =>{
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

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.visibility = "hidden";

    const spinnerCard = document.getElementById('spinner-card');

    spinnerCard.style.visibility = 'hidden';
}

function covertClass (classification) {
    const classe = {
        mammal: "mamífero",
        mammals: "mamífero",
        sentient: "sensitivo",
        gastropod: "gastropode",
        reptile: "réptil",
        amphibian: "anfíbio",
        insectoid: "insectoide",
        reptilian: "reptiliano",
        unknown: "desconhecida",
    }

    return classe[classification.toLowerCase()] || classification;
}

function covertHeight(height) {
    if (height === "unknown") {
        return "desconhecida"
    }
    return `${(height / 100).toFixed(2)} metros`;
}

function covertAllColor(allColors) {
    const cores = {
        blue: "azul",
        black: "preto",
        brown: "castanho",
        gold: "dourado",
        gray: "cinza",
        grey: "cinza",
        green: "verde",
        hazel: "avelã",
        none: "N/A",
        orange: "laranja",
        pink: "rosa",
        red: "vermelho",
        unknown: "desconhecido",
        white: "branco",
        yellow: "amarelo",
        "black, brown": "preto, marrom",
        "black, silver": "preto e prata",
        "blonde, brown, black, red": "loiro, castanho, preto e vermelho",
        "blue, brown, orange, pink":"azul, marrom, laranja, rosa",
        "blue, green, grey": "azul, verde e cinza",
        "blue, green, red, yellow, brown, orange": "azul, verde, vermelho, amarelo, marrom, laranja",
        "blue, green, yellow, brown, golden, red": "azul, verde, amarelo, marrom, dourado, vermelho",
        "blue, indigo": "azul índigo",
        "brown, blue, green, hazel, grey, amber": "castanho, azul, verde, cinza, avelã, âmbar",
        "brown, white": "marrom, branco",
        "brown, green": "verde e marrom",
        "brown, green, yellow": "marrom, verdem, amarelo",
        "brown, grey": "castanho, cinza",
        "brown, orange": "marrom, laranja",
        "brown, orange, tan": "marrom, laranja",
        "brown, purple, grey, red": "marrom, roxo, cinza, vermelho",
        "caucasian, black, asian, hispanic": "amarelo, branco, preto, pardo, indígena",
        "dark": "parda",
        "green, blue": "verde, azul",
        "green, blue, brown, red": "verde, azul, marrom, vermelho",
        "green, brown": "verde e marrom",
        "green, brown, tan": "verde, marrom e pálida",
        "green, hazel": "verde, avelã",
        "green, yellow": "verde e amarelo", 
        "grey, blue": "cinza e azul",
        "grey, green": "cinza e verde",
        "grey, green, yellow": "cinza, verde, amarelo",
        "grey, white": "cinza e branco",
        "grey, yellow, purple": "cinza, amarelo, roxo",
        "orange, brown": "laranja, marrom",
        "orange, yellow, blue, green, pink, purple, tan": "laranja, amarelo, azul, verde, rosa, roxo, pálida",
        "pale": "pálida",
        "pale pink":"rosa pálido",
        "pale, brown, red, orange, yellow": "pálida, marrom, vermelho, laranja, amarelo",
        "peach, orange, red": "pêssego, laranja, vermelho",
        "red, blond, black, white": "vermelho, loiro, preto, branco",
        "red, blue": "vermelho e azul",
        "red, blue, brown, magenta": "vermelho, azul, marrom",
        "red, orange, yellow, green, blue, black": "vermelho, laranja, amarelo, verde, azul, preto",
        "red, pink": "vermelho e rosa",
        "red, white, orange, yellow, green, blue": "vermelho, branco, laranja, amarelo, verde e azul",
        "white, brown, black": "branco, marrom, preto",
        "yellow, blue": "amarelo, azul",
        "yellow, green": "amarelo, verde",
        "yellow, red": "amarelo, vermelho"
    }

    return cores[allColors.toLowerCase()] || allColors;
}

function convertLifespan(lifespan) {
        const life = {
            indefinite: "indeterminada",
            unknown: "desconhecida"
        }
        return life[lifespan.toLowerCase()] || `${lifespan} anos`;
}

function convertPlanet(PlanetName) {
    if (PlanetName === "unknown") {
        return "desconhecido";
    }
    return PlanetName;
}