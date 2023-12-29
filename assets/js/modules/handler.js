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

    initSection(section, data, selectors) {
        switch(section) {
            case this.sections.achievements:
                this.achievements = new Achievements(data, selectors, this.onAcievementsClicked.bind(this), this.onAchievementsVisibleClicked.bind(this), this.storage.obj.visible.achievements);
                this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
                break;
            case this.sections.quests:
                this.quests = new Quests(data, selectors, this.onQuestsClicked.bind(this), this.onQuestsVisibleClicked.bind(this), this.storage.obj.visible.quests);
                this.quests.update(this.storage.isUnlocked, this.storage.obj.complete.quests, this.storage.obj.qp);
                break;
            case this.sections.pets:
                this.pets = new Pets(data, selectors, this.onPetsClicked.bind(this), this.onPetsVisibleClicked.bind(this), this.storage.obj.visible.pets);
                this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
                break;
            case this.sections.collections:
                this.collections = new Collections(data, selectors, this.onCollectionsClicked.bind(this), this.onCollectionsVisibleClicked.bind(this), this.storage.obj.visible.collections);
                this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
                break;
        }
    }

    //----------------------------
    // On item click events
    //----------------------------
    onSkillClicked(id) {
        this.storage.toggleComplete(this.sections.skills, id);
        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
        this.quests.update(this.storage.isUnlocked, this.storage.obj.complete.quests, this.storage.obj.qp);
        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
        this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
    }

    onAcievementsClicked(id) {
        this.storage.toggleComplete(this.sections.achievements, id);
        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
    }

    onQuestsClicked(id) {
        this.storage.toggleComplete(this.sections.quests, id);
        this.storage.updateQuestPoints(this.quests.getQuestPoints(id));
        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
        this.quests.update(this.storage.isUnlocked, this.storage.obj.complete.quests, this.storage.obj.qp);
        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
        this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
    }

    onPetsClicked(id) {
        this.storage.toggleComplete(this.sections.pets, id);
        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
    }

    onCollectionsClicked(id, items) {
        this.storage.updateCollections(id, items);
        this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
    }

    //----------------------------
    // On visible click events
    //----------------------------
    onAchievementsVisibleClicked() {
        this.storage.toggleVisible(this.sections.achievements);
        this.achievements.update(this.storage.isUnlocked, this.storage.obj.complete.achievements);
    }

    onQuestsVisibleClicked() {
        this.storage.toggleVisible(this.sections.quests);
        this.quests.update(this.storage.isUnlocked, this.storage.obj.complete.quests, this.storage.obj.qp);
    }

    onPetsVisibleClicked() {
        this.storage.toggleVisible(this.sections.pets);
        this.pets.update(this.storage.isUnlocked, this.storage.obj.complete.pets);
    }

    onCollectionsVisibleClicked() {
        this.storage.toggleVisible(this.sections.collections);
        this.collections.update(this.storage.isUnlocked, this.storage.obj.complete.collections);
    }
}

export function HandlerFactory() {
    const handler = new Handler();
    return handler.init();
}