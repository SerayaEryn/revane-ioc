import Bean from "./context/bean/Bean.js";

export interface ApplicationContext {
  getById: (id: string) => Promise<any>;
  getByClassType: (id: string) => Promise<any>;
  getBeanById: (id: string) => Promise<Bean>;
  getBeanByClassType: (id: string) => Promise<Bean>;
  hasById: (id: string) => Promise<boolean>;
  hasByClassType: (classType: any) => Promise<boolean>;
  getByType: (type: string) => Promise<any[]>;
  setParent: (context: ApplicationContext) => void;
  close: () => Promise<void>;
  getByMetadata(metadata: string | symbol): Promise<any[]>;
}
