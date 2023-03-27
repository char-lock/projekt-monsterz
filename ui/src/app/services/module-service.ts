import { Injectable } from "@angular/core";
import { DashBoardModuleModel } from "../models/module-model";

@Injectable()
export class ModuleService {
     module: DashBoardModuleModel[] = [
          new DashBoardModuleModel ("<h5>LeaderBoard<h5>", '', `<table class="table">
          <tr class="header-row">
            <th>Username</th>
            <th>Score</th>
          </tr>
          <tr class="table-row">
            <td>Maria Anders</td>
            <td>Germany</td>
          </tr>
          </table>`
          ),
          new DashBoardModuleModel ("<h5>Other Lesson</h5>", '', `<ul>
          <li>
          <button>Introduction To Logic</button>
          </li>
          <li>
          <button>Introduction To Computing</button>
          </li>          
          <li>
          <button>Introduction To Programming</button>
          </li>
          </ul>`),
     ];
     getModules() {
          return this.module;
     }
     
}