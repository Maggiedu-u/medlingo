// 精简版：合并初诊信息和治疗建议，删除重复复述及末轮复核。
const feverCase=[
  {
    "en": "What symptoms have you had, for how long, and what was your highest temperature?",
    "zhQ": "您有哪些症状，持续多久了？最高体温是多少？",
    "qKeys": [
      "症状|不舒服|不适",
      "多久|多长时间|几天|什么时候",
      "最高|最.*高",
      "体温|温度|烧"
    ],
    "qOptions": [
      "有哪些症状、持续多久、最高体温是多少？",
      "您今天几点上班？",
      "您上次打点滴是什么时候？"
    ],
    "patient": "我发热、喉咙痛两天了，吞咽时更疼。昨晚最高三十八点五度。",
    "english": "I have had a fever and a sore throat for two days, worse when swallowing. My highest temperature was 38.5 degrees last night.",
    "keys": [
      "fever|temperature|feverish",
      "sore throat|throat.*(?:sore|hurt|pain)|pain.*throat",
      "swallow",
      "two days|2 days",
      "38[ .]5|38 point five|thirty eight point five",
      "last night|yesterday.*night"
    ],
    "options": [
      "Fever and sore throat for two days, worse on swallowing; 38.5 degrees last night.",
      "A headache for two weeks, without fever.",
      "A sore throat since this morning; no trouble swallowing."
    ]
  },
  {
    "en": "Have you had any shortness of breath, a rash, or difficulty swallowing fluids?",
    "zhQ": "您有没有气短、皮疹，或者吞咽液体困难？",
    "qKeys": [
      "气短|呼吸困难|喘不过气",
      "皮疹|疹子|出疹",
      "吞咽|咽.*下",
      "水|液体|喝"
    ],
    "qOptions": [
      "有没有气短、皮疹或吞咽液体困难？",
      "您现在肯定没有任何危险症状。",
      "有没有头疼或牙疼？"
    ],
    "patient": "没有气短，也没有皮疹。吞咽很疼，但我还能喝水。",
    "english": "No breathlessness or rash. Swallowing is painful, but I can still drink water.",
    "keys": [
      "no|not|without",
      "breathless|shortness of breath|breathing",
      "rash",
      "swallow",
      "can.*drink|able.*drink"
    ],
    "options": [
      "no breathlessness or rash; painful swallowing but able to drink",
      "breathlessness and a rash; unable to drink",
      "no pain and no symptoms"
    ]
  },
  {
    "en": "Do you have any medication allergies, and have you taken any antibiotics for this illness?",
    "zhQ": "您对什么药物过敏吗？这次生病有没有服用过抗生素？",
    "qKeys": [
      "药",
      "过敏",
      "抗生素",
      "这次|这回|此次"
    ],
    "qOptions": [
      "有药物过敏吗，这次有没有服用抗生素？",
      "您需要静脉输液吗？",
      "您以前住过院吗？"
    ],
    "patient": "我对青霉素过敏。这次生病还没有吃过抗生素。",
    "english": "I am allergic to penicillin. I have not taken any antibiotics for this illness.",
    "keys": [
      "allerg",
      "penicillin",
      "not|no|haven t|have not",
      "antibiotic"
    ],
    "options": [
      "penicillin allergy; no antibiotics for this illness",
      "no allergies; already taking penicillin",
      "food allergy only"
    ]
  },
  {
    "en": "After examining you, I think this is more likely to be a viral infection. Antibiotics are unlikely to help. What concerns you most about this plan?",
    "zhQ": "检查后，我认为这更可能是病毒感染，抗生素不太可能有帮助。对于这个方案，您最担心什么？",
    "qKeys": [
      "检查",
      "可能|倾向",
      "病毒",
      "抗生素",
      "不太|不大|未必|没.*帮助|无.*帮助",
      "担心|顾虑|关心"
    ],
    "qOptions": [
      "检查后更可能是病毒感染，抗生素不太有帮助；您最担心什么？",
      "已经确诊细菌感染，必须立即用抗生素。",
      "医生拒绝提供任何治疗。"
    ],
    "patient": "英国医生怎么都不开药呀？我还要上班呢！您能不能给我开点抗生素？",
    "english": "Why don't doctors in the UK prescribe anything? I still have to go to work! Could you prescribe me some antibiotics?",
    "keys": [
      "uk|britain|british",
      "prescrib|medicine|medication",
      "work",
      "antibiotic"
    ],
    "options": [
      "Why do doctors in the UK not prescribe anything? I still have to work. Could you prescribe antibiotics?",
      "The patient agrees and has no concerns.",
      "I agree with the patient: you must prescribe antibiotics."
    ]
  },
  {
    "en": "Could you tell me what treatment you were hoping for?",
    "zhQ": "您原本希望接受什么治疗？",
    "qKeys": [
      "希望|想要|期待",
      "治疗|处理|怎么治"
    ],
    "qOptions": [
      "您希望接受什么治疗？",
      "您已经接受了哪些检查？",
      "您能保证明天上班吗？"
    ],
    "patient": "我在国内通常会打点滴，输点“消炎药”，感觉好得快。这里也能这样吗？",
    "english": "In China, I usually get a drip with antibiotics and feel that I recover faster. By that medicine, I mean antibiotics, not painkillers. Could I have IV antibiotics here?",
    "keys": [
      "china",
      "drip|intravenous|\biv\b",
      "antibiotic",
      "not.*painkiller|not.*pain killer|rather than.*pain"
    ],
    "options": [
      "In China I usually get a drip with antibiotics and feel better faster. I mean antibiotics, not painkillers. Could I have IV antibiotics here?",
      "The patient definitely needs intravenous anti-inflammatory painkillers.",
      "The patient has already received antibiotics here."
    ]
  },
  {
    "en": "You can drink and do not appear dehydrated on examination, so I do not recommend a drip today. Antibiotics are unlikely to help a viral infection. Ask a pharmacist about suitable pain relief, tell them about your allergies and other medicines, and drink regularly and rest.",
    "zhQ": "检查时您能喝水，也没有明显脱水，所以今天不建议输液。抗生素对病毒感染不太有帮助。请咨询药师适合的止痛药，告知过敏史和其他用药，并注意饮水休息。",
    "qKeys": [
      "喝水|饮水",
      "脱水",
      "不建议|不推荐|不需要",
      "输液|点滴",
      "抗生素",
      "病毒",
      "药师|药剂师",
      "止痛",
      "过敏",
      "其他药|其他用药",
      "休息"
    ],
    "qOptions": [
      "能喝水且无明显脱水，今天不建议输液；抗生素对病毒感染不太有帮助。咨询药师适合的止痛药，告知过敏和其他用药，并饮水休息。",
      "退烧必须输液，不用告诉药师过敏史。",
      "医生要求立即用抗生素，并保证明天能上班。"
    ],
    "patient": "我担心请假会扣工资，主管也会不高兴。能帮我解释一下为什么需要休息吗？",
    "english": "I am worried about losing pay and upsetting my manager if I take time off. Could you help explain why I need to rest?",
    "keys": [
      "pay|wage|salary",
      "manager|supervisor|boss",
      "time off|leave|absence",
      "explain",
      "rest"
    ],
    "options": [
      "I worry about losing pay and upsetting my manager if I take time off. How can I explain my need to rest?",
      "I am not worried about work at all.",
      "Please promise that I will recover by tomorrow."
    ]
  },
  {
    "en": "If you develop a new rash with this fever and sore throat, contact your GP or NHS 111 promptly for advice. Do not simply wait for a routine appointment. If you have difficulty breathing or your lips or tongue swell, call 999 immediately. Do not wait to see me at a routine appointment.",
    "zhQ": "如果这次发热、咽痛后出现新的皮疹，请及时联系全科医生或NHS 111寻求建议，不要只是等普通预约。如果出现呼吸困难，或者嘴唇或舌头肿胀，请立即拨打999，不要等待普通预约再来见我。",
    "qKeys": [
      "皮疹|疹子|出疹",
      "及时|尽快|马上|立即",
      "全科|gp|医生",
      "111",
      "不.*等|不要.*等|不能.*等",
      "呼吸困难|喘不过气|气.*不够",
      "嘴唇|唇",
      "舌",
      "肿",
      "立即|马上|立刻",
      "999",
      "不要.*等|不.*等|不能.*等"
    ],
    "qOptions": [
      "出现新皮疹及时联系GP或111，不要等普通预约；呼吸困难或嘴唇、舌头肿胀时立即拨999。",
      "所有情况都等下周预约。",
      "任何轻微皮疹都立即拨999。"
    ],
    "patient": "明白了，我会根据这些症状及时求助。谢谢医生。",
    "english": "I understand. I will seek help promptly if I develop these symptoms. Thank you, doctor.",
    "keys": [
      "understand|got it",
      "help|advice",
      "promptly|right away|straight away|immediately|without delay",
      "symptom|sign"
    ],
    "options": [
      "I understand. I will seek help promptly if I develop these symptoms. Thank you, doctor.",
      "I will ignore any new symptoms.",
      "I will wait a month before seeking help."
    ]
  }
];
const feverModule=modules.find(m=>m.id==='fever');
const rawDripMessage=feverCase[4].patient;
const clarifiedDripMessage='我在国内通常会打点滴，感觉好得快。我说的“消炎药”是抗生素，不是止痛药。这里也能给我输抗生素吗？';
feverModule.title='发热与咽痛：精简问诊';
feverModule.intro='成年患者发热、咽痛两天，能饮水。你协助英国GP完成问诊，处理开药与输液期望、工作压力和安全告知。医生已在虚构情境中完成检查。患者的抱怨是个人表达，不代表英国医疗服务的普遍做法。';
feverModule.words=[['sore throat','咽痛'],['pain on swallowing','吞咽疼痛'],['shortness of breath','气短／呼吸困难'],['rash','皮疹'],['viral infection','病毒感染'],['antibiotics','抗生素'],['anti-inflammatory medicine','抗炎药'],['a drip / IV infusion','点滴／静脉输注'],['IV fluids','静脉补液'],['dehydration','脱水'],['pain relief','缓解疼痛／止痛药'],['pharmacist','药师'],['take time off work','请假休息'],['lose pay','被扣工资／损失收入'],['swollen lips or tongue','嘴唇或舌头肿胀'],['seek urgent help','寻求紧急帮助'],['safety-netting advice','病情变化时的求助指示']];
feverModule.turns=feverCase.map(t=>['Doctor',t.en,t.patient,t.english,t.keys,t.options,t.options[0]]);
doctorChinese.fever=feverCase.map(t=>[t.zhQ,t.qKeys,t.qOptions]);
feverCase.forEach((t,i)=>meaningGroups['fever:'+i]=[t.keys]);
sceneFilms.fever.headline='发热、咽痛与治疗期望';
sceneFilms.fever.tasks='7轮双向口译 · 3道译员反应题';
sceneFilms.fever.story='一位担心影响工作的患者来到GP诊室。除了症状，你还要传达她对开药、输液和请假的顾虑，并准确处理紧急求助指示。';
sceneFilms.fever.closing='Thank you. Please follow the advice we have discussed and seek help if your symptoms change.';

