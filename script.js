const languages = [
  ["en", "English"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["it", "Italian"],
  ["pt", "Portuguese"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["zh-CN", "Chinese (Simplified)"],
  ["ar", "Arabic"],
  ["hi", "Hindi"]
];

const dependencies = [
  { name: "Node.js", kind: "Runtime" },
  { name: "HTTP Server", kind: "Built-in" },
  { name: "Google Fonts", kind: "UI Asset" },
  { name: "MyMemory API", kind: "Translation" },
  { name: "GitHub Pages", kind: "Deployment" }
];

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const sourceText = document.getElementById("sourceText");
const translatedText = document.getElementById("translatedText");
const statusText = document.getElementById("statusText");
const charCount = document.getElementById("charCount");
const translateButton = document.getElementById("translateButton");
const swapButton = document.getElementById("swapButton");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");
const chips = document.querySelectorAll(".chip");
const dependencyList = document.getElementById("dependencyList");
const heroStatus = document.getElementById("heroStatus");
const heroCount = document.getElementById("heroCount");
const heroTarget = document.getElementById("heroTarget");

function fillSelect(select, selected) {
  languages.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = value === selected;
    select.appendChild(option);
  });
}

function renderDependencies() {
  dependencies.forEach((dependency) => {
    const item = document.createElement("div");
    item.className = "dependency-item";
    item.innerHTML = `
      <span class="dependency-name">${dependency.name}</span>
      <span class="dependency-kind">${dependency.kind}</span>
    `;
    dependencyList.appendChild(item);
  });
}

function setStatus(message) {
  statusText.textContent = message;
  heroStatus.textContent = message;
}

function updateCount() {
  const count = sourceText.value.length;
  charCount.textContent = `${count} / 600`;
  heroCount.textContent = String(count);
}

function updateTargetLabel() {
  const selected = targetLanguage.options[targetLanguage.selectedIndex];
  heroTarget.textContent = selected ? selected.textContent : "Unknown";
}

async function translateText() {
  const text = sourceText.value.trim();
  if (!text) {
    setStatus("Enter some text first.");
    translatedText.textContent = "Your translated text will appear here.";
    return;
  }

  if (sourceLanguage.value === targetLanguage.value) {
    translatedText.textContent = text;
    setStatus("Source and target languages match.");
    return;
  }

  translateButton.disabled = true;
  translateButton.textContent = "Translating...";
  setStatus("Requesting translation...");

  try {
    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}` +
      `&langpair=${encodeURIComponent(sourceLanguage.value)}|${encodeURIComponent(targetLanguage.value)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Translation request failed with ${response.status}`);
    }

    const data = await response.json();
    const result = data?.responseData?.translatedText?.trim();
    if (!result) {
      throw new Error("No translation returned.");
    }

    translatedText.textContent = result;
    setStatus("Translation complete.");
  } catch (error) {
    translatedText.textContent = "Translation could not be completed right now. Try again in a moment.";
    setStatus("Translation service unavailable.");
    console.error(error);
  } finally {
    translateButton.disabled = false;
    translateButton.textContent = "Translate";
  }
}

fillSelect(sourceLanguage, "en");
fillSelect(targetLanguage, "es");
renderDependencies();
updateTargetLabel();
updateCount();

sourceText.addEventListener("input", updateCount);
translateButton.addEventListener("click", translateText);
targetLanguage.addEventListener("change", updateTargetLabel);

sourceText.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    translateText();
  }
});

swapButton.addEventListener("click", () => {
  const nextSource = targetLanguage.value;
  targetLanguage.value = sourceLanguage.value;
  sourceLanguage.value = nextSource;
  updateTargetLabel();

  if (translatedText.textContent && translatedText.textContent !== "Your translated text will appear here.") {
    sourceText.value = translatedText.textContent;
    translatedText.textContent = "Your translated text will appear here.";
    updateCount();
  }

  setStatus("Languages swapped.");
});

clearButton.addEventListener("click", () => {
  sourceText.value = "";
  translatedText.textContent = "Your translated text will appear here.";
  updateCount();
  setStatus("Ready");
});

copyButton.addEventListener("click", async () => {
  const text = translatedText.textContent;
  if (!text || text === "Your translated text will appear here.") {
    setStatus("Nothing to copy yet.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Translation copied.");
  } catch (error) {
    setStatus("Copy failed.");
    console.error(error);
  }
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    sourceText.value = chip.dataset.text || "";
    updateCount();
    setStatus("Example loaded.");
  });
});
