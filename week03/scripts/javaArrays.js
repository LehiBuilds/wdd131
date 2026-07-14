let scores = [100, 72, 83, 84, 88, 87];
let names = ['Nancy', 'Blessing', 'Jorge', 'Svetlana'];

let aScore = score[0];

scores[0] = 99;

for (let i = 0; i < scores.length; i++) {
    console.log(scores[i]);
}

scores.forEach(function (score) {
    console.log(score);
});

let numScores = scores.length;
// The numScores variable is assigned the value of 6

score.push(100);
// Adds a new element to the end of the array

scores.pop();
// Removes the last element from the array

scores.shift();
// Removes the first

scores.shift();
// Removes the first element from the array

scores.unshift(100);
// Adds a new element to the beginning of the array

scores.slice(2, 3);
// Returns a shallow copy from the start index up to, but not including, the end index

scores.splice(2, 1)
// Removes 1 element from the array starting at index 2

scores.join(', ');
// Transforms the array into a single string using a comma and space as the delimiter
