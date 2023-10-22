!function(){"use strict";function s(){const t=document.createElement("input");t.type="file",t.accept=".json",t.addEventListener("change",function(){var e=new FileReader;e.onload=function(e){var t=e.target;try{var s=JSON.parse(t.result);"unlocked"in s&&"qp"in s&&"complete"in s&&(d=s,r.updateAllSections(),p(),localStorage.setObject(i,d))}catch(e){console.error(e)}},e.readAsText(t.files[0])},!1);var e=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0});t.dispatchEvent(e),t.remove()}Storage.prototype.setObject=function(e,t){this.setItem(e,JSON.stringify(t))},Storage.prototype.getObject=function(e){e=this.getItem(e);return e&&JSON.parse(e)};const i="osrs-xosaat-user";let d={combat:!1,unlocked:[],qp:0,complete:{quests:[],achievements:[],collections:[],pets:[]}};null!==localStorage.getItem(i)?d=localStorage.getObject(i):localStorage.setObject(i,d);const n=Object.freeze({Easy:1,Medium:2,Hard:3,Elite:4}),o="/osrs-progress/assets",a=new JSConfetti,c="#skills-wrapper .skill-item",t="#skills-progress",l="#qp-progress",r={init:function(){for(var e in this)"object"==typeof this[e]&&(this[e].parent=this);return this},achievements:{type:"achievements",dir:o+"/json/achievements.json",selectors:{wrapper:"#achievements-wrapper",items:"#achievements-wrapper .json-item",completed:"#achievements-completed",total:"#achievements-total",progress:"#achievements-progress"},data:{},buildNode:function(e,t,s,i){return`<div class="col ${s}">
                            <div class="d-flex flex-column json-item h-100 p-3 rounded ${i}" data-src="achievements">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${e.diary}</h4>
                                    <span class="difficulty-${e.difficulty}">${e.difficulty}</span>
                                </div>
                                <hr/>
                                <div class="flex-grow-1">
                                    <span class="json-description">${e.task}</span>
                                </div>
                                <hr/>
                                <span class="text-muted"></span>
                            </div>
                        </div>`},update:function(){this.parent.updateSection(this.type,this.selectors)}},quests:{type:"quests",dir:o+"/json/quests.json",selectors:{wrapper:"#quests-wrapper",items:"#quests-wrapper .json-item",completed:"#quests-completed",total:"#quests-total",progress:"#quests-progress"},data:{},buildNode:function(e,t,s,i){return`<div class="col ${s}">
                            <div class="json-item h-100 p-3 rounded ${i}" data-src="quests">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${t}</h4>
                                    <span class="difficulty-${e.difficulty}">${e.difficulty}</span>
                                </div>
                                <hr/>
                                <span class="text-muted"></span>
                            </div>
                        </div>`},update:function(){this.parent.updateSection(this.type,this.selectors)}},pets:{type:"pets",dir:o+"/json/pets.json",selectors:{wrapper:"#pets-wrapper",items:"#pets-wrapper .json-item",completed:"#pets-completed",total:"#pets-total",progress:"#pets-progress"},data:{},buildNode:function(e,t,s,i){return`<div class="col ${s}">
                            <div class="json-item h-100 p-3 rounded ${i}" data-src="pets">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4>${t}</h4>
                                    <img src="${e.img}" alt="${t} icon"/>
                                </div>
                                <hr/>
                                <span class="text-muted"></span>
                            </div>
                        </div>`},update:function(){this.parent.updateSection(this.type,this.selectors)}},collections:{type:"collections",dir:o+"/json/collections.json",selectors:{wrapper:"#collections-wrapper",items:"#collections-wrapper .json-item",completed:"#collections-completed",total:"#collections-total",progress:"#collections-progress"},data:{},buildNode:function(t,e,s,i){let n=`<div class="col ${s}">
                                <div class="d-flex flex-column json-item h-100 p-3 rounded ${i}" data-src="collections">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4>${e}</h4>
                                        <img src="${t.img}" alt="${e} icon"/>
                                    </div>
                                    <hr/>
                                    <ul class="d-flex flex-wrap gap-2 py-2">`;for(let e=0;e<Math.min(5,t.items.length);e++)n+=`<li class="list-group-item rounded">${t.items[e]}</li>`;return n+='</ul><div class="d-flex flex-grow-1"></div>',5<t.items.length&&(n+=`<span>and ${t.items.length-5} others...</span>`),n+='<hr/><span class="text-muted"></span></div></div>'},update:function(){this.parent.updateSection(this.type,this.selectors)}},updateSection:function(e,t){$(t.wrapper).html(""),$(t.wrapper).html(this.buildNodes(e));var e=$(t.items).length,s=$(t.items+".complete").length,i=Math.round(s/e*100)||0;$(t.total).text(e),$(t.completed).text(s),$(t.progress).width(i+"%"),$(t.progress).text(i+"%"),$(t.items).on("click",m)},updateAllSections:function(){this.achievements.update(),this.quests.update(),this.pets.update(),this.collections.update()},buildNodes:function(e){var t=0<$(`img[data-src='${e},hide']`).length,s=[],i=[];for(const r in this[e].data){var n,o=this[e].data[r],a=d.complete[e].includes(e===this.achievements.type?o.task:r),c=a?"complete":"",l=a&&t?"d-none":"";e===this.quests.type&&0<o.rewards.skills.length&&(n=new Set(o.requirements.skills.concat(o.rewards.skills)),o.requirements.skills=Array.from(n)),!function(e){if(e){if("combat"in e&&e.combat&&!d.combat)return;if("quests"in e)for(const t of e.quests)if(!d.complete.quests.includes(t))return;if("skills"in e)for(const s of e.skills)if(!d.unlocked.includes(s))return;if("qp"in e&&d.qp<e.qp)return}return 1}(o.requirements)||(n=this[e].buildNode(o,r,l,c),l=e===this.achievements.type?{diary:o.diary,difficulty:o.difficulty,html:n}:{name:r,html:n},(a?i:s).push(l))}return this.sortNodes(e,s)+this.sortNodes(e,i)},sortNodes:function(e,t){let s="";e===this.achievements.type?t.sort((e,t)=>e.diary.localeCompare(t.diary)||n[e.difficulty]-n[t.difficulty]):t.sort((e,t)=>e.name.localeCompare(t.name));for(const i of t)s+=i.html;return s}}.init();function p(){$(c+".unlocked").removeClass("unlocked");for(const e of d.unlocked)$(".skill-item[data-src="+e+"]").addClass("unlocked");$(l).text(d.qp),$(t).text(d.unlocked.length)}function u(e,t){e.includes(t)?e.splice(e.indexOf(t),1):e.push(t)}function h(){var e=$(".skill-title",this).text().trim();$(this).toggleClass("unlocked"),"Combat"===e?d.combat=!d.combat:u(d.unlocked,e),r.updateAllSections(),$(t).text(d.unlocked.length),localStorage.setObject(i,d)}function m(){var e,t=$(this).attr("data-src");$(this).toggleClass("complete"),t===r.achievements.type?u(d.complete[t],$(".json-description",this).text().trim()):(e=$("h4",this).text().trim(),u(d.complete[t],e),t===r.quests.type&&($(this).hasClass("complete")?d.qp=d.qp+r.quests.data[e].rewards.qp:d.qp=d.qp-r.quests.data[e].rewards.qp,$(l).text(d.qp),r.achievements.update(),r.pets.update(),r.collections.update())),r[t].update(),localStorage.setObject(i,d),$(this).hasClass("complete")&&a.addConfetti()}function f(){var e=$(this).attr("data-src").split(","),t=e[0];"hide"===e[1]?($(this).attr("data-src",t+",show"),$(this).attr("src",o+"/images/svg/show.svg")):($(this).attr("data-src",t+",hide"),$(this).attr("src",o+"/images/svg/hide.svg")),$(r[t].selectors.items+".complete").parent().toggleClass("d-none")}$(document).ready(function(){$(c).on("click",h),$(".show-hide").on("click",f),$("#btn-upload").on("click",s),$("#btn-download").on("click",function(){var e,t,s;e="data.json",t=d,t=new Blob([JSON.stringify(t)],{type:"text/json"}),(s=document.createElement("a")).download=e,s.href=window.URL.createObjectURL(t),s.dataset.downloadurl=["text/json",s.download,s.href].join(":"),e=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0}),s.dispatchEvent(e),s.remove()});for(const t in r){var e=r[t];$.getJSON(e.dir,function(e){this.data=e,this.update()}.bind(e))}p()})}();