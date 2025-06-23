import { Type, Component } from "../../src/revane-ioc/RevaneIOC.js";
import { Type1 } from "./Type1.js";
import { Type2 } from "./Type2.js";

@Component
export class Test {
  constructor(
    @Type(Type1) public a: any,
    public other: any,
    @Type(Type2) public b: any,
  ) {

  }
}