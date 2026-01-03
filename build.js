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
            // Adjust links for static: /page -> /page.html
            let adjustedHtml = html;
            routes.forEach(r => {
                if (r.path !== '/') {
                    const link = r.path;
                    const htmlLink = r.path + '.html';
                    adjustedHtml = adjustedHtml.replace(new RegExp(`href="${link}"`, 'g'), `href="${htmlLink}"`);
                }
            });
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