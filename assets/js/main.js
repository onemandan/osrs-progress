---
---

import { HandlerFactory } from '{{ "assets/js/modules/handler.js" | relative_url }}';

(function() {
    'use strict';

    const _handler = HandlerFactory();

    const _sections = {
        [_handler.sections.achievements]: {
            'json': '{{ "assets/json/achievements.json" | relative_url}}'
        }
    };

    //
    for(const key of Object.keys(_sections)) {
        $.getJSON(_sections[key].json, function(data) {
            _handler.initSection(this, data);
        }.bind(key));
    }
})();