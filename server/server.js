const express = require('express')
const app = express()
const path = require('path');
const router = express.Router();

router.get('/version', (req, res) => {
    res.json({ version: '1.0.0' })
});

router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(process.env.UI_URL_PREFIX, router);
app.use(express.json())
app.use(express.static(__dirname));
app.listen(process.env.port || process.env.PORT || 6060)