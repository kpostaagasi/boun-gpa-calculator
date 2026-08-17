import { registerViewInit } from './ui.js';
import { registerViewRefresh, t } from './i18n.js';
import { loadModule, saveModule, registerAppKey, uid } from './store.js';
import { scheduleHasOverlap, isValidScheduleBlock } from './boun-gpa-utils.js';
import { escapeHtml } from './grades.js';

const NS = 'schedule'; registerAppKey(NS);
let data = loadModule(NS); data.courses = Array.isArray(data.courses) ? data.courses : [];
const days = ['mon','tue','wed','thu','fri','sat','sun'];
const validColor = value => /^#[0-9a-f]{6}$/i.test(String(value)) ? value : '#2e6a8f';
const persist = () => saveModule(NS, data);
function render() {
  const root=document.getElementById('scheduleView'); if(!root)return;
  data=loadModule(NS); data.courses = Array.isArray(data.courses) ? data.courses.filter(c => c && typeof c === 'object' && (typeof c.id === 'string' || typeof c.id === 'number') && Array.isArray(c.blocks)) : [];
  const courses = data.courses.map(c => ({ ...c, blocks: c.blocks.filter(isValidScheduleBlock) }));
  const visibleDays = data.showSaturday ? days : days.slice(0, 5);
  const dayMarkup=(d,i)=>`<div class="schedule-day" data-day="${i}"><h3>${t('day.'+d)}</h3><div class="schedule-slots">${courses.flatMap(c=>c.blocks.filter(b=>b.day===i).map(b=>`<article class="schedule-block" style="--block-color:${validColor(c.color)}"><strong>${escapeHtml(c.code||c.name)}</strong><span>${escapeHtml(c.name||'')}</span><small>${escapeHtml(b.start)}–${escapeHtml(b.end)}${b.location?' · '+escapeHtml(b.location):''}</small><button class="icon-action" data-action="edit" data-id="${escapeHtml(c.id)}" aria-label="${escapeHtml(t('common.edit'))}">${escapeHtml(t('common.edit'))}</button></article>`)).join('')}</div></div>`;
  root.innerHTML=`<section class="module-shell"><div class="module-heading"><div><p class="eyebrow">BOUN GPA CALCULATOR</p><h2>${t('schedule.title')}</h2><p>${t('schedule.desc')}</p></div><button class="btn btn-primary" data-action="add">${t('schedule.addCourse')}</button></div><div class="schedule-toolbar"><label><input type="checkbox" id="scheduleSaturday" ${data.showSaturday?'checked':''}> ${t('schedule.showSaturday')}</label>${scheduleHasOverlap(courses)?`<span class="schedule-warning">${t('schedule.overlap')}</span>`:''}</div><div class="schedule-grid ${data.showSaturday?'show-weekend':''}">${visibleDays.map(dayMarkup).join('')}</div>${!courses.length?`<div class="empty-state"><h3>${t('schedule.empty')}</h3><p>${t('schedule.emptyDesc')}</p></div>`:''}</section>`;
 root.querySelector('[data-action="add"]')?.addEventListener('click',()=>editCourse());
 root.querySelector('#scheduleSaturday')?.addEventListener('change',e=>{data.showSaturday=e.target.checked;persist();render();});
 root.querySelectorAll('[data-action="edit"]').forEach(b=>b.addEventListener('click',()=>editCourse(b.dataset.id)));
}
function editCourse(id) {
 const old=data.courses.find(c=>c.id===id)||{id:uid(),name:'',code:'',color:'#2e6a8f',blocks:[{day:0,start:'09:00',end:'10:00',location:''}]};
 const name=prompt(t('schedule.name'),old.name); if(name===null)return; const code=prompt(t('schedule.code'),old.code)||'';
 const block={...(old.blocks?.[0]||{day:0,start:'09:00',end:'10:00',location:''})}; const day=prompt(t('schedule.day')+' (0 Mon – 6 Sun)',String(block.day)); if(day===null)return;
 if(!/^[0-6]$/.test(day)) return alert(t('alert.importError'));
 block.day=Number(day); block.start=prompt(t('schedule.start'),block.start)||block.start; block.end=prompt(t('schedule.end'),block.end)||block.end; block.location=prompt(t('schedule.location'),block.location)||'';
 if(!isValidScheduleBlock(block)) return alert(t('alert.importError'));
 const course={...old,name,code,color:validColor(old.color),blocks:[block,...(old.blocks||[]).slice(1)]}; const index=data.courses.findIndex(c=>c.id===id); if(index<0)data.courses.push(course);else data.courses[index]=course; persist();render();
}
function init(){render();}
registerViewInit('schedule',init); registerViewRefresh('schedule',render);
