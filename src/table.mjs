import DataTable from 'datatables.net';
//import 'datatables.net-responsive';
//import 'datatables.net-fixedheader';
import './lib/customsort.mjs';
import createSqlWorker from './lib/sqlWorker.mjs';
import {toolTipMouseover} from './lib/toolTip.mjs';
import {hyphenateHTMLString} from './lib/hyphenate.mjs';
import {vanillaSelectBox} from './lib/vanillaSelectBox.mjs';

const allcolumns = new Map([
    ['shelfmark', {title: 'shelfmark', type: 'shelfmark', sql: 'mss.filename, shelfmark', 
                  post: (res) => `<a href="/mss/${res.filename}" class="shelfmark">${res.shelfmark}</a>`}],
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
    
    ['g_below-base', {sql: '[g_below-base].context AS [g_below-base], [g_below-base].text as [g_below-base_sort]', title: 'ligature', searchcolumn: '[g_below-base].text', table: '[g_below-base]', type: 'tamil', render: {_: 'display', sort: 'sort'}, post: (res) => {return {display: hyphenateHTMLString(res['g_below-base']), sort: res['g_below-base_sort']};}}],
    ['g_post-base', {sql: '[g_post-base].context AS [g_post-base], [g_post-base].text as [g_post-base_sort]', title: 'ligature', searchcolumn: '[g_below-base].text', table: '[g_post-base]', type: 'tamil', render: {_: 'display', sort: 'sort'}, post: (res) => {return {display: hyphenateHTMLString(res['g_post-base']), sort: res['g_post-base_sort']};}}],
    ['synch', {sql: 'synch', title: 'unit'}],
    ['milestone', {sql: 'milestone, facs', title: 'page/folio', post: (res) => res.milestone && res.facs ? `<a href="/mss/${res.filename}?facs=${res.facs}">${res.milestone}</a>` : res.milestone}],
    ['placement', {sql: 'placement', title: 'placement'}],
]);

    const old_shelfmarks = ['Ancien fonds','Ariel','w/d','Burnouf','Cordier','Ducler','Haas','Reydellet','Vinson'];
    for(const shelfmark of old_shelfmarks)
        allcolumns.set(`old_shelfmarks(${shelfmark})`, {title: 'old shelfmark', type: 'shelfmark', sql: `json_extract(old_shelfmarks, '$.${shelfmark}') AS 'old_shelfmarks(${shelfmark})'`});


const getData = async (table) => {
    
    const worker = await createSqlWorker('/mss/db/meta.db');
    
    const defaultfields = ['shelfmark','repository','title','languages','material','extent','date','images'];

    const joins = [];
    const conditions = [];

    const sqlcolumns = table.dataset.sqlcolumns;
    const columnfields = sqlcolumns ? sqlcolumns.split(', ') : defaultfields;
    const columnsarr = [];

    let distinct = 'DISTINCT';

    for(const field of columnfields) {
        const config = allcolumns.get(field);
        if(!config) continue;
        columnsarr.push(config.sql);
        if(config.table) {
            joins.push(`INNER JOIN ${config.table} ON ${config.table}.filename = mss.filename`);
            distinct = ''; // for paratexts; might have multiples in the same file
        }
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

    const personstr = table.dataset.persons;
    if(personstr) {
        joins.push('INNER JOIN persons ON persons.filename = mss.filename');
        conditions.push(`persons.persname IN (${personstr}) AND persons.role != ""`);
    }

    const searchtext = table.dataset.searchtext;
    if(searchtext)
        conditions.push(`${table.dataset.searchcolumn} LIKE ${searchtext}`);

    const columnstr = columnsarr.join(', ') + ' ';
    const joinstr = joins.join(' ');
    const conditionstr = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await worker.db.query(`SELECT ${distinct} ${columnstr} FROM mss ${joinstr} ${conditionstr} ORDER BY mss.filename`);
    return processResult(result,columnfields);
};

const processResult = (result,columnfields) => {
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
          const ret = {data: field, title: config.title, name: field};
          if(config.type) ret.type = config.type;
          if(config.render) ret.render = config.render;
          return ret;
    });

    const files = result.map(res => `"${res.filename}"`).join(', ');
    return {rows: rows, columns: columns, files: files};
};

const filterColumn = (dt,e) => {
    const colname = e.target.dataset.name;
    if(!colname) return;

    const column = dt.column(`${colname}:name`);
    if(column.search() !== e.target.value)
        column.search(e.target.value).draw();
};

const makeTable = (data, table) => {

    const dataTable = new DataTable(`#${table.id}`, {
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
          //responsive: true,
          scrollX: true
          //fixedHeader: true

  });
  const filterrow = document.createElement('tr');
  filterrow.id = 'filter_inputs';
  for(const column of data.columns) {
    const th = document.createElement('th');
    const input = document.createElement('input');
    input.type = 'text';
    input.dataset.name = column.name;
    input.placeholder = `Filter ${column.title}`;
    input.style.width = '100%';
    th.appendChild(input);
    filterrow.appendChild(th);
  }
  filterrow.style.height = '0px';
  document.querySelector('.dataTables_scrollHead thead').prepend(filterrow);
  filterrow.addEventListener('keyup', filterColumn.bind(null,dataTable));
  filterrow.addEventListener('change', filterColumn.bind(null,dataTable));
  filterrow.addEventListener('clear', filterColumn.bind(null,dataTable));
    
  const filterbutton = document.createElement('button');
  filterbutton.id = 'filter_button';
  filterbutton.title = 'More filters';
  filterbutton.append('↓');
  document.getElementById('index_filter').appendChild(filterbutton);
  filterbutton.addEventListener('click', (e) => {
    const toshow = document.getElementById('filter_inputs');
    if(toshow.style.height === '0px') {
        toshow.style.height = 'auto';
        for(const input of toshow.querySelectorAll('input'))
            input.style.display = 'block';
        e.target.textContent = '↑';
        e.target.title = 'Less filters';
    }
    else {
        toshow.style.height = '0px';
        for(const input of toshow.querySelectorAll('input'))
            input.style.display = 'none';
        e.target.textContent = '↓';
        e.target.title = 'More filters';
    }
  });

  document.getElementById('spinner').style.display = 'none';
  const tabs = document.getElementById('tabright');
  if(tabs) tabs.style.visibility = 'visible';
  document.getElementById('index').style.visibility = 'visible';
    
  table.dataset.files = data.files;
  table.addEventListener('mouseover',toolTipMouseover);

  return dataTable;
};

export {makeTable, getData, allcolumns};
