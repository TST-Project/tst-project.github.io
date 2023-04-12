const docMouseover = function(e) {
    var targ = e.target.closest('[data-anno]');
    while(targ && targ.hasAttribute('data-anno')) {
        toolTip.make(e,targ);
        targ = targ.parentNode;
    }
};
const toolTip = {
    make: function(e,targ) {
        const toolText = targ.dataset.anno;
        if(!toolText) return;

        var tBox = document.getElementById('tooltip');
        const tBoxDiv = document.createElement('div');

        if(tBox) {
            for(const kid of tBox.childNodes) {
                if(kid.myTarget === targ)
                    return;
            }
            tBoxDiv.appendChild(document.createElement('hr'));
        }
        else {
            tBox = document.createElement('div');
            tBox.id = 'tooltip';
            tBox.style.top = (e.clientY + 10) + 'px';
            tBox.style.left = e.clientX + 'px';
            document.body.appendChild(tBox);
            tBoxDiv.myTarget = targ;
        }

        tBoxDiv.appendChild(document.createTextNode(toolText));
        tBoxDiv.myTarget = targ;
        tBox.appendChild(tBoxDiv);
        targ.addEventListener('mouseleave',toolTip.remove,{once: true});
        tBox.animate([
            {opacity: 0 },
            {opacity: 1, easing: 'ease-in'}
        ], 200);
    },
    remove: function(e) {
        const tBox = document.getElementById('tooltip');
        if(!tBox) return;

        if(tBox.children.length === 1) {
            tBox.remove();
            return;
        }

        const targ = e.target;
        for(const kid of tBox.childNodes) {
            if(kid.myTarget === targ) {
                kid.remove();
                break;
            }
        }
        if(tBox.children.length === 1) {
            const kid = tBox.firstChild.firstChild;
            if(kid.tagName === 'HR')
                kid.remove();
        }
    },
};

export {toolTip, docMouseover as toolTipMouseover};
