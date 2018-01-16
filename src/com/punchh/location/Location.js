export const getLocation = () => {
    return new Promise( (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            var longitude = position.coords.longitude ;
            var latitude = position.coords.latitude ;

            resolve({longitude, latitude});
          },
          (error) => {
              reject(JSON.stringify(error))
          }
        );
    })
}
