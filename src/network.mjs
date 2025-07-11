//import createSqlWorker from './lib/sqlWorker.mjs';
import openDb from './lib/sqlite.mjs';
import Cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
Cytoscape.use(d3Force);

const _state = {
    cy: null,
    searchTimeout: null
};

const roles = ['annotator','author','collector','commissioner','editor','owner','scribe'];
const colours = ['#a6cee3','#e41a1c','#7570b3','#e7298a','#e6ab02','#a6761d','#66a61e'];
//const colours = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'];
const rolemap = new Map(roles.map((role,i) => [role,colours[i]]));

const networkstyle = [
    {selector: 'node',
     style: {
         'background-color': '#666',
         'text-wrap': 'wrap',
         'text-max-width': '80',
         'width': 8,
         'height': 8,
         'font-family': 'brill, et-book, Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif'
     }
    },
    {selector: 'node[label]',
     style: {
         'label': 'data(label)',
     },
    },
    {selector: 'node.manuscript',
     style: {
         'label': '',
         'shape': 'rectangle',
         'width': (el) => el.data('width') || 5,
         'height': (el) => el.data('height') || 5,
         'background-opacity': '0.5'
     }
    },
    {selector: 'node.manuscript.clicked',
     style: {
         'label': 'data(popup)'
     }
    },
    {selector: 'edge',
     style: {
         'width': 1,
         'label': '',
         'font-family': 'brill, et-book, Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif',
         'text-rotation': 'autorotate',
         'line-color': (edge) => rolemap.get(edge.data('popup')) || '#ccc',
         'target-arrow-color': '#ccc',
         'target-arrow-shape': 'none',
         'line-opacity': '0.5',
         'text-opacity': '1',
         'curve-style': 'bezier'
     }
    },
    {selector: 'edge.clicked',
     style: {
         'label': 'data(popup)',
         'line-opacity': '1'
     }
    },
    {selector: '.found',
    style: {
        'underlay-color': 'rgb(255,255,12)',
        'underlay-padding': 4,
        'underlay-opacity': 0.8,
        'line-color': 'rgb(255,255,12)',
        'z-index': 15
        }
    },
    {selector: '.manuscript.found',
     style: {
         'label': 'data(popup)',
     }
    },
    /*
    {selector: 'edge.scribe',
     style: {
         'width': 2,
         'line-color': '#1b9e77',
         'target-arrow-color': '#1b9e77',
     }
    },
    {selector: 'edge.editor',
     style: {
         'width': 2,
         'line-color': '#d95f02',
         'target-arrow-color': '#d95f02',
     }
    },
    {selector: 'edge.collector',
     style: {
         'width': 2,
         'line-color': '#7570b3',
         'target-arrow-color': '#7570b3',
     }
    },
    {selector: 'node.scribe, node.procurer, node.editor',
     style: {
        'background-opacity': '0.8'
     }
    }
    */
];
/*
const queryFromPersname = async (persname) => {
    const worker = await createSqlWorker('/mss/db/meta.db');
    const query = 
        'SELECT path, mss.shelfmark as shelfmark, mss.width as width, mss.height as height, persons.persname as persname, persons.role as role FROM '+
        '('+
            'SELECT persons.filename as path, persons.persname '+
            'FROM persons '+
            `WHERE persons.persname = "${persname}" AND persons.role != ""`+
        ') AS SUBQUERY '+
        'INNER JOIN persons '+
        'INNER JOIN mss '+
        'WHERE path = persons.filename AND path = mss.filename AND persons.role != ""';
    return await worker.db.query(query);
};
*/
const queryFromTable = async (dt) => {

    const filenames = dt.column(`shelfmark:name`,{search: 'applied'}).nodes()
                        .map(n => `"${n.querySelector('a').href.split('/').pop()}"`)
                        .toArray().join(', ');
    
    //const filenames = document.getElementById('index').dataset.files;
    //const worker = await createSqlWorker('/mss/db/meta.db');
    const worker = await openDb('/mss/db/meta.db');

    const query = 
        'SELECT path, mss.shelfmark as shelfmark, mss.width as width, mss.height as height, persons.persname as persname, persons.role as role FROM '+
        '('+
            'SELECT persons.filename as path, persons.persname '+
            'FROM persons '+
            `WHERE persons.filename IN (${filenames}) AND persons.role != ""`+
        ') AS SUBQUERY '+
        'INNER JOIN persons '+
        'INNER JOIN mss '+
        'WHERE path = persons.filename AND path = mss.filename AND persons.role != ""';
    return (await worker.exec(query))[0];
};

