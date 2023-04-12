import createSqlWorker from './lib/sqlWorker.mjs';
import Cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
Cytoscape.use(d3Force);

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
         'line-color': '#ccc',
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
];

const getNetwork = async (persname) => {
    const worker = await createSqlWorker('/mss/db/meta.db');
    //const worker = await createSqlWorker('/meta.db');
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
    const result = await worker.db.query(query);

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
    for(const res of result) {
        if(!nodes.has(res.persname)) {
            nodes.set(res.persname, {
                data: {
                    id: res.persname,
                    label: res.persname
                },
                classes: 'person'
            });
        }
        if(!nodes.has(res.shelfmark)) {
            const data = {
                data: {
                    id: res.path,
                    width: parsesize(res.width),
                    height: parsesize(res.height),
                    popup: res.shelfmark
                },
                classes: 'manuscript'
            };
            nodes.set(res.shelfmark, data);
        }
        edges.push({
            data: {
                id: `${res.persname}-${res.role}-${res.path}`,
                source: res.persname,
                target: res.path,
                popup: res.role
            },
            classes: res.role
        });
    }
    
    return edges.concat([...nodes.values()]);
};

const drawNetwork = async () => {
    const container = document.getElementById('network');
    const persname = container.dataset.person;
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'flex';

    const cy = Cytoscape({
       container: container,
       elements: await getNetwork(persname),
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

    const mouseUp  = (cy,e) => {
        cy.$('.clicked').removeClass('clicked');
        if(e.target.data('popup'))
            e.target.addClass('clicked');
    };

    cy.on('mouseup',mouseUp.bind(null,cy));
};

document.getElementById('tabright').addEventListener('click',(e) => {

    if(document.getElementById('spinner').style.display !== 'none') return;

    if(e.target.id === 'listview' && !e.target.classList.contains('selected')) {
        e.target.classList.add('selected');
        document.getElementById('networkview').classList.remove('selected');
        document.getElementById('index_wrapper').style.display = 'block';
        document.getElementById('network').style.display = 'none';
        return;
    }

    if(e.target.id === 'networkview' && !e.target.classList.contains('selected')) {
        e.target.classList.add('selected');
        const listview = document.getElementById('listview').classList.remove('selected');
        document.getElementById('index_wrapper').style.display = 'none';
        document.getElementById('network').style.display = 'block';
        if(!document.getElementById('network').classList.contains('__________cytoscape_container'))
            drawNetwork();

    }
});
