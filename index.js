const express = require('express');
const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
