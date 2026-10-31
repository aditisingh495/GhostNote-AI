const promptInput = document.getElementById("prompt");
const genreSelect = document.getElementById("genre");
const generateBtn = document.getElementById("generate");
const storyTitle = document.getElementById("title");
const storyText = document.getElementById("storyText");
const storySection = document.getElementById("story");
const emptySection = document.getElementById("empty");
const endingsSection = document.getElementById("endings");

let fearLevel = "eerie";
let currentStory = null;

// Story collections for each horror genre
const stories = {
  paranormal: {
    titles: ["The Voice Behind the Wall", "The Unseen Visitor"],
    openings: [
      "At midnight, a whisper came from inside the locked wardrobe. You were alone, or so you believed.",
      "The room suddenly grew cold. A shadow appeared in the mirror, standing directly behind you."
    ]
  },

  haunted: {
    titles: ["The House That Remembered", "Room Number 13"],
    openings: [
      "The abandoned house had been empty for twenty years. Yet every night, one upstairs window glowed.",
      "You found a key beneath the doorstep. Its tag carried a message in your own handwriting: WELCOME HOME."
    ]
  },

  psychological: {
    titles: ["The Other You", "A Face in the Glass"],
    openings: [
      "Your reflection smiled before you did. Then it raised a finger to its lips, asking you to stay silent.",
      "Every morning, you found a new note on your desk. Today's note read: STOP TRUSTING YOUR MEMORY."
    ]
  },

  folklore: {
    titles: ["The Marigold Path", "The Thirteenth Bell"],
    openings: [
      "Your grandmother warned you never to follow the glowing flowers beyond the old well. Tonight, they appeared at your window.",
      "The village bells rang thirteen times. Every door closed, every candle went out, and something entered the forest."
    ]
  },

  campus: {
    titles: ["The Last Lecture", "Absent at Midnight"],
    openings: [
      "The old college building was locked, but a lecture was playing inside. On the attendance sheet, your name was already marked present.",
      "At midnight, your phone received a timetable notification for a classroom demolished ten years ago."
    ]
  }
};

const fearLines = {
  eerie: [
    "A folded note appeared beneath the door. It contained a drawing of you, standing in this exact room.",
    "Three gentle knocks came from the window. You remembered that your room was on the seventh floor."
  ],

  dark: [
    "Your phone displayed a photograph taken seconds ago. In it, a pale figure stood behind your shoulder.",
    "Footsteps circled the room, stopping whenever you moved. Then they began walking inside the walls."
  ],

  nightmare: [
    "The lights died. Every shadow in the room turned toward you, although nothing else had moved.",
    "Your reflection pressed its hand against the glass. From the other side, another hand pressed back."
  ]
};

const endings = {
  open: [
    "You opened the door. Beyond it was your own bedroom, but every photograph showed a stranger standing beside you. The stranger slowly raised a hand in greeting.",
    "Behind the door, a staircase descended into darkness. On the first step lay a diary. Its final page described everything you were doing right now."
  ],

  run: [
    "You ran until sunrise. At home, you locked every door. Then your phone buzzed with a photograph of you sleeping, taken from the foot of your bed.",
    "You escaped into the street. Every streetlight went dark at once, and your shadow continued running even after you had stopped."
  ]
};

// Select a random item
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Display a notification
let toastTimer;

function notify(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Update character counter
promptInput.addEventListener("input", () => {
  document.getElementById("characters").textContent =
    promptInput.value.length;
});

// Select fear intensity
document.querySelectorAll(".level").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".level").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    fearLevel = button.dataset.level;
  });
});

// Generate a story
generateBtn.addEventListener("click", () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    notify("Enter a mysterious idea first! 👻");
    promptInput.focus();
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "THE SHADOWS ARE GATHERING...";

  setTimeout(() => {
    const genre = genreSelect.value;
    const selectedStory = stories[genre];

    const title = randomItem(selectedStory.titles);
    const opening = randomItem(selectedStory.openings);
    const twist = randomItem(fearLines[fearLevel]);

    const story = {
      id: Date.now().toString(),
      title,
      genre,
      prompt,
      text:
        opening +
        "\n\nIt all began with one thought: " +
        '"' + prompt + '"' +
        "\n\n" +
        twist +
        "\n\nThen a voice whispered from the darkness: " +
        '"You can leave whenever you like. You only have to find the right door."'
    };

    currentStory = story;

    displayStory(story);

    generateBtn.disabled = false;
    generateBtn.textContent = "✧ SUMMON MY STORY ↗";
  }, 500);
});

