import{B as O}from"./BaseListPage-BL72EV22.js";import{_ as $,r as V,a as k,m as M,g as n,o as F,c as I,d as e,w as t,k as c,t as y,E as v}from"./index-0Rub1XVr.js";const L={class:"users-page"},z={__name:"Users",setup(A){const p=V(null),b=V(!1),g=V("create"),N=V(null),r=k({username:"",realName:"",role:"",status:""}),s=k({username:"",realName:"",role:"",phone:"",email:"",status:"1"}),w={username:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:3,max:20,message:"长度在 3 到 20 个字符",trigger:"blur"}],realName:[{required:!0,message:"请输入姓名",trigger:"blur"}],role:[{required:!0,message:"请选择角色",trigger:"change"}],phone:[{pattern:/^1[3-9]\d{9}$/,message:"请输入正确的手机号",trigger:"blur"}],email:[{type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}]},f=o=>{p.value&&(p.value.loading=!0,setTimeout(()=>{p.value.tableData=[{username:"admin",realName:"管理员",role:"管理员",phone:"13800138000",email:"admin@example.com",status:"1",createTime:"2024-03-14 12:00:00"},{username:"doctor1",realName:"张医生",role:"医生",phone:"13800138001",email:"doctor1@example.com",status:"1",createTime:"2024-03-14 13:00:00"}].filter(l=>{const m=!o.username||l.username.includes(o.username),u=!o.realName||l.realName.includes(o.realName),d=!o.role||l.role===o.role,_=!o.status||l.status===o.status;return m&&u&&d&&_}),p.value.total=p.value.tableData.length,p.value.loading=!1},500))},C=()=>{Object.keys(r).forEach(o=>{r[o]=""}),f(r)},E=()=>{g.value="create",b.value=!0,Object.keys(s).forEach(o=>{s[o]=o==="status"?"1":""})},B=o=>{g.value="edit",b.value=!0,Object.keys(s).forEach(l=>{s[l]=o[l]})},R=o=>{v.success("删除成功"),f(r)},T=({command:o,selection:l})=>{switch(o){case"delete":v.success(`批量删除 ${l.length} 条记录成功`),f(r);break;case"export":v.success("导出成功");break}},D=()=>{N.value.validate(o=>{o&&(v.success(g.value==="create"?"创建成功":"更新成功"),b.value=!1,f(r))})};return M(()=>{f(r)}),(o,l)=>{const m=n("el-input"),u=n("el-form-item"),d=n("el-option"),_=n("el-select"),i=n("el-table-column"),S=n("el-tag"),h=n("el-dropdown-item"),U=n("el-radio"),P=n("el-radio-group"),j=n("el-form"),x=n("el-button"),q=n("el-dialog");return F(),I("div",L,[e(O,{ref_key:"listPage",ref:p,"search-form":r,onSearch:f,onReset:C,onCreate:E,onEdit:B,onDelete:R,onBatchCommand:T},{"search-items":t(()=>[e(u,{label:"用户名"},{default:t(()=>[e(m,{modelValue:r.username,"onUpdate:modelValue":l[0]||(l[0]=a=>r.username=a),placeholder:"请输入用户名",clearable:""},null,8,["modelValue"])]),_:1}),e(u,{label:"姓名"},{default:t(()=>[e(m,{modelValue:r.realName,"onUpdate:modelValue":l[1]||(l[1]=a=>r.realName=a),placeholder:"请输入姓名",clearable:""},null,8,["modelValue"])]),_:1}),e(u,{label:"角色"},{default:t(()=>[e(_,{modelValue:r.role,"onUpdate:modelValue":l[2]||(l[2]=a=>r.role=a),placeholder:"请选择角色",clearable:""},{default:t(()=>[e(d,{label:"管理员",value:"admin"}),e(d,{label:"医生",value:"doctor"}),e(d,{label:"护士",value:"nurse"})]),_:1},8,["modelValue"])]),_:1}),e(u,{label:"状态"},{default:t(()=>[e(_,{modelValue:r.status,"onUpdate:modelValue":l[3]||(l[3]=a=>r.status=a),placeholder:"请选择状态",clearable:""},{default:t(()=>[e(d,{label:"启用",value:"1"}),e(d,{label:"禁用",value:"0"})]),_:1},8,["modelValue"])]),_:1})]),"dropdown-items":t(({row:a})=>[e(h,{command:a.status==="1"?"disable":"enable"},{default:t(()=>[c(y(a.status==="1"?"禁用":"启用"),1)]),_:2},1032,["command"]),e(h,{command:"resetPwd"},{default:t(()=>l[12]||(l[12]=[c("重置密码")])),_:1})]),default:t(()=>[e(i,{prop:"username",label:"用户名"}),e(i,{prop:"realName",label:"姓名"}),e(i,{prop:"role",label:"角色"}),e(i,{prop:"phone",label:"手机号"}),e(i,{prop:"email",label:"邮箱"}),e(i,{prop:"status",label:"状态"},{default:t(({row:a})=>[e(S,{type:a.status==="1"?"success":"danger"},{default:t(()=>[c(y(a.status==="1"?"启用":"禁用"),1)]),_:2},1032,["type"])]),_:1}),e(i,{prop:"createTime",label:"创建时间"})]),_:1},8,["search-form"]),e(q,{modelValue:b.value,"onUpdate:modelValue":l[11]||(l[11]=a=>b.value=a),title:g.value==="create"?"新建用户":"编辑用户",width:"500px"},{footer:t(()=>[e(x,{onClick:l[10]||(l[10]=a=>b.value=!1)},{default:t(()=>l[15]||(l[15]=[c("取消")])),_:1}),e(x,{type:"primary",onClick:D},{default:t(()=>l[16]||(l[16]=[c("确定")])),_:1})]),default:t(()=>[e(j,{ref_key:"formRef",ref:N,model:s,rules:w,"label-width":"100px"},{default:t(()=>[e(u,{label:"用户名",prop:"username"},{default:t(()=>[e(m,{modelValue:s.username,"onUpdate:modelValue":l[4]||(l[4]=a=>s.username=a),placeholder:"请输入用户名"},null,8,["modelValue"])]),_:1}),e(u,{label:"姓名",prop:"realName"},{default:t(()=>[e(m,{modelValue:s.realName,"onUpdate:modelValue":l[5]||(l[5]=a=>s.realName=a),placeholder:"请输入姓名"},null,8,["modelValue"])]),_:1}),e(u,{label:"角色",prop:"role"},{default:t(()=>[e(_,{modelValue:s.role,"onUpdate:modelValue":l[6]||(l[6]=a=>s.role=a),placeholder:"请选择角色"},{default:t(()=>[e(d,{label:"管理员",value:"admin"}),e(d,{label:"医生",value:"doctor"}),e(d,{label:"护士",value:"nurse"})]),_:1},8,["modelValue"])]),_:1}),e(u,{label:"手机号",prop:"phone"},{default:t(()=>[e(m,{modelValue:s.phone,"onUpdate:modelValue":l[7]||(l[7]=a=>s.phone=a),placeholder:"请输入手机号"},null,8,["modelValue"])]),_:1}),e(u,{label:"邮箱",prop:"email"},{default:t(()=>[e(m,{modelValue:s.email,"onUpdate:modelValue":l[8]||(l[8]=a=>s.email=a),placeholder:"请输入邮箱"},null,8,["modelValue"])]),_:1}),e(u,{label:"状态",prop:"status"},{default:t(()=>[e(P,{modelValue:s.status,"onUpdate:modelValue":l[9]||(l[9]=a=>s.status=a)},{default:t(()=>[e(U,{label:"1"},{default:t(()=>l[13]||(l[13]=[c("启用")])),_:1}),e(U,{label:"0"},{default:t(()=>l[14]||(l[14]=[c("禁用")])),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue","title"])])}}},J=$(z,[["__scopeId","data-v-19ab54b6"]]);export{J as default};