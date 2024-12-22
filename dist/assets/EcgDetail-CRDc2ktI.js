import{_ as J,f as K,r as b,a as N,m as Q,g as c,o as k,c as C,d as e,w as s,b as i,k as t,t as u,h as P,v as W,x,y as X,z as Y,F as Z,n as h,E as p}from"./index-0Rub1XVr.js";const ee={class:"ecg-device-detail"},le={class:"card-header"},se={class:"test-grid"},ae={class:"test-logs"},te={class:"log-header"},oe={class:"log-content"},re={class:"log-time"},ne={class:"log-message"},de={__name:"EcgDetail",setup(ue){const D=K().params.deviceNo,g=b({deviceNo:"ECG001",deviceName:"心电图机1号",model:"ECG-1200G",manufacturer:"科强",department:"心内科",status:"1",lastLoginTime:"2024-03-14 10:00:00",ip:"192.168.1.100"}),f=b({deviceUrl:"http://192.168.1.100:8080",username:"admin",password:"******",ftpUrl:"ftp://192.168.1.100",ftpUsername:"ecg",ftpPassword:"******"}),n=N({login:!1,ecg:!1,diagnosis:!1,ftp:!1,patient:!1}),V=b([]),w=b(!1),L=b(null),o=N({deviceUrl:"",username:"",password:"",ftpUrl:"",ftpUsername:"",ftpPassword:""}),R={deviceUrl:[{required:!0,message:"请输入设备URL",trigger:"blur"}],username:[{required:!0,message:"请输入登录账号",trigger:"blur"}],ftpUrl:[{required:!0,message:"请输入FTP地址",trigger:"blur"}],ftpUsername:[{required:!0,message:"请输入FTP账号",trigger:"blur"}]},m=(a,l)=>{const T=new Date().toLocaleTimeString();V.value.unshift({time:T,status:a,message:l})},q=()=>{Object.assign(o,{deviceUrl:f.value.deviceUrl,username:f.value.username,ftpUrl:f.value.ftpUrl,ftpUsername:f.value.ftpUsername}),w.value=!0},B=()=>{var a;(a=L.value)==null||a.validate(l=>{l&&(Object.assign(f.value,{deviceUrl:o.deviceUrl,username:o.username,ftpUrl:o.ftpUrl,ftpUsername:o.ftpUsername}),o.password&&(f.value.password=o.password),o.ftpPassword&&(f.value.ftpPassword=o.ftpPassword),p.success("配置已更新"),w.value=!1)})},G=async()=>{n.login=!0;try{await new Promise(a=>setTimeout(a,1e3)),m("success","设备登录成功"),p.success("登录测试成功")}catch(a){m("error","设备登录失败："+a.message),p.error("登录测试失败")}finally{n.login=!1}},S=async()=>{n.ecg=!0;try{await new Promise(a=>setTimeout(a,1500)),m("success","心电图传输成功"),p.success("心电图传输测试成功")}catch(a){m("error","心电图传输失败："+a.message),p.error("心电图传输测试失败")}finally{n.ecg=!1}},j=async()=>{n.diagnosis=!0;try{await new Promise(a=>setTimeout(a,1200)),m("success","判读测试成功"),p.success("判读测试成功")}catch(a){m("error","判读测试失败："+a.message),p.error("判读测试失败")}finally{n.diagnosis=!1}},z=async()=>{n.ftp=!0;try{await new Promise(a=>setTimeout(a,1e3)),m("success","FTP上传成功"),p.success("FTP上传测试成功")}catch(a){m("error","FTP上传失败："+a.message),p.error("FTP上传测试失败")}finally{n.ftp=!1}},I=async()=>{n.patient=!0;try{await new Promise(a=>setTimeout(a,800)),m("success","患者查询成功"),p.success("患者查询测试成功")}catch(a){m("error","患者查询失败："+a.message),p.error("患者查询测试失败")}finally{n.patient=!1}},M=()=>{V.value=[],p.success("日志已��空")},O=async()=>{console.log("Loading device data for:",D)};return Q(()=>{O()}),(a,l)=>{const d=c("el-descriptions-item"),T=c("el-tag"),E=c("el-descriptions"),F=c("el-card"),v=c("el-button"),y=c("el-icon"),_=c("el-input"),U=c("el-form-item"),$=c("el-form"),A=c("el-dialog");return k(),C("div",ee,[e(F,{class:"detail-card"},{header:s(()=>l[8]||(l[8]=[i("div",{class:"card-header"},[i("span",{class:"title"},"设备详情")],-1)])),default:s(()=>[e(E,{column:2,border:""},{default:s(()=>[e(d,{label:"设备编号"},{default:s(()=>[t(u(g.value.deviceNo),1)]),_:1}),e(d,{label:"设备名称"},{default:s(()=>[t(u(g.value.deviceName),1)]),_:1}),e(d,{label:"设备型号"},{default:s(()=>[t(u(g.value.model),1)]),_:1}),e(d,{label:"厂商"},{default:s(()=>[t(u(g.value.manufacturer),1)]),_:1}),e(d,{label:"使用科室"},{default:s(()=>[t(u(g.value.department),1)]),_:1}),e(d,{label:"状态"},{default:s(()=>[e(T,{type:g.value.status==="1"?"success":"danger"},{default:s(()=>[t(u(g.value.status==="1"?"在线":"离线"),1)]),_:1},8,["type"])]),_:1}),e(d,{label:"最后登录时间"},{default:s(()=>[t(u(g.value.lastLoginTime),1)]),_:1}),e(d,{label:"IP地址"},{default:s(()=>[t(u(g.value.ip),1)]),_:1})]),_:1})]),_:1}),e(F,{class:"detail-card"},{header:s(()=>[i("div",le,[l[10]||(l[10]=i("span",{class:"title"},"登录配置",-1)),e(v,{type:"primary",link:"",onClick:q},{default:s(()=>l[9]||(l[9]=[t("编辑配置")])),_:1})])]),default:s(()=>[e(E,{column:2,border:""},{default:s(()=>[e(d,{label:"设备URL"},{default:s(()=>[t(u(f.value.deviceUrl),1)]),_:1}),e(d,{label:"登录账号"},{default:s(()=>[t(u(f.value.username),1)]),_:1}),e(d,{label:"登录密码"},{default:s(()=>l[11]||(l[11]=[t("******")])),_:1}),e(d,{label:"FTP地址"},{default:s(()=>[t(u(f.value.ftpUrl),1)]),_:1}),e(d,{label:"FTP账号"},{default:s(()=>[t(u(f.value.ftpUsername),1)]),_:1}),e(d,{label:"FTP密码"},{default:s(()=>l[12]||(l[12]=[t("******")])),_:1})]),_:1})]),_:1}),e(F,{class:"detail-card"},{header:s(()=>l[13]||(l[13]=[i("div",{class:"card-header"},[i("span",{class:"title"},"接口测试")],-1)])),default:s(()=>[i("div",se,[e(v,{type:"primary",loading:n.login,onClick:G},{default:s(()=>[e(y,null,{default:s(()=>[e(P(W))]),_:1}),l[14]||(l[14]=t("登录测试 "))]),_:1},8,["loading"]),e(v,{type:"success",loading:n.ecg,onClick:S},{default:s(()=>[e(y,null,{default:s(()=>[e(P(x))]),_:1}),l[15]||(l[15]=t("心电图传输 "))]),_:1},8,["loading"]),e(v,{type:"warning",loading:n.diagnosis,onClick:j},{default:s(()=>[e(y,null,{default:s(()=>[e(P(X))]),_:1}),l[16]||(l[16]=t("判读测试 "))]),_:1},8,["loading"]),e(v,{type:"info",loading:n.ftp,onClick:z},{default:s(()=>[e(y,null,{default:s(()=>[e(P(x))]),_:1}),l[17]||(l[17]=t("FTP上传 "))]),_:1},8,["loading"]),e(v,{loading:n.patient,onClick:I},{default:s(()=>[e(y,null,{default:s(()=>[e(P(Y))]),_:1}),l[18]||(l[18]=t("患者查询 "))]),_:1},8,["loading"])]),i("div",ae,[i("div",te,[l[20]||(l[20]=i("span",{class:"title"},"测试日志",-1)),e(v,{type:"primary",link:"",onClick:M},{default:s(()=>l[19]||(l[19]=[t(" 清空日志 ")])),_:1})]),i("div",oe,[(k(!0),C(Z,null,h(V.value,(r,H)=>(k(),C("div",{key:H,class:"log-item"},[e(T,{size:"small",type:r.status==="success"?"success":"danger",class:"log-status"},{default:s(()=>[t(u(r.status==="success"?"成功":"失败"),1)]),_:2},1032,["type"]),i("span",re,u(r.time),1),i("span",ne,u(r.message),1)]))),128))])])]),_:1}),e(A,{modelValue:w.value,"onUpdate:modelValue":l[7]||(l[7]=r=>w.value=r),title:"编辑配置",width:"500px"},{footer:s(()=>[e(v,{onClick:l[6]||(l[6]=r=>w.value=!1)},{default:s(()=>l[21]||(l[21]=[t("取消")])),_:1}),e(v,{type:"primary",onClick:B},{default:s(()=>l[22]||(l[22]=[t("确定")])),_:1})]),default:s(()=>[e($,{ref_key:"formRef",ref:L,model:o,rules:R,"label-width":"100px"},{default:s(()=>[e(U,{label:"设备URL",prop:"deviceUrl"},{default:s(()=>[e(_,{modelValue:o.deviceUrl,"onUpdate:modelValue":l[0]||(l[0]=r=>o.deviceUrl=r),placeholder:"请输入设备URL"},null,8,["modelValue"])]),_:1}),e(U,{label:"登录账号",prop:"username"},{default:s(()=>[e(_,{modelValue:o.username,"onUpdate:modelValue":l[1]||(l[1]=r=>o.username=r),placeholder:"请输入登录账号"},null,8,["modelValue"])]),_:1}),e(U,{label:"登录密码",prop:"password"},{default:s(()=>[e(_,{modelValue:o.password,"onUpdate:modelValue":l[2]||(l[2]=r=>o.password=r),type:"password",placeholder:"请输入登录密码","show-password":""},null,8,["modelValue"])]),_:1}),e(U,{label:"FTP地址",prop:"ftpUrl"},{default:s(()=>[e(_,{modelValue:o.ftpUrl,"onUpdate:modelValue":l[3]||(l[3]=r=>o.ftpUrl=r),placeholder:"请输入FTP地址"},null,8,["modelValue"])]),_:1}),e(U,{label:"FTP账号",prop:"ftpUsername"},{default:s(()=>[e(_,{modelValue:o.ftpUsername,"onUpdate:modelValue":l[4]||(l[4]=r=>o.ftpUsername=r),placeholder:"请输入FTP账号"},null,8,["modelValue"])]),_:1}),e(U,{label:"FTP密码",prop:"ftpPassword"},{default:s(()=>[e(_,{modelValue:o.ftpPassword,"onUpdate:modelValue":l[5]||(l[5]=r=>o.ftpPassword=r),type:"password",placeholder:"请输入FTP密码","show-password":""},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}},fe=J(de,[["__scopeId","data-v-8019a40e"]]);export{fe as default};
