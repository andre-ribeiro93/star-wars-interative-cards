let currentPageUrl = 'https://swapi.dev/api/planets/';

document.getElementById('loading-animation').style.visibility = "visible";

window.onload = async () => {
    try {
        await loadplanets(currentPageUrl);
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

async function loadplanets(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Lê o conteúdo presente no elemento 'main-content' e limpa os resultados anteriores devido a igualdade com a 'string vazia'.

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((planets) => {
            const card = document.createElement("div");
            const planetImageUrl = `https://starwars-visualguide.com/assets/img/planets/${planets.url.replace(/\D/g, "")}.jpg`;

            const backgroundImageUrl = new Image();

            backgroundImageUrl.onload = () => {
                card.style.backgroundImage = `url('${planetImageUrl}')`;
            }

            backgroundImageUrl.onerror = () => {
                card.style.backgroundImage = "url('../assets/planetNotFound.jpg')";
                
                const notFoundText = document.createElement("span");
                notFoundText.className = "not-found-text";
                notFoundText.innerText = "Imagem do planeta não catalogada";

                card.appendChild(notFoundText);
            }
            
            backgroundImageUrl.src = planetImageUrl;
            card.className = "cards";

            const planetsNameBG = document.createElement("div");
            planetsNameBG.className = "planet-name-bg";

            const planetsName = document.createElement("span");
            planetsName.className = "planet-name";
            planetsName.innerText = `${planets.name}`;

            planetsNameBG.appendChild(planetsName);
            card.appendChild(planetsNameBG);

            card.onclick = async () => {
                const modal = document.getElementById('modal');
                modal.style.visibility = "visible";

                function initialModal() {

                    const modalContent = document.getElementById('modal-content');
                    modalContent.innerHTML = '';
    
                    const planetImage = document.createElement("div");
                    const planetImageUrl = `https://starwars-visualguide.com/assets/img/planets/${planets.url.replace(/\D/g, "")}.jpg`;
    
                    const backgroundImageUrl = new Image();
        
                    backgroundImageUrl.onload = () => {
                        planetImage.style.backgroundImage = `url('${planetImageUrl}')`;
                    }
        
                    backgroundImageUrl.onerror = () => {
                        planetImage.style.backgroundImage = "url('../assets/planetNotFound.jpg')";
                    }
                    
                    backgroundImageUrl.src = planetImageUrl;
                    planetImage.className = "planet-image";
    
                    const name = document.createElement("span");
                    name.className = "planet-details";
                    name.innerText = `Nome: ${convertName(planets.name)}`
    
                    const rotation = document.createElement("span");
                    rotation.className = "planet-details";
                    rotation.innerText = `Período de rotação: ${convertRotation(planets.rotation_period)}`
    
                    const orbital = document.createElement("span");
                    orbital.className = "planet-details";
                    orbital.innerText = `Período orbital: ${convertOrbital(planets.orbital_period)}`
    
                    const diameter = document.createElement("span");
                    diameter.className = "planet-details";
                    diameter.innerText = `Diâmetro: ${convertDiameter(planets.diameter)}`
                    
                    const climate = document.createElement("span");
                    climate.className = "planet-details";
                    climate.innerText = `Clima: ${convertClimate(planets.climate)}`
    
                    const gravity = document.createElement("span");
                    gravity.className = "planet-details";
                    let convertText = `Gravidade: ${convertGravity(planets.gravity)}`
                    let finalGravity = convertText.replace("standard", "padrão");
                    gravity.innerText = finalGravity;
    
                    const terrain = document.createElement("span");
                    terrain.className = "planet-details";
                    terrain.innerText = `Terreno: ${convertTerrain(planets.terrain)}`
    
                    const surfaceWater = document.createElement("span");
                    surfaceWater.className = "planet-details";
                    surfaceWater.innerText = `Superfície de água: ${convertSurface(planets.surface_water)}`
    
                    const population = document.createElement("span");
                    population.className = "planet-details";
                    population.innerText = `População: ${convertPopulation(planets.population)}`
    
                    modalContent.appendChild(planetImage);
                    modalContent.appendChild(name);
                    modalContent.appendChild(rotation);
                    modalContent.appendChild(orbital);
                    modalContent.appendChild(diameter);
                    modalContent.appendChild(climate);
                    modalContent.appendChild(gravity);
                    modalContent.appendChild(terrain);
                    modalContent.appendChild(surfaceWater);
                    modalContent.appendChild(population);
                }

                initialModal();
                
                const returnButton = document.getElementById('return-button');
                returnButton.style.display = 'none';
                
                returnButton.addEventListener('click', async (e) => {
                    e.stopPropagation();

                    returnButton.style.display = 'none';
                    spinnerCard.style.visibility = 'hidden';

                    initialModal()
                });

                const charactersButton = document.getElementById('characters-button');
                charactersButton.style.display = 'block';

                const spinnerCard = document.getElementById('spinner-card');
                spinnerCard.style.display = 'none';

                charactersButton.addEventListener('click', async (e) => {
                    e.stopPropagation();

                    returnButton.style.display = 'block';
                
                    const characters = planets.residents;

                    const modalContent = document.getElementById('modal-content');
                    modalContent.innerHTML = '';
    
                    try {
                        const charactersContainer = document.createElement("div");
                        charactersContainer.className = "characters-container";
    
                        modalContent.appendChild(charactersContainer);

                        spinnerCard.style.display = 'block';
                        spinnerCard.style.visibility = 'visible';
    
                        for (const characterUrl of characters) {
                            const response = await fetch(characterUrl);
                            const character = await response.json();

                            spinnerCard.style.display = 'block'
    
                            const charactersContent = document.createElement("div");
                            charactersContent.className = "characters-content";
    
                            const charactersImage = document.createElement ("div");
                            charactersImage.className = "characters-image";
                            const charactersImageUrl = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
                            charactersImage.style.backgroundImage = charactersImageUrl
        
                            const charactersName = document.createElement ("span");
                            charactersName.className = "characters-name";
                            charactersName.innerText = character.name
    
                            charactersContent.appendChild(charactersImage);
                            charactersContent.appendChild(charactersName);
    
                            charactersContainer.appendChild(charactersContent);
                        }

                        spinnerCard.style.display = 'none'
    
                    }catch (error) {
                        console.log(`Falha no carregamento dos dados dos nativos ${error}`);
                    }
                });
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
        throw new Error('Erro no carregamento dos planetas');
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    document.getElementById('loading-animation').style.visibility = "visible";

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadplanets(responseJson.next);

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

        await loadplanets(responseJson.previous);

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

function loadPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <=9) {

        document.getElementById('loading-animation').style.visibility = "visible";

        const url = `https://swapi.dev/api/planets/?page=${pageNumber}`;
        
        loadplanets (url).then(() =>{
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

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.visibility = "hidden";

    const charactersButton = document.getElementById('characters-button');
    const returnButton = document.getElementById('return-button');
    const spinnerCard = document.getElementById('spinner-card');

    charactersButton.style.display = 'none';
    returnButton.style.display = 'none';
    spinnerCard.style.visibility = 'hidden';
}

function convertName(nameValue) {
    if (nameValue === "unknown") {
        return "Desconhecido";
    }
    return nameValue;
}

function convertRotation(rotationValue) {
    const horas = {
        "n/a": "desconhecido",
        unknown: "desconhecido",
        "0": "desconhecido"
    }    
    return horas[rotationValue.toLowerCase()] || `${rotationValue} horas`;
}

function convertOrbital(orbitalValue) {
    const dias = {
        "n/a": "desconhecido",
        unknown: "desconhecido",
        "0": "desconhecido"
    }    
    return dias[orbitalValue.toLowerCase()] || `${orbitalValue} dias`;
}

function convertDiameter(diameterValue) {
    const quilometros = {
        "n/a": "desconhecido",
        unknown: "desconhecido",
        "0": "desconhecido"
    }    
    return quilometros[diameterValue.toLowerCase()] || `${diameterValue} km`;
}

function convertGravity(gravityValue) {
    const unidade = {
        "n/a": "desconhecida",
        unknown: "desconhecida",
    }    
    return unidade[gravityValue.toLowerCase()] || gravityValue;
}

function convertPopulation(population) {
    if (population === "unknown") {
        return "desconhecida"
    }
    return population;
}

function convertSurface(water) {
    if (water === "unknown") {
        return "desconhecida"
    }
    return `${water}%`;
}

function convertClimate(climateValue) {
    const climate = {
        unknown: "desconhecido",
        arid: "árido",
        temperate: "temperado",
        "temperate, tropical": "temperado e tropical",
        frozen: "congelado",
        murky: "sombrio",
        "temperate, arid": "temperado e árido",
        "temperate, arid, windy": "temperado, árido e ventoso",
        hot: "quente",
        "artificial temperate ": "atmosfera artificial",
        frigid: "frio",
        "hot, humid": "quente e úmido",
        "temperate, moist": "temperado e úmido",
        polluted: "poluido",
        superheated: "superaquecido",
        "arid, temperate, tropical": "árido, temperado e tropical",
        "temperate, arid, subartic": "temperado, árido, subártico",
        "temperate, artic": "temperado, ártico",
        "tropical, temperate": "tropical e temperado",
        "arid, rocky, windy": "árido e ventoso"
    }
    return climate[climateValue.toLowerCase()] || climateValue;
}

function convertTerrain(terrainValue) {
    const biome = {
        unknown: "desconhecido",
        desert: "deserto",
        "grasslands, mountains": "pradarias e montanhas",
        "jungle, rainforests": "selva e florestas tropicais",
        "tundra, ice caves, mountain ranges": "tundra, cavernas de gelo e cadeias montanhosas",
        "swamp, jungles": "pântano e selva",
        "gas giant": "gigante gasoso",
        "forests, mountains, lakes": "florestas, montanhas e lagos",
        "grassy hills, swamps, forests, mountains": "colinas gramadas, pântanos, florestas e montanhas",
        "cityscape, mountains": "paisagem urbana e montanhas",
        ocean: "oceano",
        "rock, desert, mountain, barren": "rocha, deserto, montanha e estério",
        "scrublands, savanna, canyons, sinkholes": "matagais, savanas, cânions e sumidouros",
        "volcanoes, lava rivers, mountains, caves": "vulcões, rios de lava, montanhas e cavernas",
        "jungle, forests, lakes, rivers": "selva, florestas, lagos e rios",
        "airless asteroid": "asteróide sem ar",
        "glaciers, mountains, ice canyons": "geleiras, montanhas, desfiladeiros de gelo",
        "fungus forests": "floresta de fungos",
        "mountains, fields, forests, rock arches": "montanhas, campos, florestas e arcos rochosos",
        "caves, desert, mountains, volcanoes": "cavernas, deserto, montanhas e vulcões",
        grass: "pradaria",
        cityscape: "paisagem urbana",
        "plains, urban, hills, forests": "planícies, paisagem urbana, colinas e florestas",
        "jungles, oceans, urban, swamps": "selvas, oceanos, paisagem urbana e pântanos",
        "urban, oceans, swamps, bogs": "paisagem urbana, oceanos, pântanos e brejos",
        "oceans, savannas, mountains, grasslands": "oceanos, savanas, montanhas e pradarias",
        "rocky islands, oceans": "ilhas rochosas, oceanos",
        "plains, seas, mesas": "planícies, mares, planaltos",
        "mountains, seas, grasslands, deserts": "montanhas, mares, pradarias e desertos",
        "deserts, mountains": "desertos e montanhas",
        "oceans, reefs, islands": "oceanos, recifes e ilhas",
        "plains, forests": "planícies e florestas",
        "mountains, volcanoes, rocky deserts": "montanhas, vulcões e desertos rochosos",
        "swamps, lakes": "pântanos, lagos",
        "swamps, deserts, jungles, mountains": "pântanos, desertos, selvas e montanhas",
        "forests, deserts, savannas": "florestas, desertos e savanas",
        "mountains, valleys, deserts, tundra": "montanhas, vales, desertos e tundra",
        "urban, barren": "urbanizado e estério",
        "desert, tundra, rainforests, mountains": "deserto, tundra, florestas tropicais e montanhas",
        "barren, ash": "estéril e coberto de cinzas",
        "toxic cloudsea, plateaus, volcanoes": "mar de nuvens tóxicas, planaltos e vulcões",
        verdant: "pampa",
        "lakes, islands, swamps, seas": "lagos, ilhas, pântanos e mares",
        "rocky canyons, acid pools": "cânions rochosos e piscinas ácidas",
        rocky: "rochoso",
        "oceans, rainforests, plateaus": "oceanos, florestas tropicais e planaltos",
        deserts: "deserto",
        "rainforests, rivers, mountains": "florestas tropicais, rios, montanhas",
        "jungles, forests, deserts": "selvas, florestas e desertos",
        "oceans, glaciers": "oceanos e geleiras",
        "urban, vines": "paisagem urbana e vinhas",
        "plains, forests, hills, mountains": "planícies, florestas, colinas e montanhas",
        "cities, savannahs, seas, plains": "cidades, savanas, mares e planícies",
        "rainforests, cliffs, canyons, seas": "florestas tropicais, falésias, cânions e mares"
    }
    return biome [terrainValue.toLowerCase()] || terrainValue;
}