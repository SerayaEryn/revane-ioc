export default class Controller {
  options: { path: string }
  constructor () {
    this.options = { path: '/test' }
  }

  middleware (req, res, next): void {
    next()
  }
}
