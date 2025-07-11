const speech = new SpeechSynthesisUtterance();
let voices = [];

const voiceSelect = document.getElementById("voiceSelect");
const textarea = document.querySelector("textarea");
const button = document.querySelector("button");

function populateVoices() {
    voices = window.speechSynthesis.getVoices();

    // Filter to one voice per language
    const uniqueLanguages = {};
    voices.forEach((voice) => {
        const lang = voice.lang;
        if (!uniqueLanguages[lang]) {
            uniqueLanguages[lang] = voice;
        }
    });

    // Clear and populate select
    voiceSelect.innerHTML = '';
    Object.entries(uniqueLanguages).forEach(([lang, voice], index) => {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = `${voice.name} - ${lang}`;
        voiceSelect.appendChild(option);
    });

    // Set default voice
    speech.voice = uniqueLanguages[voiceSelect.value] || voices[0];
}

// Call populateVoices once and again when voices load
populateVoices();
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

// Change voice on selection
voiceSelect.addEventListener("change", () => {
    const selectedLang = voiceSelect.value;
    const selectedVoice = voices.find((v) => v.lang === selectedLang);
    if (selectedVoice) {
        speech.voice = selectedVoice;
    }
});

// Speak text
button.addEventListener("click", () => {
    speech.text = textarea.value.trim();
    if (speech.text !== "") {
        window.speechSynthesis.cancel(); // stop anything else speaking
        window.speechSynthesis.speak(speech);
    }
});
