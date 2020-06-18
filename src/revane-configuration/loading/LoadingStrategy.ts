export interface LoadingStrategy {
  load (configDirectory: string, profile: string): Promise<object>
}
