export class DOMHelper {
  static clearEventListener(elem) {
    const clone = elem.cloneNode(true);
    elem.replaceWith(clone);

    return clone;
  }

  static moveElement(elemId, newDestinationSelector) {
    const el = document.getElementById(elemId);
    const destinationEl = document.querySelector(newDestinationSelector);
    destinationEl.append(el);
    el.scrollIntoView({ behavior: "smooth" });
  }
}
