import{d as $,o,c as m,r as B,n as C,a as _,b as S,e as f,w as L,v as D,F as b,f as k,g as O,h as g,i as N,j as T,k as E,l as y,t as I,m as V}from"./index-EMrw1Wsn.js";const x=$("itemStore",{state:()=>({items:[],selectedItems:[]}),actions:{setItems(a){this.items=a},clearItems(){this.items=[],this.selectedItems=[]},setSelectedItems(a){this.selectedItems=a},clearSelectedItems(){this.selectedItems=[]}}}),v=(a,s)=>{const i=a.__vccOpts||a;for(const[n,u]of s)i[n]=u;return i},q={name:"ThemedButton",props:{disabled:{type:Boolean,default:!1},fullWidth:{type:Boolean,default:!1}},emits:["click"],methods:{handleClick(a){this.disabled||this.$emit("click",a)}}},J=["disabled"];function A(a,s,i,n,u,r){return o(),m("button",{class:C(["themed-button",{"is-full-width":i.fullWidth}]),disabled:i.disabled,onClick:s[0]||(s[0]=(...e)=>r.handleClick&&r.handleClick(...e))},[B(a.$slots,"default")],10,J)}const M=v(q,[["render",A]]),Q={name:"ItemSearchList",components:{ThemedButton:M},props:{items:{type:Array,required:!0}},setup(a){const s=x(),i=_(""),n=_(""),u=_([]);let r=null;const e=S(()=>{const l=new Set;return a.items.filter(c=>l.has(c.item_name)?!1:(l.add(c.item_name),!0))}),t=()=>{clearTimeout(r),r=setTimeout(()=>{n.value=i.value},1e3)},d=S(()=>n.value.trim()===""?e.value.filter(l=>u.value.some(c=>c.item_name===l.item_name)):e.value.filter(l=>l.item_name.toLowerCase().includes(n.value.toLowerCase())));return{itemStore:s,searchQuery:i,selectedItems:u,filteredItems:d,handleInput:t,updateStoredItems:()=>{const l=e.value.filter(c=>u.value.includes(c.item_name));s.setSelectedItems(l)},resetStoredItems:()=>{u.value=[],i.value="",n.value="",s.clearSelectedItems()}}}},U=["disabled"],j={class:"item-list"},F=["value"],z={key:0},W={class:"button-container"};function P(a,s,i,n,u,r){const e=T("ThemedButton");return o(),m("div",{class:C(["item-search-list",{"is-disabled":!a.$props.items.length}])},[s[5]||(s[5]=f("h3",null,"Search Items from filtered Categories",-1)),L(f("input",{type:"text","onUpdate:modelValue":s[0]||(s[0]=t=>n.searchQuery=t),onInput:s[1]||(s[1]=(...t)=>n.handleInput&&n.handleInput(...t)),placeholder:"Search items...",class:"search-bar",disabled:!a.$props.items.length},null,40,U),[[D,n.searchQuery]]),f("ul",j,[(o(!0),m(b,null,k(n.filteredItems,t=>(o(),m("li",{key:t.id,class:"item"},[f("label",null,[L(f("input",{type:"checkbox","onUpdate:modelValue":s[2]||(s[2]=d=>n.selectedItems=d),value:t.item_name},null,8,F),[[E,n.selectedItems]]),y(" "+I(t.item_name),1)])]))),128)),n.filteredItems.length?O("",!0):(o(),m("p",z,"No items found."))]),f("div",W,[g(e,{disabled:!a.$props.items.length||!n.selectedItems.length,onClick:n.updateStoredItems},{default:N(()=>s[3]||(s[3]=[y(" Submit List ")])),_:1},8,["disabled","onClick"]),g(e,{disabled:!a.$props.items.length||!n.selectedItems.length,onClick:n.resetStoredItems},{default:N(()=>s[4]||(s[4]=[y(" Reset List ")])),_:1},8,["disabled","onClick"])])],2)}const R=v(Q,[["render",P],["__scopeId","data-v-aab31d27"]]),G={name:"TerminalList",props:{terminals:{type:Array,required:!0},items:{type:Array,required:!0}},setup(a){const s=x(),i=S(()=>{const e=s.selectedItems.map(t=>t.item_name);return a.items.filter(t=>e.includes(t.item_name)).filter(t=>t.price_buy>0)}),n=S(()=>{const e={};return i.value.forEach(t=>{e[t.id_terminal]||(e[t.id_terminal]=[]),e[t.id_terminal].push(t)}),Object.keys(e).map(t=>({id_terminal:t,items:e[t]}))});return{sortedTerminals:S(()=>{const e=new Set(i.value.map(p=>p.item_name)),t=[],d=new Set;for(;e.size>0;){let p=null,h=0;if(n.value.forEach(l=>{if(!d.has(l.id_terminal)){const c=l.items.filter(w=>e.has(w.item_name)).length;c>h&&(h=c,p=l)}}),p){const l=p.items.filter(c=>e.has(c.item_name));t.push({id_terminal:p.id_terminal,items:l}),l.forEach(c=>e.delete(c.item_name)),d.add(p.id_terminal)}else break}return t}),getTerminalName:e=>{const t=a.terminals.find(d=>d.id===parseInt(e));return t?t.name:"Unknown Terminal"}}}},H={class:"terminal-list"},K={key:0},X={key:1};function Y(a,s,i,n,u,r){return o(),m("div",H,[s[0]||(s[0]=f("h3",null,"Terminal List",-1)),n.sortedTerminals.length?(o(),m("ul",K,[(o(!0),m(b,null,k(n.sortedTerminals,(e,t)=>(o(),m("li",{class:"terminal",key:t},[f("strong",null,I(n.getTerminalName(e.id_terminal))+" ("+I(e.items.length)+" item"+I(e.items.length>1?"s":"")+") ",1),f("ul",null,[(o(!0),m(b,null,k(e.items,d=>(o(),m("li",{class:"item",key:d.item_name},I(d.item_name),1))),128))])]))),128))])):(o(),m("p",X,"No selected items found."))])}const Z=v(G,[["render",Y],["__scopeId","data-v-4f700589"]]),ee={components:{ItemSearchList:R,TerminalList:Z},setup(){const a=_([]),s=_([]),i=_([]),n=_(!0),u=async()=>{const r={items:"https://uexcorp.space/api/2.0/items_prices_all",terminals:"https://uexcorp.space/api/2.0/terminals?type=item",orbit_distances:"https://uexcorp.space/api/2.0/orbits_distances?id_star_system=68"};try{const e=async l=>(await(await fetch(l)).json()).data,[t,d,p]=await Promise.all([e(r.items),e(r.terminals),e(r.orbit_distances)]);a.value=t,s.value=d,i.value=p,localStorage.setItem("items",JSON.stringify(t)),localStorage.setItem("terminals",JSON.stringify(d)),localStorage.setItem("orbit_distances",JSON.stringify(p));const h=Date.now()+24*60*60*1e3;localStorage.setItem("dataExpiration",h.toString())}catch(e){console.error("Error fetching data:",e)}finally{n.value=!1}};return V(async()=>{const r=localStorage.getItem("dataExpiration");!r||Date.now()>Number(r)?await u():(a.value=JSON.parse(localStorage.getItem("items"))||[],s.value=JSON.parse(localStorage.getItem("terminals"))||[],i.value=JSON.parse(localStorage.getItem("orbit_distances"))||[],n.value=!1,console.log("Data loaded from localStorage"))}),{isLoading:n,items:a,terminals:s}}},te={key:0,class:"loader-overlay"},se={key:1};function ne(a,s,i,n,u,r){const e=T("ItemSearchList"),t=T("TerminalList");return o(),m("div",null,[s[1]||(s[1]=f("h1",{class:"title"},"Shopping-List",-1)),n.isLoading?(o(),m("div",te,s[0]||(s[0]=[f("div",{class:"loader"},null,-1)]))):(o(),m("div",se,[g(e,{items:n.items},null,8,["items"]),g(t,{terminals:n.terminals,items:n.items},null,8,["terminals","items"])]))])}const ie=v(ee,[["render",ne],["__scopeId","data-v-917c3556"]]);export{ie as default};