// from data.js
let tableData = data;

function tabledraw(datasource) {
    datasource.forEach(ufoReport => {
        let row = ufoTable.append("tr");
        Object.entries(ufoReport).forEach(([key, value]) => {
            let cell = row.append("td");
            cell.text(value);
        });
    });
}

//Capitalize City, State and Country text
tableData.forEach(entry => {
    let newCity = entry.city.replace(/\b\w/g, c => c.toUpperCase());
    let newState = entry.state.toUpperCase();
    let newCountry = entry.country.toUpperCase();
    entry.city = newCity;
    entry.state = newState;
    entry.country = newCountry;
});
// Get a reference to the table
let ufoTable = d3.select("tbody")

tabledraw(tableData);

//Convert date entries to datetime for future sorting
let date_data = [];
tableData.forEach(entry => {
    let date_format = Date.parse(entry.datetime);
    date_data.push(date_format);
});


//Sort dates in order to get a max and min date that will be passed to the filter drop down
let sorted_date = date_data.sort((a, b) => b - a);
let max_date = new Date(sorted_date[0]).toISOString().slice(0,10);
let min_date = new Date(sorted_date[sorted_date.length-1]).toISOString().slice(0,10);


//Assign max and min dates to the filter drop down
document.getElementById("start_date").setAttribute("max", max_date);
document.getElementById("start_date").setAttribute("min", min_date);
document.getElementById("finish_date").setAttribute("max", max_date);
document.getElementById("finish_date").setAttribute("min", min_date);

//Assign filter button
let button = d3.select("#filter-btn");
let table = d3.select("tbody");

//Create action after button click
button.on("click", function() {
    let startDateValue = Date.parse(document.getElementById('start_date').value);
    let endDateValue = Date.parse(document.getElementById('finish_date').value);
    let firstfilter = tableData.filter(_d => Date.parse(_d.datetime) >= startDateValue);
    let finalfilter = firstfilter.filter(_d => Date.parse(_d.datetime) < (endDateValue + 25000000));
    console.log(min_date);
    console.log(startDateValue);

    //Check if valid filter request
    if (endDateValue < startDateValue) {
            alert("Start date has to be before the end date!");
            finalfilter = tableData;
    }  else if (isNaN(startDateValue)) {
        alert("A start date must be entered")
        finalfilter = tableData;
    }  else if (isNaN(endDateValue)) {
        finalfilter = firstfilter;
    };

    //Clear table
    table.html("");

    //Populate table with filtered data
    tabledraw(finalfilter);
});

let reset = d3.select("#reset-btn");
reset.on("click", function() {
    console.log("reset was clicked")
    document.getElementById("start_date").valueAsDate = null;
    document.getElementById("finish_date").valueAsDate = null;
    table.html("");
    tabledraw(tableData);
});

//Code to remove blue highlight around the utton which was last pressed (found on internt search https://medium.com/hackernoon/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2)
function handleFirstTab(e) {
    if (e.keyCode === 9) { // the "I am a keyboard user" key
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
    }
}

window.addEventListener('keydown', handleFirstTab);

