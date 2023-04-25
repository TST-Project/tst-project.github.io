import {makeTable, getData} from './table.mjs';

window.addEventListener('load', async () => {

    const table = document.getElementById('index');
    if(!table || table.dataset.sqlcolumns === 'none')
        return;
    
    const dt = makeTable(await getData(table), table);

    const stats = document.getElementById('stats');
    if(stats) {
        const { StatsListen } = await import('./stats.mjs');
        StatsListen(dt);
    }
   
});
