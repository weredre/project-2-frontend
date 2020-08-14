///////////////////////
//SET URL SO IT USES DEPLOYED API URL IF IT EXISTS, LOCALHOST IF IT DOESN'T
const deployedURL = "https://project-2-back-end.herokuapp.com";
const URL = deployedURL ? deployedURL : "http://localhost:3000";

///////////////////////
//GLOBAL VARIABLES
//////////////////////
const $characterInput = $("#createinput");
const $npcInput = $("#npcinput");
const $strInput = $("#createSTRinput");
const $aglInput = $("#createAGLinput");
const $wilInput = $("#createWILinput");
const $logInput = $("#createLOGinput");
const $chaInput = $("#createCHAinput");
const $edgInput = $("#createEDGinput");
const $shadowAmpsSelect = $("#createselect");
// button with the property create
const $button = $("#createbutton");
const $nameEditInput = $("#editinput");
const $shadowAmpsEditSelect = $("#editselect");
// button with the property edit
const $editButton = $("#editbutton");
const $ul = $("ul");

//////////////////////////////
//FUNCTIONS
/////////////////////////////
//DEFINE FUNCTIONS HERE
npc = $("#npcinput").checked;

//GET PIZZA FROM API AND POPULATE SELECTOR INPUT
const getShadowsAmps = async () => {
  //API CALL USING ASYNC/AWAIT
  const response = await fetch(`${URL}/shadowAmps`);
  const data = await response.json();

  //POPULATE SELECTOR WITH RETRIEVED DATA
  // create an option tag for each pizza we collect
  data.forEach((shadowAmps) => {
      const $option = $('<option>').attr('value', shadowAmps._id).text(shadowAmps.name)
      $shadowAmpsSelect.append($option);

      const $option2 = $('<option>').attr('value', shadowAmps._id).text(shadowAmps.name)
      $shadowAmpsEditSelect.append($option2);
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
    const $li = $('<li>').text(`${character.name }, Strength: ${character.STR}, Agility: ${character.AGL}, Wisdom: ${character.WIL}, Logic: ${character.LOG}, Charisma: ${character.CHA}, Edge: ${character.EDG} `);
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
    "isNPC": npc,
    "STR": $strInput.val(),
    "AGL": $aglInput.val(),
    "WIL": $wilInput.val(),
    "LOG": $logInput.val(),
    "CHA": $chaInput.val(),
    "EDG": $edgInput.val(),
    "shadowAmps": $shadowAmpsSelect.val()
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
getShadowsAmps();
// initial getting of rats
getCharacters();
// add create function to button click event listener
$button.on('click', createCharater)
// add update function to edit submit button
$editButton.on('click', updatedCharacter)
