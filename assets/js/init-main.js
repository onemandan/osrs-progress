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
    //Loads a user selected .json file and updates @_userObj with the given data
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
                    if ("unlocked" in data && "qp" in data && "complete" in data && "showHide" in data) {
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
    const _userObjID = "osrs-xosaat-user-v2";

    //_userObj contains completed quests/achievements/collections/pets for persistent storage
    let _userObj = {
        combat: false,
        unlocked: [],
        qp: 0,
        complete: {
            quests: [],
            achievements: [],
            pets: [],
            collections: {},
        },
        showHide: {
            "collections": "show",
            "pets": "show",
            "quests": "show",
            "achievements": "show"
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
    const _wikiImagesDir = "https://oldschool.runescape.wiki/images/";
    const _confetti = new JSConfetti();

    let _modal;

    //Selectors
    const _skillsSelector = "#skills-wrapper .skill-item";
    const _skillsTitleSelector = ".skill-title";

    const _skillsProgressSelector = "#skills-progress";
    const _qpProgressSelector = "#qp-progress";

    const _showHideSelector = ".show-hide";
    const _downloadSelector = "#btn-download";
    const _uploadSelector = "#btn-upload";

    const _modalItemsSelector = ".modal-body li";
    const _modalBtnSave = "#btn-modal-save";
    const _modalBtnComplete = "#btn-modal-complete-all";

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
                completed: ".achievements-completed",
                total: ".achievements-total",
                incomplete: ".achievements-incomplete",
                progress: "#achievements-progress",
            },
            data: {},
            buildNode: function(opts) {
                return `<div class="col ${opts.classes.hidden}">
                            <div class="d-flex flex-column json-item h-100 p-3 rounded ${opts.classes.complete}" data-src="achievements">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${opts.data.diary}</h4>
                                    <span class="difficulty-${opts.data.difficulty}">${opts.data.difficulty}</span>
                                </div>
                                <hr/>
                                <div class="flex-grow-1">
                                    <span class="json-description">${opts.data.task}</span>
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
                completed: ".quests-completed",
                total: ".quests-total",
                incomplete: ".quests-incomplete",
                progress: "#quests-progress",
            },
            data: {},
            buildNode: function(opts) {
                return `<div class="col ${opts.classes.hidden}">
                            <div class="json-item h-100 p-3 rounded ${opts.classes.complete}" data-src="quests">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${opts.title}</h4>
                                    <span class="difficulty-${opts.data.difficulty}">${opts.data.difficulty}</span>
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
                completed: ".pets-completed",
                total: ".pets-total",
                incomplete: ".pets-incomplete",
                progress: "#pets-progress",
            },
            data: {},
            buildNode: function(opts) {
                return `<div class="col ${opts.classes.hidden}">
                            <div class="json-item h-100 p-3 rounded ${opts.classes.complete}" data-src="pets">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${opts.title}</h4>
                                    <img src="${opts.data.img}" alt="${opts.title} icon"/>
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
                completed: ".collections-completed",
                total: ".collections-total",
                incomplete: ".collections-incomplete",
                progress: "#collections-progress",
            },
            data: {},
            buildNode: function(opts) {
                const maxItems = 5;
                const totalItems = opts.data.items.length;

                let html = `<div class="col col-sm-12 col-md-6 col-lg-4 ${opts.classes.hidden}">
                                <div class="d-flex flex-column json-item p-3 rounded ${opts.classes.complete}" data-src="collections">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${opts.title}</h4>
                                        <img src="${opts.data.img}" alt="${opts.title} icon"/>
                                    </div>
                                    <hr/>
                                    <ul class="d-flex flex-wrap gap-2 py-2">`
            
                for (let i = 0; i < Math.min(maxItems, totalItems); i++) {
                    const completeClass = opts.title in _userObj.complete.collections && _userObj.complete.collections[opts.title].includes(opts.data.items[i]) ? "complete" : ""; 

                    html = html + `<li class="list-group-item rounded ${completeClass}">${opts.data.items[i]}</li>`;
                }
            
                html = html + `</ul>`;

                if (totalItems > maxItems) {
                    html = html + `<span>and ${totalItems - maxItems} others...</span>`;
                }
                
                html = html + `<hr/>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted"></span>
                            <div class="justify-content-end">
                                <span>${opts.title in _userObj.complete.collections ? _userObj.complete.collections[opts.title].length : 0}/${totalItems}</span>
                            </div>
                        </div>
                    </div>
                </div>`;

                return html;
            },
            buildModal: function(collection){
                let html = "";

                for (const item of this.data[collection].items) {
                    const completeClass = collection in _userObj.complete.collections && _userObj.complete.collections[collection].includes(item) ? "complete" : "";

                    html = html + `<li class="list-group-item rounded d-flex justify-content-between ${completeClass}">
                        <div class="d-flex justify-content-start align-items-center">
                            <img src="${_wikiImagesDir}${item.replaceAll(" ", "_")}.png" onerror="this.src='${_wikiImagesDir}Bank_filler.png'" width="16px" height="16px" alt="icon"/>
                            <span class="collection-item ms-3">${item}</span>
                        </div>
                        <span class="text-muted"></span>
                    </li>`;
                }
                
                $(".modal-title").text(collection);
                $(".modal-body ul").html(html);
                $(_modalItemsSelector).on("click", onModalItemClick);
            },
            update: function() {
                this.parent.updateSection(this.type, this.selectors);
                updateMasonry();
            }
        },
        updateSection: function(type, selectors) {
            $(selectors.wrapper).html(this.buildNodes(type));
    
            const nTotal = $(selectors.items).length;
            const nComplete = $(selectors.items + ".complete").length;
            const nProgress = Math.round((nComplete / nTotal) * 100) || 0;
            const nIncomplete = nTotal - nComplete;
    
            $(selectors.total).text(nTotal);
            $(selectors.completed).text(nComplete);
            $(selectors.incomplete).text(nIncomplete);
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
            const hideCompletedItems = _userObj.showHide[type] === "hide";

            //Node lists, as completed items are sent to the end of the DOM wrapper, maintain two lists to sort individually
            const nodes = [];
            const completedNodes = [];

            for (const oID in this[type].data) {
                const data = this[type].data[oID];

                //As quests cannot be started until all relevant skills are unlocked, treat quest skill rewards as requirements
                if (type === this.quests.type) {
                    if (data.rewards.skills.length > 0) {

                        //Append rewarded skills to requirements
                        const rSkills = new Set(data.requirements.skills.concat(data.rewards.skills));
                        data.requirements.skills = Array.from(rSkills);
                    }
                }
                
                if (isUnlocked(data.requirements)) {
                    let isComplete;

                    //Determine if the item has been completed by checking the @_userObj object
                    if (type === this.collections.type) {
                        isComplete = oID in _userObj.complete.collections && _userObj.complete.collections[oID].length === data.items.length;
                    } else {
                        isComplete = _userObj.complete[type].includes(type === this.achievements.type ? data.task : oID);
                    }

                    //Item CSS classes
                    const completeClass = isComplete ? "complete" : "";
                    const hiddenClass = isComplete && hideCompletedItems ? "d-none" : "";

                    //Build the html node with options
                    const html = this[type].buildNode({
                        "data": data,
                        "title": oID,
                        "classes": {
                            "hidden": hiddenClass,
                            "complete": completeClass
                        }
                    });

                    //Create the node object 
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

    //updateMasonry
    //The collections section uses the masonry layout, which needs to be reloaded and updated on change
    function updateMasonry() {
        $(_progressSections.collections.selectors.wrapper).masonry("reloadItems");
        $(_progressSections.collections.selectors.wrapper).masonry("layout");
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
                for (const skill of requirements.skills) {

                    //Determine if there is an either/or skill requirement
                    if (skill.includes("||")) {
                        if (!skill.split("||").some(s => _userObj.unlocked.includes(s))) {
                            return false;
                        }

                    } else if (!_userObj.unlocked.includes(skill)) {
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

        if (type === _progressSections.collections.type) {
            _progressSections.collections.buildModal($("h4", this).text().trim());
            _modal.show();
        } else {
            $(this).toggleClass("complete");

            if (type === _progressSections.achievements.type) {
                toggleArrayItem(_userObj.complete[type], $(".json-description", this).text().trim());
            } else {
                const title = $("h4", this).text().trim();
                toggleArrayItem(_userObj.complete[type], title);

                //For quests, update the QP in the @userObj, the QP indicator and other sections
                if (type === _progressSections.quests.type) {
                    if ($(this).hasClass("complete")) {
                        _userObj.qp = _userObj.qp + _progressSections.quests.data[title].rewards.qp;
                    } else {
                        _userObj.qp = _userObj.qp - _progressSections.quests.data[title].rewards.qp;
                    }

                    //Update quest points indicator
                    $(_qpProgressSelector).text(_userObj.qp);

                    //Update achievements/pets/collections as they can be locked behind quest completions
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
    }

    //onShowHideClick
    //Toggles the show/hide img button utilitisng the 'data-src' attribute to update the image src corresponding with its state
    //Toggles the visibility of the completed items in the corresponding section
    function onShowHideClick() {
        //Data source contains section and state, e.g. achievements,show
        const dSrc = $(this).attr("data-src").split(",");
        const type = dSrc[0];
        const state = dSrc[1];
        
        const newState = state === "hide" ? "show": "hide";

        $(this).attr("data-src", `${type},${newState}`);
        $(this).attr("src", `${_assetsDir}/images/svg/${newState}.svg`);

        //Only toggle the visibility of completed items
        //Section obtained from the img buttons 'data-src' attribute
        $(_progressSections[type].selectors.items + ".complete").parent().toggleClass("d-none");

        if (type === _progressSections.collections.type) {
            updateMasonry();
        }

        //Update @_userObj
        _userObj.showHide[type] = newState;

        //Save @_userObj
        localStorage.setObject(_userObjID, _userObj);
    }

    //onModalItemClick
    //Toggle the 'complete' class on the collection items within the modal when clicked
    function onModalItemClick() {
        $(this).toggleClass("complete");
    }

    //onModalSaveClick
    //Update the @_userObj with completed collection items and update the collections section
    function onModalSaveClick() {
        const completeItemsLength = $(_modalItemsSelector + ".complete").length;
        const collection = $(".modal-title").text();
        const completeItems = [];

        $(_modalItemsSelector + ".complete").each(function() {
            completeItems.push($(".collection-item", this).text());
        });

        _userObj.complete.collections[collection] = completeItems;
        _progressSections.collections.update();
        
        //Add confetti if all items completed and hide modal
        if (completeItemsLength === _progressSections.collections.data[collection].items.length) {
            _confetti.addConfetti();
        }

        _modal.hide();
        
         //Save @_userObj
         localStorage.setObject(_userObjID, _userObj);
    }

    function onModalCompleteClick() {
        $(_modalItemsSelector).addClass("complete");
    }

    //--------------------
    //End onClick events
    
    //On document ready
    //--------------------

    $(document).ready(function () {

        _modal = new bootstrap.Modal($(".modal")[0]);

        //Click event listeners
        $(_skillsSelector).on("click", onSkillClick);
        $(_showHideSelector).on("click", onShowHideClick);
        
        $(_uploadSelector).on("click", uploadFile);
        $(_downloadSelector).on("click", function() {
            saveFile("data.json", _userObj);
        });

        $(_modalBtnComplete).on("click", onModalCompleteClick);
        $(_modalBtnSave).on("click", onModalSaveClick);

        $(_showHideSelector).each(function() {
            const type = $(this).attr("data-src").split(",")[0];

            $(this).attr("data-src", `${type},${_userObj.showHide[type]}`);
            $(this).attr("src", `${_assetsDir}/images/svg/${_userObj.showHide[type]}.svg`);
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