import { ProjectsList } from "./Modules/ProjectList";

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
