/* =====================================
   VISITOR COUNTER (Unique Only)
===================================== */

const visitorElement = document.getElementById("visitorCount");

if (visitorElement) {

    const WORKSPACE = "game-aware-campaign";
    const COUNTER   = "game-aware-campaign-visits";
    const BASE_URL  = `https://api.counterapi.dev/v2/${WORKSPACE}/${COUNTER}`;
    const FLAG_KEY  = "hasVisited_gameaware";

    const alreadyVisited = localStorage.getItem(FLAG_KEY);

    if (!alreadyVisited) {

        // Orang baru → increment
        fetch(`${BASE_URL}/up`)
            .then(res => res.json())
            .then(data => {

                const count = data.data?.up_count || 0;

                visitorElement.textContent = `${count} Visits`;
                localStorage.setItem("visitorCount", count);
                localStorage.setItem(FLAG_KEY, "true"); // tandai sudah berkunjung
                updateDashboard();
            })
            .catch(err => {
                console.error("Counter Error:", err);
                visitorElement.textContent = "Visitor N/A";
            });

    } else {

        // Orang lama → hanya GET, tidak increment
        fetch(`${BASE_URL}`)
            .then(res => res.json())
            .then(data => {

                const count = data.data?.up_count || 0;

                visitorElement.textContent = `${count} Visits`;
                localStorage.setItem("visitorCount", count);
                updateDashboard();
            })
            .catch(err => {
                visitorElement.textContent = "Visitor N/A";
            });
    }
}

/* =====================================
   ANSWER SCALE
===================================== */

const answerScale = [
    { label: "Tidak Pernah", score: 1 },
    { label: "Jarang", score: 2 },
    { label: "Kadang", score: 3 },
    { label: "Sering", score: 4 },
    { label: "Sangat Sering", score: 5 }
];

/* =====================================
   QUESTION DATA
===================================== */

const preTestQuestions = [
    {
        question:
        "Saya mengetahui apa itu adiksi game online."
    },
    {
        question:
        "Saya memahami dampak psikologis bermain game berlebihan."
    },
    {
        question:
        "Saya mengetahui konsep digital well-being."
    },
    {
        question:
        "Saya memahami pentingnya mengatur waktu bermain."
    },
    {
        question:
        "Saya mengetahui tanda-tanda kecanduan game."
    }
];

const selfCheckQuestions = [
    {
        question:
        "Saya sering bermain lebih lama dari yang direncanakan."
    },
    {
        question:
        "Saya merasa gelisah ketika tidak bermain game."
    },
    {
        question:
        "Saya sulit berhenti bermain ketika sudah mulai."
    },
    {
        question:
        "Saya mengabaikan tugas karena bermain game."
    },
    {
        question:
        "Saya lebih memilih bermain game dibanding aktivitas sosial."
    }
];

const postTestQuestions = [
    {
        question:
        "Saya memahami cara mengurangi risiko adiksi game."
    },
    {
        question:
        "Saya memahami konsep self-regulation."
    },
    {
        question:
        "Saya mengetahui cara menerapkan digital well-being."
    },
    {
        question:
        "Saya memahami dampak jangka panjang adiksi game."
    },
    {
        question:
        "Saya siap membangun kebiasaan bermain yang sehat."
    }
];

/* =====================================
   QUIZ SYSTEM
===================================== */

const quizAnswers = {};

function generateQuiz(
    containerId,
    questions,
    storageKey,
    type
) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    let html = "";

    questions.forEach((q, index) => {

        html += `
        <div class="quiz-card">

            <div class="quiz-question">
                ${index + 1}. ${q.question}
            </div>

            <div class="quiz-options">

                ${answerScale.map(answer => `
                    <div
                        class="quiz-option"
                        onclick="
                        selectAnswer(
                            '${containerId}',
                            ${index},
                            ${answer.score},
                            this
                        )">

                        ${answer.label}

                    </div>
                `).join("")}

            </div>

        </div>
        `;
    });

    html += `
        <button
            class="btn-primary"
            style="margin-top:20px"
            onclick="
            submitQuiz(
                '${containerId}',
                '${storageKey}',
                '${type}'
            )">

            Kirim Jawaban

        </button>

        <div
            id="${containerId}-result"
            style="margin-top:20px">
        </div>
    `;

    container.innerHTML = html;
}

function selectAnswer(
    containerId,
    questionIndex,
    score,
    element
) {

    if (!quizAnswers[containerId]) {
        quizAnswers[containerId] = [];
    }

    quizAnswers[containerId][questionIndex] =
        score;

    const options =
        element.parentElement.querySelectorAll(
            ".quiz-option"
        );

    options.forEach(option => {
        option.classList.remove("selected");
    });

    element.classList.add("selected");
}

/* =====================================
   RISK METER
===================================== */

function updateRiskMeter(score) {

    const fill =
        document.getElementById("riskFill");

    const text =
        document.getElementById("riskText");

    if (!fill || !text) return;

    const percentage =
        (score / 25) * 100;

    fill.style.width =
        percentage + "%";

    if (score <= 10) {

        text.textContent =
            "LOW RISK";

        text.className =
            "risk-low";

    } else if (score <= 18) {

        text.textContent =
            "MEDIUM RISK";

        text.className =
            "risk-medium";

    } else {

        text.textContent =
            "HIGH RISK";

        text.className =
            "risk-high";
    }
}

