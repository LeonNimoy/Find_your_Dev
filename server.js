const fs = require('fs');
const http = require('http');

const replaceTemplate = (temp, developer) => {
  let output = temp.replace(/{%DEVNAME%}/g, developer.devName);
  output = output.replace(/{%IMAGE%}/g, developer.image);
  output = output.replace(/{%BUDGET%}/g, developer.budget);
  output = output.replace(/{%FROM%}/g, developer.from);
  output = output.replace(
    /{%PROGRAMMINGLANGUAGES%}/g,
    developer.programmingLanguages,
  );
  output = output.replace(/{%DESCRIPTION%}/g, developer.description);
  output = output.replace(/{%ID%}/g, developer.id);

  if (!developer.organic) {
    output = output.replace(/{%NOT_WORKING%}/g, 'not-working');
  } else {
    output = output.replace(/{%NOT_WORKING%}/g, '');
  }
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/src/pages/index.html`,
  'utf-8',
);
const tempCard = fs.readFileSync(
  `${__dirname}/src/pages/templateCards.html`,
  'utf-8',
);
// const tempProduct = fs.readFileSync(
//   `${__dirname}/templates/template-developer.html`,
//   'utf-8',
// );

const data = fs.readFileSync(`${__dirname}/src/data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview page
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObject
      .map(el => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%DEVELOPERS_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathName === '/developer') {
    res.end('This is the PRODUCT');
    // API
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to the requests on port 8000');
});
