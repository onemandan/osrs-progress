Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

class Store {
    constructor() {
        this.id = 'osrs-xosaat-user-v3';
        this.obj = {
            qp: 0,
            complete: {
                skills: [],
                achievements: [],
                quests: [],
                pets: [],
                collections: {},
            },
            visible: {
                achievements: true,
                quests: true,
                pets: true,
                collections: true,
            }
        }

        this.isUnlocked = this.isUnlocked.bind(this);
    }

    //init
    //Initialise @obj using localStorage
    init() {
        //Update @_userObj with localStorage if available
        if (localStorage.getItem(this.id) !== null) {
            this.obj = localStorage.getObject(this.id);
        } else {
            localStorage.setObject(this.id, this.obj);
        }

        return this;
    }

    //isUnlocked
    //Check whether or not an item is unlocked based on @requirements
    //@requirements - object containing item requirements
    isUnlocked(requirements) {
        if (requirements) {
            if ('combat' in requirements && (requirements.combat && !this.obj.complete.skills.includes('Combat'))) {
                return false;
            }

            if ("qp" in requirements && this.obj.qp < requirements.qp) {
                return false;
            }
    
            if ("quests" in requirements) {
                for (const quest of requirements.quests){
                    if (!this.obj.complete.quests.includes(quest)) {
                        return false;
                    }
                }
            }
    
            if ("skills" in requirements) {
                for (const skill of requirements.skills) {

                    //Determine if there is an either/or skill requirement
                    if (skill.includes("||")) {
                        if (!skill.split("||").some(s => this.obj.complete.skills.includes(s))) {
                            return false;
                        }
                    } else if (!this.obj.complete.skills.includes(skill)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    //toggleArrayItem
    //Add array item if not present, remove if present
    //@arr - array
    //@item - item to add/remove to/from @arr
    toggleComplete(type, item) {
        const arr = this.obj.complete[type];

        if (arr.includes(item)) {
            arr.splice(arr.indexOf(item), 1);
        } else {
            arr.push(item);
        }

        localStorage.setObject(this.id, this.obj);
    }

    //toggleVisible
    //Update the visible status
    //@type - section visibility to update
    toggleVisible(type) {
        this.obj.visible[type] = !this.obj.visible[type];

        localStorage.setObject(this.id, this.obj);
    }

    updateCollections(id, items) {
        this.obj.complete.collections[id] = items;

        localStorage.setObject(this.id, this.obj);
    }

    //updateQuestPoints
    //Updates @obj quest points count
    //@qp - amount of quest points to update @obj with
    updateQuestPoints(qp) {
        this.obj.qp += qp;

        localStorage.setObject(this.id, this.obj);
    }

    //saveFile
    //Saves @dataObjToWrite as a .json file
    //@filename resulting name of the file
    saveFile(filename) {

        //Create blob data stream from @dataObjToWrite with 'text/json' mimetype
        const blob = new Blob([JSON.stringify(this.obj)], { type: "text/json" });
        const link = document.createElement("a");
        
        //Set link attributes
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

        const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(evt);
        link.remove();
    }

    //uploadFile
    //Loads a user selected .json file and updates @_userObj with the given data
    uploadFile() {
        
        //Create an 'input' element
        const link = document.createElement("input");

        //Set input type and accepted file format
        link.type = "file";
        link.accept = ".json";

        //change event is called when a file is selected
        link.addEventListener("change", function() {
            var reader = new FileReader();
            reader.onload = function (e) {
                var target = e.target;

                try {
                    const data = JSON.parse(target.result);

                    //Arbitrary simple check
                    if ('combat' in data && 'qp' in data && 'complete' in data) {
                        _userObj = data;

                        _progressSections.updateAllSections();
                        updateGeneral();

                        localStorage.setObject(_userObjID, _userObj);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            reader.readAsText(link.files[0]);
        }, false);

        const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(evt);
        link.remove();
    }
}

class Skills {
    constructor(onClick) {
        this.onClick = onClick;

        this.selectors = {
            items: '#skills-wrapper>div',
            activeItems: '#skills-wrapper>div._active>._id:not(:contains("Combat"))',
            progress: '#skills-progress'
        };
    }

    //init
    //Initialise skill items status (_active, _inactive) based on @completed and set click event handlers
    //@complete - localStorage completed skills object
    init(completed) {
        $(this.selectors.items).each((index, element) => {
            if (completed.includes($(element).find('._id').text())) {
                $(element).addClass('_active');
                $(element).removeClass('_inactive');
            }
        });

        //Skills items click event handler
        $(this.selectors.items).on('click', (event) => {

            //Toggle _active and _inactive classes to visually update items
            $(event.currentTarget).toggleClass('_active');
            $(event.currentTarget).toggleClass('_inactive');

            //Item click callback with skill name
            this.onClick($(event.currentTarget).find('._id').text());
            this.updateProgress();
        });

        this.updateProgress();
        return this;
    }


    //updateProgress
    //Update the skill progress count
    updateProgress() {
        $(this.selectors.progress).text($(this.selectors.activeItems).length);
    }
}

function SkillsFactory(onClick, completed) {
    const skills = new Skills(onClick);
    return skills.init(completed);
}

function StoreFactory() {
    const store = new Store();
    return store.init();
}

export { SkillsFactory, StoreFactory }