//const getNetwork = async (persname) => {
const getNetwork = async (dt) => {
    /*
    const result = persname ?
        await queryFromPersname(persname) :
        await queryFromTable();
    */
    const result = await queryFromTable(dt);
    const colnames = new Map(result.columns.map((e,i) => [e,i]));

    const nodes = new Map();

    const parsesize = (str) => {
        if(typeof str !== 'string') return str / 4;

        const split = str.split('-');
        if(split.length > 1)
            return parseInt(split[1])-parseInt(split[0]) / 8;
        else
            return parseInt(split[0]) / 4;
    };

    
    const edges = [];
    for(const res of result.values) {
        const persname = res[colnames.get('persname')];
        const shelfmark = res[colnames.get('shelfmark')];
        const role = res[colnames.get('role')];
        const path = res[colnames.get('path')];
        const width = res[colnames.get('width')];
        const height = res[colnames.get('height')];
        if(!nodes.has(persname)) {
            nodes.set(persname, {
                data: {
                    id: persname,
                    label: persname
                },
                classes: 'person'
            });
        }
        if(!nodes.has(shelfmark)) {
            const data = {
                data: {
                    id: path,
                    width: parsesize(width),
                    height: parsesize(height),
                    popup: shelfmark
                },
                classes: 'manuscript'
            };
            nodes.set(shelfmark, data);
        }
        edges.push({
            data: {
                id: `${persname}-${role}-${path}`,
                source: persname,
                target: path,
                popup: role
            }
        });
    }
    
    return edges.concat([...nodes.values()]);
};

const destroyNetwork = () => {
    _state.cy?.destroy();
    const legend = document.getElementById('networklegend');
    if(legend) legend.remove();
};

const drawNetwork = async (dt,searchparams) => {
    const container = document.getElementById('network');
    //const persname = container.dataset.person;
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'flex';
    
    destroyNetwork();

    const cy = Cytoscape({
       container: container,
       elements: await getNetwork(dt),
       layout: {
           name: 'd3-force',
           linkId: function id(d) {return d.id;},
           linkDistance: 80,
           manyBodyStrength: -300,
           fixedAfterDragging: true,
           wheelSensitivity: 0.5,
           ready: () => {
               spinner.style.display = 'none';
               container.style.background = 'rgb(255,255,255)';

           },
           randomize: true,
           infinite: true
       },
       minZoom: 0.5,
       style: networkstyle
    });
    
    container.before(makeLegend(searchparams,cy));

    const mouseUp  = (cy,e) => {
        cy.$('.clicked').removeClass('clicked');
        if(e.target.data('popup'))
            e.target.addClass('clicked');
    };

    cy.on('tapend',mouseUp.bind(null,cy));
    _state.cy = cy;

};

const makeLegend = (searchparams,cy) => {
    const legend = document.createElement('div');
    legend.id = 'networklegend';
    
    const hexToRgb = (hex) => {
        return {r:'0x'+hex[1]+hex[2]|0,g:'0x'+hex[3]+hex[4]|0,b:'0x'+hex[5]+hex[6]|0};
    };

    const mscontainer = document.createElement('div');
    const msbox = document.createElement('span');
    msbox.classList.add('msbox');
    const mstitle = document.createElement('span');
    mstitle.append('manuscript');
    mscontainer.append(msbox);
    mscontainer.append(mstitle);
    legend.append(mscontainer);

    const perscontainer = document.createElement('div');
    const persbox = document.createElement('span');
    persbox.classList.add('persbox');
    persbox.append('●');
    const perstitle = document.createElement('span');
    perstitle.append('person');
    perscontainer.append(persbox);
    perscontainer.append(perstitle);
    legend.append(perscontainer);
    const allroles = [...rolemap,['other','#cccccc']];
    for(const [role, colour] of allroles) {
        const div = document.createElement('div');
        const line = document.createElement('span');
        //line.append('―');
        const rgb = hexToRgb(colour);
        line.style.borderBottom = `3px solid rgba(${rgb.r},${rgb.g},${rgb.b},0.8)`;
        line.classList.add('line');
        const title = document.createElement('span');
        title.append(role);
        div.appendChild(line);
        div.appendChild(title);
        legend.appendChild(div);
    }
    if(searchparams && searchparams.join('').trim() !== '') {
        const joined = searchparams.filter(s => s.trim() !== '').join(', ');
        const div = document.createElement('div');
        div.append(`filter: ${joined}`);
        legend.appendChild(div);
    }
    
    const searchbox = document.createElement('input');
    searchbox.autocomplete = 'off';
    searchbox.placeholder = 'Search...';
    searchbox.style.marginLeft = 'auto';
    searchbox.style.marginRight = '1em';
    legend.firstChild.style.marginLeft = 'auto';
    searchbox.addEventListener('change',searchSigla.bind(null,cy));
    searchbox.addEventListener('keyup',searchSigla.bind(null,cy));

    legend.appendChild(searchbox);

    return legend;
};

