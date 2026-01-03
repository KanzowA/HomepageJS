const express = require('express');
const path = require('path');

const app = express();
exports.app = app;
const PORT = 3000;

/* Tell Express where static files are */
app.use(express.static(path.join(__dirname, 'public')));

/* Tell Express to use EJS */
app.set('view engine', 'ejs');

/* Tell Express where views are */
app.set('views', path.join(__dirname, 'views'));

// Header Files

app.get('/', (req, res) => {
    res.render('index'); // views/index.ejs
});

app.get('/aktuelles', (req, res) => {
    res.render('aktuelles'); // views/aktuelles.ejs
});

app.get('/naechste-termine', (req, res) => {
    res.render('naechste-termine'); // views/naechste-termine.ejs
});

app.get('/unsere-mannschaften', (req, res) => {
    res.render('unsere-mannschaften'); // views/unsere-mannschaften.ejs
});

app.get('/mitglied-werden', (req, res) => {
    res.render('mitglied-werden'); // views/mitglied-werden.ejs
});

app.get('/dwz-liste', (req, res) => {
    res.render('dwz-liste'); // views/dwz-liste.ejs
});

app.get('/archiv', (req, res) => {
    res.render('archiv'); // views/archiv.ejs
});

app.get('/verschiedenes', (req, res) => {
    res.render('verschiedenes'); // views/verschiedenes.ejs
});

// Footer Files

app.get('/impressum', (req, res) => {
    res.render('impressum'); // views/impressum.ejs
});

app.get('/datenschutzerklaerung', (req, res) => {
    res.render('datenschutzerklaerung'); // views/datenschutzerklaerung.ejs
});

app.get('/statut', (req, res) => {
    res.render('statut'); // views/statut.ejs
});

app.get('/rechtliches', (req, res) => {
    res.render('rechtliches'); // views/rechtliches.ejs
});

app.get('/kontakt', (req, res) => {
    res.render('kontakt'); // views/kontakt.ejs
});

app.get('/vorstand', (req, res) => {
    res.render('vorstand'); // views/vorstand.ejs
});

// Other Files (Veschiedenes Dropdown)

app.get('/freunde', (req, res) => {
    res.render('freunde'); // views/freunde.ejs
});

app.get('/lustiges', (req, res) => {
    res.render('lustiges'); // views/lustiges.ejs
});

app.get('/vereinsmeisterschaften', (req, res) => {
    res.render('vereinsmeisterschaften'); // views/vereinsmeisterschaften.ejs
});

app.get('/schnellschach-meisterschaften', (req, res) => {
    res.render('schnellschach-meisterschaften'); // views/schnellschach-meisterschaften.ejs
});

app.get('/rekorde', (req, res) => {
    res.render('rekorde'); // views/rekorde.ejs
});

app.get('/schulschach', (req, res) => {
    res.render('schulschach'); // views/schulschach.ejs
});

app.get('/sonstiges', (req, res) => {
    res.render('sonstiges'); // views/sonstiges.ejs
});

// Other Files (Archiv Dropdown)

app.get('/aeltere-beitraege', (req, res) => {
    res.render('aeltere-beitraege'); // views/aeltere-beitraege.ejs
});

app.get('/chronik-2008-2014', (req, res) => {
    res.render('chronik-2008-2014'); // views/chronik-2008-2014.ejs
});

app.get('/chronik-2015-2021', (req, res) => {
    res.render('chronik-2015-2021'); // views/chronik-2015-2021.ejs
});

const dwzListeRoute = require('./routes/dwz_liste_retrieve') 
app.use('/dwz-liste-dynamic', dwzListeRoute);

/* Start server */
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
