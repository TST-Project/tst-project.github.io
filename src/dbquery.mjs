import createSqlWorker from './lib/sqlWorker.mjs';
import SqlString from 'sqlstring-sqlite';
import {vanillaSelectBox} from './lib/vanillaSelectBox.mjs';
import {makeTable, getData, allcolumns} from './table.mjs';
import {Transliterate} from './lib/transliterate.mjs';

const getPersons = async (checked) => {
    const spinner = document.getElementById('personsspinner');
    spinner.style.display = 'flex';

    const worker = await createSqlWorker('/mss/db/meta.db');
    const results = await worker.db.query("SELECT DISTINCT persname FROM persons WHERE role != ''");

    spinner.style.display = 'none';
    
    const select = document.getElementById('personsselect');
    for(const result of results) {
        const option = document.createElement('option');
        option.value = SqlString.escape(result.persname);
        option.append(' ' + result.persname);
        if(checked && checked.includes(option.value)) {
            option.toggleAttribute('selected');
        }
        select.append(option);
    }
    select.style.display = 'block';
    const box = new vanillaSelectBox('#personsselect',
        {
            'maxHeight': 500,
            'search': true,
            'placeHolder': 'search names...',
        }
    );
};

const findchecked = (par) => {
    const fieldset = par.querySelectorAll('input');
    if(fieldset.item(1).type === 'radio') {
        for(const radio of fieldset)
            if(radio.checked) return radio.value;
    }
    else {
        const ret = [];
        for(const checkbox of fieldset)
            if(checkbox.checked) ret.push(checkbox.value);
        return ret;
    }
};

const submitQuery = async (e) => {
    const params = [];
    const searchtext = document.getElementById('queryinput')?.value;
    const maintable = findchecked(document.getElementById('maincolumn'));
    const columns = findchecked(document.getElementById('othercolumns'));
    const persons = [...document.getElementById('btn-group-personsselect').querySelectorAll('li.active')].filter(el => el.dataset.value !== 'all');

    if(maintable !== 'mss') columns.unshift(maintable);
    
    params.push(['sqlcolumns', columns.join(', ')]);

    if(searchtext) {
        params.push(['searchcolumn',maintable]);
        params.push(['searchtext',searchtext]);
    }
    
    if(persons.length > 0)
        params.push(['persons',JSON.stringify([...persons].map(el => el.dataset.value))]);

    const urlParams = new URLSearchParams();
    for(const param of params)
        urlParams.set(...param);
    window.location.search = urlParams;
};

const updateColumnsList = (e) => {
    const checked = document.getElementById('mss').checked;
    for(const el of document.getElementsByClassName('notmss')) {
        if(checked) {
            el.style.display = 'none';
            const input = el.querySelector('input');
            if(input) input.checked = false;
        }
        else
            el.style.display = 'unset';
    }
};

const getQuery = (table) => {
    let querydesc = '';
    const urlParams = new URLSearchParams(window.location.search);
    
    const searchtext = urlParams.get('searchtext');
    if(searchtext) {
        table.dataset.searchtext = SqlString.escape(`%${Transliterate(searchtext)}%`);
        document.getElementById('queryinput').value = searchtext;

        const searchcolumn = urlParams.get('searchcolumn');
        if(searchcolumn === 'mss')
            table.dataset.searchcolumn = 'mss.shelfmark';
        else {
            const coldata = allcolumns.get(searchcolumn);
            const columnname = coldata.searchcolumn || coldata.table + '.text';
            table.dataset.searchcolumn = columnname;
        }
        
        document.getElementById(searchcolumn).checked = true;

        const maincolname = document.querySelector(`label[for='${searchcolumn}']`).textContent;
        querydesc += `<p><strong>Search:</strong> <em>${searchtext}</em> <strong>in</strong> ${maincolname}</p>`;
    }

    const sqlcolumns = urlParams.get('sqlcolumns');
    table.dataset.sqlcolumns = sqlcolumns;
    const collist = [];
    for(const col of sqlcolumns.split(', ')) {
        document.getElementById(col).checked = true;
        collist.push(document.querySelector(`label[for='${col}']`).textContent);
    }
    querydesc += `<p><strong>Table columns:</strong> ${collist.join(', ')}`;

    const persons = urlParams.get('persons');
    let personsarr = [];
    if(persons) {
        personsarr = JSON.parse(persons);
        table.dataset.persons = personsarr.join(', ');
        const personsstr = personsarr.map(str => str.replace(/^'/,'').replace(/'$/,'')).join(', ');
        querydesc += `<p><strong>Persons involved:</strong> ${personsstr}`;
    }

    querydesc += '<p><button id="revisequery" style="display: none">Revise query</button></p>';
    const qparameters = document.getElementById('queryparameters');
    
    qparameters.innerHTML = querydesc;
    document.getElementById('revisequery').addEventListener('click',reviseQuery.bind(null, personsarr));

};

const reviseQuery = (personsarr) => {
    document.getElementById('index_wrapper').style.display = 'none';
    document.getElementById('queryparameters').style.display = 'none';
    document.getElementById('tabright').style.display = 'none';
    document.getElementById('network').style.display = 'none';
    prepForm(personsarr);
};

const prepForm = (personsarr) => {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('queryparameters').style.display = 'none';
    document.getElementById('querycontainer').style.display = 'flex';
    getPersons(personsarr);

    const maincolumn = document.getElementById('maincolumn');
    for(const el of maincolumn.querySelectorAll('input'))
        el.addEventListener('change',updateColumnsList);

    document.getElementById('querybutton').addEventListener('click',submitQuery);
};

window.addEventListener('load', async () => {

    if(window.location.search !== '') {
        const table = document.getElementById('index');
        getQuery(table);
        document.getElementById('queryparameters').style.display = 'flex';
        makeTable(await getData(table), table);

        document.getElementById('revisequery').style.display = 'block';
    }
    else
        prepForm();
});
