import { Constructor } from "../revane-ioc-core/Constructor.js";
import { LoaderOptions } from "../revane-ioc/RevaneIOC.js";

export class ComponentScanLoaderOptions extends LoaderOptions {
  constructor(
    public basePackage: string,
    public includeFilters: any[] | null,
    public excludeFilters: any[] | null,
    public modulesToScan: Constructor[],
  ) {
    super();
    this.type = "scan";
  }
}
