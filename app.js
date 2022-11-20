const entryInput = document.querySelectorAll(".entry__input-keys");

const entryCopyBtn = document.querySelector(".entry__copy-btn");
const entryBtnChange = document.querySelector(".entry__Btn--change");
const entryKeyBoardInputSelect = document.querySelector(".entry__input-keys--select");

const entryQrcodeBtn = document.querySelector(".entry__qrcode-btn");
const entryQrscanImg = document.querySelector(".entry__qrscan-img");
const entryBtnQrAlert = document.querySelector(".entry__btn--qr-alert");

const modalBackdrop = document.querySelector(".modal-backdrop");
const modalBackdropCloseBtn = document.querySelector(".modal-backdrop__close-btn");
const modalBackdropCopyBtn = document.querySelector(".modal-backdrop__copy-btn");

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },
  eventHandler: {
    oninput: null,
    onclose: null,
  },
  properties: {
    value: "",
    capsLock: false,
  },

  //   make main & keysContainer elements
  //   make classList to elements
  //   append keys array
  //   fix elements to DOM
  init() {
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    this.elements.main.classList.add("keyboard", "1keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");

    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Get user input
    entryInput.forEach((element) => {
      element.addEventListener("focus", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter", "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "*", "space"];

    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      // Operation of special buttons
      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--active-table");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this._triggerEvent("oninput");
          });

          break;
      }
      fragment.appendChild(keyElement);
      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandler[handlerName] == "function") {
      this.eventHandler[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandler.oninput = oninput;
    this.eventHandler.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandler.oninput = oninput;
    this.eventHandler.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },
};
window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});

// copy input text
entryCopyBtn.addEventListener("click", () => {
  if (entryKeyBoardInputSelect.value) {
    entryKeyBoardInputSelect.select();
    navigator.clipboard.writeText(entryKeyBoardInputSelect.value);
    entryBtnChange.textContent = "done";

    setTimeout(() => {
      entryBtnChange.textContent = "content_copy";
    }, 700);
  }
});

// QR Code
entryQrcodeBtn.addEventListener("click", () => {
  if (!entryKeyBoardInputSelect.value) {
    entryBtnQrAlert.textContent = "directions";
    entryKeyBoardInputSelect.style.background = "#e9e1e1f6";
  }
  setTimeout(() => {
    entryBtnQrAlert.textContent = "qr_code";
    entryKeyBoardInputSelect.style.background = "#f7f7f7";
  }, 1000);
  if (entryKeyBoardInputSelect.value) {
    modalBackdrop.style.display = "block";
    let qrValue = entryKeyBoardInputSelect.value;

    entryQrscanImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrValue}`;
  }
});

// close modal with backdrop
window.addEventListener("click", (e) => {
  if (e.target == modalBackdrop) {
    modalBackdrop.style.display = "none";
  }
});

modalBackdropCloseBtn.addEventListener("click", () => {
  modalBackdrop.style.display = "none";
});

// save in clipboard
modalBackdropCopyBtn.addEventListener("click", () => {
  async function copyPicture() {
    try {
      let qrValue = entryKeyBoardInputSelect.value;

      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrValue}`);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } catch (err) {
      console.error(err.name, err.massage);
    }
  }
  copyPicture();
});
