class Section {
    constructor(data, onClick) {
        this.imagesURL = 'https://oldschool.runescape.wiki/images/';
        this.data = data;
        this.onClick = onClick;

        this.progress = {
            total: 0,
            complete: 0
        };

        /*for(const key of Object.keys(this.data)) {
            this.data[key].name = key;
        }

        console.log(this.data);*/
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
                obj.active = completed.includes(obj[completedKey]);
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
    onItemClick(event) {
        $(event.currentTarget).toggleClass('_active');
        $(event.currentTarget).toggleClass('_inactive');

        //Item click callback with item id
        this.onClick($(event.currentTarget).find('._id').text());
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
                nodes.push(this.template(obj.diary, obj.banner, obj.difficulty, obj.task, this.difficulty[obj.difficulty].colour, obj.active))
            }

            return nodes.join('');
        }, completed, this.selectors);
    }

    //compare
    //Compares active status > diary name > diary difficulty
    compare(a, b) {
        return (+a.active) - (+b.active) || a.diary.localeCompare(b.diary) || this.difficulty[a.difficulty].compare - this.difficulty[b.difficulty].compare;
    }

    template(diary, banner, difficulty, task, colour, active) {
        return `
        <div class='flex flex-col rounded-lg p-3 cursor-pointer transition-opacity drop-shadow-lg hover:outline bg-birch-500 ${active ? '_inactive' : '_active'} _ic'>
            <div class='flex flex-row justify-between items-center'>
                <div class='flex flex-row items-center'>
                    <img class='h-6 w-auto' src='${this.imagesURL}${banner.replaceAll(' ', '_')}.png' alt='${banner} icon'/>
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

    getQuestPoints(quest) {
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
                <img class='h-6 w-auto' src='${img}' alt='${pet} icon'/>
                <h3 class='text-2xl ms-3 _id'>${pet}</h3>
            </div>
            <hr class='h-px my-2 bg-birch-800 border-0'>
            <span class='text-status text-md'></span>
        </div>`
    }
}

export { Achievements, Quests, Pets }

    //updateProgress
    //@Update calls the @super.Update function, which will call @this.updateProgress, overriding @super.updateProgress.  This allows further functionality
    //while still being able to call @super.updateProgress