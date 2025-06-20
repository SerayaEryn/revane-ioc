import { idSym, typeSym, scopeSym, dependenciesSym } from "./Symbols.js";
import {
  BeanDefinition,
  DefaultBeanDefinition,
  Loader,
  Scopes,
} from "../revane-ioc/RevaneIOC.js";
import Filter from "./Filter.js";
import RegexFilter from "./RegexFilter.js";
import { recursiveReaddir } from "./RecursiveReadDir.js";
import { ComponentScanLoaderOptions } from "./ComponentScanLoaderOptions.js";
import { ModuleLoadError } from "./ModuleLoadError.js";
import { DependencyDefinition } from "../revane-ioc-core/dependencies/DependencyDefinition.js";
import { pathWithEnding } from "../revane-utils/FileUtil.js";
import { access, constants } from "node:fs/promises";

const filterByType = {
  regex: RegexFilter,
};

export default class ComponentScanLoader implements Loader {
  public async load(
    options: ComponentScanLoaderOptions[],
  ): Promise<BeanDefinition[]> {
    const promises: Promise<BeanDefinition[]>[] = [];
    for (const option of options) {
      promises.push(this.#scan(option));
    }
    const allBeanDefinitions = await Promise.all(promises);
    return allBeanDefinitions.flat();
  }

  public type(): string {
    return "scan";
  }

  async #scan(options: ComponentScanLoaderOptions): Promise<BeanDefinition[]> {
    const { basePackage, modulesToScan } = options;
    const includeFilters = convert(options.includeFilters ?? []);
    const excludeFilters = convert(options.excludeFilters ?? []);
    const files = await recursiveReaddir(basePackage);
    const flatFiles = files.flat();
    const filesFilteredByJavascript = filterByJavascriptFiles(flatFiles);
    const filesFilteredByPackage = this.#filterByPackage(
      filesFilteredByJavascript,
    );
    const filteredFiles = this.#applyFilters(
      filesFilteredByPackage,
      includeFilters,
      excludeFilters,
    );
    let result: BeanDefinition[] = [];
    for (const file of filteredFiles) {
      try {
        const fileEnding = await this.#fileEnding(file);
        const requiredFile = await import(pathWithEnding(file, fileEnding));
        if (requiredFile == null) {
          throw new Error("null");
        }
        result = result.concat(this.#processModule(requiredFile, file));
      } catch (error) {
        throw new ModuleLoadError(file, error);
      }
    }
    for (const moduleToScan of modulesToScan) {
      try {
        const requiredFile = await import(moduleToScan);
        if (requiredFile == null) {
          throw new Error("null");
        }
        result = result.concat(this.#processModule(requiredFile, moduleToScan));
      } catch (error) {
        if (error.code == "ERR_MODULE_NOT_FOUND") {
          continue;
        } else {
          throw new ModuleLoadError(moduleToScan, error);
        }
      }
    }
    return result;
  }

  #processModule(requiredFile, file: string): BeanDefinition[] {
    const moduleMap = getModuleMap(requiredFile);
    if (moduleMap.size === 0) {
      if (this.#isNoComponent(requiredFile)) {
        return [];
      }
      return [getBeanDefinition(null, requiredFile, file)];
    } else {
      const result: BeanDefinition[] = [];
      for (const key of moduleMap.keys()) {
        const aModule = moduleMap.get(key);
        if (this.#isNoComponent(aModule)) {
          return [];
        }
        result.push(getBeanDefinition(key, aModule, file));
      }
      return result;
    }
  }

  async #fileEnding(file: string): Promise<string> {
    if (file.endsWith(".js") || file.lastIndexOf(".") === -1) {
      return ".js";
    }
    if (file.endsWith(".mjs")) {
      return ".mjs";
    }
    try {
      const fileMjs = pathWithEnding(file, ".mjs");
      await access(fileMjs, constants.R_OK);
      return ".mjs";
    } catch (_) {
      console.log(_);
    } // eslint-disable-line no-empty
    return ".js";
  }

  #isNoComponent(aModule: any): boolean {
    return Reflect.getMetadata(idSym, aModule) == null;
  }

  #applyFilters(
    files: string[],
    includeFilters: Filter[],
    excludeFilters: Filter[],
  ): string[] {
    let filtered = files;
    for (const filter of includeFilters) {
      filtered = filtered.filter((def) => filter.applies(def));
    }
    for (const filter of excludeFilters) {
      filtered = filtered.filter((def) => !filter.applies(def));
    }
    return filtered;
  }

  #filterByPackage(files: string[]): string[] {
    return files.filter((file) => !file.includes("/node_modules"));
  }
}

function getModuleMap(requiredFile: any): Map<string, any> {
  const moduleMap = new Map<string, any>();
  for (const key of Object.keys(requiredFile)) {
    moduleMap.set(key, requiredFile[key]);
  }
  return moduleMap;
}

function getBeanDefinition(
  key: string | null,
  module1: any,
  clazz: any,
): DefaultBeanDefinition {
  const id = Reflect.getMetadata(idSym, module1);
  const type = Reflect.getMetadata(typeSym, module1);
  const scope = Reflect.getMetadata(scopeSym, module1) ?? Scopes.SINGLETON;
  const dependencyTypes =
    Reflect.getMetadata("revane:dependency-types", module1) ?? [];
  const dependencyClassTypes =
    Reflect.getMetadata("design:paramtypes", module1) ?? [];
  const dependencies = Reflect.getMetadata(dependenciesSym, module1).map(
    (it, index) =>
      toReference(it, dependencyTypes, dependencyClassTypes[index]),
  );
  const beanDefinition = new DefaultBeanDefinition(id);
  beanDefinition.class = clazz;
  beanDefinition.dependencyIds = dependencies;
  beanDefinition.scope = scope;
  beanDefinition.type = type;
  beanDefinition.key = key;
  return beanDefinition;
}

function toReference(
  id: string,
  dependencyTypes: any,
  classType: any,
): DependencyDefinition {
  return new DependencyDefinition("bean", id, classType);
}

function filterByJavascriptFiles(files: string[]): string[] {
  const filteredFiles: string[] = [];
  for (const file of files) {
    if (file.endsWith(".js") || file.endsWith(".mjs")) {
      filteredFiles.push(file);
    }
  }
  return filteredFiles;
}

function convert(filters): Filter[] {
  return filters.map((filter) => new filterByType[filter.type](filter));
}
