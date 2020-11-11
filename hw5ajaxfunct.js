let requestURL = 'https://moodle.converse.edu/CSC335/GSP-Fire-Stations.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function(){
    const firestationsText = request.response;
    const firestations = JSON.parse(firestationsText);
    maketable(firestations)
    showFire(firestations)
}



function makeTable(fields, data) {
    // Make the table itself
    let table = document.createElement('table');

    // Add a header row to the table
    let row = document.createElement('tr');
    for (field of fields) {
        // Capitalize the field names
        displayTitle = field[0].toUpperCase() + field.substring(1).toLowerCase()
        row.appendChild(makeAndFillElt('th', displayTitle))
    }
    table.appendChild(row);

    // Add the actual station data
    for (station of data) {
        row = document.createElement('tr');
        for (field of fields) {
            row.appendChild(makeAndFillElt('td', station[field]));
        }
        table.appendChild(row);
    }

    return table;
}


function getFireStations() {
let fn = function(req) {
    // Get and empty the element where all this stuff goes
    let div = document.getElementById('fire-station-table');
    div.innerHTML = '';

    //Only needed for HW
    // Put a heading above the table
    let h3 = document.createElement('h3');
    h3.innerHTML = 'Table of fire stations'
    div.appendChild(h3);

    // Finally, add the table to the div
    div.appendChild(makeTable(stations.meta.fields, stations.data));

}}
