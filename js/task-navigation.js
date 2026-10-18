
(function(){
const dock=document.getElementById('task-dock'),status=document.getElementById('dock-status'),next=document.getElementById('dock-next');let target=null;
function visible(el){return el&&!el.closest('[hidden]')&&el.getClientRects().length>0}
function sync(){
 const app=document.querySelector('main');if(!app)return;
 const scene=document.getElementById('dynamic-room');let label='';target=null;
 if(scene){
  label=(document.querySelector('.scene-top .pill')?.textContent||'')+' · '+(document.getElementById('live-status')?.textContent||'');
  const phase=typeof conversationPhase==='undefined'?'':conversationPhase;
  if(['speaking','replaying'].includes(phase)){next.textContent='正在说话，请听完…';}
  else if(phase==='roleDecision'){
   const reaction=document.getElementById('reaction-next');if(visible(reaction))target=reaction;
   else next.textContent='请先选择一道反应题选项';
  }else if(visible(document.getElementById('check'))){target=document.getElementById('check');}
  else {target=Array.from(document.querySelectorAll('#doctor-controls button')).find(b=>visible(b)&&!b.disabled);if(!target)next.textContent='等待当前话轮结束…';}
 }else{
  target=Array.from(app.querySelectorAll('button.primary')).find(b=>visible(b)&&!b.disabled);
  label=document.querySelector('.complete')?'本关已完成，可进入下一场景':document.querySelector('.vocab-layout')?'先学习本关词汇，再进入对话场景':'选择场景，开始练习';
 }
 dock.hidden=!scene&&!target;
 if(status.textContent!==label)status.textContent=label;
 if(target){if(next.textContent!==target.textContent)next.textContent=target.textContent;next.disabled=target.disabled;}else next.disabled=true;
}
next.onclick=()=>{if(target&&visible(target)&&!target.disabled)target.click();sync()};
document.getElementById('dock-locate').onclick=()=>{
 const phase=typeof conversationPhase==='undefined'?'':conversationPhase;
 const el=phase==='roleDecision'?document.getElementById('turn-prompt'):['interpreting','recording','feedback','feedbackDoctor'].includes(phase)?document.getElementById('response-panel'):document.getElementById('doctor-controls')||target;
 el?.scrollIntoView({behavior:'smooth',block:'center'});
};
const app=document.querySelector('main');if(app)new MutationObserver(sync).observe(app,{subtree:true,childList:true,attributes:true,characterData:true});window.addEventListener('resize',sync);sync();
})();
