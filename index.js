import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
async function readHtmlFile(fileName) {
    try {
        const filePath = join(dirname(fileURLToPath(import.meta.url)), fileName);
        const data = await readFile(filePath, 'utf8');
        return { success: true, data }
    }
    catch (err) {
        console.error(`Error reading file:${fileName}`, err.message);
        return { success: false, error: err.message }
    }
}

const server = createServer(async (req, res) => {
    let fileName;
    switch (req.url) {
        case '/':
            fileName = 'index.html';
            break;
        case '/about':
            fileName = 'about.html';
            break;
        case '/contat-me':
            fileName = 'contact-me.html';
            break;
        default:
            // Handle 404 for unknown routes
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Page Not Found</h1><p>Available routes: <a href="/">Home</a> | <a href="/about">About</a></p>| <a href="/contact-me">contact-me</a></p>');
            return;
    }

    const result = await readHtmlFile(fileName);

    if (result.success) {
        res.end(result.data);
    } else {
        res.statusCode = 500;
        res.end('Error message');
    }
});

const port = 8080;

server.listen(port, () => {
    console.log(`Server running at http://${port}/`);
});
