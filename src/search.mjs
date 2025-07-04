//import createSqlWorker from './lib/sqlWorker.mjs';
import openDb from './lib/sqlite.mjs';
import SqlString from 'sqlstring-sqlite';
import DataTable from 'datatables.net';
import {hyphenateHTMLString} from './lib/hyphenate.mjs';
import {Transliterate} from './lib/transliterate.mjs';

const ftssearch = async (query) => {
    
    document.getElementById('spinner').style.display = 'flex';

    //const worker = await createSqlWorker('/mss/db/fts.db');
    const worker = await openDb('/mss/db/fts.db');

    const literated = Transliterate(query);
        
    const clean = SqlString.escape(literated)
                    .replace(/"/g,'""')
                    .replace(/^'/,`'"`)
                    .replace(/'$/,`"'`);

    const result = await worker.exec(
        `SELECT filename, shelfmark, title, snippet(fulltext,3,'<span class="highlit">','</span>','…',200) `+
         `AS snippet FROM fulltext WHERE text MATCH ${clean} ORDER BY rank`
    );

    document.getElementById('spinner').style.display = 'none';

    if(result.length === 0) {
        document.getElementById('noresulttext').textContent = literated;
        document.getElementById('noresult').style.visibility = 'visible';
        return;
    }

    const data = result[0].values.map(el => {
        const shelfmark = `<a href="/mss/${el[0]}" class="shelfmark">${el[1]}</a>`;
        const title = hyphenateHTMLString(el[2]);
        return [shelfmark, title, el[3]];

    });

    document.getElementById('index').style.visibility = 'visible';

    const ftstable = new DataTable('#index', {
          searchable: true,
          'language': {
              'search': 'Filter:'
          },
          paging: true,
          pageLength: 100,
          lengthMenu: [
            [25, 50, 100, -1],
            [25, 50, 100, 'All']
          ],
          sortable: true,
          scrollX: true,
          data: data,
          columns: [
          { title: 'shelfmark', type: 'shelfmark' },
          { title: 'title', type: 'tamil'},
          { title: 'search result' }
          ],

  });
};
const newPage = (val) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('q',val);
    window.location.search = urlParams;
};
document.getElementById('ftsinput').addEventListener('keyup', e => {
    if(event.keyCode !== 13)  return;

    const val = e.target.value.trim();
    if(val !== '') newPage(val);
});
document.getElementById('ftsbutton').addEventListener('click', e => {
    const val = document.getElementById('ftsinput').value.trim();
    if(val !== '') newPage(val);
});

const getquery = e => {
    const inputbox = document.getElementById('ftsinput');
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if(query) {
        inputbox.value = query;
        ftssearch(query);
    }
    inputbox.style.visibility = 'visible';
};

window.addEventListener('DOMContentLoaded', getquery);

