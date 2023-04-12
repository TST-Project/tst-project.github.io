import DataTable from 'datatables.net';
import 'datatables.net-responsive';
import 'datatables.net-fixedheader';
//import 'datatables.net-responsive-dt';
import './lib/customsort.mjs';
import createSqlWorker from './lib/sqlWorker.mjs';
import {toolTipMouseover} from './lib/toolTip.mjs';
import Hypher from 'hypher';
import {hyphenation_ta_Latn} from './lib/ta-Latn.mjs';
import {hyphenation_sa} from './lib/sa.mjs';

const hyphenator = {
    ta: new Hypher(hyphenation_ta_Latn),
    sa: new Hypher(hyphenation_sa)
};

const allcolumns = new Map([
    ['shelfmark', {title: 'shelfmark', type: 'shelfmark', sql: 'mss.filename, shelfmark', 
                  post: (res) => `<a href="https://tst-project.github.io/mss/${res.filename}" class="shelfmark">${res.shelfmark}</a>`}],
    ['repository', {sql: 'repository', title: 'repository'}],
    ['title', {sql: 'title', title: 'title', type: 'tamil', post: (res) => hyphenateHTMLString(res.title)}],
    ['languages', {sql: 'languages', title: 'languages'}],
    ['material', {sql: 'material', title: 'material'}],
    ['width', {sql: 'width', title: 'width'}],
    ['height', {sql: 'height', title: 'height'}],
    ['extent', {sql: 'extent', title: 'extent', type: 'extent'}],
    ['date', {sql: 'date', title: 'date', type: 'daterange'}],
    ['images', {sql: 'images', title: 'images', post: (res) => res.images ? `<span class="smallcaps">${res.images}</span>` : ''}],

    ['blessing', {sql: 'paratexts_blessing.text AS blessing', title: 'blessing', table: 'paratexts_blessing', type: 'tamil', post: (res) => hyphenateHTMLString(res.blessing)}],
    ['colophon', {sql: 'paratexts_colophon.text AS colophon', title: 'colophon', table: 'paratexts_colophon', type: 'tamil', post: (res) => hyphenateHTMLString(res.colophon)}],
    ['header', {sql: 'paratexts_header.text AS header', title: 'header', table: 'paratexts_header', type: 'tamil', post: (res) => hyphenateHTMLString(res.header)}],
    ['invocation', {sql: 'paratexts_invocation.text AS invocation', title: 'invocation', table: 'paratexts_invocation', type: 'tamil', post: (res) => hyphenateHTMLString(res.invocation)}],
    ['ownership-statement', {sql: '[paratexts_ownership-statement].text AS [ownership-statement]', title: 'ownership statement', table: '[paratexts_ownership-statement]', type: 'tamil', post: (res) => hyphenateHTMLString(res['ownership-statement'])}],
    ['satellite-stanza', {sql: '[paratexts_satellite-stanza].text AS [satellite-stanza]', title: 'satellite stanza', table: '[paratexts_satellite-stanza]', type: 'tamil', post: (res) => hyphenateHTMLString(res['satellite-stanza'])}],
    ['table-of-contents', {sql: '[paratexts_table-of-contents].text AS [table-of-contents]', title: 'table of contents', table: '[paratexts_table-of-contents]', type: 'tamil', post: (res) => hyphenateHTMLString(res['table-of-contents'])}],
    ['paratext_title', {sql: 'paratexts_title.text AS paratext_title', title: 'title', table: '[paratexts_title]', type: 'tamil', post: (res) => hyphenateHTMLString(res.paratext_title)}],
    ['tbc', {sql: 'paratexts_TBC.text AS [tbc]', title: 'TBC', table: '[paratexts_TBC]', type: 'tamil', post: (res) => hyphenateHTMLString(res.tbc)}],
    
    ['g_below-base', {sql: '[g_below-base].context AS [g_below-base], [g_below-base].text as [g_below-base_sort]', title: 'ligature', table: '[g_below-base]', type: 'tamil', render: {_: 'display', sort: 'sort'}, post: (res) => {return {display: hyphenateHTMLString(res['g_below-base']), sort: res['g_below-base_sort']};}}],
    ['g_post-base', {sql: '[g_post-base].context AS [g_post-base], [g_post-base].text as [g_post-base_sort]', title: 'ligature', table: '[g_post-base]', type: 'tamil', render: {_: 'display', sort: 'sort'}, post: (res) => {return {display: hyphenateHTMLString(res['g_post-base']), sort: res['g_post-base_sort']};}}],
    ['synch', {sql: 'synch', title: 'unit'}],
    ['milestone', {sql: 'milestone, facs', title: 'page/folio', post: (res) => res.milestone && res.facs ? `<a href="https://tst-project.github.io/mss/${res.filename}?facs=${res.facs}">${res.milestone}</a>` : res.milestone}],
    ['placement', {sql: 'placement', title: 'placement'}],
]);

    const old_shelfmarks = ['Ancien fonds','Ariel','w/d','Burnouf','Cordier','Ducler','Haas','Reydellet','Vinson'];
    for(const shelfmark of old_shelfmarks)
        allcolumns.set(`old_shelfmarks(${shelfmark})`, {title: 'old shelfmark', type: 'shelfmark', sql: `json_extract(old_shelfmarks, '$.${shelfmark}') AS 'old_shelfmarks(${shelfmark})'`});

