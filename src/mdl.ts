import {inject} from 'aurelia-framework';
import 'material-design-lite';

@inject(Element)  // awesome-typescript-loader#162 broke autoinject
export class MdlCustomAttribute {

  constructor(private element: Element) { }

  attached() {
    componentHandler.upgradeElement(this.element as HTMLElement);
  }
}