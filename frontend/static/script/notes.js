function GetNotes() {
    return new Promise((resolve, reject) => {
        fetch('/api/notes', {
            method: 'get',
            headers: { "accept": "application/json", "authorization": `bearer ${localStorage.getItem('token')}` }
        })
            .then(response => response.json())
            .then(json => {
                resolve(json.notes);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function CreateNote(text) {
    return new Promise((resolve, reject) => {
        fetch('/api/notes', {
            method: 'post',
            headers: { "content-type": "application/json", "accept": "application/json", "authorization": `bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ text })
        })
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

function DeleteNote(id) {
    return new Promise((resolve, reject) => {
        fetch(`/api/notes/${id}`, {
            method: 'delete',
            headers: { "content-type": "application/json", "accept": "application/json", "authorization": `bearer ${localStorage.getItem('token')}` },
        })
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

function UpdateNote(id, data) {
    return new Promise((resolve, reject) => {
        fetch(`/api/notes/${id}`, {
            method: 'put',
            headers: { "content-type": "application/json", "accept": "application/json", "authorization": `bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

function GetSharedNotes(id) {
    return new Promise((resolve, reject) => {
        fetch(`/api/notes/${id}`, {
            method: 'get',
            headers: { "accept": "application/json", "authorization": `bearer ${localStorage.getItem('token')}` }
        })
            .then(response => response.json())
            .then(json => {
                resolve(json.notes);
            })
            .catch(err => {
                reject(err);
            });
    });
}