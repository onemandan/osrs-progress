---
---

import { TileFactory } from '{{ "assets/js/modules/tile.js" | relative_url }}';

class Achievements {
    constructor(selectors, data) {
        this.tiles = [];
        this.selectors = selectors;
        this.data = data;

        this.difficulty = Object.freeze({
            'Easy': {
                'compare': 1,
                'colour': 'text-lime-500'
            },
            'Medium': {
                'compare': 2,
                'colour': 'text-sky-500'
            },
            'Hard': {
                'compare': 3,
                'colour': 'text-fuchsia-400'
            },
            'Elite': {
                'compare': 4,
                'colour': 'text-yellow-400'
            }
        });
    }

    init(callback) {
        for(const key of Object.keys(this.data)) {
            this.tiles.push(TileFactory(this.data[key].task, this.data[key].requirements,
                this.template(this.data[key].diary, this.data[key].difficulty, this.difficulty[this.data[key].difficulty].colour, this.data[key].task),
                callback, this.data[key].diary, this.difficulty[this.data[key].difficulty].compare));
        }

        return this;
    }

    update(isUnlocked) {
        let unlockedTiles = [];
        $(this.selectors.wrapper).html('');

        for(const tile of this.tiles) {
            if(isUnlocked(tile.requirements)){
                unlockedTiles.push(tile);
            }
        }

        this.sort(unlockedTiles);

        for(const tile of unlockedTiles) {
            $(this.selectors.wrapper).append(tile.element);
        }
    }

    sort(unlockedTiles) {
        unlockedTiles.sort((a, b) => a.primary.localeCompare(b.primary) || a.secondary - b.secondary);
    }

    template(diary, difficulty, colour, task) {
        return `
        <div class='flex flex-col rounded-lg p-3 cursor-pointer transition-opacity drop-shadow-lg hover:outline bg-birch-500 _active _ic' data-src='achievement'>
            <div class='flex flex-row justify-between items-center'>
                <h3 class='text-2xl'>${diary}</h3>
                <span class='text-md ${colour}'>${difficulty}</span>
            </div>
            <hr class="h-px my-2 bg-birch-800 border-0">
            <span class="text-md text-yellow-400 grow _id">${task}</span>
            <hr class="h-px my-2 bg-birch-800 border-0">
            <span class='text-status text-md'></span>
        </div>`
    }
}

export function AchievementsFactory(selectors, data, callback) {
    const achievements = new Achievements(selectors, data);
    return achievements.init(callback);
}