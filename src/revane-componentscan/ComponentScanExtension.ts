import { Extension, Loader } from '../revane-ioc/RevaneIOC'
import ComponentScanLoader from './ComponentScanLoader'

export class ComponentScanExtension extends Extension {
  public beanLoaders (): Loader[] {
    return [new ComponentScanLoader()]
  }
}
