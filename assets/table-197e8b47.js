import{D as C,h as O,s as D}from"./hyphenate-65d9bac0.js";const $="aāiīuūṛṝeēoōkgṅcjñṭḍṇtdnpbmyrlvḻḷṟṉśṣsh".split("").reverse(),W=new Map;for(const[t,e]of $.entries())W.set(e,t);const B=(t,e,i="asc")=>{const l=Math.min(t.length,e.length);let s=0;for(;s<l;){const n=t.charAt(s).toLowerCase(),a=e.charAt(s).toLowerCase();if(n===a)s++;else{const r=W.get(n)||-1,o=W.get(a)||-1;return i==="asc"?r<o:r>o}}return i==="asc"?t.length>e.length:t.length<e.length};C.ext.type.search.tamil=t=>t?t.replace(/<.*?>|\u00AD/g,"").replace(/\s+/," ").toLowerCase():"";const N=t=>t?t.replace(/<.*?>|\u00AD/g,"").replace(/\s+/," ").toLowerCase():"";C.ext.type.order["tamil-asc"]=(t,e)=>B(N(t),N(e),"asc");C.ext.type.order["tamil-desc"]=(t,e)=>B(N(t),N(e),"desc");C.ext.type.order["shelfmark-pre"]=t=>t?t.replace(/\d+/g,e=>e.padStart(4,"0")):"0000";C.ext.type.order["extent-pre"]=t=>t.match(/^\d+ f?f.$/)?parseInt(t)*2:parseInt(t);C.ext.type.order["numrange-pre"]=t=>{if(t.match("–")){const e=t.split("–");return e[0]||e[1]}else return t};C.ext.type.order["hyphenated-pre"]=t=>t?t.replace(/<.*?>|\u00AD/g,"").replace(/\s+/g," ").toLowerCase():"";C.ext.type.search.hyphenated=t=>t?t.replace(/<.*?>|\u00AD/g,"").replace(/\s+/g," ").toLowerCase():"";const R=function(t){for(var e=t.target.closest("[data-anno]");e&&e.hasAttribute("data-anno");)z.make(t,e),e=e.parentNode},z={make:function(t,e){const i=e.dataset.anno;if(!i)return;var l=document.getElementById("tooltip");const s=document.createElement("div");if(l){for(const n of l.childNodes)if(n.myTarget===e)return;s.appendChild(document.createElement("hr"))}else l=document.createElement("div"),l.id="tooltip",l.style.top=t.clientY+10+"px",l.style.left=t.clientX+"px",document.body.appendChild(l),s.myTarget=e;s.appendChild(document.createTextNode(i)),s.myTarget=e,l.appendChild(s),e.addEventListener("mouseleave",z.remove,{once:!0}),l.animate([{opacity:0},{opacity:1,easing:"ease-in"}],200)},remove:function(t){const e=document.getElementById("tooltip");if(!e)return;if(e.children.length===1){e.remove();return}const i=t.target;for(const l of e.childNodes)if(l.myTarget===i){l.remove();break}if(e.children.length===1){const l=e.firstChild.firstChild;l.tagName==="HR"&&l.remove()}}};let H=function(){let t=0,e=[];return{set:function(i){return e.push({offset:++t,ptr:i}),e[e.length-1].offset},remove:function(i){e=e.filter(function(s){return s.offset!=i}).splice(0)},closeAllButMe:function(i){e.forEach(function(l){l.offset!=i&&l.ptr.closeOrder()})}}}();function g(t,e){let i=this;if(this.instanceOffset=H.set(i),this.domSelector=t,this.root=document.querySelector(t),this.rootToken=null,this.main,this.button,this.title,this.isMultiple=this.root.hasAttribute("multiple"),this.multipleSize=this.isMultiple&&this.root.hasAttribute("size")?parseInt(this.root.getAttribute("size")):-1,this.isOptgroups=!1,this.currentOptgroup=0,this.drop,this.top,this.left,this.options,this.listElements,this.isDisabled=!1,this.search=!1,this.searchZone=null,this.inputBox=null,this.disabledItems=[],this.ulminWidth=140,this.ulmaxWidth=1/0,this.ulminHeight=25,this.maxOptionWidth=1/0,this.maxSelect=1/0,this.isInitRemote=!1,this.isSearchRemote=!1,this.onInit=null,this.onSearch=null,this.onInitSize=null,this.forbidenAttributes=["class","selected","disabled","data-text","data-value","style"],this.forbidenClasses=["active","disabled"],this.userOptions={maxWidth:500,minWidth:-1,maxHeight:400,translations:{all:"All",item:"item",items:"items",selectAll:"Select All",clearAll:"Clear All"},search:!1,placeHolder:"",stayOpen:!1,disableSelectAll:!1,buttonItemsSeparator:","},this.keepInlineStyles=!1,this.keepInlineCaretStyles=!0,e){if(e.itemsSeparator!=null&&(this.userOptions.buttonItemsSeparator=e.itemsSeparator),e.maxWidth!=null&&(this.userOptions.maxWidth=e.maxWidth),e.minWidth!=null&&(this.userOptions.minWidth=e.minWidth),e.maxHeight!=null&&(this.userOptions.maxHeight=e.maxHeight),e.translations!=null)for(var l in e.translations)e.translations.hasOwnProperty(l)&&this.userOptions.translations[l]&&(this.userOptions.translations[l]=e.translations[l]);e.placeHolder!=null&&(this.userOptions.placeHolder=e.placeHolder),e.search!=null&&(this.search=e.search),e.remote!=null&&e.remote&&(e.remote.onInit!=null&&typeof e.remote.onInit=="function"&&(this.onInit=e.remote.onInit,this.isInitRemote=!0),e.remote.onInitSize!=null&&(this.onInitSize=e.remote.onInitSize,this.onInitSize<3&&(this.onInitSize=3)),e.remote.onSearch!=null&&typeof e.remote.onSearch=="function"&&(this.onSearch=e.remote.onSearch,this.isSearchRemote=!0)),e.stayOpen!=null&&(this.userOptions.stayOpen=e.stayOpen),e.disableSelectAll!=null&&(this.userOptions.disableSelectAll=e.disableSelectAll),e.maxSelect!=null&&!isNaN(e.maxSelect)&&e.maxSelect>=1&&(this.maxSelect=e.maxSelect,this.userOptions.disableSelectAll=!0),e.maxOptionWidth!=null&&!isNaN(e.maxOptionWidth)&&e.maxOptionWidth>=20&&(this.maxOptionWidth=e.maxOptionWidth,this.ulminWidth=e.maxOptionWidth+60,this.ulmaxWidth=e.maxOptionWidth+60),e.keepInlineStyles!=null&&(this.keepInlineStyles=e.keepInlineStyles),e.keepInlineCaretStyles!=null&&(this.keepInlineCaretStyles=e.keepInlineCaretStyles)}this.closeOrder=function(){let s=this;s.userOptions.stayOpen||(s.drop.style.visibility="hidden",s.search&&(s.inputBox.value="",Array.prototype.slice.call(s.listElements).forEach(function(n){n.classList.remove("hide")})))},this.getCssArray=function(s){let n=[];return s===".vsb-main button"&&(n=[{key:"min-width",value:"120px"},{key:"border-radius",value:"0"},{key:"width",value:"100%"},{key:"text-align",value:"left"},{key:"z-index",value:"1"},{key:"color",value:"#333"},{key:"background",value:"white !important"},{key:"border",value:"1px solid #999 !important"},{key:"line-height",value:"20px"},{key:"font-size",value:"14px"},{key:"padding",value:"6px 12px"}]),a(n);function a(r){let o="";return r.forEach(function(v){o+=v.key+":"+v.value+";"}),o}},this.init=function(){let s=this;s.isInitRemote?s.onInit("",s.onInitSize).then(function(n){s.buildSelect(n),s.createTree()}):s.createTree()},this.getResult=function(){let s=this,n=[];return s.root.querySelectorAll("option").forEach(function(r){r.selected&&n.push(r.value)}),n},this.createTree=function(){this.rootToken=i.domSelector.replace(/[^A-Za-z0-9]+/,""),this.root.style.display="none";let s=document.getElementById("btn-group-"+this.rootToken);if(s&&s.remove(),this.main=document.createElement("div"),this.root.parentNode.insertBefore(this.main,this.root.nextSibling),this.main.classList.add("vsb-main"),this.main.setAttribute("id","btn-group-"+this.rootToken),this.main.style.marginLeft=this.main.style.marginLeft,i.userOptions.stayOpen&&(this.main.style.minHeight=this.userOptions.maxHeight+10+"px"),i.userOptions.stayOpen)this.button=document.createElement("div");else if(this.button=document.createElement("button"),this.keepInlineStyles){var n=i.getCssArray(".vsb-main button");this.button.setAttribute("style",n)}this.button.style.maxWidth=this.userOptions.maxWidth+"px",this.userOptions.minWidth!==-1&&(this.button.style.minWidth=this.userOptions.minWidth+"px"),this.main.appendChild(this.button),this.title=document.createElement("span"),this.button.appendChild(this.title),this.title.classList.add("title");let a=document.createElement("span");if(this.button.appendChild(a),a.classList.add("caret"),this.keepInlineCaretStyles&&(a.style.position="absolute",a.style.right="8px",a.style.marginTop="8px"),i.userOptions.stayOpen&&(a.style.display="none",this.title.style.paddingLeft="20px",this.title.style.fontStyle="italic",this.title.style.verticalAlign="20%"),this.drop=document.createElement("div"),this.main.appendChild(this.drop),this.drop.classList.add("vsb-menu"),this.drop.style.zIndex=2e3-this.instanceOffset,this.ul=document.createElement("ul"),this.drop.appendChild(this.ul),this.ul.style.maxHeight=this.userOptions.maxHeight+"px",this.ul.style.minWidth=this.ulminWidth+"px",this.ul.style.maxWidth=this.ulmaxWidth+"px",this.ul.style.minHeight=this.ulminHeight+"px",this.isMultiple&&(this.ul.classList.add("multi"),!i.userOptions.disableSelectAll)){let c=document.createElement("option");c.setAttribute("value","all"),c.innerText=i.userOptions.translations.selectAll,this.root.insertBefore(c,this.root.hasChildNodes()?this.root.childNodes[0]:null)}let r="",o="",v=0;if(this.search){this.searchZone=document.createElement("div"),this.ul.appendChild(this.searchZone),this.searchZone.classList.add("vsb-js-search-zone"),this.searchZone.style.zIndex=2001-this.instanceOffset,this.inputBox=document.createElement("input"),this.searchZone.appendChild(this.inputBox),this.inputBox.setAttribute("type","text"),this.inputBox.setAttribute("id","search_"+this.rootToken),this.maxOptionWidth<1/0&&(this.searchZone.style.maxWidth=i.maxOptionWidth+30+"px",this.inputBox.style.maxWidth=i.maxOptionWidth+30+"px");var S=document.createElement("p");this.ul.appendChild(S),S.style.fontSize="12px",S.innerHTML="&nbsp;",this.ul.addEventListener("scroll",function(c){var y=this.scrollTop;i.searchZone.parentNode.style.top=y+"px"})}if(this.options=document.querySelectorAll(this.domSelector+" > option"),Array.prototype.slice.call(this.options).forEach(function(c){let y=c.textContent,f=c.value,u;c.hasAttributes()&&(u=Array.prototype.slice.call(c.attributes).filter(function(h){return i.forbidenAttributes.indexOf(h.name)===-1}));let b=c.getAttribute("class");b?b=b.split(" ").filter(function(h){return i.forbidenClasses.indexOf(h)===-1}):b=[];let d=document.createElement("li"),p=c.hasAttribute("selected"),m=c.hasAttribute("disabled");i.ul.appendChild(d),d.setAttribute("data-value",f),d.setAttribute("data-text",y),u!==void 0&&u.forEach(function(h){d.setAttribute(h.name,h.value)}),b.forEach(function(h){d.classList.add(h)}),i.maxOptionWidth<1/0&&(d.classList.add("short"),d.style.maxWidth=i.maxOptionWidth+"px"),p&&(v++,r+=o+y,o=i.userOptions.buttonItemsSeparator,d.classList.add("active"),i.isMultiple||(i.title.textContent=y,b.length!=0&&b.forEach(function(h){i.title.classList.add(h)}))),m&&d.classList.add("disabled"),d.appendChild(document.createTextNode(" "+y))}),document.querySelector(i.domSelector+" optgroup")!==null){i.isOptgroups=!0,i.options=document.querySelectorAll(i.domSelector+" option");let c=document.querySelectorAll(i.domSelector+" optgroup");Array.prototype.slice.call(c).forEach(function(y){let f=y.querySelectorAll("option"),u=document.createElement("li"),b=document.createElement("span"),d=document.createElement("i"),p=document.createElement("b"),m=y.getAttribute("data-way");m||(m="closed"),(!m||m!=="closed"&&m!=="open")&&(m="closed"),u.appendChild(b),u.appendChild(d),i.ul.appendChild(u),u.classList.add("grouped-option"),u.classList.add(m),i.currentOptgroup++;let h=i.rootToken+"-opt-"+i.currentOptgroup;u.id=h,u.appendChild(p),p.appendChild(document.createTextNode(y.label)),u.setAttribute("data-text",y.label),i.ul.appendChild(u),Array.prototype.slice.call(f).forEach(function(k){let E=k.textContent,T=k.value,A=k.getAttribute("class");A?A=A.split(" "):A=[],A.push(m);let I=document.createElement("li"),M=k.hasAttribute("selected");i.ul.appendChild(I),I.setAttribute("data-value",T),I.setAttribute("data-text",E),I.setAttribute("data-parent",h),A.length!=0&&A.forEach(function(_){I.classList.add(_)}),M&&(v++,r+=o+E,o=i.userOptions.buttonItemsSeparator,I.classList.add("active"),i.isMultiple||(i.title.textContent=E,A.length!=0&&A.forEach(function(_){i.title.classList.add(_)}))),I.appendChild(document.createTextNode(E))})})}if(i.options.length-Number(!i.userOptions.disableSelectAll)==v)r=i.userOptions.translations.all;else if(i.multipleSize!=-1&&v>i.multipleSize){let c=v===1?i.userOptions.translations.item:i.userOptions.translations.items;r=v+" "+c}i.isMultiple&&(i.title.innerHTML=r),i.userOptions.placeHolder!=""&&i.title.textContent==""&&(i.title.textContent=i.userOptions.placeHolder),i.listElements=i.drop.querySelectorAll("li:not(.grouped-option)"),i.search&&i.inputBox.addEventListener("keyup",function(c){let y=c.target.value.toUpperCase(),f=y.length,u=0,b=0,d=null;i.isSearchRemote?f==0?i.remoteSearchIntegrate(null):f>=3&&i.onSearch(y).then(function(p){i.remoteSearchIntegrate(p)}):(f<3?Array.prototype.slice.call(i.listElements).forEach(function(p){p.getAttribute("data-value")==="all"?d=p:(p.classList.remove("hidden-search"),u++,b+=p.classList.contains("active"))}):Array.prototype.slice.call(i.listElements).forEach(function(p){p.getAttribute("data-value")!=="all"?p.getAttribute("data-text").toUpperCase().indexOf(y)===-1&&p.getAttribute("data-value")!=="all"?p.classList.add("hidden-search"):(u++,p.classList.remove("hidden-search"),b+=p.classList.contains("active")):d=p}),d&&(u===0?d.classList.add("disabled"):d.classList.remove("disabled"),b!==u?(d.classList.remove("active"),d.innerText=i.userOptions.translations.selectAll,d.setAttribute("data-selected","false")):(d.classList.add("active"),d.innerText=i.userOptions.translations.clearAll,d.setAttribute("data-selected","true"))))}),i.userOptions.stayOpen?(i.drop.style.visibility="visible",i.drop.style.boxShadow="none",i.drop.style.minHeight=this.userOptions.maxHeight+10+"px",i.drop.style.position="relative",i.drop.style.left="0px",i.drop.style.top="0px",i.button.style.border="none"):this.main.addEventListener("click",function(c){i.isDisabled||(i.drop.style.visibility="visible",document.addEventListener("click",L),c.preventDefault(),c.stopPropagation(),i.userOptions.stayOpen||H.closeAllButMe(i.instanceOffset))}),this.drop.addEventListener("click",function(c){if(i.isDisabled||c.target.tagName==="INPUT")return;let y=c.target.tagName==="SPAN",f=c.target.tagName==="I",u=c.target.parentElement;if(!u.hasAttribute("data-value")&&u.classList.contains("grouped-option")){if(!y&&!f)return;let m,h;f?i.checkUncheckFromParent(u):(u.classList.contains("open")?(m="open",h="closed"):(m="closed",h="open"),u.classList.remove(m),u.classList.add(h),i.drop.querySelectorAll("[data-parent='"+u.id+"']").forEach(function(E){E.classList.remove(m),E.classList.add(h)}));return}let b=c.target.getAttribute("data-value"),d=c.target.getAttribute("data-text"),p=c.target.getAttribute("class");if(!(p&&p.indexOf("disabled")!=-1)&&!(p&&p.indexOf("overflow")!=-1)){if(b==="all"){c.target.hasAttribute("data-selected")&&c.target.getAttribute("data-selected")==="true"?i.setValue("none"):i.setValue("all");return}if(!i.isMultiple)i.root.value=b,i.title.textContent=d,p?i.title.setAttribute("class",p+" title"):i.title.setAttribute("class","title"),Array.prototype.slice.call(i.listElements).forEach(function(m){m.classList.remove("active")}),d!=""&&c.target.classList.add("active"),i.privateSendChange(),i.userOptions.stayOpen||L();else{let m=!1;p&&(m=p.indexOf("active")!=-1),m?c.target.classList.remove("active"):c.target.classList.add("active"),c.target.hasAttribute("data-parent")&&i.checkUncheckFromChild(c.target);let h="",k="",E=0,T=0;for(let A=0;A<i.options.length;A++)T++,i.options[A].value==b&&(i.options[A].selected=!m),i.options[A].selected&&(E++,h+=k+i.options[A].textContent,k=i.userOptions.buttonItemsSeparator);if(T==E-Number(!i.userOptions.disableSelectAll))h=i.userOptions.translations.all;else if(i.multipleSize!=-1&&E>i.multipleSize){let A=E===1?i.userOptions.translations.item:i.userOptions.translations.items;h=E+" "+A}i.title.textContent=h,i.checkSelectMax(E),i.checkUncheckAll(),i.privateSendChange()}c.preventDefault(),c.stopPropagation(),i.userOptions.placeHolder!=""&&i.title.textContent==""&&(i.title.textContent=i.userOptions.placeHolder)}});function L(){document.removeEventListener("click",L),i.drop.style.visibility="hidden",i.search&&(i.inputBox.value="",Array.prototype.slice.call(i.listElements).forEach(function(c){c.classList.remove("hidden-search")}))}},this.init(),this.checkUncheckAll()}g.prototype.buildSelect=function(t){let e=this;if(!(t==null||t.length<1))if(e.isOptgroups||(e.isOptgroups=t[0].parent!=null&&t[0].parent!=""),e.isOptgroups){let i={};t=t.filter(function(l){return l.parent!=null&&l.parent!=""}),t.forEach(function(l){i[l.parent]||(i[l.parent]=!0)});for(let l in i){let s=document.createElement("optgroup");s.setAttribute("label",l),options=t.filter(function(n){return n.parent==l}),options.forEach(function(n){let a=document.createElement("option");a.value=n.value,a.text=n.text,n.selected&&a.setAttribute("selected",!0),s.appendChild(a)}),e.root.appendChild(s)}}else t.forEach(function(i){let l=document.createElement("option");l.value=i.value,l.text=i.text,i.selected&&l.setAttribute("selected",!0),e.root.appendChild(l)})};g.prototype.remoteSearchIntegrate=function(t){let e=this;if(t==null||t.length==0){let l=e.optionsCheckedToData();l&&(t=l.slice(0)),e.remoteSearchIntegrateIt(t)}else{let l=e.optionsCheckedToData();if(l.length>0)for(var i=t.length-1;i>=0;i--)l.indexOf(t[i].id)!=-1&&t.slice(i,1);t=t.concat(l),e.remoteSearchIntegrateIt(t)}};g.prototype.optionsCheckedToData=function(){let t=this,e=[],i=t.ul.querySelectorAll("li.active:not(.grouped-option)"),l={};return i&&Array.prototype.slice.call(i).forEach(function(s){let n={value:s.getAttribute("data-value"),text:s.getAttribute("data-text"),selected:!0};if(n.value!=="all"){if(t.isOptgroups){let a=s.getAttribute("data-parent");if(l[a]!=null)n.parent=l[a];else{let o=t.ul.querySelector("#"+a).getAttribute("data-text");l[a]=o,n.parent=o}}e.push(n)}}),e};g.prototype.removeOptionsNotChecked=function(t){let e=this,i=e.onInitSize,l=t==null?0:t.length,s=e.root.length;if(s+l>i){let a=s+l-i-1,r=0;for(var n=e.root.length-1;n>=0;n--)e.root.options[n].selected==!1&&r<=a&&(r++,e.root.remove(n))}};g.prototype.changeTree=function(t,e){let i=this;i.empty(),i.remoteSearchIntegrateIt(t),e&&e.onSearch&&typeof e.onSearch=="function"&&(i.onSearch=e.onSearch,i.isSearchRemote=!0),i.listElements=this.drop.querySelectorAll("li:not(.grouped-option)")};g.prototype.remoteSearchIntegrateIt=function(t){let e=this;if(!(t==null||t.length==0)){for(;e.root.firstChild;)e.root.removeChild(e.root.firstChild);e.buildSelect(t),e.reloadTree()}};g.prototype.reloadTree=function(){let t=this,e=t.ul.querySelectorAll("li");if(e!=null)for(var i=e.length-1;i>=0;i--)e[i].getAttribute("data-value")!=="all"&&t.ul.removeChild(e[i]);if(t.isOptgroups){if(document.querySelector(t.domSelector+" optgroup")!==null){t.options=document.querySelectorAll(this.domSelector+" option");let l=document.querySelectorAll(this.domSelector+" optgroup");Array.prototype.slice.call(l).forEach(function(s){let n=s.querySelectorAll("option"),a=document.createElement("li"),r=document.createElement("span"),o=document.createElement("i"),v=document.createElement("b"),S=s.getAttribute("data-way");S||(S="closed"),(!S||S!=="closed"&&S!=="open")&&(S="closed"),a.appendChild(r),a.appendChild(o),t.ul.appendChild(a),a.classList.add("grouped-option"),a.classList.add(S),t.currentOptgroup++;let x=t.rootToken+"-opt-"+t.currentOptgroup;a.id=x,a.appendChild(v),v.appendChild(document.createTextNode(s.label)),a.setAttribute("data-text",s.label),t.ul.appendChild(a),Array.prototype.slice.call(n).forEach(function(L){let c=L.textContent,y=L.value,f=L.getAttribute("class");f?f=f.split(" "):f=[],f.push(S);let u=document.createElement("li"),b=L.hasAttribute("selected");t.ul.appendChild(u),u.setAttribute("data-value",y),u.setAttribute("data-text",c),u.setAttribute("data-parent",x),f.length!=0&&f.forEach(function(d){u.classList.add(d)}),b&&(t.userOptions.buttonItemsSeparator,u.classList.add("active"),t.isMultiple||(t.title.textContent=c,f.length!=0&&f.forEach(function(d){t.title.classList.add(d)}))),u.appendChild(document.createTextNode(c))})})}t.listElements=this.drop.querySelectorAll("li:not(.grouped-option)")}else t.options=t.root.querySelectorAll("option"),Array.prototype.slice.call(t.options).forEach(function(l){let s=l.textContent,n=l.value;if(n!="all"){let a;l.hasAttributes()&&(a=Array.prototype.slice.call(l.attributes).filter(function(x){return t.forbidenAttributes.indexOf(x.name)===-1}));let r=l.getAttribute("class");r?r=r.split(" ").filter(function(x){return t.forbidenClasses.indexOf(x)===-1}):r=[];let o=document.createElement("li"),v=l.hasAttribute("selected"),S=l.disabled;t.ul.appendChild(o),o.setAttribute("data-value",n),o.setAttribute("data-text",s),a!==void 0&&a.forEach(function(x){o.setAttribute(x.name,x.value)}),r.forEach(function(x){o.classList.add(x)}),t.maxOptionWidth<1/0&&(o.classList.add("short"),o.style.maxWidth=t.maxOptionWidth+"px"),v&&(t.userOptions.buttonItemsSeparator,o.classList.add("active"),t.isMultiple||(t.title.textContent=s,r.length!=0&&r.forEach(function(x){t.title.classList.add(x)}))),S&&o.classList.add("disabled"),o.appendChild(document.createTextNode(" "+s))}})};g.prototype.disableItems=function(t){let e=this,i=[];w(t)=="string"&&(t=t.split(",")),w(t)=="array"&&Array.prototype.slice.call(e.options).forEach(function(l){t.indexOf(l.value)!=-1&&(i.push(l.value),l.setAttribute("disabled",""))}),Array.prototype.slice.call(e.listElements).forEach(function(l){let s=l.getAttribute("data-value");i.indexOf(s)!=-1&&l.classList.add("disabled")})};g.prototype.enableItems=function(t){let e=this,i=[];w(t)=="string"&&(t=t.split(",")),w(t)=="array"&&Array.prototype.slice.call(e.options).forEach(function(l){t.indexOf(l.value)!=-1&&(i.push(l.value),l.removeAttribute("disabled"))}),Array.prototype.slice.call(e.listElements).forEach(function(l){i.indexOf(l.getAttribute("data-value"))!=-1&&l.classList.remove("disabled")})};g.prototype.checkSelectMax=function(t){let e=this;e.maxSelect==1/0||!e.isMultiple||(e.maxSelect<=t?Array.prototype.slice.call(e.listElements).forEach(function(i){i.hasAttribute("data-value")&&!i.classList.contains("disabled")&&!i.classList.contains("active")&&i.classList.add("overflow")}):Array.prototype.slice.call(e.listElements).forEach(function(i){i.classList.contains("overflow")&&i.classList.remove("overflow")}))};g.prototype.checkUncheckFromChild=function(t){let e=this,i=t.getAttribute("data-parent"),l=document.getElementById(i);if(!e.isMultiple)return;let s=e.drop.querySelectorAll("li"),n=Array.prototype.slice.call(s).filter(function(o){return o.hasAttribute("data-parent")&&o.getAttribute("data-parent")==i&&!o.classList.contains("hidden-search")}),a=0,r=n.length;r!=0&&(n.forEach(function(o){o.classList.contains("active")&&a++}),a===r||a===0?a===0?l.classList.remove("checked"):l.classList.add("checked"):l.classList.remove("checked"))};g.prototype.checkUncheckFromParent=function(t){let e=this,i=t.id;if(!e.isMultiple)return;let l=e.drop.querySelectorAll("li"),s=Array.prototype.slice.call(l).filter(function(r){return r.hasAttribute("data-parent")&&r.getAttribute("data-parent")==i&&!r.classList.contains("hidden-search")}),n=0,a=s.length;a!=0&&(s.forEach(function(r){r.classList.contains("active")&&n++}),n===a||n===0?(s.forEach(function(r){var o=document.createEvent("HTMLEvents");o.initEvent("click",!0,!1),r.dispatchEvent(o)}),n===0?t.classList.add("checked"):t.classList.remove("checked")):(t.classList.remove("checked"),s.forEach(function(r){if(!r.classList.contains("active")){var o=document.createEvent("HTMLEvents");o.initEvent("click",!0,!1),r.dispatchEvent(o)}})))};g.prototype.checkUncheckAll=function(){let t=this;if(!t.isMultiple)return;let e=0,i=0,l=0,s=null;t.listElements!=null&&(Array.prototype.slice.call(t.listElements).forEach(function(n){n.hasAttribute("data-value")&&(n.getAttribute("data-value")==="all"&&(s=n),n.getAttribute("data-value")!=="all"&&!n.classList.contains("hidden-search")&&!n.classList.contains("disabled")&&(i++,e+=n.classList.contains("active")),n.getAttribute("data-value")!=="all"&&!n.classList.contains("disabled")&&l++)}),s&&(e===i?(e===l&&(t.title.textContent=t.userOptions.translations.all),s.classList.add("active"),s.innerText=t.userOptions.translations.clearAll,s.setAttribute("data-selected","true")):e===0&&(t.title.textContent=t.userOptions.placeHolder,s.classList.remove("active"),s.innerText=t.userOptions.translations.selectAll,s.setAttribute("data-selected","false"))))};g.prototype.setValue=function(t){let e=this,i=e.drop.querySelectorAll("li");if(t==null||t==null||t=="")e.empty();else if(e.isMultiple){w(t)=="string"&&(t==="all"?(t=[],Array.prototype.slice.call(i).forEach(function(s){if(s.hasAttribute("data-value")){let n=s.getAttribute("data-value");n!=="all"?(!s.classList.contains("hidden-search")&&!s.classList.contains("disabled")&&t.push(s.getAttribute("data-value")),s.classList.contains("active")&&(s.classList.contains("hidden-search")||s.classList.contains("disabled"))&&t.push(n)):s.classList.add("active")}else s.classList.contains("grouped-option")&&s.classList.add("checked")})):t==="none"?(t=[],Array.prototype.slice.call(i).forEach(function(s){if(s.hasAttribute("data-value")){let n=s.getAttribute("data-value");n!=="all"&&s.classList.contains("active")&&(s.classList.contains("hidden-search")||s.classList.contains("disabled"))&&t.push(n)}else s.classList.contains("grouped-option")&&s.classList.remove("checked")})):t=t.split(","));let l=[];if(w(t)=="array"){Array.prototype.slice.call(e.options).forEach(function(o){t.indexOf(o.value)!==-1?(o.selected=!0,l.push(o.value)):o.selected=!1});let s="",n="",a=0,r=0;if(Array.prototype.slice.call(i).forEach(function(o){o.value!=="all"&&r++,l.indexOf(o.getAttribute("data-value"))!=-1?(o.classList.add("active"),a++,s+=n+o.getAttribute("data-text"),n=e.userOptions.buttonItemsSeparator):o.classList.remove("active")}),r==a-Number(!e.userOptions.disableSelectAll))s=e.userOptions.translations.all;else if(e.multipleSize!=-1&&a>e.multipleSize){let o=a===1?e.userOptions.translations.item:e.userOptions.translations.items;s=a+" "+o}e.title.textContent=s,e.privateSendChange()}e.checkUncheckAll()}else{let l=!1,s="";Array.prototype.slice.call(i).forEach(function(n){n.getAttribute("data-value")==t?(n.classList.add("active"),l=!0,s=n.getAttribute("data-text")):n.classList.remove("active")}),Array.prototype.slice.call(e.options).forEach(function(n){n.value==t?(n.selected=!0,className=n.getAttribute("class"),className||(className="")):n.selected=!1}),l&&(e.title.textContent=s,e.userOptions.placeHolder!=""&&e.title.textContent==""&&(e.title.textContent=e.userOptions.placeHolder),className!=""?e.title.setAttribute("class",className+" title"):e.title.setAttribute("class","title"))}};g.prototype.privateSendChange=function(){let t=document.createEvent("HTMLEvents");t.initEvent("change",!0,!1),this.root.dispatchEvent(t)};g.prototype.empty=function(){Array.prototype.slice.call(this.listElements).forEach(function(e){e.classList.remove("active")});let t=this.drop.querySelectorAll("li.grouped-option");t&&Array.prototype.slice.call(t).forEach(function(e){e.classList.remove("checked")}),Array.prototype.slice.call(this.options).forEach(function(e){e.selected=!1}),this.title.textContent="",this.userOptions.placeHolder!=""&&this.title.textContent==""&&(this.title.textContent=this.userOptions.placeHolder),this.checkUncheckAll(),this.privateSendChange()};g.prototype.destroy=function(){let t=document.getElementById("btn-group-"+this.rootToken);t&&(H.remove(this.instanceOffset),t.remove(),this.root.style.display="inline-block")};g.prototype.disable=function(){this.main.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation()});let t=document.getElementById("btn-group-"+this.rootToken);t&&(button=t.querySelector("button"),button&&button.classList.add("disabled"),this.isDisabled=!0)};g.prototype.enable=function(){let t=document.getElementById("btn-group-"+this.rootToken);t&&(button=t.querySelector("button"),button&&button.classList.remove("disabled"),this.isDisabled=!1)};g.prototype.showOptions=function(){console.log(this.userOptions)};"remove"in Element.prototype||(Element.prototype.remove=function(){this.parentNode&&this.parentNode.removeChild(this)});function w(t){return Object.prototype.toString.call(t).replace("[object ","").replace("]","").toLowerCase()}const q=new Map([["shelfmark",{title:"shelfmark",type:"shelfmark",sql:"mss.filename, shelfmark",post:t=>`<a href="/mss/${t.filename}" class="shelfmark">${t.shelfmark}</a>`}],["repository",{sql:"repository",title:"repository"}],["title",{sql:"title",title:"title",type:"tamil",post:t=>O(t.title)}],["languages",{sql:"languages",title:"languages"}],["material",{sql:"material",title:"material"}],["width",{sql:"width",title:"width"}],["height",{sql:"height",title:"height"}],["extent",{sql:"extent",title:"extent",type:"extent"}],["date",{sql:"date",title:"date",type:"daterange"}],["images",{sql:"images",title:"images",post:t=>t.images?`<span class="smallcaps">${t.images}</span>`:""}],["blessing",{sql:"paratexts_blessing.text AS blessing",title:"blessing",table:"paratexts_blessing",type:"tamil",post:t=>O(t.blessing)}],["colophon",{sql:"paratexts_colophon.text AS colophon",title:"colophon",table:"paratexts_colophon",type:"tamil",post:t=>O(t.colophon)}],["header",{sql:"paratexts_header.text AS header",title:"header",table:"paratexts_header",type:"tamil",post:t=>O(t.header)}],["invocation",{sql:"paratexts_invocation.text AS invocation",title:"invocation",table:"paratexts_invocation",type:"tamil",post:t=>O(t.invocation)}],["ownership-statement",{sql:"[paratexts_ownership-statement].text AS [ownership-statement]",title:"ownership statement",table:"[paratexts_ownership-statement]",type:"tamil",post:t=>O(t["ownership-statement"])}],["satellite-stanza",{sql:"[paratexts_satellite-stanza].text AS [satellite-stanza]",title:"satellite stanza",table:"[paratexts_satellite-stanza]",type:"tamil",post:t=>O(t["satellite-stanza"])}],["table-of-contents",{sql:"[paratexts_table-of-contents].text AS [table-of-contents]",title:"table of contents",table:"[paratexts_table-of-contents]",type:"tamil",post:t=>O(t["table-of-contents"])}],["paratext_title",{sql:"paratexts_title.text AS paratext_title",title:"title",table:"[paratexts_title]",type:"tamil",post:t=>O(t.paratext_title)}],["tbc",{sql:"paratexts_TBC.text AS [tbc]",title:"TBC",table:"[paratexts_TBC]",type:"tamil",post:t=>O(t.tbc)}],["g_below-base",{sql:"[g_below-base].context AS [g_below-base], [g_below-base].text as [g_below-base_sort]",title:"ligature",searchcolumn:"[g_below-base].text",table:"[g_below-base]",type:"tamil",render:{_:"display",sort:"sort"},post:t=>({display:O(t["g_below-base"]),sort:t["g_below-base_sort"]})}],["g_post-base",{sql:"[g_post-base].context AS [g_post-base], [g_post-base].text as [g_post-base_sort]",title:"ligature",searchcolumn:"[g_below-base].text",table:"[g_post-base]",type:"tamil",render:{_:"display",sort:"sort"},post:t=>({display:O(t["g_post-base"]),sort:t["g_post-base_sort"]})}],["synch",{sql:"synch",title:"unit"}],["milestone",{sql:"milestone, facs",title:"page/folio",post:t=>t.milestone&&t.facs?`<a href="/mss/${t.filename}?facs=${t.facs}">${t.milestone}</a>`:t.milestone}],["placement",{sql:"placement",title:"placement"}]]),F=["Ancien fonds","Ariel","w/d","Burnouf","Cordier","Ducler","Haas","Reydellet","Vinson"];for(const t of F)q.set(`old_shelfmarks(${t})`,{title:"old shelfmark",type:"shelfmark",sql:`json_extract(old_shelfmarks, '$.${t}') AS 'old_shelfmarks(${t})'`});const P=async t=>{const e=await D("/mss/db/meta.db"),i=["shelfmark","repository","title","languages","material","extent","date","images"],l=[],s=[],n=t.dataset.sqlcolumns,a=n?n.split(", "):i,r=[];for(const b of a){const d=q.get(b);d&&(r.push(d.sql),d.table&&l.push(`INNER JOIN ${d.table} ON ${d.table}.filename = mss.filename`))}const o=t.dataset.collection;o&&(l.push("INNER JOIN collections ON collections.filename = mss.filename"),s.push(`collections.collection = "${o}"`));const v=t.dataset.repository;v&&s.push(`mss.repository = "${v}"`);const S=t.dataset.collector;S&&(l.push("INNER JOIN persons ON persons.filename = mss.filename"),s.push(`persons.persname = "${S}" AND persons.role = "collector"`));const x=t.dataset.persons;x&&(l.push("INNER JOIN persons ON persons.filename = mss.filename"),s.push(`persons.persname IN (${x}) AND persons.role != ""`));const L=t.dataset.searchtext;L&&s.push(`${t.dataset.searchcolumn} LIKE ${L}`);const c=r.join(", ")+" ",y=l.join(" "),f=s.length>0?`WHERE ${s.join(" AND ")}`:"",u=await e.db.query(`SELECT ${c} FROM mss ${y} ${f} ORDER BY mss.filename`);return V(u,a)},V=(t,e)=>{const i=t.map(n=>{const a={};for(const r of e){const o=q.get(r);o?a[r]=o.post?o.post(n)||"":n[r]:a[r]=n[r]||""}return a}),l=e.map(n=>{const a=q.get(n),r={data:n,title:a.title};return a.type&&(r.type=a.type),a.render&&(r.render=a.render),r}),s=t.map(n=>`"${n.filename}"`).join(", ");return{rows:i,columns:l,files:s}},j=(t,e)=>{const i=new C(`#${e.id}`,{searchable:!0,language:{search:"Filter:"},paging:!0,pageLength:100,lengthMenu:[[25,50,100,-1],[25,50,100,"All"]],sortable:!0,data:t.rows,columns:t.columns,scrollX:!0});document.getElementById("spinner").style.display="none";const l=document.getElementById("tabright");return l&&(l.style.visibility="visible"),document.getElementById("index").style.visibility="visible",e.dataset.files=t.files,e.addEventListener("mouseover",R),i};export{q as a,P as g,j as m,g as v};
