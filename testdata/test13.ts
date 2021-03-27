export default class Controller {
  addRoutes (router): void {
    router.get('/', (req, res, next) => {
      res.send('success')
    })
  }
}
