export class Component {
  #hostSelector;
  #insertBefore = false;

  constructor(hostId, insertBefore = false) {
    this.#hostSelector = hostId
      ? document.getElementById(hostId)
      : document.body;
    this.#insertBefore = insertBefore;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }

  init() {
    this.#hostSelector.insertAdjacentElement(
      this.#insertBefore ? "afterbegin" : "beforeend",
      this.element
    );
  }
}
