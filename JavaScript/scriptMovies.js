let currentPageUrl = 'https://swapi.dev/api/films/';

document.getElementById('loading-animation').style.visibility = "visible";

let initialModalContent = null

window.onload = async () => {
    try {
        await loadfilms(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert ('Erro no carregamento dos cards');
    }

    document.getElementById('loading-animation').style.visibility = "hidden";
};

async function loadfilms(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Lê o conteúdo presente no elemento 'main-content' e limpa os resultados anteriores devido a igualdade com a 'string vazia'.

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((movie) => {
            const card = document.createElement("div");
            card.className = "cards";

            const poster = document.createElement("div");
            poster.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/films/${movie.url.replace(/\D/g, "")}.jpg')`;
            poster.className = "poster";

            const movieNameBG = document.createElement("div");
            movieNameBG.className = "movie-name-bg";

            const movieName = document.createElement("span");
            movieName.className = "movie-name";
            movieName.innerText = convertTitle(movie.title);

            movieNameBG.appendChild(movieName);
            card.appendChild(poster);
            card.appendChild(movieNameBG);

            card.onclick = async () => {

                const modal = document.getElementById('modal');
                modal.style.visibility = "visible";

                function initialModal() {

                    const modalContent = document.getElementById('modal-content');
                    modalContent.innerHTML = '';
    
                    const name = document.createElement("span");
                    name.className = "movie-name-modal";
                    name.innerText = `${convertTitle(movie.title)}`
    
                    const movieImage = document.createElement("div");
                    movieImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/films/${movie.url.replace(/\D/g, "")}.jpg')`;
                    movieImage.className = "movie-image";
    
                    const releaseDate = document.createElement("span");
                    releaseDate.className = "movie-details";
                    releaseDate.innerText = `Diretor: ${reverseDate(movie.release_date)}`
    
                    const director = document.createElement("span");
                    director.className = "movie-details";
                    director.innerText = `Diretor: ${movie.director}`
    
                    const producer = document.createElement("span");
                    producer.className = "movie-details";
                    producer.innerText = `Produtor: ${movie.producer}`
    
                    const synopsis = document.createElement("span");
                    synopsis.className = "synopsis";
                    synopsis.innerText = `Prólogo: ${convertTitle(movie.opening_crawl)}`
    
                    modalContent.appendChild(name);
                    modalContent.appendChild(movieImage);
                    modalContent.appendChild(releaseDate);
                    modalContent.appendChild(director);
                    modalContent.appendChild(producer);
                    modalContent.appendChild(synopsis);
                }

                initialModal()

                const returnButton = document.getElementById('return-button');
                returnButton.style.display = 'none';
                
                returnButton.addEventListener('click', async (e) => {
                    e.stopPropagation();

                    returnButton.style.display = 'none';
                    spinnerCard.style.visibility = 'hidden';
                    previousButton.style.visibility = 'hidden';
                    nextButton.style.visibility = 'hidden';

                    initialModal()
                });

                const charactersButton = document.getElementById('characters-button');
                charactersButton.style.display = 'block';

                const spinnerCard = document.getElementById('spinner-card');
                spinnerCard.style.display = 'none';
                
                const previousButton = document.getElementById('previous-button');
                const nextButton = document.getElementById('next-button');
                
                charactersButton.addEventListener('click', async (e) => {
                    e.stopPropagation();

                    returnButton.style.display = 'block';

                    const characters = movie.characters;
                    
                    const modalContent = document.getElementById('modal-content');
                    modalContent.innerHTML = '';

                    let currentPage = 1;
                    const itensPerPage = 12;
                    const totalPages = Math.ceil(characters.length / itensPerPage);
                    
                    try {

                        const charactersContainer = document.createElement("div");
                        charactersContainer.className = "elements-container";
                        modalContent.appendChild(charactersContainer);

                        async function loadAndDisplayCharacters(page) {
                            charactersContainer.innerHTML = '';

                            spinnerCard.style.display = 'block';
                            spinnerCard.style.visibility = 'visible'

                            previousButton.style.display = 'none';
                            nextButton.style.display = 'none';
                            previousButton.style.visibility = 'visible';
                            nextButton.style.visibility = 'visible';

                            const startIndex = (page - 1) * itensPerPage;
                            const endIndex = page * itensPerPage;
                            const charactersPerPage = characters.slice(startIndex, endIndex);

                            async function loadCharacters() {
                                for (const characterUrl of charactersPerPage) {
                                    const response = await fetch(characterUrl);
                                    const character = await response.json();

                                    spinnerCard.style.display = 'block';
        
                                    const charactersContent = document.createElement("div");
                                    charactersContent.className = "element-content";
            
                                    const characterImage = document.createElement ("div");
                                    characterImage.className = "element-image";
                                    const characterImageUrl = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
                                    characterImage.style.backgroundImage = characterImageUrl
                
                                    const characterName = document.createElement ("span");
                                    characterName.className = "element-name";
                                    characterName.innerText = character.name

                                    previousButton.style.display = 'none';
                                    nextButton.style.display = 'none';
            
                                    charactersContent.appendChild(characterImage);
                                    charactersContent.appendChild(characterName);
            
                                    charactersContainer.appendChild(charactersContent);
                                }

                            } await loadCharacters();

                            currentPage = page;

                            spinnerCard.style.display = 'none'

                            if (currentPage <= 1) {
                                previousButton.style.display = 'none';
                            } else {
                                previousButton.style.display = 'block';
                            }

                            if (currentPage >= totalPages) {
                                nextButton.style.display = 'none';
                            } else {
                                nextButton.style.display = 'block';
                            }

                            spinnerCard.style.display = 'hidden'
                        }

                        previousButton.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            currentPage--;
                            
                            await loadAndDisplayCharacters(currentPage);
                        });

                        nextButton.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            currentPage++;
                            
                            await loadAndDisplayCharacters(currentPage);
                        });

                        loadAndDisplayCharacters(currentPage);
    
                    } catch (error) {
                        console.log(`Falha no carregamento dos dados dos personagens ${error}`);
                    }
                });

                const planetsButton = document.getElementById('planets-button');
                planetsButton.style.display = 'block';

                planetsButton.addEventListener('click', async (e) => {
                    e.stopPropagation();

                    returnButton.style.display = 'block';
                    previousButton.style.visibility = 'hidden';
                    nextButton.style.visibility = 'hidden';

                    const planets = movie.planets;

                    const modalContent = document.getElementById('modal-content');
                    modalContent.innerHTML = '';

                    try {
                        const planetsContainer = document.createElement("div");
                        planetsContainer.className = "elements-container";
                        modalContent.appendChild(planetsContainer);

                        spinnerCard.style.display = 'block'
                        spinnerCard.style.visibility = 'visible'
                    
                        for (const planetUrl of planets) {
                            const response = await fetch(planetUrl);
                            const planet = await response.json();

                            spinnerCard.style.display = 'block'
                    
                            const planetsContent = document.createElement("div");
                            planetsContent.className = "element-content";
                    
                            const planetImage = document.createElement("div");
                            const planetImageUrl = `https://starwars-visualguide.com/assets/img/planets/${planet.url.replace(/\D/g, "")}.jpg`;

                            const backgroundImageUrl = new Image();
                
                            backgroundImageUrl.onload = () => {
                                planetImage.style.backgroundImage = `url('${planetImageUrl}')`;
                            }
                
                            backgroundImageUrl.onerror = () => {
                                planetImage.style.backgroundImage = "url('../assets/planetNotFound.jpg')";
                            }
                            
                            backgroundImageUrl.src = planetImageUrl;
                            planetImage.className = "element-image";
                    
                            const planetName = document.createElement ("span");
                            planetName.className = "element-name";
                            planetName.innerText = planet.name                    
                    
                            planetsContent.appendChild(planetImage);
                            planetsContent.appendChild(planetName);
                    
                            planetsContainer.appendChild(planetsContent);
                        }

                        spinnerCard.style.display = 'none'
                    
                    } catch (error) {
                        console.log(`Falha no carregamento dos dados dos planetas ${error}`);
                    }
                });        
            }

            mainContent.appendChild(card);
        });

    } catch (error) {
        throw new Error('Erro no carregamento dos personagens');
    }
}

