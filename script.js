let count = 190000;

const counter = document.getElementById("counter");
const goalText = document.getElementById("goal");
const remainingText = document.getElementById("remaining");
const progress = document.getElementById("progress");

const goals = [
    100,
    1000,
    10000,
    20000,
    30000,
    40000,
    50000,
    60000,
    70000,
    80000,
    90000,
    100000,
    200000,
    300000,
    400000,
    500000,
    600000,
    700000,
    800000,
    900000,
    1000000
];

for (let i = 2000000; i <= 100000000; i += 1000000) {
    goals.push(i);
}

function formatNumber(number) {
    if (number >= 1000000000)
        return (number / 1000000000).toFixed(1).replace(".0", "") + "B";

    if (number >= 1000000)
        return (number / 1000000).toFixed(1).replace(".0", "") + "M";

    if (number >= 1000)
        return (number / 1000).toFixed(1).replace(".0", "") + "K";

    return number.toLocaleString();
}

function updateGoal() {
    const nextGoal = goals.find(goal => goal > count);

    if (!nextGoal) {
        goalText.textContent = "100M+";
        remainingText.textContent = "Milestones complete!";
        progress.style.width = "100%";
        return;
    }

    const goalIndex = goals.indexOf(nextGoal);
    const previousGoal = goals[goalIndex - 1] || 0;

    const remaining = nextGoal - count;

    goalText.textContent = formatNumber(nextGoal);
    remainingText.textContent = `${formatNumber(remaining)} remaining`;

    const percentage =
        ((count - previousGoal) / (nextGoal - previousGoal)) * 100;

    progress.style.width =
        Math.max(0, Math.min(100, percentage)) + "%";
}

function updateCounter() {
    counter.textContent = count.toLocaleString();
    updateGoal();
}

document.getElementById("clickButton").addEventListener("click", () => {
    count++;
    updateCounter();
});

updateCounter();
