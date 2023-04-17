import Hypher from 'hypher';
import {hyphenation_ta_Latn} from './ta-Latn.mjs';
import {hyphenation_sa} from './sa.mjs';

const hyphenator = {
    ta: new Hypher(hyphenation_ta_Latn),
    sa: new Hypher(hyphenation_sa)
};

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

export { hyphenateHTMLString };
