---
---

import { TileFactory } from '{{ "assets/js/modules/tile.js" | relative_url }}';

class Skills {
    constructor(selector) {
        this.selector = selector;
    }

    init(callback) {
        $(this.selector).each((index, element) => {
            TileFactory($(element).children()[0].innerText, null, $(element).html(), callback, null, null, element);
        });

        return this;
    }
}

export function SkillsFactory(selector, callback) {
    const skills = new Skills(selector);
    return skills.init(callback);
}