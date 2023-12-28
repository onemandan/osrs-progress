class Section {
    constructor(data, onClick) {
        this.imagesURL = 'https://oldschool.runescape.wiki/images/';
        this.data = data;
        this.onClick = onClick;

        this.progress = {
            total: 0,
            complete: 0
        };
    }

    update(fUnlocked, fSort, fHtml, completed, selectors) {
        const available = this.getAvailable(fUnlocked, fSort, completed, selectors.jsonKey);
        this.updateProgress(selectors.progress);

        $(selectors.wrapper).html(fHtml(available));
        $(selectors.items).on('click', (event) => {
            this.onItemClick(event);
        });
    }

    //getAvailable
    //Returns a sorted array of unlocked @data items and updates @progress counts
    //@fUnlocked - callback function to obtain item unlock status
    //@fSort - sort comparison function
    //@completed - completed localStorage object
    //@completedKey - key to use for the @completed object
    getAvailable(fUnlocked, fSort, completed, completedKey) {
        const available = [];

        //Reset progress counts
        this.progress.complete = 0;
        this.progress.total = 0;

        for(const key of Object.keys(this.data)) {
            const obj = this.data[key];

            //Add data item and update counts if unlocked
            if (fUnlocked(obj.requirements)) {
                if (completed.constructor === Array) {
                    obj.active = completed.includes(obj[completedKey]);
                } else if (completed.constructor === Object) {
                    obj.active = obj[completedKey] in completed && obj.items.length - completed[obj[completedKey]].length === 0;
                }
                
                available.push(obj);
                
                this.progress.complete += (+obj.active);
                this.progress.total++;
            }
        }

        return available.sort(fSort);
    }

    //onItemClick
    //Toggles item active status
    //@event - click event target
    //@opts - additional options, default null
    onItemClick(event, opts = null) {
        $(event.currentTarget).toggleClass('_active');
        $(event.currentTarget).toggleClass('_inactive');

        //Item click callback with item id
        this.onClick($(event.currentTarget).find('._id').text(), opts);
    }

    //updateProgress
    //Updates progress elements with @progress counts
    //@selectors - element CSS selectors to update
    updateProgress(selectors) {

        //Update total, complete and incomplete progress counts
        $(selectors.total).text(this.progress.total);
        $(selectors.complete).text(this.progress.complete);
        $(selectors.incomplete).text(this.progress.total - this.progress.complete);

        //Update progress bar width
        $(selectors.bar).css('width', `${(this.progress.complete / this.progress.total) * 100}%`);
    }
}

//----------------------------
// Achievements
//----------------------------
class Achievements extends Section {
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
        super.update(fUnlocked, this.compare, (arr) => {
            const nodes = [];

            for (const obj of arr) {
                nodes.push(this.template(obj.diary, obj.img, obj.difficulty, obj.task, this.difficulty[obj.difficulty].colour, obj.active))
            }

            return nodes.join('');
        }, completed, this.selectors);
    }

    //compare
    //Compares active status > diary name > diary difficulty
    compare(a, b) {
        return (+a.active) - (+b.active) || a.diary.localeCompare(b.diary) || this.difficulty[a.difficulty].compare - this.difficulty[b.difficulty].compare;
    }

    template(diary, img, difficulty, task, colour, active) {
        return `
        <div class='flex flex-col rounded-lg p-3 cursor-pointer transition-opacity drop-shadow-lg hover:outline bg-birch-500 ${active ? '_inactive' : '_active'} _ic'>
            <div class='flex flex-row justify-between items-center'>
                <div class='flex flex-row items-center'>
                    <img class='h-6 w-auto' src='${this.imagesURL}${img.replaceAll(' ', '_')}.png' alt='${img} icon'/>
                    <h3 class='text-2xl ms-3'>${diary}</h3>
                </div>
                
                <span class='text-md ${colour}'>${difficulty}</span>
            </div>
            <hr class='h-px my-2 bg-birch-800 border-0'>
            <span class='text-md text-yellow-400 grow _id'>${task}</span>
            <hr class='h-px my-2 bg-birch-800 border-0'>
            <span class='text-status text-md'></span>
        </div>`
    }
}

//----------------------------
// Quests
//----------------------------
class Quests extends Section {
    constructor(data, onClick) {
        super(data, onClick);

        //As quests cannot be started until all relevant skills are unlocked, treat quest skill rewards as requirements
        for(const key of Object.keys(this.data)) {
            if (this.data[key].rewards.skills.length > 0) {

                //Append rewarded skills to requirements
                const rSkills = new Set(this.data[key].requirements.skills.concat(this.data[key].rewards.skills));
                this.data[key].requirements.skills = Array.from(rSkills);
            }
        }

        this.selectors = {
            jsonKey: 'name',
            wrapper: '#quests-wrapper',
            items: '#quests-wrapper>div',
            itemsInactive: '#quests-wrapper>div._inactive',
            progress: {
                bar: '#quests-bar',
                total: '#quests-total',
                complete: '#quests-complete',
                incomplete: '#quests-incomplete',
                questPoints: '#quests-progress'
            }
        };

        //Provides colours based on difficulty
        this.difficulty = {
            Novice: 'text-lime-500',
            Intermediate: 'text-sky-500',
            Experienced: 'text-fuchsia-400',
            Master: 'text-yellow-400',
            Grandmaster: 'text-red-400'
        };

        this.compare = this.compare.bind(this);
    }

    update(fUnlocked, completed, qp) {
        super.update(fUnlocked, this.compare, (arr) => {
            const nodes = [];

            for (const obj of arr) {
                nodes.push(this.template(obj.name, obj.difficulty, this.difficulty[obj.difficulty], obj.active))
            }

            return nodes.join('');
        }, completed, this.selectors);

        //Update quest point count
        $(this.selectors.progress.questPoints).text(qp);
    }

