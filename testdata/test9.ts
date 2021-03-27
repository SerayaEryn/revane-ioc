import { Controller } from '../src/revane-ioc/RevaneIOC'

@Controller
export default class Test9 {
  invoked: boolean = false
  doSomething (): void {
    this.invoked = true
  }

  addRoutes (router): void {
    router.get()
  }

  middleware (req, res, next): void {
    next()
  }
}
