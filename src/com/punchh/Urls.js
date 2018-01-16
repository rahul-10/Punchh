
export const distane_url = (lat, long, destination) => {
    return("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+lat+","+long+"&destinations="+destination+"&mode=driving&key=");
}

export const distane_url_2 = (source, destination) => {
    return("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+source+"&destinations="+destination+"&mode=driving&key=");
}

export const weather_url = (place) => {
    return("http://api.openweathermap.org/data/2.5/weather?q="+ place+ "&appid=8e63a6ca1e393f321c2f4b348ead929d")
}
