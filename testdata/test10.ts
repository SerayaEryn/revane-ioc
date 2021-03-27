import { PostConstruct } from '../src/revane-ioc/RevaneIOC'

export default class Test10 {
  @PostConstruct
  postConstruct (): void {
    throw new Error('Booom')
  }
}
