---
---

import { Section } from '{{ "assets/js/modules/sections/section.js" | relative_url }}';

export class Achievements extends Section {
    constructor(selectors, data) {
        super(data);

        this.selectors = selectors;

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

    update(fUnlocked) {
        const available = super.getAvailable(fUnlocked, this.compare.bind(this));
        const html = [];

        for (const obj of available) {
            html.push(this.template(obj.diary, obj.banner, obj.difficulty, obj.task, this.difficulty[obj.difficulty].colour))
        }

        $(this.selectors.wrapper).html(html.join(''));
    }

    compare(a, b) {
        return a.diary.localeCompare(b.diary) || this.difficulty[a.difficulty].compare - this.difficulty[b.difficulty].compare;
    }

    template(diary, banner, difficulty, task, colour) {
        return `
        <div class='flex flex-col rounded-lg p-3 cursor-pointer transition-opacity drop-shadow-lg hover:outline bg-birch-500 _active _ic' data-src='achievement'>
            <div class='flex flex-row justify-between items-center'>
                <div class='flex flex-row items-center'>
                    <img src='${this.imagesURL}${banner.replaceAll(' ', '_')}.png' alt="${banner} icon" width='16px' height='auto'/>
                    <h3 class='text-2xl ms-3'>${diary}</h3>
                </div>
                
                <span class='text-md ${colour}'>${difficulty}</span>
            </div>
            <hr class="h-px my-2 bg-birch-800 border-0">
            <span class="text-md text-yellow-400 grow _id">${task}</span>
            <hr class="h-px my-2 bg-birch-800 border-0">
            <span class='text-status text-md'></span>
        </div>`
    }
}