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

    this.elements.main.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
  },

  _createKeys() {
    const keyLayout = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter", "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "*", "space"];
  },
};
