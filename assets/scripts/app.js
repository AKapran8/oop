class DOMHelper {
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

class Component {
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

class Tooltip extends Component {
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

class ProjectItem {
  id = null;
  #type = "";
  #updateProjListFuncHandler;
  hasTooltip = false;

  constructor(id, updateProjListFunc, type) {
    this.id = id;
    this.#type = type;
    this.#updateProjListFuncHandler = updateProjListFunc;
    this.#getMoreInfo();
    this.#switchProjectHandler(this.#type);
    this.initDrag();
  }

  initDrag() {
    document.getElementById(this.id).addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", this.id);
      event.dataTransfer.effectAllowed = "move";
    });
  }

  #showModeInfoHandler() {
    if (this.hasTooltip) {
      return;
    }

    const el = document.querySelector(`#${this.id}`);
    const text = el.dataset && el.dataset.extraInfo ? el.dataset.extraInfo : "";

    const tooltip = new Tooltip(this.id, text, () => (this.hasTooltip = false));
    tooltip.init();
    this.hasTooltip = true;
  }

  #getMoreInfo() {
    const elem = document.querySelector(`#${this.id}`);
    let moreInfoBtn = elem.querySelector("button:first-of-type");
    moreInfoBtn = DOMHelper.clearEventListener(moreInfoBtn);
    moreInfoBtn.addEventListener("click", this.#showModeInfoHandler.bind(this));
  }

  #switchProjectHandler(type) {
    const elem = document.querySelector(`#${this.id}`);
    let switchBtn = elem.querySelector("button:last-of-type");

    switchBtn = DOMHelper.clearEventListener(switchBtn);
    switchBtn.textContent = type === "active" ? "Finished" : "Activate";

    switchBtn.addEventListener(
      "click",
      this.#updateProjListFuncHandler.bind(null, this.id)
    );
  }

  update(updateProjListFn, type) {
    this.#updateProjListFuncHandler = updateProjListFn;
    this.#switchProjectHandler(type);
  }
}

class ProjectsList {
  #projects = [];
  #switchHandler;

  constructor(type) {
    this.type = type;
    const items = document.querySelectorAll(`#${type}-projects li`);
    for (const item of items) {
      this.#projects.push(
        new ProjectItem(item.id, this.switchProject.bind(this), this.type)
      );
    }
    this.connectDropp();
  }

  connectDropp = () => {
    const list = document.querySelector(`#${this.type}-projects ul`);

    list.addEventListener("dragenter", (event) => {
      if (event.dataTransfer.types[0] === "text/plain") {
        list.parentElement.classList.add("droppble");
        event.preventDefault();
      }
    });

    list.addEventListener("dragover", (event) => {
      if (event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
      }
    });

    list.addEventListener("dragleave", (event) => {
      if (
        event.relatedTarget.closest &&
        event.relatedTarget.closest(`#${this.type}-projects ul`) !== list
      ) {
        list.parentElement.classList.remove("droppble");
      }
    });

    list.addEventListener("drop", (event) => {
      const projId = event.dataTransfer.getData("text/plain");

      if (this.#projects.find((p) => p.id === projId)) {
        return;
      }

      document
        .getElementById(projId)
        .querySelector("button:last-of-type")
        .click();
      list.parentElement.classList.remove("droppble");
      event.preventDefault();
    });
  };

  setSwitchHandlerFunc(switchHandlerFunc) {
    this.#switchHandler = switchHandlerFunc;
  }

  addProject(project) {
    this.#projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }

  switchProject(projectId) {
    this.#switchHandler(this.#projects.find((p) => p.id === projectId));
    this.#projects = this.#projects.filter((p) => p.id !== projectId);
  }
}

class App {
  static initData() {
    const activeProjects = new ProjectsList("active");
    const finishedProjects = new ProjectsList("finished");

    activeProjects.setSwitchHandlerFunc(
      finishedProjects.addProject.bind(finishedProjects)
    );
    finishedProjects.setSwitchHandlerFunc(
      activeProjects.addProject.bind(activeProjects)
    );
  }
}

App.initData();
