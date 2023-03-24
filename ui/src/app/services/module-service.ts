import { Injectable } from "@angular/core";
import { DashBoardModuleModel } from "../models/module-model";

@Injectable()
export class ModuleService {
     module: DashBoardModuleModel[] = [
          new DashBoardModuleModel ("LoremIpsum1", '', "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus lectus sit amet lectus fermentum, ac blandit orci convallis. Donec a venenatis nisl, ut dictum nulla. Sed tincidunt tortor nisl, vel laoreet urna ulla. Etiam ultrices, purus et sodales ultricies, diam sapien posuere velit, ac pharetra ex est quis sapien. Aenean quis libero vel leo maximus bibendum imperdiet quis lacus."),
          new DashBoardModuleModel ("LoremIpsum2", '', "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus lectus ulla. Etiam ultrices, purus et sodales ultricies, diam sapien posuere velit, ac pharetra ex est quis sapien. Aenean quis libero vel leo maximus bibendum imperdiet quis lacus. et sodales ultricies, diam sapien posuere velit, ac pharetra ex est quis sapien. Aenean quis libero vel leo maximus bibendum imperdiet quis lacus. et sodales ultricies, diam sapien posuere velit, ac pharetra ex est quis sapien. Aenean quis libero vel leo maximus bibendum imperdiet quis lacus."),
          new DashBoardModuleModel ("Lorem Ipsum3", '', "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus lectus sit amet lectus fermentum, ac blandit orci convallis. Donec a venenatis nisl, ut dictum nulla. Sed tincidunt tortor nise. Praesent nec ante in risus tincidunt rhoncus vitae pharetra nulla. Etiam ultrices, purus et sodales ultricies, diam sapien posuere velit, ac pharetra ex est quis sapien. Aenean quis libero vel leo maximus bibendum imperdiet quis lacus."),
     ];
     getModules() {
          return this.module;
     }
}