const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

button.addEventListener('click', (e) => {
    e.preventDefault;

    const inputValue = input.value;
    input.value = '';

    const li = document.createElement('li');
    const deleteButton = document.createElement('button');

    li.textContent = inputValue;
    deleteButton.textContent = '❌';

    li.appendChild(deleteButton);
    list.appendChild(li);

    deleteButton.addEventListener('click', () => {
        li.remove();
    })
})
input.focus;
