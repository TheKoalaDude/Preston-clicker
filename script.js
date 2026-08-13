// ==========================================
// PRESTON CLICKER - GLOBAL VERSION
// ==========================================

const SUPABASE_URL = "https://xngccbpchzyhebnirhfm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N9J4vcxM4SPUl2eHZJAvNg_QitFdwDs";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// ELEMENTS
// ==========================================

const counter = document.getElementById("counter");
const clickButton = document.getElementById("clickButton");

const perMinute = document.getElementById("perMinute");
const perHour = document.getElementById("perHour");

const goalText = document.getElementById("goal");
const remainingText = document.getElementById("remaining");
const progress = document.getElementById("progress");


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
// NUMBER FORMAT
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

    return Number(number).toLocaleString();
}


// ==========================================
// UPDATE GOAL
// ==========================================

function updateGoal(count) {

    const nextGoal = goals.find(goal => goal > count);

    if (!nextGoal) {

        goalText.textContent = "100M+";
        remainingText.textContent = "Milestones complete!";
        progress.style.width = "100%";

        return;
    }

    const index = goals.indexOf(nextGoal);

    const previousGoal =
        index > 0 ? goals[index - 1] : 0;

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
        Math.max(0, Math.min(100, percentage)) + "%";
}


// ==========================================
// UPDATE MAIN COUNTER
// ==========================================

function updateCounter(count) {

    counter.textContent =
        Number(count).toLocaleString();

    updateGoal(Number(count));
}


// ==========================================
// GLOBAL CLICK
// ==========================================

clickButton.addEventListener("click", async () => {

    clickButton.disabled = true;

    try {

        const { data, error } =
            await db.rpc("increment_global_clicks");

        if (error) {
            console.error("CLICK ERROR:", error);
            return;
        }

        if (data !== null) {
            updateCounter(Number(data));
        }

    } catch (error) {

        console.error("GLOBAL CLICK ERROR:", error);

    } finally {

        clickButton.disabled = false;

    }
});


// ==========================================
// LOAD GLOBAL COUNTER
// ==========================================

async function loadCounter() {

    const { data, error } =
        await db
            .from("global_counter")
            .select("clicks")
            .eq("id", 1)
            .single();

    if (error) {

        console.error("LOAD ERROR:", error);

        return;
    }

    updateCounter(Number(data.clicks));
}


// ==========================================
// GLOBAL REALTIME UPDATES
// ==========================================

db.channel("preston-global-counter")

    .on(
        "postgres_changes",
        {
            event: "UPDATE",
            schema: "public",
            table: "global_counter"
        },

        (payload) => {

            const newCount =
                Number(payload.new.clicks);

            updateCounter(newCount);

            recordClick();
        }
    )

    .subscribe((status) => {

        console.log(
            "Realtime status:",
            status
        );

    });


// ==========================================
// CLICKS PER MINUTE / HOUR
// ==========================================

let clickHistory = [];

function recordClick() {

    clickHistory.push(Date.now());

    cleanHistory();

    updateRates();
}


function cleanHistory() {

    const now = Date.now();

    clickHistory =
        clickHistory.filter(
            time =>
                now - time <= 3600000
        );
}


function updateRates() {

    cleanHistory();

    const now = Date.now();

    const minuteAgo =
        now - 60000;

    const hourAgo =
        now - 3600000;

    const minuteCount =
        clickHistory.filter(
            time => time >= minuteAgo
        ).length;

    const hourCount =
        clickHistory.filter(
            time => time >= hourAgo
        ).length;

    perMinute.textContent =
        minuteCount.toLocaleString();

    perHour.textContent =
        hourCount.toLocaleString();
}


setInterval(
    updateRates,
    1000
);


// ==========================================
// START
// ==========================================

loadCounter();

updateRates();

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script.js"></script>