const reactionQuestions={
 '3:patient':{title:'患者抱怨不开药，还要上班',prompt:'患者说：“英国医生怎么都不开药呀？我还要上班呢！您能不能给我开点抗生素？”以下哪种译员反应最合适？',choices:[{text:'向医生完整传达患者的不满、工作顾虑和抗生素请求，保留第一人称，不代表自己赞同。',correct:true,why:'患者的情绪和工作压力都是沟通内容。完整传达，让医生回应；不替患者要求某种治疗，也不为了缓和气氛删掉抱怨。'},{text:'替医生向患者解释“英国都是这样的，您别抱怨”，不再翻译这段话。',why:'这会遗漏患者的顾虑，并让译员代替医生解释。应把患者真实想法传给医生。'},{text:'告诉医生“I agree with her. You must prescribe antibiotics.”',why:'这把患者的请求变成译员自己的主张，并额外施压，改变了原话的立场。'}]},
 '4:patient':{title:'“消炎药”究竟指什么？',prompt:'患者提出打点滴，并说要输“消炎药”。你不能确定她指抗生素还是止痛抗炎药。你会怎样处理？',clarifies:true,choices:[{text:'透明说明需要澄清，询问患者“您指抗生素，还是止痛抗炎药？”，再向医生传达澄清后的意思。',correct:true,why:'“消炎药”在日常口语中可能含义不明确。不要直接猜成antibiotics或anti-inflammatory medicine。医生也应知道译员正在作术语澄清。'},{text:'直接译成anti-inflammatory painkillers，避免打断问诊。',why:'可能把患者的抗生素请求译错。效率不能替代必要的澄清。'},{text:'直接告诉医生“The patient needs IV antibiotics.”',why:'既猜测了药物类别，又把患者的期望改成了临床需要；译员不能替医护判断输液适应证。'}]},
 '6:doctor':{title:'紧急求助指示能否简化？',prompt:'医生说出现呼吸困难，或嘴唇、舌头肿胀时立即拨999，不要等普通预约。以下哪种转达最合适？',choices:[{text:'“如果呼吸困难，或嘴唇、舌头肿胀，请立即拨999，不要等普通预约。”',correct:true,why:'保留具体危险症状、立即行动和999，不能统一简化为“有问题下次再来”。同一话轮还须准确传达新皮疹应联系GP／111的指示。'},{text:'“如果之后不舒服，再约医生来看就行。”',why:'这会删掉紧急程度和行动指示，可能让患者误以为可以等普通预约。'},{text:'“以后只要起一点皮疹，就必须立刻打999。”',why:'这把同一话轮中针对新皮疹的GP／111建议与当前紧急指示混为一谈，扩大了原话范围。'}]}
};
let completedDecisions=new Set(),activeDecision=null,decisionOrder=[],decisionCorrect=false;
const enhancedStart=start;
start=function(){completedDecisions=new Set();activeDecision=null;decisionCorrect=false;feverModule.turns[4][2]=rawDripMessage;enhancedStart()};
const enhancedOpen=openTranslation;
openTranslation=function(){const key=turn+':'+segment;if(current.id==='fever'&&reactionQuestions[key]&&!completedDecisions.has(key)){showReaction(key);return}enhancedOpen()};
function showReaction(key){activeDecision=key;decisionCorrect=false;const q=reactionQuestions[key];decisionOrder=q.choices.map((c,i)=>i);for(let i=decisionOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[decisionOrder[i],decisionOrder[j]]=[decisionOrder[j],decisionOrder[i]]}conversationPhase='roleDecision';document.getElementById('turn-prompt').hidden=false;document.getElementById('response-content').hidden=true;document.getElementById('doctor-controls').innerHTML='<span class="note">请先完成右侧译员反应题，再继续口译。</span>';document.getElementById('live-status').textContent='译员反应判断 · 三选一';document.getElementById('turn-prompt').innerHTML='<div class="eyebrow">INTERPRETER DECISION · 译员反应题</div><h2 style="margin-top:16px">'+q.title+'</h2><p>'+q.prompt+'</p><div class="reaction-options">'+decisionOrder.map((i,n)=>'<button class="option" onclick="chooseReaction('+n+')">'+String.fromCharCode(65+n)+'　'+esc(q.choices[i].text)+'</button>').join('')+'</div><div id="reaction-feedback" aria-live="polite"></div><button id="reaction-next" class="primary" onclick="continueReaction()" hidden>理解了，继续口译 →</button>'}
function chooseReaction(n){if(conversationPhase!=='roleDecision'||decisionCorrect)return;const q=reactionQuestions[activeDecision],c=q.choices[decisionOrder[n]];decisionCorrect=!!c.correct;const f=document.getElementById('reaction-feedback');f.className='feedback '+(decisionCorrect?'good':'bad');f.innerHTML=(decisionCorrect?'✓ 这个选择更合适。':'请再想一想。')+'<br>'+esc(c.why);document.getElementById('reaction-next').hidden=!decisionCorrect}
function continueReaction(){if(conversationPhase!=='roleDecision'||!decisionCorrect)return;const q=reactionQuestions[activeDecision];completedDecisions.add(activeDecision);if(q.clarifies){feverModule.turns[4][2]=clarifiedDripMessage;document.getElementById('audio-message').textContent='译员透明说明后作了术语澄清。患者补充如下，请听完再译。';conversationPhase='ready';playSource(false)}else enhancedOpen()}
const enhancedEvaluate=evaluateAnswer;
evaluateAnswer=function(id,index,input){if(id!=='fever')return enhancedEvaluate(id,index,input);const t=normalizeAnswer(input);if(!feverCase[index].keys.every(k=>new RegExp(k,'i').test(t)))return false;const wrong=(index===1&&(/i (?:have|am having) (?:shortness of breath|a rash)/.test(t)||/cannot drink|can t drink/.test(t)))||(index===2&&/not allergic|no (?:known )?allerg/.test(t))||(index===6&&/not call 999|do not call 999|wait for.*routine/.test(t)&&!/not wait|without waiting/.test(t));return !wrong};
const enhancedRender=renderScene;
renderScene=function(){enhancedRender();if(current.id==='fever'){const h=document.querySelector('.scene-top h2');if(h)h.textContent='精简问诊 · '+(turn+1)+' / '+current.turns.length+'轮';const p=document.querySelector('.scene-top .pill');if(p)p.textContent='双向口译 · '+completedDecisions.size+'/3 反应题完成'}};
advance=function(){if(conversationPhase!=='feedback')return;turn++;if(turn<current.turns.length){renderScene();beginQuestion()}else finish()};
const enhancedHome=home;
home=function(){enhancedHome();const cards=document.querySelectorAll('.cards .card');const card=cards[2];if(card){const bottom=card.querySelector('.card-bottom span');if(bottom)bottom.textContent='7轮对话 · 3道译员反应题'}const hero=document.querySelector('.hero');if(hero)hero.insertAdjacentHTML('afterend','<div class="scene-gallery-bar"><div><strong>新增：发热与咽痛精简问诊</strong><p>打点滴与抗生素期望、工作顾虑、安全告知和3道译员反应题。</p></div><button class="primary" onclick="vocab(2)">直接进入扩展关卡 →</button></div>')};
const enhancedFinish=finish;
finish=function(){enhancedFinish();if(current.id==='fever'){const c=document.querySelector('.complete');if(c)c.insertAdjacentHTML('afterbegin','<div class="callout">已完成7轮双向口译与'+completedDecisions.size+'道译员反应题。情境选择反映本例中的沟通原则，不替代专业判断。</div>');const review=document.querySelector('.complete .sub');if(review)review.textContent='发热与咽痛精简问诊：症状、输液期望、工作压力与安全告知。'}};
sources=function(){modal('<h2>扩展脚本的依据</h2><p>病例、医患台词和选项为原创教学材料。普通发热咽痛不自动等于需要抗生素或输液。是否用药或输液由临床人员评估，本例中的医生已完成虚构检查。</p><p>出现新皮疹应及时联系GP／111。呼吸困难、嘴唇或舌头肿胀须紧急求助，不应等普通预约。</p><p><a href="https://www.nhs.uk/symptoms/sore-throat/" target="_blank" rel="noopener">NHS：Sore throat</a><br><a href="https://www.nhs.uk/conditions/scarlet-fever/" target="_blank" rel="noopener">NHS：Scarlet fever</a><br><a href="https://www.nhs.uk/conditions/anaphylaxis/" target="_blank" rel="noopener">NHS：Anaphylaxis</a><br><a href="https://www.rightdecisions.scot.nhs.uk/nhs-borders-clinical-guidelines/drugs-and-therapeutics/guidance-for-intravenous-fluid-and-electrolyte-prescription-in-adults/" target="_blank" rel="noopener">NHS Borders：成人静脉补液评估原则</a><br><a href="https://www.ncihc.org/ncihc-national-code-of-ethics" target="_blank" rel="noopener">NCIHC：医疗口译伦理（作为教学参考，非英国法规）</a></p><p class="note">脚本尚待临床与医疗口译专家审校。游戏是语言练习，不作诊断或用药指导。</p>')};
home();

