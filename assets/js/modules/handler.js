---
---

import { Achievements, Quests, Pets, Collections } from '{{ "assets/js/modules/sections.js" | relative_url }}';
import { SkillsFactory, StoreFactory } from '{{ "assets/js/modules/factories.js" | relative_url }}';

class Handler {
    constructor() {
        this.achievements = null;
        this.storage = null;
        this.skills = null;
        this.quests = null;
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
                this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
                break;
            case this.sections.quests:
                this.quests = new Quests(data, this.onQuestsClicked.bind(this));
                this.quests.update(this.storage.isUnlocked, this.storage.obj.complete.quests, this.storage.obj.qp);
                break;
            case this.sections.pets:
                this.pets = new Pets(data, this.onPetsClicked.bind(this));
                this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
                break;
            case this.sections.collections:
                this.collections = new Collections(data, this.onCollectionsClicked.bind(this));
                this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
                break;
        }
    }

    onSkillClicked(id) {
        this.storage.toggleComplete('skills', id);

        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
        this.quests.update(this.storage.isUnlocked, this.storage.obj.complete.quests, this.storage.obj.qp);
        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
        this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
    }

    onAcievementClicked(id) {
        this.storage.toggleComplete('achievements', id);

        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
    }

    onQuestsClicked(id) {
        this.storage.toggleComplete('quests', id);
        this.storage.updateQuestPoints(this.quests.getQuestPoints(id));

        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
        this.quests.update(this.storage.isUnlocked, this.storage.obj.complete.quests, this.storage.obj.qp);
        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
        this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
    }

    onPetsClicked(id) {
        this.storage.toggleComplete('pets', id);

        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
    }

    onCollectionsClicked(id, items) {
        this.storage.updateCollections(id, items);

        this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
    }
}

export function HandlerFactory() {
    const handler = new Handler();
    return handler.init();
}