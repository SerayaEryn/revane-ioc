export default class Controller {
  addRoutes (router): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    router.get('/', (req, res, next) => {
      res.send('success')
    })
  }
}
