import { ProjectItem } from "./ProjectItem.js";
import { DOMHelper } from "./DOMHelper.js";

export class ProjectsList {
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
