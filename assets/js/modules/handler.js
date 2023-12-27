---
---

import { Achievements, Pets } from '{{ "assets/js/modules/sections.js" | relative_url }}';
import { SkillsFactory, StoreFactory } from '{{ "assets/js/modules/factories.js" | relative_url }}';

class Handler {
    constructor() {
        this.achievements = null;
        this.storage = null;
        this.skills = null;
        this.pets = null;

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
            case this.sections.pets:
                this.pets = new Pets(data, this.onPetsClicked.bind(this));
                break;
        }

        this[section].update(this.storage.isUnlocked, this.storage.obj.complete[section]);
    }

    onSkillClicked(id) {
        this.storage.toggleComplete('skills', id);
        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
    }

    onAcievementClicked(id) {
        this.storage.toggleComplete('achievements', id);
        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
    }

    onPetsClicked(id) {
        this.storage.toggleComplete('pets', id);
        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
    }
}

export function HandlerFactory() {
    const handler = new Handler();
    return handler.init();
}