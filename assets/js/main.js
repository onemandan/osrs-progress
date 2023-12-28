---
---

import { HandlerFactory } from '{{ "assets/js/modules/handler.js" | relative_url }}';

(function() {
    'use strict';

    const _handler = HandlerFactory();

    const _sections = {
        [_handler.sections.achievements]: '{{ "assets/json/achievements.json" | relative_url }}',
        [_handler.sections.quests]: '{{ "assets/json/quests.json" | relative_url }}',
        [_handler.sections.pets]: '{{ "assets/json/pets.json" | relative_url }}',
    };

    //
    for(const key of Object.keys(_sections)) {
        $.getJSON(_sections[key], function(data) {
            _handler.initSection(this, data);
        }.bind(key));
    }
})();