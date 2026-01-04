const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// List of routes and their corresponding EJS files
const routes = [
    { path: '/', view: 'index' },
    { path: '/aktuelles', view: 'aktuelles' },
    { path: '/naechste-termine', view: 'naechste-termine' },
    { path: '/unsere-mannschaften', view: 'unsere-mannschaften' },
    { path: '/mitglied-werden', view: 'mitglied-werden' },
    { path: '/dwz-liste', view: 'dwz-liste' },
    { path: '/archiv', view: 'archiv' },
    { path: '/verschiedenes', view: 'verschiedenes' },
    { path: '/impressum', view: 'impressum' },
    { path: '/datenschutzerklaerung', view: 'datenschutzerklaerung' },
    { path: '/statut', view: 'statut' },
    { path: '/rechtliches', view: 'rechtliches' },
    { path: '/kontakt', view: 'kontakt' },
    { path: '/vorstand', view: 'vorstand' },
    { path: '/freunde', view: 'freunde' },
    { path: '/lustiges', view: 'lustiges' },
    { path: '/vereinsmeisterschaften', view: 'vereinsmeisterschaften' },
    { path: '/schnellschach-meisterschaften', view: 'schnellschach-meisterschaften' },
    { path: '/rekorde', view: 'rekorde' },
    { path: '/schulschach', view: 'schulschach' },
    { path: '/sonstiges', view: 'sonstiges' },
    { path: '/aeltere-beitraege', view: 'aeltere-beitraege' },
    { path: '/chronik-2008-2014', view: 'chronik-2008-2014' },
    { path: '/chronik-2015-2021', view: 'chronik-2015-2021' },
    // Add more routes as needed
];

// Output directory
const outputDir = path.join(__dirname, 'dist');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Render each route to HTML
routes.forEach(route => {
    const viewPath = path.join(__dirname, 'views', route.view + '.ejs');
    const outputPath = path.join(outputDir, route.path === '/' ? 'index.html' : route.path.slice(1) + '.html');

    // Ensure subdirectories exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Render EJS (assuming no dynamic data for static generation)
    ejs.renderFile(viewPath, {}, (err, html) => {
        if (err) {
            console.error(`Error rendering ${route.view}:`, err);
        } else {
            // Adjust links for static: /page -> /page.html and relative page -> page.html
            let adjustedHtml = html;
            routes.forEach(r => {
                if (r.path !== '/') {
                    const link = r.path.slice(1); // remove leading /
                    const htmlLink = link + '.html';
                    adjustedHtml = adjustedHtml.replace(new RegExp(`href="${link}"`, 'g'), `href="${htmlLink}"`);
                    adjustedHtml = adjustedHtml.replace(new RegExp(`href="/${link}"`, 'g'), `href="${htmlLink}"`);
                    // Also adjust with anchors
                    adjustedHtml = adjustedHtml.replace(new RegExp(`href="${link}#`, 'g'), `href="${htmlLink}#`);
                }
            });
            // Adjust asset paths: /style.css -> public/style.css, /Images/ -> public/Images/, etc.
            adjustedHtml = adjustedHtml.replace(/href="\/style\.css"/g, 'href="public/style.css"');
            adjustedHtml = adjustedHtml.replace(/src="\/script\.js"/g, 'src="public/script.js"');
            adjustedHtml = adjustedHtml.replace(/href="\/Images\//g, 'href="public/Images/');
            adjustedHtml = adjustedHtml.replace(/src="\/Images\//g, 'src="public/Images/');
            adjustedHtml = adjustedHtml.replace(/href="\/Files\//g, 'href="public/Files/');
            adjustedHtml = adjustedHtml.replace(/src="\/Files\//g, 'src="public/Files/');
            // Adjust iframe src for dwz-liste
            adjustedHtml = adjustedHtml.replace(/src="\/dwz-liste-dynamic"/g, 'src="dwz-liste-dynamic.html"');
            fs.writeFileSync(outputPath, adjustedHtml);
            console.log(`Generated: ${outputPath}`);
        }
    });
});

// Copy public folder to dist
const publicDir = path.join(__dirname, 'public');
const copyRecursive = (src, dest) => {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(child => {
            copyRecursive(path.join(src, child), path.join(dest, child));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};
copyRecursive(publicDir, path.join(outputDir, 'public'));

console.log('Static site generated in dist/');