/* =====================================
   SUBMIT QUIZ
===================================== */
function submitQuiz(
    containerId,
    storageKey,
    type
){

    const answers =
        quizAnswers[containerId] || [];

    const totalQuestions =
        document.querySelectorAll(
            `#${containerId} .quiz-question`
        ).length;

    const answeredQuestions =
        answers.filter(
            answer => answer !== undefined
        ).length;

    if(answeredQuestions < totalQuestions){

        alert(
            "Silakan jawab semua pertanyaan terlebih dahulu."
        );

        return;
    }

    let total = 0;

    answers.forEach(score => {
        total += score;
    });

    localStorage.setItem(
        storageKey,
        total
    );

    if(type === "selfcheck"){
        updateRiskMeter(total);
    }

    updateDashboard();
    updateCampaignProgress();
    showComparison();

    const result =
        document.getElementById(
            `${containerId}-result`
        );

    if(result){

        result.innerHTML = `
        <div class="quiz-card">
            <h3>Jawaban Berhasil Disimpan</h3>
            <p>Skor Anda: <b>${total}</b></p>
        </div>
        `;
    }
}

/* =====================================
   COMPARISON
===================================== */

function showComparison() {

    const pre =
        parseInt(
            localStorage.getItem(
                "preTestScore"
            )
        );

    const post =
        parseInt(
            localStorage.getItem(
                "postTestScore"
            )
        );

    if (isNaN(pre) || isNaN(post))
        return;

    const result =
        document.getElementById(
            "postTestContainer-result"
        );

    if (!result) return;

    let improvement = 0;

    if(pre > 0){

        improvement =
        Math.round(
            ((post - pre) / pre) * 100
        );
    }

    result.innerHTML = `
        <div class="quiz-card">

            <h3>
                Perbandingan Hasil
            </h3>

            <p>Pre-Test: <b>${pre}</b></p>

            <p>Post-Test: <b>${post}</b></p>

            <p>
                Peningkatan:
                <b>${improvement}%</b>
            </p>

        </div>
    `;
}

/* =====================================
   DASHBOARD
===================================== */

function updateDashboard() {

    const visitor =
        localStorage.getItem(
            "visitorCount"
        ) || 0;

    const visitorEl =
        document.getElementById(
            "dashboardVisitors"
        );

    if (visitorEl) {
        visitorEl.textContent =
            visitor;
    }
}

/* =====================================
   PROGRESS BAR
===================================== */
function updateCampaignProgress(){

    let completed = 0;

    if(localStorage.getItem("preTestScore") !== null)
        completed++;

    if(localStorage.getItem("selfcheckScore") !== null)
        completed++;

    if(localStorage.getItem("postTestScore") !== null)
        completed++;

    const percentage =
        Math.round(
            (completed / 3) * 100
        );

    const fill =
        document.getElementById(
            "campaignProgressFill"
        );

    const text =
        document.getElementById(
            "campaignProgressText"
        );

    if(fill){
        fill.style.width =
            percentage + "%";
    }

    if(text){
        text.textContent =
            percentage + "%";
    }
}

/* =====================================
   CALCULATOR
===================================== */

function calculateGamingTime() {

    const input =
        document.getElementById(
            "dailyHours"
        );

    if (!input) return;

    const hours =
        parseFloat(input.value);

    if (isNaN(hours)) {

        alert(
            "Masukkan jumlah jam bermain."
        );

        return;
    }

    const month = hours * 30;
    const year = hours * 365;
    const days = (year / 24).toFixed(1);

    const result =
        document.getElementById(
            "calculatorResult"
        );

    if (!result) return;

    result.innerHTML = `
        <div class="quiz-card">

            <h3>
                Hasil Perhitungan
            </h3>

            <p>
                Dalam 1 bulan:
                <b>${month} jam</b>
            </p>

            <p>
                Dalam 1 tahun:
                <b>${year} jam</b>
            </p>

            <p>
                Setara dengan:
                <b>${days} hari penuh</b>
            </p>

        </div>
    `;
}

/* =====================================
   INIT
===================================== */

document.addEventListener(
"DOMContentLoaded",
() => {

    if(
        document.getElementById(
        "preTestContainer"
        )
    ){
        generateQuiz(
            "preTestContainer",
            preTestQuestions,
            "preTestScore",
            "pretest"
        );
    }

    if(
        document.getElementById(
        "selfCheckContainer"
        )
    ){
        generateQuiz(
            "selfCheckContainer",
            selfCheckQuestions,
            "selfcheckScore",
            "selfcheck"
        );
    }

    if(
        document.getElementById(
        "postTestContainer"
        )
    ){
        generateQuiz(
            "postTestContainer",
            postTestQuestions,
            "postTestScore",
            "posttest"
        );
    }

    updateDashboard();
    updateCampaignProgress();
    showComparison();
});