import { Extension, Loader } from '../revane-ioc/RevaneIOC.js'
import ComponentScanLoader from './ComponentScanLoader.js'

export class ComponentScanExtension extends Extension {
  public beanLoaders (): Loader[] {
    return [new ComponentScanLoader()]
  }
}
