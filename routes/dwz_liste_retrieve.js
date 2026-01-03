// dwz_liste.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { app } = require('../app');
const dwzListeRoute = require('../routes/dwz_liste_retrieve');

// Route to serve the DWZ table dynamically
router.get('/', async (req, res) => {
    try {
        const url = 'https://www.schachbund.de/verein/70353.html';
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        // Extract the table by ID
        const table = $('#dewisTable');

        const removeCols = [1, 2, 4]; // example: remove first and fourth columns

        table.find('tr').each((i, row) => {
            const $row = $(row);
            removeCols
                .slice() // copy array
                .sort((a,b) => b-a) // remove from highest index first
                .forEach(idx => {
                    $(row).find('th, td').eq(idx).remove();
                });
        });

        table.find('tr').each((i, row) => {
            $(row).find('td').each((j, cell) => {
                const text = $(cell).text();
                // Split by comma, reverse, join
                if (text.includes(',')) {
                    const parts = text.split(',').map(p => p.trim());
                    $(cell).text(parts.reverse().join(' '));
                }
            });
        });

        // Minimal HTML page for iframe
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>DWZ Tabelle</title>
                <style>
                    table.dwz { width: 100%; font-family: Lucida Sans, sans-serif;}
                    table.dwz th, table.dwz td {
                        padding: 0.4em 0.6em;
                    }

                    table.dwz th {
                        background-color: #f8f8f8;
                        color: #b40808;
                        font-weight: 600;
                    }

                    table.dwz tr:nth-child(even) td {
                        background-color: #f2f2f2;
                    }

                    table.dwz tr:hover td {
                        background-color: #ffe0e0;
                    }
                </style>
            </head>
            <body>
                <table class="dwz" id="dewisTable">
                    ${table.html()}
                </table>
            </body>
            </html>
        `);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching DWZ table.');
    }
});

module.exports = router


