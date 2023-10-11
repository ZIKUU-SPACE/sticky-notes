const container2 = document.querySelector('.container2');
const container3 = document.querySelector('.container3');
const checkIcon = document.querySelector('#check-icon');
const xIcon = document.querySelector('#x-icon');
const micIcon = document.querySelector('#mic-icon');
const createButton = document.querySelector('#create-button');

let i = 0;
let notes = [];
let selectedNote = null;
let isSharedNotes = false;

/*
    Voice related codes
*/
const synth = window.speechSynthesis;
let voices = [];
let defaultVoice = null;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    recognition.onresult = e => {
        const text = e.results[0][0].transcript;
        if (text) {
            document.querySelector('#note-text').value = text;
        }
    };
} else {
    micIcon.style.visibility = 'hidden';
}

function getVoices() {
    voices = synth.getVoices();
    if (voices.length > 0) {
        voices = voices.filter(voice => voice.lang === 'ja-JP');
        defaultVoice = voices.filter(voice => voice.default)[0];
    }
}

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = (syn, e) => {
        getVoices();
    }
}

function speak(str) {
    const speakText = new SpeechSynthesisUtterance(str);
    speakText.onend = e => {
        console.log('Done speaking');
    };
    speakText.onerror = e => {
        console.error('Something went wrong in speech');
    };
    speakText.rate = 1;
    speakText.pitch = 1;
    synth.speak(speakText);
}
/*
*/

createButton.addEventListener('click', (e) => {
    e.preventDefault();
    typeNote();
});

xIcon.addEventListener('click', (e) => {
    e.preventDefault();
    typeNote();
});

checkIcon.addEventListener('click', async () => {
    createNote();
});

micIcon.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
    }
});

function typeNote() {
    if (container3.style.display == 'none') {
        container3.style.display = 'block';
        createButton.style.visibility = 'hidden';
    } else {
        container3.style.display = 'none';
        createButton.style.visibility = 'visible';
    }
}

async function addNote(id, user, text) {
    const node0 = document.createElement('div');
    const node1 = document.createElement('h1');
    const node2 = document.createElement('span');
    const node3 = document.createElement('p');

    node0.classList.add('note');

    node2.style.visibility = 'hidden';
    node2.textContent = id;

    node3.style.visibility = 'hidden';
    node3.textContent = user;

    node1.innerHTML = text;
    node1.setAttribute(
        'style',
        'width:250px;height:200px;font-size:18px;padding:20px;margin-top:10px;overflow:hidden;box-shadow:0px 10px 24px 0px rgba(0,0,0,0.75);');
    node1.style.margin = margin();
    node1.style.transform = rotate();
    node1.style.background = color();
    node0.appendChild(node1);
    node0.appendChild(node2);
    node0.appendChild(node3);

    document.querySelector('.container2').insertAdjacentElement('beforeend', node0);

    node0.addEventListener('click', (e) => {
        const t = e.currentTarget;
        selectedNote = findNote(t.querySelector('span').textContent);
        const aside = document.querySelector('x-aside');
        aside.onOpen = asideOpenFunc;
        aside.okAction = saveNoteAction;
        aside.alternateAction = deleteNoteAction;
        aside.dispatchEvent(new CustomEvent('open'))
    });

    document.querySelector('#note-text').value = '';
}

async function createNote() {
    const noteText = document.querySelector('#note-text').value;
    const result = await CreateNote(noteText);
    notes.push(result);
    addNote(result._id, result.user.name, noteText);
}

function findNoteDiv(id) {
    const noteDivs = Array.from(document.querySelectorAll('.note'));
    const filtered = noteDivs.filter(note => note.querySelector('span').textContent === id);
    if (filtered.length > 0) {
        return filtered[0];
    }
    return null;
}

function findNote(id) {
    const filtered = notes.filter(note => note._id === id);
    if (filtered.length > 0) {
        return filtered[0];
    }
    return null;
}

function updateNoteDiv(note) {
    const div = findNoteDiv(note._id);
    if (div) {
        div.querySelector('h1').innerHTML = note.text;
    }
}

function margin() {
    const random_margin = ['-5px', '1px', '5px', '10px', '15px', '20px'];
    return random_margin[Math.floor(Math.random() * random_margin.length)];
}

function rotate() {
    const random_rotate = ['rotate(3deg)', 'rotate(1deg)', 'rotate(-1deg)', 'rotate(-3deg)', 'rotate(-5deg)', 'rotate(-10deg)'];
    return random_rotate[Math.floor(Math.random() * random_rotate.length)];
}

