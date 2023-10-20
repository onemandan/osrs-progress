(function() {
    "use strict";

    //Start Local Storage
    ///////////////////////

    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    }
    
    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    const userObjID = "osrs-xosaat-user";

    let userObj = {
        unlocked: [],
        qp: 0,
        complete: {
            quests: [],
            achievements: [],
            collections: [],
            pets: [],
        }
    };

    if (localStorage.getItem(userObjID) !== null) {
        userObj = localStorage.getObject(userObjID);
    } else {
        localStorage.setObject(userObjID, userObj);
    }

    ///////////////////////
    //End Local Storage

    const skillsSelector = "#skills-wrapper .skill-item";
    const skillsTitleSelector = ".skill-title";

    const achievementsSelector = "#achievements-wrapper";
    const achievementsItemsSelector = achievementsSelector + " .json-item";
    const achievementsCompletedSelector = "#achievements-completed";
    const achievementsTotalSelector = "#achievements-total";

    const questsSelector = "#quests-wrapper";
    const questsItemsSelector = questsSelector + " .json-item";
    const questsCompletedSelector = "#quests-completed";
    const questsTotalSelector = "#quests-total";

    const petsSelector = "#pets-wrapper";
    const petsItemsSelector = petsSelector + " .json-item";
    const petsCompletedSelector = "#pets-completed";
    const petsTotalSelector = "#pets-total";

    const collectionsSelector = "#collections-wrapper";
    const collectionsItemsSelector = collectionsSelector + " .json-item";
    const collectionsCompletedSelector = "#collections-completed";
    const collectionsTotalSelector = "#collections-total";

    const jsonObj = {
        achievements: {
            data: {},
            dir: "/assets/json/achievements.json",
            update: function(){
                updateSection(achievementsSelector, achievementsItemsSelector, achievementsCompletedSelector, achievementsTotalSelector, function() {
                    let html = "";

                    for (const oID in jsonObj.achievements.data) {
                        const data = jsonObj.achievements.data[oID];
                        const complete = userObj.complete.achievements.includes(data.task) ? "complete" : "";

                        if (isUnlocked(data.requirements)) {
                            html = html + 
                            `<div class="col">
                                <div class="d-flex flex-column json-item h-100 p-3 rounded ${complete}" data-src="achievement">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${data.diary}</h4>
                                        <span class="difficulty-${data.difficulty}">${data.difficulty}</span>
                                    </div>
                                    <hr/>
                                    <div class="flex-grow-1">
                                        <span class="json-description">${data.task}</span>
                                    </div>
                                    <hr/>
                                    <span class="text-muted"></span>
                                </div>
                            </div>`;
                        }
                    }

                    return html;
                }.bind(this));
            }
        },
        quests: {
            data: {},
            dir: "/assets/json/quests.json",
            update: function() {
                updateSection(questsSelector, questsItemsSelector, questsCompletedSelector, questsTotalSelector, function() {
                    let html = "";

                    for (const oID in jsonObj.quests.data) {
                        const data = jsonObj.quests.data[oID];
                        const complete = userObj.complete.quests.includes(oID) ? "complete" : "";

                        if (data.rewards.skills.length > 0) {
                            const rSkills = new Set(data.requirements.skills.concat(data.rewards.skills));
                            data.requirements.skills = Array.from(rSkills);
                        }
                        
                        if (isUnlocked(data.requirements)) {
                            html = html + 
                            `<div class="col">
                                <div class="json-item h-100 p-3 rounded ${complete}" data-src="quest">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${oID}</h4>
                                        <span class="difficulty-${data.difficulty}">${data.difficulty}</span>
                                    </div>
                                    <hr/>
                                    <span class="text-muted"></span>
                                </div>
                            </div>`;
                        }
                    }

                    return html;
                }.bind(this));
            }
        },
        pets: {
            data: {},
            dir: "/assets/json/pets.json",
            update: function(){
                updateSection(petsSelector, petsItemsSelector, petsCompletedSelector, petsTotalSelector, function() {
                    let html = "";

                    for (const oID in this.data) {
                        const data = this.data[oID];
                        const complete = userObj.complete.pets.includes(oID) ? "complete" : "";
                        
                        if (isUnlocked(data.requirements)) {
                            html = html + 
                            `<div class="col">
                                <div class="json-item h-100 p-3 rounded ${complete}" data-src="pet">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${oID}</h4>
                                        <img src="${data.img}" alt="${oID} icon"/>
                                    </div>
                                    <hr/>
                                    <span class="text-muted"></span>
                                </div>
                            </div>`;
                        }
                    }

                    return html;
                }.bind(this));
            }
        },
        collections: {
            data: {},
            dir: "/assets/json/collections.json",
            update: function() {
                updateSection(collectionsSelector, collectionsItemsSelector, collectionsCompletedSelector, collectionsTotalSelector, function() {
                    const maxItems = 5;
                    let html = "";

                    for (const oID in this.data) {
                        const data = this.data[oID];
                        const complete = userObj.complete.collections.includes(oID) ? "complete" : "";
                        
                        if (isUnlocked(data.requirements)) {
                            html = html + 
                            `<div class="col">
                                <div class="d-flex flex-column json-item h-100 p-3 rounded ${complete}" data-src="collection">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${oID}</h4>
                                        <img src="${data.img}" alt="${oID} icon"/>
                                    </div>
                                    <hr/>
                                    <ul class="d-flex flex-wrap gap-2 py-2">`
            
                            for (let i = 0; i < Math.min(maxItems, data.items.length); i++) {
                                html = html +
                                `<li class="list-group-item rounded">${data.items[i]}</li>`;
                            }
            
                            html = html + 
                                    `</ul>
                                <div class="d-flex flex-grow-1"></div>`;
            
                            if (data.items.length > maxItems) {
                                html = html + 
                                `<span>and ${data.items.length - maxItems} others...</span>`;
                            }
                            
                            html = html +
                                    `<hr/>
                                    <span class="text-muted"></span>
                                </div>
                            </div>`;
                        }
                    }

                    return html;
                }.bind(this));
            }
        }
    };

    function updateSection(wrapper, wrapperItems, completed, total, callback) {
        $(wrapper).html("");
        $(wrapper).html(callback());
        $(total).text($(wrapperItems).length);
        $(wrapperItems).on("click", onJSONObjClick);
    }

    function updateAllSections() {
        jsonObj.achievements.update();
        jsonObj.quests.update();
        jsonObj.pets.update();
        jsonObj.collections.update();
    }

    function isUnlocked(requirements) {
        const combat = userObj.unlocked.includes("Combat");

        if (requirements) {
            if ("combat" in requirements && (requirements.combat && !combat)) {
                return false;
            }
    
            if ("quests" in requirements) {
                for (const quest of requirements.quests){
                    if (!userObj.complete.quests.includes(quest)) {
                        return false;
                    }
                }
            }
    
            if ("skills" in requirements) {
                for (const skill of requirements.skills){
                    if (!userObj.unlocked.includes(skill)) {
                        return false;
                    }
                }
            }

            if ("qp" in requirements && userObj.qp < requirements.qp) {
                return false;
            }
        }


        return true;
    }

    function toggleArrayItem(arr, item) {
        if (arr.includes(item)) {
            arr.splice(arr.indexOf(item), 1);
        } else {
            arr.push(item);
        }
    }

    function onSkillClick(e) {
        $(this).toggleClass("unlocked");
        toggleArrayItem(userObj.unlocked, $(skillsTitleSelector, this).text().trim());

        updateAllSections();
    }

    function onJSONObjClick(e) {
        const type = $(this).attr("data-src"); 

        $(this).toggleClass("complete");

        if (type === "achievement") {
            toggleArrayItem(userObj.complete.achievements, $(".json-description", this).text().trim());
        } else if (type === "quest") {
            toggleArrayItem(userObj.complete.quests, $("h4", this).text().trim());
        } else if (type === "pet") {
            toggleArrayItem(userObj.complete.pets, $("h4", this).text().trim());
        } else if (type === "collection") {
            toggleArrayItem(userObj.complete.collections, $("h4", this).text().trim());
        }
    }

    //On document ready
    $(document).ready(function () {
        $(skillsSelector).on("click", onSkillClick);

        for (const oID in jsonObj) {
            const oObj = jsonObj[oID];

            $.getJSON(oObj.dir, function(data) {
                this.data = data;
                this.update();
            }.bind(oObj));
        }
    });
})();