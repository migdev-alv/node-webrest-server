import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
    console.log(req.url);

    /*res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>URL: ${req.url}</h1>`);
    res.end();*/

    /*const data = {
        name: 'John Doe',
        age: 30,
        city: 'New York',
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    //res.write(JSON.stringify(data));
    res.end(JSON.stringify(data));*/

    if (req.url === '/') {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlFile);
        return;
    }
    /*else if (req.url === '/css/styles.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync('./public/css/styles.css', 'utf8'));
    }
    else if (req.url === '/js/app.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(fs.readFileSync('./public/js/app.js', 'utf8'));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end();
    }*/

    if (req.url?.endsWith('js')) {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(fs.readFileSync('./public/js/app.js', 'utf8'));
    }
    else if (req.url?.endsWith('css')) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync('./public/css/styles.css', 'utf8'));
    }

});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});