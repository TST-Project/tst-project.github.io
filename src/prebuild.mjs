import fs from 'fs';
import path from 'path';
import jsdom from 'jsdom';

const getIndices = path => {
    const files = [];
    for (const file of fs.readdirSync(path)) {
        if(file.startsWith('node_modules') || file.startsWith('dist') || file.startsWith('chaff')) continue;
        const fullPath = path + '/' + file;
        if(fs.lstatSync(fullPath).isDirectory())
            getIndices(fullPath).forEach(x => files.push(file + '/' + x));
        else if(file.endsWith('index.html')) {
            files.push(file);
        }
    }
    return files;
};

const makeHtml = (str) => (new jsdom.JSDOM(str)).window.document;

const readHtml = (str) => makeHtml(fs.readFileSync(str,{encoding: 'utf-8'}));

const template = readHtml('template.html');
const templateMenu = template.getElementById('menu');
const templateFooter = template.querySelector('article > footer');

const files = getIndices('./');
for(const file of files) {
    const html = readHtml(file);

    const menu = html.getElementById('menu');
    if(menu)
        menu.replaceWith(templateMenu.cloneNode(true));
    if(file === 'index.html')
        html.querySelector('.logo').remove();

    const footer = html.querySelector('article > footer');
    if(footer)
        footer.replaceWith(templateFooter.cloneNode(true));

    fs.writeFileSync(file,html.documentElement.outerHTML,{encoding: 'utf8'});
}
