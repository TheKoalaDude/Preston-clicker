// ==========================================
// PRESTON CLICKER - GLOBAL COUNTER
// ==========================================

// Supabase connection
const SUPABASE_URL = "https://xngccbpchzyhebnirhfm.supabase.co";

// Your PUBLIC/PUBLISHABLE key
const SUPABASE_KEY = "your-publishable-key";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// PAGE ELEMENTS
// ==========================================

const counter = document.getElementById("counter");
const goalText = document.getElementById("goal");
const remainingText = document.getElementById("remaining");
const progress = document.getElementById("progress");
const clickButton = document.getElementById("clickButton");


// ==========================================
// GOALS
// ==========================================

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


// ==========================================
// FORMAT NUMBERS
// ==========================================

function formatNumber(number) {

    if (number >= 1000000000) {
        return (number / 1000000000)
            .toFixed(1)
            .replace(".0", "") + "B";
    }

    if (number >= 1000000) {
        return (number / 1000000)
            .toFixed(1)
            .replace(".0", "") + "M";
    }

    if (number >= 1000) {
        return (number / 1000)
            .toFixed(1)
            .replace(".0", "") + "K";
    }

    return number.toLocaleString();
}


// ==========================================
// GOAL SYSTEM
// ==========================================

function updateGoal(count) {

    const nextGoal = goals.find(goal => goal > count);

    if (!nextGoal) {

        goalText.textContent = "100M+";

        remainingText.textContent =
            "Milestones complete!";

        progress.style.width = "100%";

        return;
    }

    const goalIndex = goals.indexOf(nextGoal);

    const previousGoal =
        goals[goalIndex - 1] || 0;

    const remaining =
        nextGoal - count;

    goalText.textContent =
        formatNumber(nextGoal);

    remainingText.textContent =
        `${formatNumber(remaining)} remaining`;

    const percentage =
        ((count - previousGoal) /
        (nextGoal - previousGoal)) * 100;

    progress.style.width =
        Math.max(
            0,
            Math.min(100, percentage)
        ) + "%";
}


// ==========================================
// UPDATE COUNTER
// ==========================================

let currentCount = 190000;

function updateCounter(count) {

    currentCount = count;

    counter.textContent =
        count.toLocaleString();

    updateGoal(count);
}


// ==========================================
// GLOBAL CLICK
// ==========================================

clickButton.addEventListener("click", async () => {

    clickButton.disabled = true;

    const { data, error } =
        await db.rpc("increment_global_clicks");

    if (error) {

        console.error(
            "Global click error:",
            error
        );

        clickButton.disabled = false;

        return;
    }

    if (data !== null) {
        updateCounter(Number(data));
    }

    clickButton.disabled = false;
});


// ==========================================
// GET CURRENT GLOBAL COUNT
// ==========================================

async function loadCounter() {

    const { data, error } =
        await db
            .from("global_counter")
            .select("clicks")
            .eq("id", 1)
            .single();

    if (error) {

        console.error(
            "Counter loading error:",
            error
        );

        return;
    }

    updateCounter(
        Number(data.clicks)
    );
}


// ==========================================
// REALTIME GLOBAL UPDATES
// ==========================================

db.channel("global-counter")
    .on(
        "postgres_changes",
        {
            event: "UPDATE",
            schema: "public",
            table: "global_counter"
        },
        payload => {

            const newCount =
                Number(payload.new.clicks);

            updateCounter(newCount);

            recordGlobalClick();
        }
    )
    .subscribe();


// ==========================================
// CLICKS / MINUTE + HOUR
// ==========================================

let recentGlobalClicks = [];

function recordGlobalClick() {

    const now = Date.now();

    recentGlobalClicks.push(now);

    cleanClickHistory();

    updateRateDisplay();
}

function cleanClickHistory() {

    const now = Date.now();

    recentGlobalClicks =
        recentGlobalClicks.filter(
            timestamp =>
                now - timestamp <= 3600000
        );
}

function updateRateDisplay() {

    cleanClickHistory();

    const now = Date.now();

    const oneMinuteAgo =
        now - 60000;

    const oneHourAgo =
        now - 3600000;

    const minuteClicks =
        recentGlobalClicks.filter(
            timestamp =>
                timestamp >= oneMinuteAgo
        ).length;

    const hourClicks =
        recentGlobalClicks.filter(
            timestamp =>
                timestamp >= oneHourAgo
        ).length;

    document.getElementById(
        "perMinute"
    ).textContent =
        minuteClicks.toLocaleString();

    document.getElementById(
        "perHour"
    ).textContent =
        hourClicks.toLocaleString();
}

setInterval(
    updateRateDisplay,
    1000
);


// ==========================================
// START
// ==========================================

loadCounter();
updateRateDisplay();
