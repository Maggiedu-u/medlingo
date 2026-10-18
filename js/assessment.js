
// Meaning groups accept everyday and clinical registers; order is unimportant.
const meaningGroups={
 'booking:0':[['appointment|see (?:a |the )?(?:doctor|gp)|book.*(?:doctor|gp)','gp|general practitioner|doctor']],
 'booking:1':[['routine|regular|non urgent','tomorrow|next day']],
 'booking:2':[['ten|10','tomorrow|next day']],
 'checkin:0':[['appointment|booked|scheduled','ten|10']],
 'checkin:1':[['\\bli\\b|l[ -]i']],
 'checkin:2':[['twelfth|12|twelve','may','1995|nineteen ninety five']],
 'fever:0':[['fever|temperature|feverish','sore throat|throat.*(?:sore|hurt|pain)|pain.*throat']],
 'fever:1':[['(?:two|2|couple of) days']],
 'fever:2':[['allerg|reaction','penicillin']],
 'triage:0':[['diarrh[oe]+a|loose (?:stools|bowel movements)|watery stools|the runs','dizz|light[ -]?headed|feel faint']],
 'triage:1':[['(?:abdom(?:en|inal)|stomach|tummy|belly|gut).*(?:pain|ache|hurt|sore|cramp)|(?:pain|ache|hurt|sore|cramp).*(?:abdom(?:en|inal)|stomach|tummy|belly|gut)']],
 'triage:2':[['six|6','ten|10']],
 'dehydration:0':[['ten|10','watery|water like|liquid']],
 'dehydration:1':[['vomit|throw up|sick|can(?:not| t).*keep.*down|unable.*keep.*down','water|fluid|drink|anything.*down']],
 'dehydration:2':[['(?:little|hardly|barely|not much|almost no|no|not).*(?:urin|pee|wee)|(?:urin|pee|wee).*(?:little|hardly|barely|not much)']],
 'trauma:0':[['car|vehicle','left leg']],
 'trauma:1':[['cannot|can not|can t|unable|couldn t','numb|no feeling|lost.*(?:feeling|sensation)']],
 'trauma:2':[['head','did not|didn t|no loss|never|not lose|stayed conscious|remained conscious|did not pass out']]
};
function normalizeAnswer(s){return s.toLowerCase().replace(/[’']/g,' ').replace(/-/g,' ').replace(/\s+/g,' ').trim()}
function evaluateAnswer(id,index,input){
 const text=normalizeAnswer(input), entry=meaningGroups[id+':'+index];
 const required=entry?entry[0]:modules.find(m=>m.id===id).turns[index][4];
 let ok=required.every(pattern=>new RegExp(pattern,'i').test(text));
 const wrong=(id==='triage'&&index===1&&/\b(?:no|not|without)\b.{0,25}(?:pain|ache|hurt|cramp)/.test(text))||
 (id==='fever'&&index===2&&/not allergic|no (?:known )?(?:allerg|reaction)/.test(text))||
 (id==='trauma'&&index===0&&/right leg/.test(text))||
 (id==='trauma'&&index===1&&/\bi can (?:walk|bear|stand|put)|no numbness|not numb/.test(text))||
 (id==='trauma'&&index===2&&/\bi (?:did )?(?:lose|lost) consciousness|\bi passed out|did not hit.*head|didn t hit.*head/.test(text));
 return ok&&!wrong;
}
let voiceList=[],voiceChoice='',voiceRate=1;
try{voiceChoice=localStorage.getItem('medlingo-voice')||'';voiceRate=Number(localStorage.getItem('medlingo-rate'))||1}catch{}
function loadVoices(){voiceList=window.speechSynthesis?window.speechSynthesis.getVoices().filter(v=>/^en(?:-|_)/i.test(v.lang)):[];voiceList.sort((a,b)=>voiceScore(b)-voiceScore(a));return voiceList}
function voiceScore(v){return (/natural|neural|premium|enhanced/i.test(v.name)?100:0)+(/google|samantha|daniel|ava|serena|aria|jenny/i.test(v.name)?25:0)+(/^en-GB/i.test(v.lang)?10:0)}
if(window.speechSynthesis){loadVoices();window.speechSynthesis.addEventListener?.('voiceschanged',()=>{loadVoices();if(document.getElementById('voice-select'))fillVoices()})}
say=function(text){if(!window.speechSynthesis)return modal('<h2>朗读暂不可用</h2><p>当前浏览器没有提供语音朗读功能，请阅读文字继续。</p>');speechSynthesis.cancel();loadVoices();const u=new SpeechSynthesisUtterance(text);const voice=voiceList.find(v=>v.voiceURI===voiceChoice)||voiceList[0];if(voice){u.voice=voice;u.lang=voice.lang}else u.lang='en-GB';u.rate=voiceRate;u.pitch=1;speechSynthesis.speak(u)};
function voiceSettings(){modal('<h2>选择更适合你的声音</h2><p>优先使用设备提供的高质量英语音色。不同电脑和浏览器可用的声音不同，可以试听后选择。</p><label for="voice-select">英语音色</label><select id="voice-select" onchange="setVoice(this.value)"></select><label for="voice-rate">语速</label><select id="voice-rate" onchange="setRate(this.value)"><option value="0.9">稍慢 · 0.9×</option><option value="1">自然 · 1.0×</option><option value="1.1">稍快 · 1.1×</option></select><button class="secondary" onclick="say(\'Good morning. Can you tell me what has brought you in today?\')">▷ 试听医护对话</button><p class="note">这里调整的是题目朗读（语音合成），不会改变麦克风语音识别。没有高质量音色时仍可能偏机械；本版尚未接入真人录音或独立云端配音。</p>');fillVoices();document.getElementById('voice-rate').value=String(voiceRate)}
function fillVoices(){loadVoices();const s=document.getElementById('voice-select');s.innerHTML='<option value="">自动选择较高质量音色</option>'+voiceList.map(v=>'<option value="'+esc(v.voiceURI)+'">'+esc(v.name)+' · '+esc(v.lang)+'</option>').join('');s.value=voiceChoice}
function setVoice(value){voiceChoice=value;try{localStorage.setItem('medlingo-voice',value)}catch{}}
function setRate(value){voiceRate=Number(value);try{localStorage.setItem('medlingo-rate',value)}catch{}}

