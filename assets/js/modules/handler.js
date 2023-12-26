---
---

import { Achievements } from '{{ "assets/js/modules/sections/achievements.js" | relative_url }}';
import { SkillsFactory } from '{{ "assets/js/modules/sections/skills.js" | relative_url }}';
import { StoreFactory } from '{{ "assets/js/modules/local-storage.js" | relative_url }}';

class Handler {
    constructor() {
        this.achievements = null;
        this.storage = null;
        this.skills = null;
        
        this.sections = Object.freeze({
            achievements: 'achievements',
            quests: 'quests',
            pets: 'pets',
            collections: 'collections'
        });
    }

    init() {
        this.storage = StoreFactory();
        this.skills = SkillsFactory(this.onSkillClicked.bind(this), this.storage.obj.complete.skills);
        
        return this;
    }

    initSection(section, data) {
        switch(section) {
            case this.sections.achievements:
                this.achievements = new Achievements(data, this.onAcievementClicked.bind(this));
                break;
        }

        this[section].update(this.storage.isUnlocked, this.storage.obj.complete[section]);
    }

    onSkillClicked(id) {
        this.storage.toggleComplete('skills', id);

        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
    }

    onAcievementClicked(id) {
        this.storage.toggleComplete('achievements', id);

        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
    }
}

export function HandlerFactory() {
    const handler = new Handler();
    return handler.init();
}