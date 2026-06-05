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

        fetch(`${BASE_URL}/up`)
            .then(res => res.json())
            .then(data => {
                const count = data.data?.up_count || 0;
                visitorElement.textContent = `${count} Visits`;
                localStorage.setItem("visitorCount", count);
                localStorage.setItem(FLAG_KEY, "true");
                updateDashboard();
            })
            .catch(err => {
                console.error("Counter Error:", err);
                visitorElement.textContent = "Visitor N/A";
            });

    } else {

        fetch(BASE_URL)
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

/* Pre-Test Question */
const preTestQuestions = [

{
    question:
    "Apa yang dimaksud dengan Gaming Disorder?",

    options:[
        "Kebiasaan bermain game secara rutin setiap hari",
        "Kondisi klinis di mana seseorang tidak mampu mengontrol dorongan bermain game hingga mengganggu kehidupan sehari-hari",
        "Bermain game lebih dari 2 jam sehari",
        "Rasa suka terhadap game yang sangat kuat"
    ],

    correct:1
},

{
    question:
    "WHO secara resmi mengakui Gaming Disorder sebagai kondisi klinis pada tahun...",

    options:[
        "2010",
        "2014",
        "2018",
        "2022"
    ],

    correct:2
},

{
    question:
    "Dalam teori Online Flow State, apa yang terjadi saat pemain mengalami flow?",

    options:[
        "Pemain merasa bosan dan ingin berhenti",
        "Pemain mengalami keterlibatan penuh dan kehilangan rasa waktu",
        "Pemain merasa stres karena level terlalu sulit",
        "Pemain terhubung dengan teman secara sosial"
    ],

    correct:1
},

{
    question:
    "Menurut Self-Regulation Theory, mengapa seseorang bisa gagal membatasi waktu bermain game?",

    options:[
        "Karena grafis game terlalu menarik",
        "Karena kapasitas regulasi diri terkuras oleh kelelahan mental dan kebutuhan pelarian emosional",
        "Karena kurangnya pengawasan orang tua",
        "Karena harga internet yang terjangkau"
    ],

    correct:1
},

{
    question:
    "Uses and Gratifications Theory menjelaskan orang bermain game secara berlebihan karena...",

    options:[
        "Tidak punya kegiatan lain",
        "Game selalu memberikan hadiah setiap hari",
        "Game memenuhi kebutuhan psikologis seperti pencapaian, interaksi sosial, dan pelarian dari tekanan",
        "Tekanan dari komunitas gaming"
    ],

    correct:2
},

{
    question:
    "Manakah yang BUKAN tanda-tanda Gaming Disorder menurut WHO?",

    options:[
        "Tidak mampu mengontrol durasi bermain",
        "Memprioritaskan game di atas tanggung jawab lain",
        "Bermain game bersama teman secara sosial dan terkontrol",
        "Terus bermain meskipun menyadari dampak negatifnya"
    ],

    correct:2
},

{
    question:
    "Prevalensi Gaming Disorder di kalangan remaja Indonesia berdasarkan studi Banda Aceh adalah...",

    options:[
        "6,7%",
        "9,9%",
        "30,8%",
        "15,3%"
    ],

    correct:2
}

];

/* Self Check Question */
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

/* Post-Test Question */
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

/* =====================================
   SELF CHECK QUIZ
===================================== */

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

/* =====================================
   KNOWLEDGE QUIZ
===================================== */

function generateKnowledgeQuiz(
    containerId,
    questions,
    storageKey,
    type
){

    const container =
    document.getElementById(
        containerId
    );

    if(!container) return;

    let html = "";

    questions.forEach(
    (q,index) => {

        html += `
        <div class="quiz-card">

            <div class="quiz-question">

                ${index + 1}.
                ${q.question}

            </div>

            <div class="quiz-options">

                ${q.options.map(
                    (option,optionIndex) =>

                `
                <div
                    class="quiz-option"

                    onclick="
                    selectKnowledgeAnswer(
                        '${containerId}',
                        ${index},
                        ${optionIndex},
                        this
                    )">

                    ${option}

                </div>
                `
                ).join("")}

            </div>

        </div>
        `;
    });

    html += `
    <button
        class="btn-primary"
        style="margin-top:20px"

        onclick="
        submitKnowledgeQuiz(
            '${containerId}',
            '${storageKey}',
            '${type}'
        )">

        Kirim Jawaban

    </button>

    <div
        id="${containerId}-result">
    </div>
    `;

    container.innerHTML =
    html;
}

/* =====================================
   KNOWLEDGE ANSWER
===================================== */

function selectKnowledgeAnswer(
    containerId,
    questionIndex,
    selectedOption,
    element
){

    if(
        !quizAnswers[
            containerId
        ]
    ){

        quizAnswers[
            containerId
        ] = [];
    }

    quizAnswers[
        containerId
    ][questionIndex] =
    selectedOption;

    const options =
    element.parentElement
    .querySelectorAll(
        ".quiz-option"
    );

    options.forEach(option => {

        option.classList.remove(
            "selected"
        );

    });

    element.classList.add(
        "selected"
    );
}

/* =====================================
   SUBMIT KNOWLEDGE QUIZ
===================================== */

function submitKnowledgeQuiz(
    containerId,
    storageKey,
    type
){

    const answers =
    quizAnswers[
        containerId
    ] || [];

    const questions =
    type === "pretest"
    ? preTestQuestions
    : postTestQuestions;

    /* VALIDASI IDENTITAS */

    if(type === "pretest"){

        const name =
        document.getElementById(
            "participantName"
        )?.value.trim();

        const age =
        document.getElementById(
            "participantAge"
        )?.value;

        const gender =
        document.getElementById(
            "participantGender"
        )?.value;

        const status =
        document.getElementById(
            "participantStatus"
        )?.value;

        const gamingHours =
        document.getElementById(
            "gamingHours"
        )?.value;

        const platforms =
        document.querySelectorAll(
            ".platform:checked"
        );

        if(
            !name ||
            !age ||
            !gender ||
            !status ||
            !gamingHours
        ){

            alert(
                "Lengkapi data responden terlebih dahulu."
            );

            return;
        }

        if(
            platforms.length === 0
        ){

            alert(
                "Pilih minimal satu platform gaming."
            );

            return;
        }
    }

    const answeredQuestions =
    answers.filter(
        answer => answer !== undefined
    ).length;

    if(
        answeredQuestions <
        questions.length
    ){

        alert(
            "Silakan jawab semua pertanyaan."
        );

        return;
    }

    let correct = 0;

    questions.forEach(
    (question,index) => {

        if(
            answers[index] ===
            question.correct
        ){

            correct++;
        }

    });

    const score =
    Math.round(
        (
            correct /
            questions.length
        ) * 100
    );

    localStorage.setItem(
        storageKey,
        score
    );

    if(type === "pretest"){

    const participantData = {

        name:
        document.getElementById(
            "participantName"
        ).value,

        age:
        document.getElementById(
            "participantAge"
        ).value,

        gender:
        document.getElementById(
            "participantGender"
        ).value,

        status:
        document.getElementById(
            "participantStatus"
        ).value === "Lainnya"

        ? document.getElementById(
            "otherStatus"
        ).value

        : document.getElementById(
            "participantStatus"
        ).value,

        gamingHours:
        document.getElementById(
            "gamingHours"
        ).value,

        platforms:
        [...document.querySelectorAll(
            ".platform:checked"
        )].map(
            item => item.value
        )
    };

    localStorage.setItem(
        "participantData",
        JSON.stringify(
            participantData
        )
    );
}

    const result =
    document.getElementById(
        `${containerId}-result`
    );

    if(!result) return;

    let category = "";

    if(score >= 80){

        category =
        "Pemahaman Baik";

    }else if(
        score >= 60
    ){

        category =
        "Pemahaman Cukup";

    }else{

        category =
        "Perlu Edukasi Tambahan";
    }

    result.innerHTML = `
    <div class="quiz-card">

        <h3>
            Hasil Tes
        </h3>

        <p>

            Jawaban Benar:
            <b>
            ${correct}
            /
            ${questions.length}
            </b>

        </p>

        <p>

            Nilai:
            <b>
            ${score}
            </b>

        </p>

        <p>

            Kategori:
            <b>
            ${category}
            </b>

        </p>

    </div>
    `;

    updateDashboard();
    updateCampaignProgress();
    showComparison();

}

/* =====================================
   SELECT ANSWER
===================================== */

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
function updateDashboard(){

    const visitor =
    localStorage.getItem(
        "visitorCount"
    ) || 0;

    const visitorEl =
    document.getElementById(
        "dashboardVisitors"
    );

    if(visitorEl){

        visitorEl.textContent =
        visitor;
    }

    const preEl =
    document.getElementById(
        "dashboardPreTest"
    );

    if(preEl){

        preEl.textContent =
        localStorage.getItem(
            "preTestScore"
        ) ? "1" : "0";
    }

    const selfEl =
    document.getElementById(
        "dashboardSelfCheck"
    );

    if(selfEl){

        selfEl.textContent =
        localStorage.getItem(
            "selfCheckScore"
        ) ? "1" : "0";
    }

    const postEl =
    document.getElementById(
        "dashboardPostTest"
    );

    if(postEl){

        postEl.textContent =
        localStorage.getItem(
            "postTestScore"
        ) ? "1" : "0";
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

    /* PRE TEST */

    if(
        document.getElementById(
        "preTestContainer"
        )
    ){

        generateKnowledgeQuiz(
            "preTestContainer",
            preTestQuestions,
            "preTestScore",
            "pretest"
        );
    }

    /* SELF CHECK */

    if(
        document.getElementById(
        "selfCheckContainer"
        )
    ){

        generateQuiz(
            "selfCheckContainer",
            selfCheckQuestions,
            "selfCheckScore",
            "selfcheck"
        );
    }

    /* POST TEST */

    if(
        document.getElementById(
        "postTestContainer"
        )
    ){

        generateKnowledgeQuiz(
            "postTestContainer",
            postTestQuestions,
            "postTestScore",
            "posttest"
        );
    }

    /* PLATFORM GAMING */

    const noGaming =
    document.querySelector(
        'input[value="Tidak Bermain"]'
    );

    const gamingPlatforms =
    document.querySelectorAll(
        '.platform:not([value="Tidak Bermain"])'
    );

    if(noGaming){

        noGaming.addEventListener(
        "change",
        function(){

            if(this.checked){

                gamingPlatforms.forEach(
                platform => {

                    platform.checked = false;

                });

            }

        });
    }

    gamingPlatforms.forEach(
    platform => {

        platform.addEventListener(
        "change",
        function(){

            if(this.checked){

                noGaming.checked = false;

            }

        });

    });

    updateDashboard();
    updateCampaignProgress();
    showComparison();

});
