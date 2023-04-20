import {Sanscript} from 'https://tst-project.github.io/lib/js/sanscript.mjs';

const Transliterate = (str) => {
    const shortened = str.replaceAll('\u090F','\u090E')
                           .replaceAll('\u0913','\u0912')
                           .replaceAll('\u0947','\u0946')
                           .replaceAll('\u094B','\u094A');

    const literated = Sanscript.t(
        Sanscript.t(shortened,'tamil','iast'),
        'devanagari', 'iast')
        .replace(/^⁰|([^\d⁰])⁰/g,'$1¹⁰');

    return literated;
};

export { Transliterate };
