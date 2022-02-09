//get user's location using geolocation
async function getUserCoords(){
    let pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude];
}
//use Leaflet API to create map

const map = {
    //Had to look at solution code for properties but got the buildMap method on my own
    coordinates: [],
    businesses: [],
    myMap: {},
    markers: {},
    buildMap(){
        alert('Loading map...Please allow us to know your location');
        this.myMap = L.map('mapspace', {
            center: this.coordinates,
            zoom: 13
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: '15'
        }).addTo(this.myMap);
        
        const marker = L.marker(this.coordinates);
        marker.addTo(this.myMap).bindPopup('<b>You are here</b>').openPopup();
    },
    //add user's location to map using marker property
    addMarkers(){
        for(let i=0; i<this.businesses.length; i++){
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long
            ]).bindPopup(`${this.businesses[i].name}`).addTo(this.myMap);
        }
    }
    //This was what I came up with before looking at the solution code
    /*addTileLayer: function(array){
        let business1 = [array[0].geocodes.main.latitude, array[0].geocodes.main.longitude];
        let business2 = [array[1].geocodes.main.latitude, array[1].geocodes.main.longitude];
        let business3 = [array[2].geocodes.main.latitude, array[2].geocodes.main.longitude];
        let business4 = [array[3].geocodes.main.latitude, array[3].geocodes.main.longitude];
        let business5 = [array[4].geocodes.main.latitude, array[4].geocodes.main.longitude];
        const businessLayer = L.layerGroup([business1, business2, business3, business4, business5]).addTo(map);
    }*/
    
}



//use Foursquare API to get locations of different businesses
async function getFoursquare(businessValue){
    const options = {
        method: 'GET', 
        headers: {
            Accept: 'application/json',
            //API key deleted for security reasons. However, it should work given a proper API.
            Authorization: 'ZZZZZZZZZZZZZZ'
        }
    }
    let lat = map.coordinates[0];
    let long = map.coordinates[1];
    let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?query=${businessValue}&ll=${lat}%2C${long}&limit=5`, options);
    let respObj = await response.json();
    let businesses = respObj.results;
    return businesses;
}

function processBusinesses(data){
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude
        };
        return location;
    })
    return businesses;
}

window.onload = async () => {
    const coords = await getUserCoords();
    map.coordinates = coords;
    map.buildMap();
}

//add event listeners to UI 
document.querySelector('#submit').addEventListener('click', async (event) => {
    event.preventDefault();
    let businessValue = document.querySelector('#business').value;
    let data = await getFoursquare(businessValue);
    map.businesses = processBusinesses(data);
    map.addMarkers();
})



