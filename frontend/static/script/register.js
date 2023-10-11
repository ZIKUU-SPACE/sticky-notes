function Register(name, email, password) {
    return new Promise((resolve, reject) => {
        const data = {
            'name': name,
            'email': email,
            'password': password
        };
        const headers = { 
            'Content-Type': 'application/json',
            'accept': 'application/json'
        };
        
        fetch('/auth/register', {
            headers: headers,
            body: JSON.stringify(data),
            method: 'post'
        }).then(response => response.json())
        .then(json => {
            if(json.result === 'OK') {
                resolve();
            } else {
                reject(json.message);
            }
        })
        .catch(err => reject(err));
    });
}