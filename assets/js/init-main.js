(function() {
    "use strict";

    //Begin localStorage
    //--------------------
    
    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    }
    
    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    //saveFile
    //Saves @dataObjToWrite as a .json file
    //@filename resulting name of the file
    //@dataObjToWrite the object to save as a .json file
    function saveFile(filename, dataObjToWrite) {

        //Create blob data stream from @dataObjToWrite with 'text/json' mimetype
        const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
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
    //Loads a user selected .json file and updates @_userObj with the giiven data
    function uploadFile() {
        
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
                    if ("unlocked" in data && "qp" in data && "complete" in data) {
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

    //localStorage ID
    const _userObjID = "osrs-xosaat-user";

    //_userObj contains completed quests/achievements/collections/pets for persistent storage
    let _userObj = {
        combat: false,
        unlocked: [],
        qp: 0,
        complete: {
            quests: [],
            achievements: [],
            collections: [],
            pets: [],
        }
    };

    //Update @_userObj with localStorage if available
    if (localStorage.getItem(_userObjID) !== null) {
        _userObj = localStorage.getObject(_userObjID);
    } else {
        localStorage.setObject(_userObjID, _userObj);
    }

    //--------------------
    //End localStorage

    //Begin Globals
    //--------------------

    //Enums
    const _difficulty = Object.freeze({
        Easy: 1,
        Medium: 2,
        Hard: 3,
        Elite: 4
    });

    //Assets
    const _assetsDir = "/osrs-progress/assets";
    const _confetti = new JSConfetti();

    //Selectors
    const _skillsSelector = "#skills-wrapper .skill-item";
    const _skillsTitleSelector = ".skill-title";

    const _skillsProgressSelector = "#skills-progress";
    const _qpProgressSelector = "#qp-progress";

    const _showHideSelector = ".show-hide";
    const _downloadSelector = "#btn-download";
    const _uploadSelector = "#btn-upload";

    //_progressSections
    //Object containing data and functions for each achievement/quest/pet/collection section, as well as utility functions
    //Each object: {
    //  type: The name of the section, to use like an enum
    //  dir: The location of the sections corresponding json data file
    //  selectors: DOM selectors
    //  data: json data file as an object
    //  buildNode (function): Creates an item HTML node
    //  update (function): Calls the @_progressSections 'updateSection' function with relevant @type and @selectors
    //}
    const _progressSections = {
        init: function() {
            for (let i in this) {
                if (typeof this[i] == "object") {
                    this[i].parent = this;
                }
            }
            return this;
        },
        achievements: {
            type: "achievements",
            dir: _assetsDir + "/json/achievements.json",
            selectors: {
                wrapper: "#achievements-wrapper",
                items: "#achievements-wrapper .json-item",
                completed: "#achievements-completed",
                total: "#achievements-total",
                progress: "#achievements-progress",
            },
            data: {},
            buildNode: function(data, title, hiddenClass, completeClass) {
                return `<div class="col ${hiddenClass}">
                            <div class="d-flex flex-column json-item h-100 p-3 rounded ${completeClass}" data-src="achievements">
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
            },
            update: function(){
                this.parent.updateSection(this.type, this.selectors);
            }
        },
        quests: {
            type: "quests",
            dir: _assetsDir + "/json/quests.json",
            selectors: {
                wrapper: "#quests-wrapper",
                items: "#quests-wrapper .json-item",
                completed: "#quests-completed",
                total: "#quests-total",
                progress: "#quests-progress",
            },
            data: {},
            buildNode: function(data, title, hiddenClass, completeClass) {
                return `<div class="col ${hiddenClass}">
                            <div class="json-item h-100 p-3 rounded ${completeClass}" data-src="quests">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${title}</h4>
                                    <span class="difficulty-${data.difficulty}">${data.difficulty}</span>
                                </div>
                                <hr/>
                                <span class="text-muted"></span>
                            </div>
                        </div>`;
            },
            update: function() {
                this.parent.updateSection(this.type, this.selectors);
            }
        },
        pets: {
            type: "pets",
            dir: _assetsDir + "/json/pets.json",
            selectors: {
                wrapper: "#pets-wrapper",
                items: "#pets-wrapper .json-item",
                completed: "#pets-completed",
                total: "#pets-total",
                progress: "#pets-progress",
            },
            data: {},
            buildNode: function(data, title, hiddenClass, completeClass) {
                return `<div class="col ${hiddenClass}">
                            <div class="json-item h-100 p-3 rounded ${completeClass}" data-src="pets">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${title}</h4>
                                    <img src="${data.img}" alt="${title} icon"/>
                                </div>
                                <hr/>
                                <span class="text-muted"></span>
                            </div>
                        </div>`;
            },
            update: function(){
                this.parent.updateSection(this.type, this.selectors);
            }
        },
        collections: {
            type: "collections",
            dir: _assetsDir + "/json/collections.json",
            selectors: {
                wrapper: "#collections-wrapper",
                items: "#collections-wrapper .json-item",
                completed: "#collections-completed",
                total: "#collections-total",
                progress: "#collections-progress",
            },
            data: {},
            buildNode: function(data, title, hiddenClass, completeClass) {
                const maxItems = 5;

                let html = `<div class="col ${hiddenClass}">
                                <div class="d-flex flex-column json-item h-100 p-3 rounded ${completeClass}" data-src="collections">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${title}</h4>
                                        <img src="${data.img}" alt="${title} icon"/>
                                    </div>
                                    <hr/>
                                    <ul class="d-flex flex-wrap gap-2 py-2">`
            
                for (let i = 0; i < Math.min(maxItems, data.items.length); i++) {
                    html = html + `<li class="list-group-item rounded">${data.items[i]}</li>`;
                }
            
                html = html + `</ul><div class="d-flex flex-grow-1"></div>`;

                if (data.items.length > maxItems) {
                    html = html + `<span>and ${data.items.length - maxItems} others...</span>`;
                }
                
                html = html + `<hr/><span class="text-muted"></span></div></div>`;

                return html;
            },
            update: function() {
                this.parent.updateSection(this.type, this.selectors);
            }
        },
        updateSection: function(type, selectors) {
            $(selectors.wrapper).html("");
            $(selectors.wrapper).html(this.buildNodes(type));
    
            const nTotal = $(selectors.items).length;
            const nComplete = $(selectors.items + ".complete").length;
            const nProgress = Math.round((nComplete / nTotal) * 100) || 0;
    
            $(selectors.total).text(nTotal);
            $(selectors.completed).text(nComplete);
            $(selectors.progress).width(nProgress + "%");
            $(selectors.progress).text(nProgress + "%");
    
            $(selectors.items).on("click", onItemClick);
        },
        updateAllSections: function() {
            this.achievements.update();
            this.quests.update();
            this.pets.update();
            this.collections.update();
        },
        buildNodes: function(type) {
            const hideCompletedItems = $(`img[data-src='${type},hide']`).length > 0;

            const nodes = [];
            const completedNodes = [];

            for (const oID in this[type].data) {
                const data = this[type].data[oID];

                const isComplete = _userObj.complete[type].includes(type === this.achievements.type ? data.task : oID);

                const completeClass = isComplete ? "complete" : "";
                const hiddenClass = isComplete && hideCompletedItems ? "d-none" : "";

                if (type === this.quests.type) {
                    if (data.rewards.skills.length > 0) {
                        const rSkills = new Set(data.requirements.skills.concat(data.rewards.skills));
                        data.requirements.skills = Array.from(rSkills);
                    }
                }
                
                if (isUnlocked(data.requirements)) {
                    const html = this[type].buildNode(data, oID, hiddenClass, completeClass);
                    const node = type === this.achievements.type ? { "diary": data.diary, "difficulty": data.difficulty, "html": html } : { "name": oID, "html": html };

                    if (isComplete) {
                        completedNodes.push(node);
                    } else {
                        nodes.push(node);
                    }
                }
            }

            return this.sortNodes(type, nodes) + this.sortNodes(type, completedNodes);
        },
        sortNodes: function(type, nodes) {
            let html = "";

            //Achievements are sorted by diary name and then by difficulty
            if (type === this.achievements.type) {
                nodes.sort((a, b) => a.diary.localeCompare(b.diary) || _difficulty[a.difficulty] - _difficulty[b.difficulty]);
            } else {
                nodes.sort((a, b) => a.name.localeCompare(b.name));
            }

            for (const node of nodes) {
                html = html + node.html;
            }

            return html;
        }
    }.init();

    //--------------------
    //End globals
    
    //Begin functions
    //--------------------

    //updateGeneral
    //Update skills 'unlocked' class and general progress indicators utilising the @_userObj object
    function updateGeneral() {

        //Reset the 'unlocked' class on skill items
        $(_skillsSelector + ".unlocked").removeClass("unlocked");
        for (const unlock of _userObj.unlocked) {
            $(".skill-item[data-src=" + unlock + "]").addClass("unlocked");
        }

        //Update skill and qp total amount progress indicators
        $(_qpProgressSelector).text(_userObj.qp);
        $(_skillsProgressSelector).text(_userObj.unlocked.length);
    }

    //isUnlocked
    //Determines whether or not an achievement/quest/pet/collection item has been unlocked, utilising the @_userObj object
    //@requirements - object to test unlocked status
    function isUnlocked(requirements) {
        if (requirements) {
            if ("combat" in requirements && (requirements.combat && !_userObj.combat)) {
                return false;
            }
    
            if ("quests" in requirements) {
                for (const quest of requirements.quests){
                    if (!_userObj.complete.quests.includes(quest)) {
                        return false;
                    }
                }
            }
    
            if ("skills" in requirements) {
                for (const skill of requirements.skills){
                    if (!_userObj.unlocked.includes(skill)) {
                        return false;
                    }
                }
            }

            if ("qp" in requirements && _userObj.qp < requirements.qp) {
                return false;
            }
        }

        return true;
    }

    //toggleArrayItem
    //Add array item if not present, remove if present
    //@arr - array
    //@item - item to add/remove to/from @arr
    function toggleArrayItem(arr, item) {
        if (arr.includes(item)) {
            arr.splice(arr.indexOf(item), 1);
        } else {
            arr.push(item);
        }
    }

    //--------------------
    //End functions

    //Begin onClick events
    //--------------------

    //onSkillClick
    //Click event for all skills buttons, including combat
    //Once a skill is clicked, toggle the 'unlock' class, update the @_userObj object, update the relevant section and update progress indicators
    function onSkillClick() {
        const type = $(_skillsTitleSelector, this).text().trim();

        $(this).toggleClass("unlocked");

        //Update @_userObj combat status and unlocked skills
        if (type === "Combat") {
            _userObj.combat = !_userObj.combat;
        } else {
            toggleArrayItem(_userObj.unlocked, type);
        }
        
        _progressSections.updateAllSections();

        //Update skill progress indicator
        $(_skillsProgressSelector).text(_userObj.unlocked.length);

        //Save @_userObj
        localStorage.setObject(_userObjID, _userObj);
    }

    //onItemClick
    //Click event for the html nodes populated in the achievements/quests/pets/collections sections by @_progressSections
    //Once an item is clicked, toggle the 'complete' class, update the @_userObj object and update the relevant section
    function onItemClick() {
        const type = $(this).attr("data-src");

        $(this).toggleClass("complete");

        if (type === _progressSections.achievements.type) {
            toggleArrayItem(_userObj.complete[type], $(".json-description", this).text().trim());
        } else {
            const quest = $("h4", this).text().trim();
            toggleArrayItem(_userObj.complete[type], quest);

            //For quests, update the QP in the @userObj, the QP indicator and other sections
            if (type === _progressSections.quests.type) {
                if ($(this).hasClass("complete")) {
                    _userObj.qp = _userObj.qp + _progressSections.quests.data[quest].rewards.qp;
                } else {
                    _userObj.qp = _userObj.qp - _progressSections.quests.data[quest].rewards.qp;
                }

                //Update quest points indicator
                $(_qpProgressSelector).text(_userObj.qp);

                //Update achievements/pets/collections as they can be locked behind quest compeletions
                _progressSections.achievements.update();
                _progressSections.pets.update();
                _progressSections.collections.update();
            }
        }

        _progressSections[type].update();

        //Save @_userObj
        localStorage.setObject(_userObjID, _userObj);

        //Confetti!
        if ($(this).hasClass("complete")) {
            _confetti.addConfetti();
        }
    }

    //onShowHideClick
    //Toggles the show/hide img button utilitisng the 'data-src' attribute to update the image src corresponding with its state
    //Toggles the visibility of the completed items in the corresponding section
    function onShowHideClick() {
        //Data source contains section and state, e.g. achievements,show
        const dSrc = $(this).attr("data-src").split(",");
        const type = dSrc[0];
        const state = dSrc[1];

        if (state === "hide") {
            $(this).attr("data-src", type + ",show");
            $(this).attr("src",_assetsDir + "/images/svg/show.svg");
        } else {
            $(this).attr("data-src", type + ",hide");
            $(this).attr("src",_assetsDir + "/images/svg/hide.svg");
        }

        //Only toggle the visibility of completed items
        //Section obtained from the img buttons 'data-src' attribute
        $(_progressSections[type].selectors.items + ".complete").parent().toggleClass("d-none");
    }

    //--------------------
    //End onClick events
    
    //On document ready
    //--------------------

    $(document).ready(function () {

        //Click event listeners
        $(_skillsSelector).on("click", onSkillClick);
        $(_showHideSelector).on("click", onShowHideClick);
        
        $(_uploadSelector).on("click", uploadFile);
        $(_downloadSelector).on("click", function() {
            saveFile("data.json", _userObj);
        });

        //Load .json files and update functions
        for (const oID in _progressSections) {
            const oObj = _progressSections[oID];

            $.getJSON(oObj.dir, function(data) {
                this.data = data;
                this.update();
            }.bind(oObj));
        }

        updateGeneral();
    });
})();