const express = require("express");
const app = express()
const PORT = 5000

app.use(express.json())

app.get("/user", (request, response) => {
    response.send("Hello World new")
})

app.post("/user", (request, response) => {
    console.log(request.body)
    response.send("Hello World Post")
})

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))