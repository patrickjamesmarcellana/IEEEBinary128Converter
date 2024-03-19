import browserify from "browserify"
import esmify from "esmify"
import express from "express"
import fs from "fs"
import { router } from "./src/routes/routes.js"
import "dotenv/config"
import watchify from "watchify"

const app = express()

app.use("/static", express.static("public"))
app.use(express.urlencoded({extended: true}));
app.use("", router)
app.set("views", "./src/views");

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.sendStatus(400)
    next()
})

app.listen(process.env.PORT, () => {
    console.log(`IEEE-754 Binary-128 Floating Point Converter App now listening to port ${process.env.PORT}...`)
})

const b = browserify(['public/js/index.js', 'converter.js'], {
    plugin: [watchify, esmify]
})
const bunlde = () => {
    b.bundle()
        .on('error', console.error)
        .pipe(fs.createWriteStream('public/js/bundle.js'))
}
b.on('update', bunlde)
bunlde()
