import {Component} from "../../src/revane-ioc/RevaneIOC.js";
import {Value} from "../../src/revane-configuration/value/Value.js";

@Component
export class TestValue {
  constructor(
       @Value({key: 'test.property1', type: "string"}) public property1: string,
       @Value({key: 'test.property2', type: "number"}) public property2: number,
       @Value({key: 'test.property3', type: "boolean"}) public property3: boolean,
       @Value({key: 'test.property1'}) public property4: string
  ) {
  }
}
