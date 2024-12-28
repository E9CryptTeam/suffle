// 9 people
// let people = ["Person1", "Adit", "Afif", "Anjar", "Person2", "Doni", "Farid", "Fiki", "Hilmi"];

// 8 people
let people = ["Adit", "Afif", "Anjar", "Doni", "Farid", "Fiki", "Hilmi", "KOSONG"];

let shiftSolo = [];
let shiftDuo = [];

function addToSoloList() {
    const input = document.getElementById('soloInput');
    const name = input.value.trim();
    
    if (name && !shiftSolo.includes(name)) {
        shiftSolo.push(name);
        input.value = '';
        updateSoloDisplay();
    }
}

function addToDuoList() {
    const input = document.getElementById('duoInput'); 
    const name = input.value.trim();
    
    if (name && !shiftDuo.includes(name)) {
        shiftDuo.push(name);
        input.value = '';
        updateDuoDisplay();
    }
}

function updateSoloDisplay() {
    const soloList = document.getElementById('soloList');
    soloList.textContent = shiftSolo.join(', ');
}

function updateDuoDisplay() {
    const duoList = document.getElementById('duoList');
    duoList.textContent = shiftDuo.join(', ');
}

// Initialize displays
updateSoloDisplay();
updateDuoDisplay();

function clearShifts() {
    shiftSolo = [];
    shiftDuo = [];
    updateSoloDisplay();
    updateDuoDisplay();
}


function suffle(people) {
    function shuffleArray(array) {
        // Create a copy of the array excluding "KOSONG"
        const nonKosongElements = array.filter(item => item !== "KOSONG");
        
        // Shuffle only the non-KOSONG elements
        for (let i = nonKosongElements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nonKosongElements[i], nonKosongElements[j]] = [nonKosongElements[j], nonKosongElements[i]];
        }
        
        // Put the shuffled elements back into original array, keeping "KOSONG" in its original position
        let nonKosongIndex = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== "KOSONG") {
                array[i] = nonKosongElements[nonKosongIndex];
                nonKosongIndex++;
            }
        }
    }

    function isValidSchedule(shuffledPeople) {
        const soloOnlyPeople = shiftSolo;

        for (let i = 0; i < shuffledPeople.length; i += 3) {
            const shift = shuffledPeople.slice(i, i + 3);
            const hasKosong = shift.includes("KOSONG");
            const hasSoloPerson = soloOnlyPeople.some(person => shift.includes(person));
            
            // Return false if someone NOT from shiftSolo is in same shift as KOSONG
            if (hasKosong && !hasSoloPerson) {
                return false;
            }
        }
        return true;
    }

    let isValid = false;
    let attempts = 0;
    const maxAttempts = 10000;

    while (!isValid && attempts < maxAttempts) {
        shuffleArray(people);
        isValid = isValidSchedule(people);
        attempts++;
    }

    if (!isValid) {
        console.error("Could not find a valid schedule after " + maxAttempts + " attempts.");
    }

    const schedule = [
        {
            shifts: [
                [people[3], people[6]],
                [people[5], people[7]],
                [people[2], people[0]]
            ],
            off: [people[7], people[4], people[1]]
        },
        {
            shifts: [
                [people[4], people[3]],
                [people[1], people[5]],
                [people[7], people[2]]
            ],
            off: [people[6], people[7], people[0]]
        },
        {
            shifts: [
                [people[7], people[4]],
                [people[0], people[1]],
                [people[6], people[7]]
            ],
            off: [people[3], people[5], people[2]]
        },
        {
            shifts: [
                [people[5], people[7]],
                [people[2], people[0]],
                [people[3], people[6]]
            ],
            off: [people[4], people[1], people[7]]
        },
        {
            shifts: [
                [people[1], people[5]],
                [people[7], people[2]],
                [people[4], people[3]]
            ],
            off: [people[7], people[0], people[6]]
        },
        {
            shifts: [
                [people[0], people[1]],
                [people[6], people[7]],
                [people[7], people[4]]
            ],
            off: [people[5], people[2], people[3]]
        },
        {
            shifts: [
                [people[2], people[0]],
                [people[3], people[6]],
                [people[5], people[7]]
            ],
            off: [people[1], people[7], people[4]]
        },
        {
            shifts: [
                [people[7], people[2]],
                [people[4], people[3]],
                [people[1], people[5]]
            ],
            off: [people[0], people[6], people[7]]
        },
        {
            shifts: [
                [people[6], people[7]],
                [people[7], people[4]],
                [people[0], people[1]]
            ],
            off: [people[2], people[3], people[5]]
        }
    ];

    return schedule;
}



// Fungsi untuk menampilkan hasil ke frontend
document.addEventListener("DOMContentLoaded", () => {
    // Display going and notGoing arrays on frontend
    document.getElementById("soloList").textContent = shiftSolo.join(", ");
    // document.getElementById("duoList").textContent = shiftDuo.join(", ");
});

document.getElementById("processSchedule").addEventListener("click", () => {
    const newSchedule = suffle(people);
    const scheduleBody = document.getElementById("scheduleBody");
    scheduleBody.innerHTML = "";

    newSchedule.forEach((day, index) => {
        const row = document.createElement("tr");
        
        // Add day number
        const dayCell = document.createElement("td");
        dayCell.textContent = `Day ${index + 1}`;
        row.appendChild(dayCell);

        // Add shifts
        day.shifts.forEach(shift => {
            const shiftCell = document.createElement("td");
            shiftCell.innerHTML = shift.map(person => {
                if (person === "KOSONG") {
                    return `<span style="color: red;">${person}</span>`;
                }
                return person;
            }).join(" - ");
            row.appendChild(shiftCell);
        });

        // Add off day
        const offCell = document.createElement("td");
        offCell.innerHTML = day.off.map(person => {
            if (person === "KOSONG") {
                return `<span style="color: red;">${person}</span>`;
            }
            return person;
        }).join(" - ");
        row.appendChild(offCell);

        scheduleBody.appendChild(row);
    });
});