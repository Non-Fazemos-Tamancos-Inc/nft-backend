const express = require("express");

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/test", async (req, res) => {
    await main();

    res.json({"e": 2});
})

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });

    server.close((err) => {
        console.log('server closed')
        process.exit(err ? 1 : 0)
    })
});

let server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
