import { Component } from "./Component.js";

export class Tooltip extends Component {
  element;
  closePrevTooltip;
  #text = "";

  constructor(id, textContent, closeTooltipFunc) {
    super(id);
    this.#text = textContent;
    this.closePrevTooltip = closeTooltipFunc;
    this.#create();
  }

  closeTooltip = () => {
    this.destroy();
    this.closePrevTooltip();
  };

  #create() {
    const elem = document.createElement("div");
    elem.className = "card";

    const templateEl = document.querySelector("#tooltip");
    const templateContent = document.importNode(templateEl.content, true);
    templateContent.querySelector("p").textContent = this.#text;
    elem.append(templateContent);

    elem.addEventListener("click", this.closeTooltip);
    this.element = elem;
  }
}
