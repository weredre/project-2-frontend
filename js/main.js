///////////////////////
//SET URL SO IT USES DEPLOYED API URL IF IT EXISTS, LOCALHOST IF IT DOESN'T
const deployedURL = "http://localhost:3000";
const URL = deployedURL ? deployedURL : "http://localhost:3000";

///////////////////////
//GLOBAL VARIABLES
//////////////////////
const $characterInput = $("#createinput");
const $characterSelect = $("#createselect");
// button with the property create
const $button = $("#createbutton");
const $nameEditInput = $("#editinput");
const $characterEditSelect = $("#editselect");
// button with the property edit
const $editButton = $("#editbutton");
const $ul = $("ul");

//////////////////////////////
//FUNCTIONS
/////////////////////////////
//DEFINE FUNCTIONS HERE

//GET PIZZA FROM API AND POPULATE SELECTOR INPUT
const getCharactersNpc = async () => {
  //API CALL USING ASYNC/AWAIT
  const response = await fetch(`${URL}/characters`);
  const data = await response.json();

  //POPULATE SELECTOR WITH RETRIEVED DATA
  // create an option tag for each pizza we collect
  data.forEach((characters) => {
      const $option = $('<option>').attr('value', characters._id).text(characters.isNPC)
      characters.append($option);

      const $option2 = $('<option>').attr('value', characters._id).text(characters.isNPC)
      $characterEditSelect.append($option2);
  });
};

// GET ALL RATS
const getCharacters = async () => {
  // gets the rats
  const response = await fetch(`${URL}/character`);
  const data = await response.json();
  console.log(data);

  // populate DOM with rats
  data.forEach((character) => {
    // create li
    const $li = $('<li>').text(`${character.name}`);
    // add a delete button for each rat
    $li.append($("<button>").text("delete").attr("id", character._id).on("click", deleteCharacter));

    // add an edit button for each rat
    $li.append($('<button>').text("edit").on('click', (event) => {
      $nameEditInput.val(character.name);
      $characterEditSelect.val(character._id);
      $editButton.attr("id", character._id)
    }))
    $ul.append($li)
  })
}

// CREATE a rat

const createCharater = async () => {
  // create new rat object from form data
  const newCharacter = {
    "name": $characterInput.val(),
    // "": $pizzaSelect.val()
  }

  // send request to API to create rat
  const response = await fetch(`${URL}/character`, {
    method: 'POST',
    // let server know to parse body as JSON data
      // Postman makes headers for the user; next to "body"
    headers: {
      "Content-Type": "application/json"
    },
    // pass in a JS object and turn into a JSON string
    body: JSON.stringify(newCharacter)
  })
  const data = response.json();

  // update the DOM with new Rat
    //empty the <ul>
  $ul.empty();
  getCharacters()
}

// DELETE a rat
const deleteCharacter = async (event) => {
  //make request to delete rate
  // each rat that gets created will get a button
  const response = await fetch(`${URL}/character/${event.target.id}`, {
    method: "delete"
    // nothing else in function bc no response needed
  })
  //update the DOM
  $ul.empty();
  getCharacters()
};

//Update a Rat
const updatedCharacter = async (event) => {
  // Create Updated Rat Object
  const updatedCharacter = {
    name: $nameEditInput.val(),
    // pizza: $pizzaEditSelect.val()
  }
  // make our put request
  const response = await fetch(`${URL}/character/${event.target.id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedCharacter)
  })
  //update the DOM
  $ul.empty();
  getCharacters();

}

////////////////////////////////
// Main Application Logic
////////////////////////////////
// Start executing below

// Get the pizzas for selector
// getStats();
// initial getting of rats
getCharacters();
// add create function to button click event listener
$button.on('click', createCharater)
// add update function to edit submit button
$editButton.on('click', updatedCharacter)
