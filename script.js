const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-FT/events";

//Function to fetch party data
async function getPartyData() {
  try {
    const response = await fetch(API_URL);

    //Check if the response staus is OK (status code 200)
    if (!response.ok) {
      throw new Error(`Failed to fetch party data. Status: ${response.status}`);
    }
    //Parse the JSON data from the response
    const partyData = await response.json();

    //Log or use the party data as needed
    console.log("Party Data:", partyData);

    return partyData;
  } catch (error) {
    console.error("Error fetching party data:", error);
  }
}

// Call the function to fetch party dats and display it
async function displayPartyData() {
  const partyData = await getPartyData();
}

// Initial display of party data
displayPartyData();

// Event listener for form submission
addPartyForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const newParty = {
    name: partyName,
    date: partyDate,
    time: partyTime,
    location: partyLocation,
    description: partyDescription,
  };

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

    displayPartyData();

    addPartyForm.reset();
  } catch (error) {
    console.error("Error adding new party:", error);
  }
});
