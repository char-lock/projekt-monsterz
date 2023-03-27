import { Injectable } from "@angular/core";
import { DashBoardModuleModel } from "../models/module-model";

@Injectable()
export class ModuleService {
     module: DashBoardModuleModel[] = [
          new DashBoardModuleModel ("<h5>LeaderBoard<h5>", '', `<table>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
          </tr>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
          </tr>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
          </tr>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
          </tr>
          </table>`
          ),
          new DashBoardModuleModel ("<h5>Current Lesson</h5>", '', "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus lectus ulla. Etiam ultrices, purus et sodales ultricies, diam sapien posuere velit, ac pharetra ex est quis</p>"),
          new DashBoardModuleModel ("<h5>Lorem Ipsum 3</h5>", '', "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus lectus sit amet lectus fermentum, ac blandit orci convallis. Donec a venenatis nisl, ut dictum nulla. Sed tincidunt tortor nise.</p>"),
     ];
     getModules() {
          return this.module;
     }
     
}