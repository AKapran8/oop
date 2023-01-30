import { DOMHelper } from "./DOMHelper.js";

export class ProjectItem {

  constructor(id, updateProjListFunc, type) {
    this.hasTooltip = false;
    this.id = id;
    this.type = type ? type : '';
    this.updateProjListFuncHandler = updateProjListFunc;
    this.getMoreInfo();
    this.switchProjectHandler(this.type);
    this.initDrag();
  }

  initDrag() {
    document.getElementById(this.id).addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", this.id);
      event.dataTransfer.effectAllowed = "move";
    });
  }

  showModeInfoHandler() {
    if (this.hasTooltip) {
      return;
    }

    const el = document.querySelector(`#${this.id}`);
    const text = el.dataset && el.dataset.extraInfo ? el.dataset.extraInfo : "";
    import("./Tooltip").then((module) => {
      const tooltip = new module.Tooltip(
        this.id,
        text,
        () => (this.hasTooltip = false)
      );
      tooltip.init();
      this.hasTooltip = true;
    });
  }

  getMoreInfo() {
    const elem = document.querySelector(`#${this.id}`);
    let moreInfoBtn = elem.querySelector("button:first-of-type");
    moreInfoBtn = DOMHelper.clearEventListener(moreInfoBtn);
    moreInfoBtn.addEventListener("click", this.showModeInfoHandler.bind(this));
  }

  switchProjectHandler(type) {
    const elem = document.querySelector(`#${this.id}`);
    let switchBtn = elem.querySelector("button:last-of-type");

    switchBtn = DOMHelper.clearEventListener(switchBtn);
    switchBtn.textContent = type === "active" ? "Finished" : "Activate";

    switchBtn.addEventListener(
      "click",
      this.updateProjListFuncHandler.bind(null, this.id)
    );
  }

  update(updateProjListFn, type) {
    this.updateProjListFuncHandler = updateProjListFn;
    this.switchProjectHandler(type);
  }
}
