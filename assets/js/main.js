---
---

import { HandlerFactory } from '{{ "assets/js/modules/handler.js" | relative_url }}';

(function() {
    'use strict';

    const _handler = HandlerFactory();

    const _sections = {
        [_handler.sections.achievements]: {
            json: '{{ "assets/json/achievements.json" | relative_url }}',
            selectors: {
                jsonKey: 'task',
                wrapper: '#achievements-wrapper',
                items: '#achievements-wrapper>div',
                itemsInactive: '#achievements-wrapper>div._inactive',
                visible: '#achievements-visible',
                progress: {
                    bar: '#achievements-bar',
                    total: '.achievements-total',
                    complete: '.achievements-complete',
                    incomplete: '#achievements-incomplete'
                }
            }
        },
        [_handler.sections.quests]: {
            json: '{{ "assets/json/quests.json" | relative_url }}',
            selectors: {
                jsonKey: 'name',
                wrapper: '#quests-wrapper',
                items: '#quests-wrapper>div',
                itemsInactive: '#quests-wrapper>div._inactive',
                visible: '#quests-visible',
                progress: {
                    bar: '#quests-bar',
                    total: '.quests-total',
                    complete: '.quests-complete',
                    incomplete: '#quests-incomplete',
                    questPoints: '#quests-progress'
                }
            }
        },
        [_handler.sections.pets]: {
            json: '{{ "assets/json/pets.json" | relative_url }}',
            selectors: {
                jsonKey: 'name',
                wrapper: '#pets-wrapper',
                items: '#pets-wrapper>div',
                itemsInactive: '#pets-wrapper>div._inactive',
                visible: '#pets-visible',
                progress: {
                    bar: '#pets-bar',
                    total: '.pets-total',
                    complete: '.pets-complete',
                    incomplete: '#pets-incomplete'
                }
            }
        },
        [_handler.sections.collections]: {
            json: '{{ "assets/json/collections.json" | relative_url }}',
            selectors: {
                jsonKey: 'name',
                wrapper: '#collections-wrapper',
                items: '#collections-wrapper>div',
                itemsInactive: '#collections-wrapper>div._inactive',
                visible: '#collections-visible',
                progress: {
                    bar: '#collections-bar',
                    total: '.collections-total',
                    complete: '.collections-complete',
                    incomplete: '#collections-incomplete'
                }
            }
        }
    };

    //
    for(const key of Object.keys(_sections)) {
        $.getJSON(_sections[key].json, function(data) {
            _handler.initSection(this, data, _sections[this].selectors);
        }.bind(key));
    }
})();