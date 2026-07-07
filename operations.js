const DAYS = 6;
const LIMIT = 30;
let studentReport = [11, 42, 33, 64, 29, 37, 44];

for (let i = 0; i < studentReport.length; i++) {
    if (studentReport[i] < LIMIT) {
        console.log(studentReport[i]);
    }
};

let i = 0;
while (studentReport.length) {
    if (studentReport[i] < LIMIT)
        console.log(studentReport[i]);
    i++;
}

studentReport.forEach((number) => {
    if (number < LIMIT)
        console.log(number);
});