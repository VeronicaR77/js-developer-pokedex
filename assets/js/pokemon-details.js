const params = new URLSearchParams(window.location.search);
const pokemonId = params.get("id");

async function getPokemon(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.json();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTypeColor(type) {
    const colors = {
        fire: '#F57D31',
        water: '#6493EB',
        grass: '#74CB48',
        poison: '#A43E9E',
        bug: '#A7B723',
        flying: '#A891EC',
        normal: '#AAA67F',
        // adicione mais tipos se quiser
    }
    return colors[type] || '#6AC3A8';
}

function renderTabs(pokemon) {
    const types = pokemon.types.map(t => capitalize(t.type.name)).join(', ');
    const abilities = pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ');

    return `
        <div class="tab-content" id="aboutTab">
            <p><strong>Species:</strong> ${capitalize(pokemon.name)}</p>
            <p><strong>Height:</strong> ${(pokemon.height / 10).toFixed(1)} m</p>
            <p><strong>Weight:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</p>
            <p><strong>Abilities:</strong> ${abilities}</p>
        </div>
    `
}

function renderPokemon(pokemon) {
    const container = document.getElementById("pokemon-card");
    const primaryType = pokemon.types[0].type.name;
    const bgColor = getTypeColor(primaryType);

    document.documentElement.style.setProperty('--bg-color', bgColor);

    container.innerHTML = `
        <h1>${capitalize(pokemon.name)} <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span></h1>

        <div class="types">
            ${pokemon.types.map(t => `<span class="type">${t.type.name}</span>`).join('')}
        </div>

        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />

        <div class="tabs">
            <div class="tab active" id="tabAbout">About</div>
            <div class="tab" id="tabStats">Stats</div>
            <div class="tab" id="tabMoves">Moves</div>
        </div>

        <div id="tabContent">
            ${renderTabs(pokemon)}
        </div>
    `;

    // Lógica para trocar tabs
    const aboutTab = document.getElementById('tabAbout');
    const statsTab = document.getElementById('tabStats');
    const movesTab = document.getElementById('tabMoves');
    const tabContent = document.getElementById('tabContent');

    aboutTab.addEventListener('click', () => {
        setActiveTab(aboutTab);
        tabContent.innerHTML = renderTabs(pokemon);
    });

    statsTab.addEventListener('click', () => {
        setActiveTab(statsTab);
        const statsHTML = pokemon.stats.map(stat => `
            <p><strong>${capitalize(stat.stat.name)}:</strong> ${stat.base_stat}</p>
        `).join('');
        tabContent.innerHTML = `<div class="tab-content">${statsHTML}</div>`;
    });

    movesTab.addEventListener('click', () => {
        setActiveTab(movesTab);
        const moves = pokemon.moves.slice(0, 10).map(m => capitalize(m.move.name)).join(', ');
        tabContent.innerHTML = `<div class="tab-content"><p><strong>Main Moves:</strong> ${moves}</p></div>`;
    });

    function setActiveTab(active) {
        [aboutTab, statsTab, movesTab].forEach(tab => tab.classList.remove('active'));
        active.classList.add('active');
    }
}

getPokemon(pokemonId).then(renderPokemon);
