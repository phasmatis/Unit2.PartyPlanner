/*
     SETUP
1. References to different useful things
2. State
*/
document.addEventListener("DOMContentLoaded", function () {
  const API_URL =
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/room-5/events";
  let parties = []; //state

  const partyListElement = document.getElementById("partyList"); //reference to where we're putting party details
  const addPartyForm = document.getElementById("addPartyForm"); // reference to the party form

  /*
FETCH CALLS
/GET
/POST
/DELETE
*/

  async function getPartyData() {
    try {
      const response = await fetch(API_URL);
      const responseBody = await response.json();
      if (Array.isArray(responseBody.data)) {
        partyListElement.innerHTML = "";
        // Render parties on the page
        responseBody.data.forEach((party) => {
          const li = document.createElement("li");
          li.innerHTML = `${party.name} - ${party.date} - ${party.time} - ${party.location} - ${party.description} <button data-id="${party._id}" class="deleteButton">Delete</button>`;
          partyList.appendChild(li);
        });
      }

      return responseBody.data; // returns the event list
    } catch (err) {
      console.error(err);
    }
  }
  async function addParty(newParty) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParty),
      });

      if (!response.ok) {
        throw new Error(`Failed to add new party. Status: ${response.status}`);
      }

      // Refresh the party list after addition
      displayPartyData();
    } catch (error) {
      console.error("Error adding new party:", error);
    }
  }

  // async function deleteParty(partyId) {
  //   try {
  //     const response = await fetch(`${API_URL}/${partyId}`, {
  //       method: "DELETE",
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to delete party. Status: ${response.status}`);
  //     }

  //     // Refresh the party list after deletion
  //     displayPartyData();
  //   } catch (error) {
  //     console.error("Error deleting party:", error);
  //   }
  // }  -------- TRIED MOVING THIS DOWN --------

  /*
  EVENT LISTENERS (click submit etc.)
*/
  const form = document.getElementById("addPartyForm");

  addPartyForm.addEventListener("submit", async (event) => {
    event.preventDefault(); //STOPS PAGE REFRESH

    let partyId = document.getElementById("partyId").value;

    console.log("Trying to get partyId");
    console.log("partyId:", partyId);

    let name = document.getElementById("partyName").value;
    let date = document.getElementById("partyDate").value;
    let time = document.getElementById("partyTime").value;
    let location = document.getElementById("partyLocation").value;
    let description = document.getElementById("partyDescription").value;

    const newParty = {
      name: name,
      date: date,
      time: time,
      location: location,
      description: description,
    };
    const existingParty = parties.find((party) => party._id === partyId);

    if (!existingParty) {
      console.error(`Party with ID ${partyId} does not exist.`);
      return;
    }

    if (partyId !== null && partyId !== undefined) {
      const response = await fetch(`${API_URL}/${partyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParty), // body data type must match "Content-Type" header
      });
      if (!response.ok) {
        console.error("Failed to update party:", response.status);
      }
    } else {
      await addParty(newParty);
    }
    addPartyForm.reset();
  });

  partyListElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
      const partyId = event.target.dataset.id;

      const existingParty = parties.find((party) => party._id == partyId);

      if (!existingParty) {
        console.error(`Party with ID ${partyId} does not exist.`);
        return;
      }
      deleteParty(partyId);
    }
  });

  async function deleteParty(partyId) {
    try {
      const response = await fetch(`${API_URL}/${partyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete party. Status: ${response.status}`);
      }

      // Refresh the party list after deletion
      displayPartyData();
    } catch (error) {
      console.error("Error deleting party:", error);
    }
  }

  /*
RENDER FUNCTION

renderPartyList() - what we call when GET/POST/DELETE runs to re-render to the DOM
*/

  function renderPartyList() {
    partyListElement.innerHTML = "";

    parties.forEach((party) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
    <strong>${party.name}</strong>
    <br>Date: ${party.date}, Time: ${party.time}
    <br>Location: ${party.location}
    <br>Description: ${party.description}
    <button class='delete-button' data-party-id='${party._id}'>Delete</button>`;

      partyListElement.appendChild(listItem);
    });
  }

  async function displayPartyData() {
    parties = await getPartyData();
    // Render the party list on the DOM
    renderPartyList();
  }

  async function startApp() {
    // 1. Fetch parties
    await displayPartyData();
  }

  //initialize the app
  startApp();
});
