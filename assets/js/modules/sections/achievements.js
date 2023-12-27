---
---

import { Section } from '{{ "assets/js/modules/sections/section.js" | relative_url }}';

export class Achievements extends Section {
    constructor(data, onClick) {
        super(data, onClick);

        this.selectors = {
            jsonKey: 'task',
            wrapper: '#achievements-wrapper',
            items: '#achievements-wrapper>div',
            progress: {
                bar: '#achievements-bar',
                total: '#achievements-total',
                complete: '#achievements-complete',
                incomplete: '#achievements-incomplete'
            }
        };

        //Provides colours and sort function comparison values based on difficulty
        this.difficulty = {
            Easy: {
                'compare': 1,
                'colour': 'text-lime-500'
            },
            Medium: {
                'compare': 2,
                'colour': 'text-sky-500'
            },
            Hard: {
                'compare': 3,
                'colour': 'text-fuchsia-400'
            },
            Elite: {
                'compare': 4,
                'colour': 'text-yellow-400'
            }
        };

        this.compare = this.compare.bind(this);
    }

    update(fUnlocked, completed) {
        const available = super.getAvailable(fUnlocked, completed, this.compare, this.selectors.jsonKey);
        super.updateProgress(this.selectors.progress);

        const html = [];

        for (const obj of available) {
            html.push(this.template(obj.diary, obj.banner, obj.difficulty, obj.task, this.difficulty[obj.difficulty].colour, obj.active))
        }

        $(this.selectors.wrapper).html(html.join(''));
        $(this.selectors.items).on('click', (event) => {
            super.onItemClick(event);
            super.updateProgress(this.selectors.progress);
        });
    }

    //compare
    //Compares active status > diary name > diary difficulty
    compare(a, b) {
        return (+a.active) - (+b.active) || a.diary.localeCompare(b.diary) || this.difficulty[a.difficulty].compare - this.difficulty[b.difficulty].compare;
    }

    template(diary, banner, difficulty, task, colour, active) {
        return `
        <div class='flex flex-col rounded-lg p-3 cursor-pointer transition-opacity drop-shadow-lg hover:outline bg-birch-500 ${active ? '_inactive' : '_active'} _ic' data-src='achievement'>
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