const NetworkListen = (dt) => {
    document.getElementById('tabright').addEventListener('click',(e) => {

        if(document.getElementById('spinner').style.display !== 'none') return;

        if(e.target.id === 'listview' && !e.target.classList.contains('selected')) {
            e.target.classList.add('selected');
            document.getElementById('networkview').classList.remove('selected');
            document.getElementById('index_wrapper').style.display = 'block';
            /*
            document.getElementById('index_wrapper').style.paddingTop = '1rem';
            document.getElementById('index_wrapper').style.paddingBottom = '1rem';
            document.querySelector('.dataTables_scroll').style.overflow = 'revert';
            document.querySelector('.dataTables_scrollHead').style.height = 'revert';
            document.querySelector('.dataTables_scrollBody').style.height = 'revert';
            document.getElementById('index_length').style.display = 'block';
            document.getElementById('index_filter').style.display = 'block';
            document.getElementById('index_info').style.display = 'block';
            document.getElementById('index_paginate').style.display = 'block';
            */
            document.getElementById('network').style.display = 'none';
            document.getElementById('networklegend').style.display = 'none';
            return;
        }

        if(e.target.id === 'networkview' && !e.target.classList.contains('selected')) {
            e.target.classList.add('selected');
            const listview = document.getElementById('listview').classList.remove('selected');
            document.getElementById('index_wrapper').style.display = 'none';
            /*
            document.getElementById('index_wrapper').style.paddingTop = '0rem';
            document.getElementById('index_wrapper').style.paddingBottom = '0rem';
            document.querySelector('.dataTables_scroll').style.overflow = 'hidden';
            document.querySelector('.dataTables_scrollHead').style.height = '0px';
            document.querySelector('.dataTables_scrollBody').style.height = '0px';
            document.getElementById('index_length').style.display = 'none';
            document.getElementById('index_filter').style.display = 'none';
            document.getElementById('index_info').style.display = 'none';
            document.getElementById('index_paginate').style.display = 'none';
            */

            const networkbox = document.getElementById('network');
            networkbox.style.display = 'block';

            const legend = document.getElementById('networklegend');
            if(legend) legend.style.display = 'flex';

            const searchparams = [dt.search(),...dt.columns().search().toArray()];
            const stringy = JSON.stringify(searchparams);

            if(!networkbox.classList.contains('__________cytoscape_container') || networkbox.dataset.search !== stringy) {
                drawNetwork(dt,searchparams);
                networkbox.dataset.search = stringy;
            }

        }
    });
};

const clearFound = (cy) => {
    const oldfound = cy.nodes('.found');
    if(oldfound) oldfound.removeClass('found');
    if(_state.searchTimeout) _state.searchTimeout = null;
};

const searchSigla = (cy,e) => {
    const go = (cy, targ) => {
        clearFound(cy);
        const val = targ.value;
        if(val) {
            const oldfound = cy.nodes('.found');
            if(oldfound) oldfound.removeClass('found');
            const found = cy.nodes(`[label *= '${val}'],[popup *= '${val}']`);
            found.addClass('found');
            return found ? found[0] : null;
        }
        else return false;
    };
    
    if(e.key === 'Enter') {
        const found = go(cy,e.target);
        if(found) cy.animate({fit: {eles: found, padding: 10}, duration: 1000});
    }
    else
        if(!_state.searchTimeout)
            _state.searchTimeout = setTimeout(go,300,cy,e.target);
};

export { NetworkListen };
