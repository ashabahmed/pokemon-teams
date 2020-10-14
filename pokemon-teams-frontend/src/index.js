const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers/`
const POKEMONS_URL = `${BASE_URL}/pokemons/`

//trainers only 6 pokemon, must release one if want to add another one
//allows user to hit add pokemon button to add pokemon and release button to release pokemon
//placed in main tag document.querySelector('main')
/* <div class="card" data-id="1"><p>Prince</p>
  <button data-trainer-id="1">Add Pokemon</button>
  <ul>
    <li>Jacey (Kakuna) <button class="release" data-pokemon-id="140">Release</button></li>
    <li>Zachariah (Ditto) <button class="release" data-pokemon-id="141">Release</button></li>
    <li>Mittie (Farfetch'd) <button class="release" data-pokemon-id="149">Release</button></li>
    <li>Rosetta (Eevee) <button class="release" data-pokemon-id="150">Release</button></li>
    <li>Rod (Beedrill) <button class="release" data-pokemon-id="151">Release</button></li>
  </ul>
</div> */



document.addEventListener('DOMContentLoaded', e => {
  
  const getTrainers = () => {
    fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(renderTrainers)
  }
  
  const renderTrainers = trainers => {
    // document.querySelector('main').innerHTML = ""
    for (const trainer of trainers) {
      renderTrainer(trainer)
    }
  }

  const renderTrainer = trainer => {
    // put trainer stuff on DOM
    // put trainer's pokemon stuff on DOM

    const trainerDiv = document.createElement('div')
    trainerDiv.classList.add('card')
    trainerDiv.dataset.id = trainer.id

    trainerDiv.innerHTML = `
    <p>${trainer.name}</p>
    <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    `

    const pokemonUl = document.createElement('ul')

    for(pokemon of trainer.pokemons){
      const pokeLi = createPokemonLi(pokemon)
      pokemonUl.append(pokeLi)
    }

    const createPokemonLi = pokemon => {
      const pokeLi = document.createElement('li')
      pokeLi.innerHTML = `
      ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
      `
      return pokeLi
    }

    trainerDiv.append(pokemonUl)
    document.querySelector('main').append(trainerDiv)
  }

  const clickHandler = () => {
    document.addEventListener('click', e => {
      if (e.target.textContent === 'Add Pokemon') {
        // if team size is 6 or greater do nothing
        // if team size is less than 6, post request
        const button = e.target 
        const teamSize = e.target.nextElementSibling.children.length
        const trainerId = button.dataset.trainerId

        if (teamsize < 6) {
          const options = {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "accept": "application/json"
            },
            body: JSON.stringify({trainer_id: trainerId})
          }

          fetch(POKEMONS_URL, options)
          .then(response => response.json())
          .then(pokemon => {
            const trainerDiv = document.querySelector(`[data-id="${pokemon.trainerId}"]`)
            const pokeLi = createPokemonLi(pokemon)
            trainerDiv.querySelector('ul').append(pokeLi)
            // getTrainers()
          })
        }
      } else if (e.target.matches('.release')){
        const button = e.target
        const pokemonId = button.dataset.pokemonId

        const options = {
          method: "DELETE"
        }

        fetch(POKEMONS_URL + pokemonId, options)
        .then(response => response.json())
        .then(pokemon => {
          const pokeLi = document.querySelector(`[data-pokemon-id="${pokemon.id}"]`).parentElement
          pokeLi.remove()
        })
      }
    })
  }


  clickHandler()
  getTrainers()
})


