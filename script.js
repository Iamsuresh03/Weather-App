const userTab = document.querySelector("[data-user-weather]");
const searchTab = document.querySelector("[data-search-weather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-search-form]")
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const apiErrorContainer = document.querySelector("[api-error]");
const paraErrorContainer = document.querySelector("[p-error]");
let currentTab = userTab;
const API_KEY = "262b16ba3e11badfe4f88fbccfd3cda0"
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }

    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
}

userTab.addEventListener('click', ()=>{
    switchTab(userTab)
});

searchTab.addEventListener('click', ()=>{
    switchTab(searchTab)
});


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    } else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon} = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
        //API CALL
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const  data = await response.json();
            if(!data.sys){
                throw data;
            }
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            apiErrorContainer.classList.remove("active");
            paraErrorContainer.classList.remove("active");
            renderWeatherInfo(data);
        }
        catch(err) {
            loadingScreen.classList.remove("active");
            apiErrorContainer.classList.add("active"); 
            paraErrorContainer.classListadd("active"); 
        }

}



function renderWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-city-name]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-weather-desc]");
    const weatherIcon = document.querySelector("[data-weather-icon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-wind-speed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloud]");


    //fetching and updating in ui
    cityName.innerText =  weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}


function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation Feature Not supported!");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grant-access]");
grantAccessButton.addEventListener('click',getLocation);

let searchInput = document.querySelector("[data-search-input]")
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") return;
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if(!data.sys){
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        apiErrorContainer.classList.remove("active");
        paraErrorContainer.classList.remove("active");
        renderWeatherInfo(data);

    }
    catch(error) {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active"); 
        paraErrorContainer.classListadd("active");    
    }

}
