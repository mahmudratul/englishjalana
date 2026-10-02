// Create HTML elements for synonyms
const createElements = (array) => {
    const htmlElements = array.map(
        (el) => `<span class="btn">${el}</span>`
    );

    return htmlElements.join("");
};

const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
};

// Load all lessons
const loadLessons = () => {

    const URLlesson =
        "https://openapi.programming-hero.com/api/levels/all";

    fetch(URLlesson)
        .then((res) => res.json())
        .then((json) => DisplayLessons(json.data || []))
        .catch((error) => {
            console.error("Failed to load lessons:", error);
        });
};


// Remove active class
const removeActiveClass = () => {

    const lessonButtons =
        document.querySelectorAll(".lesson-btn");

    lessonButtons.forEach((btn) => {
        btn.classList.remove("btn-active");
    });
};


// Load words of a lesson
const loadlevelWord = (id) => {
    manageSpinner(true);

    const levelWordUrl =
        `https://openapi.programming-hero.com/api/level/${id}`;

    fetch(levelWordUrl)
        .then((res) => res.json())
        .then((data) => {

            // Remove active class from previous button
            removeActiveClass();

            // Find clicked lesson button
            const clickBtn =
                document.getElementById(`lesson-btn-${id}`);

            // Add active class
            if (clickBtn) {
                clickBtn.classList.add("btn-active");
            }

            // Display words
            displayLevelWord(data.data || []);
        })
        .catch((error) => {
            console.error("Failed to load level words:", error);
        });
};


// Display words
const displayLevelWord = (words) => {

    const wordContainer =
        document.getElementById("word-container");

    if (!wordContainer) {
        console.error("#word-container not found");
        return;
    }

    // Clear previous content
    wordContainer.innerHTML = "";


    // If no words found
    if (words.length === 0) {

        wordContainer.innerHTML = `
            <div class="col-span-full text-center leading-relaxed rounded-md bg-white p-10 shadow-md space-y-4">
                <p class="text-lg font-medium font-bangla text-gray-500">
                    এই Lesson-এ কোন শব্দ পাওয়া যায়নি।
                </p>

                <h1 class="text-3xl font-bold font-bangla">
                    অন্য একটি Lesson Select করুন।
                </h1>
            </div>
        `;
  manageSpinner(false);
        return;
    }


    // Create cards
    words.forEach((word) => {

        const card = document.createElement("div");

        card.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center py-20 px-5 space-y-4">

                <h2 class="font-bold text-xl">
                    ${word.word}
                </h2>

                <p class="font-semibold font-bangla">
                    Meaning / Pronunciation
                </p>

                <div class="text-2xl font-medium font-bangla">
                    "${word.meaning || "No meaning"} /
                    ${word.pronunciation || "No pronunciation"}"
                </div>

                <div class="flex justify-between items-center">

                    <button
                        onclick="loadWordDetail(${word.id})"
                        class="btn bg-sky-50 hover:bg-sky-200">

                        <i class="fa-solid fa-circle-info"></i>

                    </button>

                    <button onclick="pronounceWord('${word.word}')"
                        class="btn bg-sky-50 hover:bg-sky-200">

                        <i class="fa-solid fa-volume-high"></i>

                    </button>

                </div>

            </div>
        `;

        wordContainer.append(card);
    });

    manageSpinner(false);
};


// Load word details
const loadWordDetail = async (id) => {

    const wordDetailUrl =
        `https://openapi.programming-hero.com/api/word/${id}`;

    try {

        const response = await fetch(wordDetailUrl);

        const detail = await response.json();

        // Send only the actual word data
        displayWordDetail(detail.data);

    } catch (error) {

        console.error("Failed to load word detail:", error);

    }
};


// Display word details inside modal
const displayWordDetail = (word) => {

    const detailBox =
        document.getElementById("details-container");

    detailBox.innerHTML = `

        <div>
            <h2 class="font-bangla font-bold text-2xl">

                ${word.word}

                (
                <i class="fa-solid fa-microphone-lines"></i>
                : ${word.pronunciation || "N/A"}
                )

            </h2>
        </div>


        <div>

            <h2 class="font-bangla font-bold text-xl">
                Meaning
            </h2>

            <p class="font-bangla">
                ${word.meaning || "No meaning available"}
            </p>

        </div>


        <div>

            <h2 class="font-bold text-xl">
                Example
            </h2>

            <p class="font-bangla">
                ${word.sentence || "No example available"}
            </p>

        </div>


        <div>

            <h2 class="font-bold text-xl">
                Synonyms
            </h2>

            <div class="flex flex-wrap gap-2">

                ${createElements(word.synonyms || [])}

            </div>

        </div>
    `;


    // Open modal
    document.getElementById("my_modal").showModal();
    manageSpinner(false);
};


// Display all lessons
const DisplayLessons = (lessons) => {

    const LevelContainer =
        document.getElementById("lesson-container");

    if (!LevelContainer) {

        console.error("#lesson-container not found");

        return;
    }


    // Clear old content
    LevelContainer.innerHTML = "";


    // Create lesson buttons
    lessons.forEach((lesson) => {

        const btnDiv =
            document.createElement("div");

        btnDiv.innerHTML = `
            <button
                id="lesson-btn-${lesson.level_no}"
                onclick="loadlevelWord(${lesson.level_no})"
                class="btn btn-outline btn-primary mt-2 lesson-btn">

                <i class="fa-solid fa-book-open color-purple"></i>

                ${lesson.lessonName ||
                `Lesson ${lesson.level_no || ""}`}

            </button>
        `;

        LevelContainer.appendChild(btnDiv);
    });
};


// Run when page loads
loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActiveClass();
    const searchTerm = document.getElementById("search-input");
    const searchValue = searchTerm.value.trim().toLowerCase();
    // Implement search functionality here

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
        const allwords = data.data || [];
        const filteredWords = allwords.filter((word) =>
            word.word.toLowerCase().includes(searchValue)
        );
        displayLevelWord(filteredWords);
    })
    .catch((error) => {
        console.error("Failed to load words:", error);
    });
});

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
};