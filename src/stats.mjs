import Chart from 'chart.js/auto';

const getData = (dt, colname, limit) => {
    const textindex = dt.column('blessing:name').index();
    const placementindex = dt.column(`${colname}:name`).index();
    const rows = dt.rows({search: 'applied'}).nodes();
    const data = rows.map(el => {
        const placestr = el.children.item(placementindex).textContent.trim();
        const placesplit = placestr.split(', ');
        let placejoin = false;
        if(placesplit.includes('marginal')) {
            if(placesplit.includes('left')) placejoin = 'left margin';
            else if(placesplit.includes('right')) placejoin = 'right margin';
            else if(placesplit.includes('top')) placejoin = 'top margin';
            else if(placesplit.includes('bottom')) placejoin = 'bottom margin';
        }
        const placement = placejoin || placestr || 'not specified';
       
        const parclone = el.children.item(textindex).cloneNode(true);
        for(const invis of parclone.querySelectorAll('.invisible')) {
            invis.remove();
        }
        const paratext = parclone.textContent.trim().replace(/\s+/g,' ').replaceAll('-','').toLowerCase();
        return [paratext,placement];
    });

    const datamap = new Map();
    for(const datum of data.toArray()) {
        const el = datamap.get(datum[0]);
        if(el) {
            el.count = el.count + 1;
            const placementcount = el.placement[datum[1]];
            if(placementcount)
                el.placement[datum[1]] = placementcount + 1;
            else
                el.placement[datum[1]] = 1;
        }
        else {
            const ret = {count: 1, placement: {}};
            ret.placement[datum[1]] = 1;
            datamap.set(datum[0],ret);
        }
    }
    const sorted = [...datamap];
    sorted.sort((a,b) => {
        return a[1].count < b[1].count;
    });

    const clipped = sorted.slice(0,limit);
    const clippedplaces = new Set(clipped.map(r => Object.keys(r[1].placement)).flat());
    console.log(clippedplaces);
    const transformed = [...clippedplaces].map(x => {
        const ret = {};
        for(const y of clipped) {
            const got = y[1].placement[x];
            if(got) ret[y[0]] = got;
        }
        return {
            label: x,
            data: ret
        };
    });
    return transformed;
};

const drawStats = (dt) => {
    const statbox = document.getElementById('stats');
    statbox.innerHTML = '';
    statbox.dataset.search = dt.search();
    const colname = statbox.dataset.labels || 'placement';
    const data = getData(dt,colname,10);
    const fontfam = '"Brill", "et-book", "Noto Serif Tamil", "TST Grantha", "Bangla", "PedanticDevanagari", "PedanticMalayalam", "PedanticTelugu", "Noto Sans Newa", "Satisar Sharada", "Tibetan Machine Uni", "Noto Sans Nandinagari", Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", "Georgia", serif';
    statbox.style.display = 'block';
    const canvas = document.createElement('canvas');
    statbox.appendChild(canvas);
    new Chart(
        canvas,
        {
            type: 'bar',
            options: {
                scales: {
                    x: { stacked: true, ticks: {font: {family: fontfam, size: 18}, color: 'rgb(17,17,17)'} },
                    y: { stacked: true, ticks: {font: {family: fontfam, size: 16}} }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: fontfam,
                                size: 18
                            },
                            color: 'rgb(17,17,17)'
                        }
                    },
                    tooltip: {
                        titleFont: { family: fontfam, size: 16 },
                        bodyFont: { family: fontfam, size: 14 }
                    }
                }
            },
            data: {
                datasets: data
            }
        }
    );
};

const StatsListen = (dt) => {

    document.getElementById('tabright').addEventListener('click',(e) => {

        if(document.getElementById('spinner').style.display !== 'none') return;

        if(e.target.id === 'listview' && !e.target.classList.contains('selected')) {
            e.target.classList.add('selected');
            document.getElementById('statsview').classList.remove('selected');
            document.getElementById('index_wrapper').style.display = 'block';
            document.getElementById('stats').style.display = 'none';
            return;
        }

        if(e.target.id === 'statsview' && !e.target.classList.contains('selected')) {
            e.target.classList.add('selected');
            const listview = document.getElementById('listview').classList.remove('selected');
            document.getElementById('index_wrapper').style.display = 'none';
            const statsbox = document.getElementById('stats');
            statsbox.style.display = 'block';
            if(!statsbox.querySelector('canvas'))
                drawStats(dt);
            else if(statsbox.dataset.hasOwnProperty('search') && 
                   statsbox.dataset.search !== dt.search() )
                drawStats(dt);
        }
});
};

export { StatsListen };
