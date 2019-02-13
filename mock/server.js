const JServer = require('json-server')
const {dbHandler, rewriterHandler} = require('./handlers')

const server = JServer.create()
const middleware = JServer.defaults()

server.use(middleware)
// 获取db数据
const db = dbHandler('./data')

server.use(JServer.rewriter(rewriterHandler(db)))

// Use router
const router = JServer.router(db)
server.use(router)
// 返回自定义格式数据
router.render = (req, res) => {
  res.jsonp({
    data: res.locals.data,
    status: 0,
    message: 'success'
  })
}
server.listen(8000, () => {
  console.log('JSON Server is running')
})
