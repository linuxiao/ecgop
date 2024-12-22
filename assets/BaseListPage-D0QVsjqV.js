import{_ as E,r,g as a,a2 as I,o as k,c as O,b as i,d as t,w as n,h as T,ah as Y,k as l,ak as f,Y as A,q as G}from"./index-C_S8R5SK.js";const H={class:"base-list-page"},J={class:"header-content"},K={class:"action-buttons"},M={class:"search-form-content"},Q={class:"table-container"},R={class:"pagination-container"},W={__name:"BaseListPage",props:{searchForm:{type:Object,required:!0}},emits:["search","reset","create","edit","delete","batch-command"],setup(g,{expose:z,emit:B}){const d=B,v=r(!1),b=r([]),c=r([]),m=r(1),u=r(10),w=r(0),S=o=>{c.value=o},$=o=>{u.value=o,d("search")},x=o=>{m.value=o,d("search")},P=()=>{d("create")},D=(o,e)=>{switch(o){case"edit":d("edit",e);break;case"delete":d("delete",e);break}},F=o=>{d("batch-command",{command:o,selection:c.value})};return z({loading:v,tableData:b,total:w,currentPage:m,pageSize:u}),(o,e)=>{const N=a("el-icon"),_=a("el-button"),p=a("el-dropdown-item"),C=a("el-dropdown-menu"),h=a("el-dropdown"),V=a("el-form"),y=a("el-table-column"),j=a("el-table"),q=a("el-pagination"),L=I("loading");return k(),O("div",H,[i("div",J,[i("div",K,[t(_,{type:"primary",onClick:P},{default:n(()=>[t(N,null,{default:n(()=>[t(T(Y))]),_:1}),e[4]||(e[4]=l("新建 "))]),_:1}),t(h,{"split-button":"",type:"primary",disabled:!c.value.length,onCommand:F,class:"batch-dropdown"},{dropdown:n(()=>[t(C,null,{default:n(()=>[t(p,{command:"delete"},{default:n(()=>e[5]||(e[5]=[l("批量删除")])),_:1}),t(p,{command:"export"},{default:n(()=>e[6]||(e[6]=[l("批量导出")])),_:1})]),_:1})]),default:n(()=>[e[7]||(e[7]=l(" 批量操作 "))]),_:1},8,["disabled"])]),t(V,{inline:!0,model:g.searchForm},{default:n(()=>[i("div",M,[f(o.$slots,"search-items",{},void 0,!0),t(_,{type:"primary",onClick:e[0]||(e[0]=s=>o.$emit("search",g.searchForm))},{default:n(()=>e[8]||(e[8]=[l("查询")])),_:1}),t(_,{onClick:e[1]||(e[1]=s=>o.$emit("reset"))},{default:n(()=>e[9]||(e[9]=[l("重置")])),_:1})])]),_:3},8,["model"])]),i("div",Q,[A((k(),G(j,{data:b.value,onSelectionChange:S,border:"",style:{width:"100%"}},{default:n(()=>[t(y,{type:"selection",width:"55",align:"center"}),f(o.$slots,"default",{},void 0,!0),t(y,{label:"操作",width:"120",fixed:"right",align:"center"},{default:n(s=>[t(h,{"split-button":"",type:"primary",size:"small",onCommand:U=>D(U,s.row)},{dropdown:n(()=>[t(C,null,{default:n(()=>[t(p,{command:"edit"},{default:n(()=>e[10]||(e[10]=[l("编辑")])),_:1}),t(p,{command:"delete"},{default:n(()=>e[11]||(e[11]=[l("删除")])),_:1}),f(o.$slots,"dropdown-items",{row:s.row},void 0,!0)]),_:2},1024)]),default:n(()=>[e[12]||(e[12]=l(" 编辑 "))]),_:2},1032,["onCommand"])]),_:3})]),_:3},8,["data"])),[[L,v.value]])]),i("div",R,[t(q,{"current-page":m.value,"onUpdate:currentPage":e[2]||(e[2]=s=>m.value=s),"page-size":u.value,"onUpdate:pageSize":e[3]||(e[3]=s=>u.value=s),"page-sizes":[10,20,50,100],total:w.value,layout:"total, sizes, prev, pager, next, jumper",onSizeChange:$,onCurrentChange:x},null,8,["current-page","page-size","total"])])])}}},Z=E(W,[["__scopeId","data-v-9d898363"]]);export{Z as B};