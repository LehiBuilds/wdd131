// 1. Create variables holding references to the elements
const list = document.querySelector('ul');
const input = document.querySelector('input');
const button = document.querySelector('button');

// 2. Create the function that runs on button click
button.addEventListener('click', (e) => {
    // Prevent the form from submitting and refreshing the page
    e.preventDefault();

    // Store the current value of the input
    const inputValue = input.value;

    // Clear the input field
    input.value = '';

    // Create three new elements
    const listItem = document.createElement('li');
    const listText = document.createElement('span');
    const listBtn = document.createElement('button');

    // Append the span and button as children of the list item
    listItem.appendChild(listText);
    listItem.appendChild(listBtn);

    // Set the text content of the span and the button
    listText.textContent = inputValue;
    listBtn.textContent = 'Delete';

    // Append the list item to the main list
    list.appendChild(listItem);

    // Attach an event handler to the Delete button to remove the <li>
    listBtn.addEventListener('click', () => {
        listItem.remove();
        // Note: If targeting older browsers, you've use: list.removeChild(listItem);
    });

    // Refocus the input element, ready for the next entry
    input.focus();
});