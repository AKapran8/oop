import { Component } from "./Component";

export class Tooltip extends Component {

  constructor(id, textContent, closeTooltipFunc) {
    super(id);
    this.text = textContent;
    this.closePrevTooltip = closeTooltipFunc;
    this.closeTooltip = () => {
      this.destroy();
      this.closePrevTooltip();
    };
    this.create();
  }

  create() {
    const elem = document.createElement("div");
    elem.className = "card";

    const templateEl = document.querySelector("#tooltip");
    const templateContent = document.importNode(templateEl.content, true);
    templateContent.querySelector("p").textContent = this.text;
    elem.append(templateContent);

    elem.addEventListener("click", this.closeTooltip);
    this.element = elem;
  }
}
