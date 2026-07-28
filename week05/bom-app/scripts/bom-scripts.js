const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');
let chaptersArray = getChapterList() || [];

chaptersArray.forEach(chapter => {
    displayList(chapter);
});

button.addEventListener('click', (e) => {
    e.preventDefault();

    const inputValue = input.value.trim();

    if (inputValue !== '') {
        displayList(inputValue);
        chaptersArray.push(inputValue);
        setChapterList();

        input.value = '';
        input.focus();
    }
});

function displayList(item) {
    const li = document.createElement('li');
    const deleteButton = document.createElement('button');

    li.textContent = item;
    deleteButton.textContent = '❌';

    deleteButton.classList.add('delete');
    li.append(deleteButton);
    list.append(li);

    deleteButton.addEventListener('click', () => {
        li.remove();
        deleteChapter(li.textContent);
        input.focus();
    })
}

function setChapterList() {
    localStorage.setItem('myFavBOMList', JSON.stringify(chaptersArray));
}

function getChapterList() {
    return JSON.parse(localStorage.getItem('myFavBOMList'));
}

function deleteChapter(item) {
    chaptersArray = chaptersArray.filter(item => item !== chapter);
    setChapterList();
}