// Show the story on screen
function displayStory(story) {
  currentStory = story;

  storyTitle.textContent = story.title;
  storyText.textContent = story.text;

  emptySection.hidden = true;
  storySection.hidden = false;
  endingsSection.hidden = true;

  document.getElementById("continue").hidden = false;

  const saveBtn = document.getElementById("save");
  saveBtn.textContent = "♡ Save Story";
  saveBtn.classList.remove("saved");

  if (window.innerWidth < 800) {
    storySection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

// Read saved stories safely from browser storage
function getSavedStories() {
  try {
    const data = JSON.parse(
      localStorage.getItem("ghostnoteStories") || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Save stories to browser storage
function storeStories(storiesArray) {
  try {
    localStorage.setItem(
      "ghostnoteStories",
      JSON.stringify(storiesArray)
    );

    updateCount();
    return true;
  } catch {
    notify("Unable to save. Check your browser storage.");
    return false;
  }
}

// Save current story
document.getElementById("save").addEventListener("click", () => {
  if (!currentStory) return;

  const saved = getSavedStories();

  if (saved.some(item => item.id === currentStory.id)) {
    notify("This story is already saved!");
    return;
  }

  if (storeStories([currentStory, ...saved])) {
    const button = document.getElementById("save");

    button.textContent = "✓ Story Saved";
    button.classList.add("saved");

    notify("Your story is safely in your storybook!");
  }
});

// Update saved story counter
function updateCount() {
  document.getElementById("count").textContent =
    getSavedStories().length;
}

// Show or hide alternate endings
document.getElementById("continue").addEventListener("click", () => {
  endingsSection.hidden = !endingsSection.hidden;

  document.getElementById("continue").textContent =
    endingsSection.hidden ? "Choose Ending ↗" : "Hide Endings ↑";
});

// Select an ending
document.querySelectorAll(".choice").forEach(button => {
  button.addEventListener("click", () => {
    if (!currentStory) return;

    const choice = button.dataset.choice;
    const ending = randomItem(endings[choice]);

    currentStory = {
      ...currentStory,
      text: currentStory.text + "\n\n" + ending
    };

    storyText.textContent = currentStory.text;
    endingsSection.hidden = true;
    document.getElementById("continue").hidden = true;

    notify("Your story has reached its ending...");
  });
});

// Copy the story
document.getElementById("copy").addEventListener("click", async () => {
  if (!currentStory) return;

  const content =
    currentStory.title + "\n\n" + currentStory.text;

  try {
    await navigator.clipboard.writeText(content);
    notify("Story copied successfully!");
  } catch {
    notify("Copy unavailable. Try opening the page in a local server.");
  }
});

// Display saved stories
function renderArchive() {
  const archive = document.getElementById("archive");
  const list = document.getElementById("savedStories");
  const saved = getSavedStories();

  list.replaceChildren();

  if (saved.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Your storybook is empty. Save a story first!";
    message.className = "hint";
    list.appendChild(message);
  }

  saved.forEach(item => {
    const card = document.createElement("div");
    card.className = "saved-card";

    const heading = document.createElement("h3");
    heading.textContent = item.title;

    const text = document.createElement("p");
    text.textContent = item.text;

    const read = document.createElement("button");
    read.textContent = "Read Story";

    read.addEventListener("click", () => {
      displayStory(item);
      archive.hidden = true;

      document.getElementById("story").scrollIntoView({
        behavior: "smooth"
      });
    });

    const remove = document.createElement("button");
    remove.textContent = "Delete";

    remove.addEventListener("click", () => {
      const updated = getSavedStories().filter(
        story => story.id !== item.id
      );

      if (storeStories(updated)) {
        renderArchive();
        notify("Story deleted.");
      }
    });

    card.append(heading, text, read, remove);
    list.appendChild(card);
  });

  archive.hidden = false;
}

// Open and close storybook
document.getElementById("viewSaved").addEventListener("click", () => {
  renderArchive();

  document.getElementById("archive").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("closeArchive").addEventListener("click", () => {
  document.getElementById("archive").hidden = true;
});

// Initial setup
updateCount();