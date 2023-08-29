const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');


/////////////////////////////////////////////FILES

/* const hello = "hoello"
console.log(hello); */

//blocking, asynchronous way
/* const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `this is what we know about the apple:  ${textIn}./nCreate on ${Date.now()}`; 
fs.writeFileSync('./txt/output.txt', textOut);
console.log('Flie written!⚠️ ');

//Non-blocking, asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (err,data1)=>{
    if(err) return console.log('ERROR!💀');

    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err,data2)=>{
        console.log(data2);
        fs.readFile(`./txt/append.txt`, 'utf-8', (err,data3)=>{
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}/n${data3}`, 'utf-8', err=>{
                console.log('your file has been written 🥸 🤙');
            })
        });
    }); 
});
console.log('will read file');
 */
/////////////////////////////////////////////Server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-products.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName))
console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)
    
    //overview page
    if (pathname === '/' || pathname === '/overview') {
        
        res.writeHead(200, { 'Content-type': 'text/html' });


        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);


        //Product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

        //api PAGE
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data);

        //not found
    } else {

        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'blue label'
        });
        res.end('<h1>this port not found!<h1> ', pathname)
    }

});

const port = 7000;
server.listen(port, '127.0.0.1', () => {
    console.log(`Listen to requests on port ${port}`);
})

