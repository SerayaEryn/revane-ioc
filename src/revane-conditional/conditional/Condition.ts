export interface Condition {
  matches(data: any): Promise<boolean>;
}