function hideModal() {
     const modal = document.getElementById('modal');
     modal.style.visibility = "hidden";

     const charactersButton = document.getElementById('characters-button');
     const planetsButton = document.getElementById('planets-button');
     const returnButton = document.getElementById('return-button');
     const spinnerCard = document.getElementById('spinner-card');
     const previousButton = document.getElementById('previous-button');
     const nextButton = document.getElementById('next-button');
    
     charactersButton.style.display = 'none';
     planetsButton.style.display = 'none';
     returnButton.style.display = 'none';
     spinnerCard.style.visibility = 'hidden';
     previousButton.style.visibility = 'hidden';
     nextButton.style.visibility = 'hidden';

}

function convertTitle(allTitle) {
    const titles = {
        "A New Hope": "Episódio IV: Uma Nova Esperança",
        "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....": "É um período de guerra civil. Naves espaciais rebeldes, atacando a partir de uma base oculta, conquistaram sua primeira vitória contra o maligno Império Galáctico. Durante a batalha, espiões rebeldes conseguiram roubar planos secretos da arma suprema do Império, a ESTRELA DA MORTE, uma estação espacial blindada com energia suficiente para destruir um planeta inteiro. Perseguida pelos sinistros agentes do Império, a Princesa Leia corre para casa a bordo de sua nave, portando os planos roubados que podem salvar seu povo e restaurar a liberdade da galáxia...",

        "The Empire Strikes Back": "Episódio V: O Empério Contra-ataca",
        "It is a dark time for the\r\nRebellion. Although the Death\r\nStar has been destroyed,\r\nImperial troops have driven the\r\nRebel forces from their hidden\r\nbase and pursued them across\r\nthe galaxy.\r\n\r\nEvading the dreaded Imperial\r\nStarfleet, a group of freedom\r\nfighters led by Luke Skywalker\r\nhas established a new secret\r\nbase on the remote ice world\r\nof Hoth.\r\n\r\nThe evil lord Darth Vader,\r\nobsessed with finding young\r\nSkywalker, has dispatched\r\nthousands of remote probes into\r\nthe far reaches of space....": "É um momento sombrio para a Rebelião. Embora a Estrela da Morte tenha sido destruída, As tropas imperiais expulsaram as forças rebeldes de sua base oculta e as perseguem pela galáxia. Evitando a temida Frota Estelar Imperial, um grupo de combatentes libertários, liderados por Luke Skywalker, estabeleceram uma nova base secreta em Hoth, em remoto planeta gelado. O perverso lord Darth Vader, obcecado em encontrar o jovem Skywalker, despachou milhares de sondas remotas para os confins do espaço...",

        "Return of the Jedi": "Episódio VI: O Retorno de Jedi",
        "Luke Skywalker has returned to\r\nhis home planet of Tatooine in\r\nan attempt to rescue his\r\nfriend Han Solo from the\r\nclutches of the vile gangster\r\nJabba the Hutt.\r\n\r\nLittle does Luke know that the\r\nGALACTIC EMPIRE has secretly\r\nbegun construction on a new\r\narmored space station even\r\nmore powerful than the first\r\ndreaded Death Star.\r\n\r\nWhen completed, this ultimate\r\nweapon will spell certain doom\r\nfor the small band of rebels\r\nstruggling to restore freedom\r\nto the galaxy...": "Luke Skywalker retornou ao seu planeta natal, Tatooine, na tentativa de resgatar seu amigo Han Solo das garras do vil gangster Jabba the Hutt. Luke mal sabe que o IMPÉRIO GALÁCTICO começou secretamente a construção de uma nova estação espacial blindada ainda mais poderosa do que a primeira Estrela da Morte. Quando concluída, esta arma definitiva será a ruína certa para o pequeno grupo de rebeldes que segue lutando para restaurar a liberdade na galáxia...",

        "The Phantom Menace": "Episódio I: A Ameaça Fantasma",
        "Turmoil has engulfed the\r\nGalactic Republic. The taxation\r\nof trade routes to outlying star\r\nsystems is in dispute.\r\n\r\nHoping to resolve the matter\r\nwith a blockade of deadly\r\nbattleships, the greedy Trade\r\nFederation has stopped all\r\nshipping to the small planet\r\nof Naboo.\r\n\r\nWhile the Congress of the\r\nRepublic endlessly debates\r\nthis alarming chain of events,\r\nthe Supreme Chancellor has\r\nsecretly dispatched two Jedi\r\nKnights, the guardians of\r\npeace and justice in the\r\ngalaxy, to settle the conflict....": "A turbulência sufoca a República Galáctica. A tributação das rotas comerciais para diferentes sistemas estelares está em disputa. Esperando resolver o assunto com um bloqueio de mortais naves de guerra, a gananciosa Federação de Comércio interrompe todos os transportes para o pequeno planeta Naboo, enquanto o Congresso da República debate interminavelmente. Nesta alarmante cadeia de eventos, o Chanceler Supremo envia secretamente dois Cavaleiros Jedi, os guardiões da paz e da justiça na galáxia, para resolver o conflito...",

        "Attack of the Clones": "Episódio II: Ataque dos Clones",
        "There is unrest in the Galactic\r\nSenate. Several thousand solar\r\nsystems have declared their\r\nintentions to leave the Republic.\r\n\r\nThis separatist movement,\r\nunder the leadership of the\r\nmysterious Count Dooku, has\r\nmade it difficult for the limited\r\nnumber of Jedi Knights to maintain \r\npeace and order in the galaxy.\r\n\r\nSenator Amidala, the former\r\nQueen of Naboo, is returning\r\nto the Galactic Senate to vote\r\non the critical issue of creating\r\nan ARMY OF THE REPUBLIC\r\nto assist the overwhelmed\r\nJedi....": "Há agitação no Senado Galáctico. Milhares de sistemas solares declararam suas intenções de deixar a República. Este movimento separatista, sob a liderança do misterioso Conde Dookan, dificultou a preservação da paz e a ordem na galáxia, considerando-se o número limitado de Cavaleiros Jedi. A Senadora Amidala, ex-rainha de Naboo, está retornando ao Senado Galáctico para votar na crítica questão da criação de um EXÉRCITO DA REPÚBLICA para ajudar os oprimidos Jedi...",
        
        "Revenge of the Sith": "Episódio III: A Vingança dos Sith",
        "War! The Republic is crumbling\r\nunder attacks by the ruthless\r\nSith Lord, Count Dooku.\r\nThere are heroes on both sides.\r\nEvil is everywhere.\r\n\r\nIn a stunning move, the\r\nfiendish droid leader, General\r\nGrievous, has swept into the\r\nRepublic capital and kidnapped\r\nChancellor Palpatine, leader of\r\nthe Galactic Senate.\r\n\r\nAs the Separatist Droid Army\r\nattempts to flee the besieged\r\ncapital with their valuable\r\nhostage, two Jedi Knights lead a\r\ndesperate mission to rescue the\r\ncaptive Chancellor....": "Guerra! A República está desmoronando sob os ataques do cruel Lord Sith, Conde Dookan. Existem heróis em ambos os lados. O mal está em toda parte. Com um impressionante movimento, o diabólico líder do contigente droide, General Grievous, invade a capital da República e sequestra o Chanceler Palpatine, líder do Senado Galáctico. Enquanto o Exército Droide Separatista tenta fugir da capital sitiada com seu valioso refém, dois Cavaleiros Jedi lideram uma missão desesperada para resgatar o Chanceler cativo..."
    }

    return titles[allTitle] || allTitle;
}

function reverseDate(date) {
    const partes = date.split('-').reverse();
    return partes.join('-');
}

function convertPlanet(PlanetName) {
    if (PlanetName === "unknown") {
        return "desconhecido";
    }

    return PlanetName;
}