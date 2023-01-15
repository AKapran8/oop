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
  }
}

class Component {
  host;

  constructor(hostId, insertBefore = false) {
    this.host = hostId ? document.getElementById(hostId) : document.body;
    this.insertBefore = insertBefore;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }

  init() {
    this.host.insertAdjacentElement(
      this.insertBefore ? "afterbegin" : "beforeend",
      this.element
    );
  }
}

class Tooltip extends Component {
  element;
  closePrevTooltip;

  constructor(type, closeTooltipFunc) {
    super(type ? `${type}-projects` : "", type !== "active");
    this.closePrevTooltip = closeTooltipFunc;
    this.create();
  }

  closeTooltip = () => {
    this.destroy();
    this.closePrevTooltip();
  };

  create() {
    const elem = document.createElement("div");
    elem.className = "card";
    elem.textContent = "LOREM" + Math.random();
    elem.addEventListener("click", this.closeTooltip);
    this.element = elem;
  }
}

class ProjectItem {
  id = null;
  type = "";
  updateProjListFuncHandler;
  hasTooltip = false;

  constructor(id, updateProjListFunc, type) {
    this.id = id;
    this.type = type;
    console.log(this.type);
    this.updateProjListFuncHandler = updateProjListFunc;
    this.getMoreInfo();
    this.switchProjectHandler(this.type);
  }

  #showModeInfoHandler() {
    if (this.hasTooltip) {
      return;
    }

    const tooltip = new Tooltip(this.type, () => (this.hasTooltip = false));
    tooltip.init();
    this.hasTooltip = true;
  }

  getMoreInfo() {
    const elem = document.querySelector(`#${this.id}`);
    let moreInfoBtn = elem.querySelector("button:first-of-type");
    moreInfoBtn = DOMHelper.clearEventListener(moreInfoBtn);
    moreInfoBtn.addEventListener("click", this.#showModeInfoHandler.bind(this));
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
    console.log("TYPE ", type);
    this.updateProjListFuncHandler = updateProjListFn;
    this.switchProjectHandler(type);
  }
}

class ProjectsList {
  projects = [];
  switchHandler;

  constructor(type) {
    this.type = type;
    const items = document.querySelectorAll(`#${type}-projects li`);
    for (const item of items) {
      this.projects.push(
        new ProjectItem(item.id, this.switchProject.bind(this), this.type)
      );
    }
  }

  setSwitchHandlerFunc(switchHandlerFunc) {
    this.switchHandler = switchHandlerFunc;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }

  switchProject(projectId) {
    this.switchHandler(this.projects.find((p) => p.id === projectId));
    this.projects = this.projects.filter((p) => p.id !== projectId);
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
