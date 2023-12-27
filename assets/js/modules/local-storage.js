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
                quests: [],
                achievements: [],
                pets: [],
                collections: {},
            }
        }

        this.isUnlocked = this.isUnlocked.bind(this);
    }

    init() {
        //Update @_userObj with localStorage if available
        if (localStorage.getItem(this.id) !== null) {
            this.obj = localStorage.getObject(this.id);
        } else {
            localStorage.setObject(this.id, this.obj);
        }

        return this;
    }

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

export function StoreFactory() {
    const store = new Store();
    return store.init();
}