const path = require('path');
const express = require('express')
const globby = require('globby');
const { spawn } = require('child_process');


const app = express()
const port = 3000
const sketchesFolder = "../" // trailing slash!
let nodeProcess = spawn('ls')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
    const sketches = await globby(sketchesFolder + "{examples,.}/*.js", { "ignore": ['launcher']})
    const sketchesFilenames = sketches.map(p => p.slice(sketchesFolder.length))
    // res.send('Hello World!' + JSON.stringify(sketches))
    res.render('index', { title: 'Hey', message: 'Hello there!', sketches: sketchesFilenames })
})

app.post('/run', (req, res) => {
    const sketchPath = req.query.sketch
    
    try {
        nodeProcess.kill('SIGINT')
        nodeProcess = spawn("canvas-sketch", ['--open', sketchPath], {cwd: '../'})
        res.end('Launched sketch!');
    }
    catch(e) {
        res.error(e)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port} -> http://localhost:3000`)
})