const hyphenate = (el) => {
    const walker = document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    let curnode = walker.nextNode();
    while(curnode) {
        if(curnode.parentNode.lang.startsWith('ta'))
            curnode.data = hyphenator.ta.hyphenateText(curnode.data);
        else if(curnode.parentNode.lang.startsWith('sa'))
            curnode.data = hyphenator.sa.hyphenateText(curnode.data);
        curnode = walker.nextNode();
    }
};

const hyphenateHTMLString = (str) => {
    const container = document.createElement('div');
    container.innerHTML = str;
    hyphenate(container);
    return container.innerHTML;
};

const getData = async (table) => {
    
    const worker = await createSqlWorker('/mss/db/meta.db');
    //const worker = await createSqlWorker('/meta.db');
    
    const defaultfields = ['shelfmark','repository','title','languages','material','extent','date','images'];

    const joins = [];
    const conditions = [];

    const sqlcolumns = table.dataset.sqlcolumns;
    const columnfields = sqlcolumns ? sqlcolumns.split(', ') : defaultfields;
    const columnsarr = [];

    for(const field of columnfields) {
        const config = allcolumns.get(field);
        if(!config) continue;
        columnsarr.push(config.sql);
        if(config.table)
            joins.push(`INNER JOIN ${config.table} ON ${config.table}.filename = mss.filename`);
    }
    
    const collection = table.dataset.collection;
    if(collection) {
        joins.push('INNER JOIN collections ON collections.filename = mss.filename');
        conditions.push(`collections.collection = "${collection}"`);
    }
    
    const repository = table.dataset.repository;
    if(repository) conditions.push(`mss.repository = "${repository}"`);
    
    const collector = table.dataset.collector;
    if(collector) {
        joins.push('INNER JOIN persons ON persons.filename = mss.filename');
        conditions.push(`persons.persname = "${collector}" AND persons.role = "collector"`);
    }

    const columnstr = columnsarr.join(', ') + ' ';
    const joinstr = joins.join(' ');
    const conditionstr = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await worker.db.query(`SELECT ${columnstr} FROM mss ${joinstr} ${conditionstr} ORDER BY mss.filename`);
    const rows = result.map(obj => {
        const ret = {};
        for(const field of columnfields) {
            const config = allcolumns.get(field);
            if(!config) ret[field] = obj[field] || '';
            else ret[field] = config.post ? (config.post(obj) || '') : obj[field];
        }
        return ret;
    });
    
    const columns = columnfields.map(field => {
          const config = allcolumns.get(field);
          const ret = {data: field, title: config.title};
          if(config.type) ret.type = config.type;
          if(config.render) ret.render = config.render;
          return ret;
    });
    /*
    const worker2 = await createSqlWorker('https://tst-project.github.io/mss/db/fts.db');
    const result2 = await worker2.db.query(`SELECT shelfmark, snippet(fulltext,3,'<span class="highlit">','</span>','…',200) AS snippet FROM fulltext WHERE text MATCH "ceyam" ORDER BY rank`);
    console.log(result2);
    */
    return {rows: rows, columns: columns};
};

window.addEventListener('load', async () => {
    const table = document.getElementById('index');
    if(!table)  return;

    const data = await getData(table);

    const dataTable = new DataTable('#index', {
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
          data: data.rows,
          columns: data.columns,
          responsive: true,
          //fixedHeader: true

  });
  document.getElementById('spinner').style.display = 'none';
  const tabs = document.getElementById('tabright');
  if(tabs) tabs.style.visibility = 'visible';
  document.getElementById('index').style.visibility = 'visible';
  table.addEventListener('mouseover',toolTipMouseover);
});