    //compare
    //Compares active status > quest name 
    compare(a, b) {
        return (+a.active) - (+b.active) || a.name.localeCompare(b.name);
    }

    template(quest, difficulty, colour, active) {
        return `
        <div class='flex flex-col rounded-lg p-3 cursor-pointer transition-opacity drop-shadow-lg hover:outline bg-birch-500 ${active ? '_inactive' : '_active'} _ic'>
            <div class='flex flex-row justify-between items-center'>
                <div class='flex flex-row items-center'>
                    <img class='h-6 w-auto' src='' alt='icon'/>
                    <h3 class='text-2xl ms-3 _id'>${quest}</h3>
                </div>
                
                <span class='text-md ${colour}'>${difficulty}</span>
            </div>
            <hr class='h-px my-2 bg-birch-800 border-0'>
            <span class='text-status text-md'></span>
        </div>`
    }

    //getQuestPoints
    //Obtains quest points based on the given @quest from @data
    //@quest - name of the quest to obtain corresponding quest points
    getQuestPoints(quest) {
        //Ensure that negative quest points are returned if it is currently active (incomplete)
        return this.data[quest].rewards.qp * ($(this.selectors.itemsInactive + `:contains(${quest})`).length > 0 ? 1 : -1);
    }
}

//----------------------------
// Pets
//----------------------------
class Pets extends Section {
    constructor(data, onClick) {
        super(data, onClick);

        this.selectors = {
            jsonKey: 'name',
            wrapper: '#pets-wrapper',
            items: '#pets-wrapper>div',
            progress: {
                bar: '#pets-bar',
                total: '#pets-total',
                complete: '#pets-complete',
                incomplete: '#pets-incomplete'
            }
        };

        this.compare = this.compare.bind(this);
    }

    update(fUnlocked, completed) {
        super.update(fUnlocked, this.compare, (arr) => {
            const nodes = [];

            for (const obj of arr) {
                nodes.push(this.template(obj.name, obj.img, obj.active))
            }

            return nodes.join('');
        }, completed, this.selectors);
    }

    //compare
    //Compares active status > pet name 
    compare(a, b) {
        return (+a.active) - (+b.active) || a.name.localeCompare(b.name);
    }

    template(pet, img, active) {
        return `
        <div class='flex flex-col rounded-lg p-3 cursor-pointer transition-opacity drop-shadow-lg hover:outline bg-birch-500 ${active ? '_inactive' : '_active'} _ic'>
            <div class='flex flex-row items-center'>
                <img class='h-6 w-auto' src='${this.imagesURL}${img.replaceAll(' ', '_')}.png' alt='${pet} icon'/>
                <h3 class='text-2xl ms-3 _id'>${pet}</h3>
            </div>
            <hr class='h-px my-2 bg-birch-800 border-0'>
            <span class='text-status text-md'></span>
        </div>`
    }
}

//----------------------------
// Collections
//----------------------------
class Collections extends Section {
    constructor(data, onClick) {
        super(data, onClick);

        this.maxItemsDisplay = 5;

        this.selectors = {
            jsonKey: 'name',
            wrapper: '#collections-wrapper',
            items: '#collections-wrapper>div',
            progress: {
                bar: '#collections-bar',
                total: '#collections-total',
                complete: '#collections-complete',
                incomplete: '#collections-incomplete'
            }
        };

        this.compare = this.compare.bind(this);
    }

    update(fUnlocked, completed) {
        const available = super.getAvailable(fUnlocked, this.compare, completed, this.selectors.jsonKey);
        super.updateProgress(this.selectors.progress);

        const nodes = [];

        for (const obj of available) {
            nodes.push(this.template(obj.name, obj.img, obj.active, obj.items, completed))
        }

        $(this.selectors.wrapper).html(nodes.join(''));
        $(this.selectors.items).on('click', (event) => {
            const id = $(event.currentTarget).find('._id').text();
            const items = this.data[id].items;

            super.onItemClick(event, items);
        });
    }

    //compare
    //Compares active status > collection name 
    compare(a, b) {
        return (+a.active) - (+b.active) || a.name.localeCompare(b.name);
    }

    template(collection, img, active, items, completed) {
        const nodes = [];
        let additional = '';
        
        for (let i = 0; i < Math.min(this.maxItemsDisplay, items.length); i++) {
            const colour = collection in completed && completed[collection].includes(items[i]) ? 'text-green-400' : '';
            nodes.push(`<li class='text-md p-2 rounded-xl bg-birch-950 ${colour}'>${items[i]}</li>`);
        }

        if (items.length > this.maxItemsDisplay) {
            const remaining = items.length - this.maxItemsDisplay;
            additional = `and ${remaining} other${remaining > 1 ? 's' : ''}...`;
        }
        
        return `
        <div class='flex flex-col mb-5 break-inside-avoid-column rounded-lg p-3 cursor-pointer transition-opacity drop-shadow-lg hover:outline bg-birch-500 ${active ? '_inactive' : '_active'} _ic'>
            <div class='flex flex-row items-center'>
                <img class='h-6 w-auto' src='${this.imagesURL}${img.replaceAll(' ', '_')}.png' alt='${collection} icon'/>
                <h3 class='text-2xl ms-3 _id'>${collection}</h3>
            </div>
            <hr class='h-px my-2 bg-birch-800 border-0'>
            <ul class='flex flex-wrap my-2 list-none gap-2'>
                ${nodes.join('')}
            </ul>
            <div><span class='text-md'>${additional}</span></div>
            <hr class='h-px my-2 bg-birch-800 border-0'>
            <span class='text-status text-md'></span>
        </div>`
    }
}

export { Achievements, Quests, Pets, Collections }