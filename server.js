import { Database } from "jsr:@db/sqlite@0.12"
import { DB_PATH, DATA_DIR } from "./util.js"

await Deno.mkdir(DATA_DIR, { recursive: true })
const db = new Database(DB_PATH)
db.exec(`
  CREATE TABLE IF NOT EXISTS feeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

Deno.serve(async req => {
  const { method, headers, url } = req
  const { pathname } = new URL(url)
  let res = "not found"
  const head = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  try {
    console.log("method", method, "pathname", pathname)
    if (method === "GET" && pathname === "/vite.svg") {
      const file = await Deno.readFile("./public/vite.svg")
      res = new TextDecoder().decode(file)
      head["Content-Type"] = "image/svg+xml"
    } else if (method === "GET" && pathname === "/") {
      const file = await Deno.readFile("./dist/index.html")
      res = new TextDecoder().decode(file)
      head["Content-Type"] = "text/html"
    } else if (method === "GET" && pathname === "/feeds") {
      res = JSON.stringify(db.prepare("SELECT id, url, created_at FROM feeds").all())
      head["Content-Type"] = "application/json"
    } else if (method === "POST" && pathname === "/feed") {
      const data = await req.formData()
      const feed = data.get("url")
      if (!feed) throw "URL is required"
      console.log("adding URL", feed)
      db.exec("INSERT INTO feeds(url) VALUES(?)", feed)
      res = JSON.stringify(db.prepare("SELECT id, url, created_at FROM feeds").all())
    } else {
      throw "404"
    }
    return new Response(res, { headers: head })
  } catch (err) {
    console.error(method, pathname, err)
    if (err.code === 21) {
      console.log("code 21")
    }
    if (typeof err === 'string') {
      return new Response(err, { status: err === "404" ? 404 : 400 })
    }
    return new Response(err.message || err, { status: 500 })
  }
})
