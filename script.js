const SUPABASE_URL = "https://xngccbpchzyhebnirhfm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N9J4vcxM4SPUl2eHZJAvNg_QitFdwDs";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const counter = document.getElementById("counter");
const clickButton = document.getElementById("clickButton");
const perMinute = document.getElementById("perMinute");
const perHour = document.getElementById("perHour");
const goalText = document.getElementById("goal");
const remainingText = document.getElementById("remaining");
const progress = document.getElementById("progress");

const goals = [
    100, 1000, 10000,
    20000, 30000, 40000, 50000,
    60000, 70000, 80000, 90000,
    100000, 200000, 300000, 400000,
    500000, 600000, 700000, 800000,
    900000, 1000000
];

for (let n = 2000000; n <= 100000000; n += 1000000) {
    goals.push(n);
}

function formatNumber(n) {

    if (n >= 1000000000)
        return (n / 1000000000).toFixed(1)
            .replace(".0", "") + "B";

    if (n >= 1000000)
        return (n / 1000000).toFixed(1)
            .replace(".0", "") + "M";

    if (n >= 1000)
        return (n / 1000).toFixed(1)
            .replace(".0", "") + "K";

    return n.toLocaleString();
}

function updateGoal(count) {

    const next = goals.find(g => g > count);

    if (!next) {
        goalText.textContent = "100M+";
        remainingText.textContent = "Milestones complete!";
        progress.style.width = "100%";
        return;
    }

    const index = goals.indexOf(next);
    const previous = index > 0 ? goals[index - 1] : 0;

    goalText.textContent = formatNumber(next);

    remainingText.textContent =
        formatNumber(next - count) + " remaining";

    const percent =
        ((count - previous) /
        (next - previous)) * 100;

    progress.style.width =
        Math.max(0, Math.min(100, percent)) + "%";
}

function updateCounter(count) {

    counter.textContent =
        Number(count).toLocaleString();

    updateGoal(Number(count));
}


// ==========================================
// FAST GLOBAL CLICK
// ==========================================

let clicking = false;

async function globalClick() {

    if (clicking) return;

    clicking = true;

    const { data, error } =
        await db.rpc("increment_global_clicks");

    clicking = false;

    if (error) {
        console.error("CLICK ERROR:", error);
        return;
    }

    if (data !== null) {
        updateCounter(Number(data));
        recordClick();
    }
}


// Mouse click
clickButton.addEventListener(
    "click",
    globalClick
);


// ENTER KEY
document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.repeat
        ) {

            event.preventDefault();

            globalClick();
        }
    }
);


// ==========================================
// LOAD GLOBAL COUNT
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

    updateCounter(
        Number(data.clicks)
    );
}


// ==========================================
// REALTIME
// ==========================================

db.channel("preston-global")

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
        }
    )

    .subscribe();


// ==========================================
// RATE COUNTER
// ==========================================

let clickTimes = [];

function recordClick() {

    clickTimes.push(Date.now());

    updateRates();
}

function updateRates() {

    const now = Date.now();

    clickTimes =
        clickTimes.filter(
            time =>
                now - time <= 3600000
        );

    const minute =
        clickTimes.filter(
            time =>
                now - time <= 60000
        ).length;

    const hour =
        clickTimes.length;

    perMinute.textContent =
        minute.toLocaleString();

    perHour.textContent =
        hour.toLocaleString();
}


// Update rates every second
setInterval(
    updateRates,
    10
);


// ==========================================
// START
// ==========================================

loadCounter();
updateRates();