function color() {
    const random_color = ['#2cff3d', '#ff3de8', '#3dc2ff', '#04e022', '#bc83e6', '#ebb328'];
    if (i > random_color.length - 1) {
        i = 0;
    }
    return random_color[Math.floor(Math.random() * random_color.length)];
}

function initSidebar() {
    const sidebarItems = [
        { icon: 'fas fa-home', label: 'マイノート', action: loadMyNotes },
        { icon: 'fas fa-comment', label: '共有ノート', action: loadSharedNotes },
        { icon: 'fas fa-sign-out-alt', label: 'ログアウト', href: '/login' }
    ];
    const sidebar = document.querySelector('x-sidebar');
    sidebar.setItems(sidebarItems);
    sidebar.collapseOnSelect = false;
}

function voidAction() {
    console.log(this);
}

async function saveNoteAction() {
    const aside = this;
    const asideContent = aside.getContentElement();
    const text = asideContent.querySelector('textarea').value;
    const selectedUserItems = Array.from(asideContent.querySelectorAll('ul li input:checked'));
    const doCheck = asideContent.querySelector('#share').checked;
    let sharedUserIds = [];
    if (selectedUserItems.length > 0 && doCheck) {
        sharedUserIds = selectedUserItems.map(item => item.id);
    }
    try {
        UpdateNote(selectedNote._id, { text: text, sharedUserIds: sharedUserIds }).then(result => updateNoteDiv(result));
        aside.dispatchEvent(new CustomEvent('close'));
    } catch (e) {
        window.location = '/login';
    }
}

async function deleteNoteAction() {
    const aside = this;
    const noteId = selectedNote._id;
    const div = findNoteDiv(noteId);
    try {
        DeleteNote(noteId)
            .then(result => {
                div.remove();
                notes = notes.filter(note => note._id != noteId);
            })
            .catch(err => console.log(err));
        aside.dispatchEvent(new CustomEvent('close'));
    } catch (e) {
        window.location = '/login';
    }

}

async function asideOpenFunc() {
    const aside = document.querySelector('x-aside');
    let users = [];
    try {
        users = await GetUsers();
    } catch(e) {
        console.log(e);
        window.location = '/login';
        return;
    }
    const me = JSON.parse(localStorage.getItem("user"));
    let sharedCount = 0;
    users = users.filter(user => user._id !== me._id);
    let content = `
        <style>
        .note-text {
            font-size:16px;
            margin:0;
            width:284px;
            height:120px;
            padding:8px;
        }
        ul {
            margin: 0;
            list-style:none;
            font-size:16px;
            padding:8px;
            border: 1px solid var(--mui-light-gray);
            overflow-y: scroll;
            height: 160px;
        }
        </style>
        <textarea class='note-text' maxlength='200'>${selectedNote.text}</textarea>
        <p style="font-size:16px">共有ユーザー</p>
        <ul>`;
    users.forEach(user => {
        if (selectedNote.sharedUserIds.includes(user._id)) {
            sharedCount++;
            content += `<li><input type='checkbox' id='${user._id}' checked> ${user.name}</li>`;
        } else {
            content += `<li><input type='checkbox' id='${user._id}'> ${user.name}</li>`;
        }
    });
    content += '</ul>';
    content += `<input type="checkbox" id="share" ${sharedCount > 0 ? "checked" : ""}> <span style="font-size: 16px">共有する</span>`;
    aside.getButtons().forEach(button => {
        button.disabled = isSharedNotes ? true : false;
    });
    aside.setContentHTML(content);
    speak(selectedNote.text);
}

async function loadMyNotes() {
    document.querySelector('.container2').innerHTML = '';
    try {
        notes = await GetNotes();
        notes.forEach(note => addNote(note._id, note.user.name, note.text));
        isSharedNotes = false;
        createButton.style.visibility = 'visible';
    } catch (e) {
        window.location = '/login'
    }
}

async function loadSharedNotes() {
    document.querySelector('.container2').innerHTML = '';
    const user = JSON.parse(localStorage.getItem('user'));
    try {
        notes = await GetSharedNotes(user._id);
        notes.forEach(note => addNote(note._id, note.user.name, note.text));
        isSharedNotes = true;
        createButton.style.visibility = 'hidden';
    } catch (e) {
        window.location = '/login';
    }
}

function displayUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = document.querySelector('#username');
    username.innerHTML = user.name;
}


document.addEventListener('DOMContentLoaded', () => {

    initSidebar();

    displayUsername();

    loadMyNotes();

});
