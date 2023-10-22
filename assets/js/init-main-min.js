!function(){"use strict";function s(){const t=document.createElement("input");t.type="file",t.accept=".json",t.addEventListener("change",function(){var e=new FileReader;e.onload=function(e){var t=e.target;try{var s=JSON.parse(t.result);"unlocked"in s&&"qp"in s&&"complete"in s&&(c=s,d.updateAllSections(),p(),localStorage.setObject(i,c))}catch(e){console.error(e)}},e.readAsText(t.files[0])},!1);var e=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0});t.dispatchEvent(e),t.remove()}Storage.prototype.setObject=function(e,t){this.setItem(e,JSON.stringify(t))},Storage.prototype.getObject=function(e){e=this.getItem(e);return e&&JSON.parse(e)};const i="osrs-xosaat-user";let c={combat:!1,unlocked:[],qp:0,complete:{quests:[],achievements:[],collections:[],pets:[]}};null!==localStorage.getItem(i)?c=localStorage.getObject(i):localStorage.setObject(i,c);const a=Object.freeze({Easy:1,Medium:2,Hard:3,Elite:4}),o="/osrs-progress/assets",n=new JSConfetti,l="#skills-wrapper .skill-item",t="#skills-progress",r="#qp-progress",d={init:function(){for(var e in this)"object"==typeof this[e]&&(this[e].parent=this);return this},achievements:{type:"achievements",dir:o+"/json/achievements.json",selectors:{wrapper:"#achievements-wrapper",items:"#achievements-wrapper .json-item",completed:"#achievements-completed",total:"#achievements-total",progress:"#achievements-progress"},data:{},buildNode:function(e){return`<div class="col ${e.classes.hidden}">
                            <div class="d-flex flex-column json-item h-100 p-3 rounded ${e.classes.complete}" data-src="achievements">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${e.data.diary}</h4>
                                    <span class="difficulty-${e.data.difficulty}">${e.data.difficulty}</span>
                                </div>
                                <hr/>
                                <div class="flex-grow-1">
                                    <span class="json-description">${e.data.task}</span>
                                </div>
                                <hr/>
                                <span class="text-muted"></span>
                            </div>
                        </div>`},update:function(){this.parent.updateSection(this.type,this.selectors)}},quests:{type:"quests",dir:o+"/json/quests.json",selectors:{wrapper:"#quests-wrapper",items:"#quests-wrapper .json-item",completed:"#quests-completed",total:"#quests-total",progress:"#quests-progress"},data:{},buildNode:function(e){return`<div class="col ${e.classes.hidden}">
                            <div class="json-item h-100 p-3 rounded ${e.classes.complete}" data-src="quests">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${e.title}</h4>
                                    <span class="difficulty-${e.data.difficulty}">${e.data.difficulty}</span>
                                </div>
                                <hr/>
                                <span class="text-muted"></span>
                            </div>
                        </div>`},update:function(){this.parent.updateSection(this.type,this.selectors)}},pets:{type:"pets",dir:o+"/json/pets.json",selectors:{wrapper:"#pets-wrapper",items:"#pets-wrapper .json-item",completed:"#pets-completed",total:"#pets-total",progress:"#pets-progress"},data:{},buildNode:function(e){return`<div class="col ${e.classes.hidden}">
                            <div class="json-item h-100 p-3 rounded ${e.classes.complete}" data-src="pets">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${e.title}</h4>
                                    <img src="${e.data.img}" alt="${e.title} icon"/>
                                </div>
                                <hr/>
                                <span class="text-muted"></span>
                            </div>
                        </div>`},update:function(){this.parent.updateSection(this.type,this.selectors)}},collections:{type:"collections",dir:o+"/json/collections.json",selectors:{wrapper:"#collections-wrapper",items:"#collections-wrapper .json-item",completed:"#collections-completed",total:"#collections-total",progress:"#collections-progress"},data:{},buildNode:function(t){var s=t.data.items.length;let i=`<div class="col ${t.classes.hidden}">
                                <div class="d-flex flex-column json-item h-100 p-3 rounded ${t.classes.complete}" data-src="collections">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${t.title}</h4>
                                        <img src="${t.data.img}" alt="${t.title} icon"/>
                                    </div>
                                    <hr/>
                                    <ul class="d-flex flex-wrap gap-2 py-2">`;for(let e=0;e<Math.min(5,s);e++)i+=`<li class="list-group-item rounded">${t.data.items[e]}</li>`;return i+='</ul><div class="d-flex flex-grow-1"></div>',5<s&&(i+=`<span>and ${s-5} others...</span>`),i+='<hr/><span class="text-muted"></span></div></div>'},update:function(){this.parent.updateSection(this.type,this.selectors)}},updateSection:function(e,t){$(t.wrapper).html(""),$(t.wrapper).html(this.buildNodes(e));var e=$(t.items).length,s=$(t.items+".complete").length,i=Math.round(s/e*100)||0;$(t.total).text(e),$(t.completed).text(s),$(t.progress).width(i+"%"),$(t.progress).text(i+"%"),$(t.items).on("click",m)},updateAllSections:function(){this.achievements.update(),this.quests.update(),this.pets.update(),this.collections.update()},buildNodes:function(e){var t=0<$(`img[data-src='${e},hide']`).length,s=[],i=[];for(const l in this[e].data){var a,o,n=this[e].data[l];e===this.quests.type&&0<n.rewards.skills.length&&(a=new Set(n.requirements.skills.concat(n.rewards.skills)),n.requirements.skills=Array.from(a)),!function(e){if(e){if("combat"in e&&e.combat&&!c.combat)return;if("quests"in e)for(const t of e.quests)if(!c.complete.quests.includes(t))return;if("skills"in e)for(const s of e.skills)if(!c.unlocked.includes(s))return;if("qp"in e&&c.qp<e.qp)return}return 1}(n.requirements)||(a=c.complete[e].includes(e===this.achievements.type?n.task:l),o=this[e].buildNode({data:n,title:l,classes:{hidden:a&&t?"d-none":"",complete:a?"complete":""}}),n=e===this.achievements.type?{diary:n.diary,difficulty:n.difficulty,html:o}:{name:l,html:o},(a?i:s).push(n))}return this.sortNodes(e,s)+this.sortNodes(e,i)},sortNodes:function(e,t){let s="";e===this.achievements.type?t.sort((e,t)=>e.diary.localeCompare(t.diary)||a[e.difficulty]-a[t.difficulty]):t.sort((e,t)=>e.name.localeCompare(t.name));for(const i of t)s+=i.html;return s}}.init();function p(){$(l+".unlocked").removeClass("unlocked");for(const e of c.unlocked)$(".skill-item[data-src="+e+"]").addClass("unlocked");$(r).text(c.qp),$(t).text(c.unlocked.length)}function u(e,t){e.includes(t)?e.splice(e.indexOf(t),1):e.push(t)}function h(){var e=$(".skill-title",this).text().trim();$(this).toggleClass("unlocked"),"Combat"===e?c.combat=!c.combat:u(c.unlocked,e),d.updateAllSections(),$(t).text(c.unlocked.length),localStorage.setObject(i,c)}function m(){var e,t=$(this).attr("data-src");$(this).toggleClass("complete"),t===d.achievements.type?u(c.complete[t],$(".json-description",this).text().trim()):(e=$("h4",this).text().trim(),u(c.complete[t],e),t===d.quests.type&&($(this).hasClass("complete")?c.qp=c.qp+d.quests.data[e].rewards.qp:c.qp=c.qp-d.quests.data[e].rewards.qp,$(r).text(c.qp),d.achievements.update(),d.pets.update(),d.collections.update())),d[t].update(),localStorage.setObject(i,c),$(this).hasClass("complete")&&n.addConfetti()}function f(){var e=$(this).attr("data-src").split(","),t=e[0];"hide"===e[1]?($(this).attr("data-src",t+",show"),$(this).attr("src",o+"/images/svg/show.svg")):($(this).attr("data-src",t+",hide"),$(this).attr("src",o+"/images/svg/hide.svg")),$(d[t].selectors.items+".complete").parent().toggleClass("d-none")}$(document).ready(function(){$(l).on("click",h),$(".show-hide").on("click",f),$("#btn-upload").on("click",s),$("#btn-download").on("click",function(){var e,t,s;e="data.json",t=c,t=new Blob([JSON.stringify(t)],{type:"text/json"}),(s=document.createElement("a")).download=e,s.href=window.URL.createObjectURL(t),s.dataset.downloadurl=["text/json",s.download,s.href].join(":"),e=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0}),s.dispatchEvent(e),s.remove()});for(const t in d){var e=d[t];$.getJSON(e.dir,function(e){this.data=e,this.update()}.bind(e))}p()})}();