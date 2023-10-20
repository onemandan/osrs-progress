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

    const _difficulty = Object.freeze({
        Easy: 1,
        Medium: 2,
        Hard: 3,
        Elite: 4
    });

    const _skillsSelector = "#skills-wrapper .skill-item";
    const _skillsTitleSelector = ".skill-title";

    const _achievementsSelector = "#achievements-wrapper";
    const _achievementsItemsSelector = _achievementsSelector + " .json-item";
    const _achievementsCompletedSelector = "#achievements-completed";
    const _achievementsTotalSelector = "#achievements-total";
    const _achievementsProgress = "#achievements-progress";

    const _questsSelector = "#quests-wrapper";
    const _questsItemsSelector = _questsSelector + " .json-item";
    const _questsCompletedSelector = "#quests-completed";
    const _questsTotalSelector = "#quests-total";
    const _questsProgress = "#quests-progress";

    const _petsSelector = "#pets-wrapper";
    const _petsItemsSelector = _petsSelector + " .json-item";
    const _petsCompletedSelector = "#pets-completed";
    const _petsTotalSelector = "#pets-total";
    const _petsProgress = "#pets-progress";

    const _collectionsSelector = "#collections-wrapper";
    const _collectionsItemsSelector = _collectionsSelector + " .json-item";
    const _collectionsCompletedSelector = "#collections-completed";
    const _collectionsTotalSelector = "#collections-total";
    const _collectionsProgress = "#collections-progress";

    const _showHideSelector = ".show-hide";

    const jsonObj = {
        achievements: {
            data: {},
            dir: "/assets/json/achievements.json",
            update: function(){
                updateSection(_achievementsSelector, _achievementsItemsSelector, _achievementsCompletedSelector, _achievementsTotalSelector, _achievementsProgress, function() {
                    const hide = $("img[data-src='achievement,hide']").length > 0;

                    let nodes = [];
                    let completeNodes = [];

                    for (const oID in jsonObj.achievements.data) {
                        const data = jsonObj.achievements.data[oID];
                        const complete = userObj.complete.achievements.includes(data.task) ? "complete" : "";
                        const hidden = complete && hide ? "d-none" : "";

                        if (isUnlocked(data.requirements)) {
                            let html =  
                            `<div class="col ${hidden}">
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

                            if (complete) {
                                completeNodes.push({
                                    "diary": data.diary,
                                    "difficulty": data.difficulty,
                                    "html": html
                                });
                            } else {
                                nodes.push({
                                    "diary": data.diary,
                                    "difficulty": data.difficulty,
                                    "html": html
                                });
                            }
                        }
                    }

                    return sortNodesHTML(["diary", "difficulty"], nodes) + sortNodesHTML(["diary", "difficulty"], completeNodes);
                }.bind(this));
            }
        },
        quests: {
            data: {},
            dir: "/assets/json/quests.json",
            update: function() {
                updateSection(_questsSelector, _questsItemsSelector, _questsCompletedSelector, _questsTotalSelector, _questsProgress, function() {
                    const hide = $("img[data-src='quest,hide']").length > 0;

                    let nodes = [];
                    let completeNodes = [];
                    
                    for (const oID in jsonObj.quests.data) {
                        const data = jsonObj.quests.data[oID];
                        const complete = userObj.complete.quests.includes(oID) ? "complete" : "";
                        const hidden = complete && hide ? "d-none" : "";

                        if (data.rewards.skills.length > 0) {
                            const rSkills = new Set(data.requirements.skills.concat(data.rewards.skills));
                            data.requirements.skills = Array.from(rSkills);
                        }
                        
                        if (isUnlocked(data.requirements)) {
                            let html =  
                            `<div class="col ${hidden}">
                                <div class="json-item h-100 p-3 rounded ${complete}" data-src="quest">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${oID}</h4>
                                        <span class="difficulty-${data.difficulty}">${data.difficulty}</span>
                                    </div>
                                    <hr/>
                                    <span class="text-muted"></span>
                                </div>
                            </div>`;

                            if (complete) {
                                completeNodes.push({
                                    "name": oID,
                                    "html": html
                                });
                            } else {
                                nodes.push({
                                    "name": oID,
                                    "html": html
                                });
                            }
                        }
                    }

                    return sortNodesHTML("name", nodes) + sortNodesHTML("name", completeNodes);
                }.bind(this));
            }
        },
        pets: {
            data: {},
            dir: "/assets/json/pets.json",
            update: function(){
                updateSection(_petsSelector, _petsItemsSelector, _petsCompletedSelector, _petsTotalSelector, _petsProgress, function() {
                    const hide = $("img[data-src='pet,hide']").length > 0;

                    let nodes = [];
                    let completeNodes = [];

                    for (const oID in this.data) {
                        const data = this.data[oID];
                        const complete = userObj.complete.pets.includes(oID) ? "complete" : "";
                        const hidden = complete && hide ? "d-none" : "";
                        
                        if (isUnlocked(data.requirements)) {
                            let html = 
                            `<div class="col ${hidden}">
                                <div class="json-item h-100 p-3 rounded ${complete}" data-src="pet">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${oID}</h4>
                                        <img src="${data.img}" alt="${oID} icon"/>
                                    </div>
                                    <hr/>
                                    <span class="text-muted"></span>
                                </div>
                            </div>`;

                            if (complete) {
                                completeNodes.push({
                                    "name": oID,
                                    "html": html
                                });
                            } else {
                                nodes.push({
                                    "name": oID,
                                    "html": html
                                });
                            }
                        }
                    }

                    return sortNodesHTML("name", nodes) + sortNodesHTML("name", completeNodes);
                }.bind(this));
            }
        },
        collections: {
            data: {},
            dir: "/assets/json/collections.json",
            update: function() {
                updateSection(_collectionsSelector, _collectionsItemsSelector, _collectionsCompletedSelector, _collectionsTotalSelector, _collectionsProgress, function() {
                    const hide = $("img[data-src='collection,hide']").length > 0;
                    const maxItems = 5;

                    let nodes = [];
                    let completeNodes = [];

                    for (const oID in this.data) {
                        const data = this.data[oID];
                        const complete = userObj.complete.collections.includes(oID) ? "complete" : "";
                        const hidden = complete && hide ? "d-none" : "";
                        
                        if (isUnlocked(data.requirements)) {
                            let html = 
                            `<div class="col ${hidden}">
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

                            if (complete) {
                                completeNodes.push({
                                    "name": oID,
                                    "html": html
                                });
                            } else {
                                nodes.push({
                                    "name": oID,
                                    "html": html
                                });
                            }
                        }
                    }

                    return sortNodesHTML("name", nodes) + sortNodesHTML("name", completeNodes);
                }.bind(this));
            }
        }
    };

    function sortNodesHTML(key, nodes) {
        let html = "";

        if (Array.isArray(key)) {
            nodes.sort((a, b) => a[key[0]].localeCompare(b[key[0]]) || _difficulty[a[key[1]]] - _difficulty[b[key[1]]]);
        } else {
            nodes.sort((a, b) => a[key].localeCompare(b[key]));
        }
        

        for (const node of nodes) {
            html = html + node.html;
        }

        return html;
    }

    function updateSection(wrapper, wrapperItems, completed, total, progress, callback) {
        $(wrapper).html("");
        $(wrapper).html(callback());

        const nTotal = $(wrapperItems).length;
        const nComplete = $(wrapperItems + ".complete").length;
        const nProgress = Math.round((nComplete / nTotal) * 100);

        $(total).text(nTotal);
        $(completed).text(nComplete);
        $(progress).width(nProgress + "%");
        $(progress).text(nProgress + "%");

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
        toggleArrayItem(userObj.unlocked, $(_skillsTitleSelector, this).text().trim());

        updateAllSections();

        localStorage.setObject(userObjID, userObj);
    }

    function onJSONObjClick(e) {
        const type = $(this).attr("data-src"); 

        $(this).toggleClass("complete");

        if (type === "achievement") {
            toggleArrayItem(userObj.complete.achievements, $(".json-description", this).text().trim());
            jsonObj.achievements.update();
        } else if (type === "quest") {
            toggleArrayItem(userObj.complete.quests, $("h4", this).text().trim());
            updateAllSections();
        } else if (type === "pet") {
            toggleArrayItem(userObj.complete.pets, $("h4", this).text().trim());
            jsonObj.pets.update();
        } else if (type === "collection") {
            toggleArrayItem(userObj.complete.collections, $("h4", this).text().trim());
            jsonObj.collections.update();
        }

        localStorage.setObject(userObjID, userObj);
    }

    //On document ready
    $(document).ready(function () {
        $(_skillsSelector).on("click", onSkillClick);

        $(_showHideSelector).on("click", function() {
            const dSrc = $(this).attr("data-src").split(",");
            const type = dSrc[0];
            const current = dSrc[1];

            if (current === "hide") {
                $(this).attr("data-src", type + ",show");
                $(this).attr("src","/assets/images/svg/show.svg");
            } else {
                $(this).attr("data-src", type + ",hide");
                $(this).attr("src","/assets/images/svg/hide.svg");
            }

            if (type === "achievement") {
                jsonObj.achievements.update();
            } else if (type === "quest") {
                jsonObj.quests.update();
            } else if (type === "pet") {
                jsonObj.pets.update();
            } else if (type === "collection") {
                jsonObj.collections.update();
            }
        });

        for (const oID in jsonObj) {
            const oObj = jsonObj[oID];

            $.getJSON(oObj.dir, function(data) {
                this.data = data;
                this.update();
            }.bind(oObj));
        }

        for (const unlock of userObj.unlocked) {
            $(".skill-item[data-src=" + unlock + "]").addClass("unlocked");
        }
    });
})();