const hambutton = document.getElementById('menu');
const navigation = document.querySelector('navigation');

hambutton.addEventListener('click', () => {
    hambutton.classList.toggle('open');
    navigation.classList.toggle('open');
})

// footer
const year = document.querySelector("#currentyear");
const today = new Date();

year.innerHTML = `${today.getFullYear()}`;

document.getElementById("lastModified").innerHTML = document.lastModified;