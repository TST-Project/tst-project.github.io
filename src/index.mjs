import {makeTable, getData} from './table.mjs';

window.addEventListener('load', async () => {

    const table = document.getElementById('index');
    if(table && table.dataset.sqlcolumns !== 'none')
        makeTable(await getData(table), table);
    
});
