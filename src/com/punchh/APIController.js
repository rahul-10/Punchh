
export const getFetch = (url) => {
    return new Promise( (resolve, reject) => {
        getMethod(url).then((response) => {
            setTimeout(() => null, 0);
            response.text().then((res) => {
                res = JSON.parse(res);
                console.log(res);
                if(response.status != 200){
                    console.log("error");
                    reject(res.message);
                }
                resolve(res);
            }).catch((err) => reject(err))
        }).catch( (err)=>{
            reject(err);
        })
    })
}

export const getMethod =  (url) => {
    return new Promise( (resolve, reject) => {
        fetch( url , {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'},
        }).then( (response) => {
            console.log(response);
            resolve(response);
        }).catch((err) => reject(err))
    })
}
