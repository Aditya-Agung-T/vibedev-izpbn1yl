/**
 * @typedef {'want'|'played'} GameStatus
 * @typedef {{id:string,name:string,minPlayers:number,maxPlayers:number,playMinutes:number,rating:number,tags:string[],status:GameStatus,createdAt:number,updatedAt:number}} Game
 */
export const statuses=new Set(['want','played']);
const integer=(v,min,max)=>Number.isInteger(Number(v))&&Number(v)>=min&&(max===undefined||Number(v)<=max);
export function validateGame(x={}){const e=[];if(typeof x.name!=='string'||!x.name.trim())e.push('Name is required');else if(x.name.trim().length>80)e.push('Name must be 80 characters or fewer');if(!integer(x.minPlayers,1,99))e.push('Minimum players must be 1-99');if(!integer(x.maxPlayers,1,99))e.push('Maximum players must be 1-99');if(integer(x.minPlayers,1,99)&&integer(x.maxPlayers,1,99)&&Number(x.maxPlayers)<Number(x.minPlayers))e.push('Maximum players must not be lower');if(!integer(x.playMinutes,1,1440))e.push('Play time must be 1-1440 minutes');if(!integer(x.rating,1,5))e.push('Rating must be 1-5');if(!statuses.has(x.status))e.push('Choose a status');const tags=normalizeTags(x.tags);if(tags.some(t=>t.length>24))e.push('Tags must be 24 characters or fewer');return e}
export function normalizeTags(v){return [...new Set((Array.isArray(v)?v:String(v??'').split(',')).map(s=>String(s).trim().toLowerCase()).filter(Boolean))]}
export function normalizeGame(x,id){const now=Date.now();return {id:id||globalThis.crypto?.randomUUID?.()||`${now}-${Math.random()}`,name:String(x.name??'').trim(),minPlayers:+x.minPlayers,maxPlayers:+x.maxPlayers,playMinutes:+x.playMinutes,rating:+x.rating,tags:normalizeTags(x.tags),status:x.status,createdAt:Number.isFinite(+x.createdAt)&&+x.createdAt>0?+x.createdAt:now,updatedAt:now}}
export function addGame(xs,g){return [...xs,g]}
export function updateGame(xs,id,p){return xs.map(x=>x.id===id?normalizeGame({...x,...p},id):x)}
export function deleteGame(xs,id){return xs.filter(x=>x.id!==id)}
export function filterGames(xs,{query='',tag='all',status='all'}={}){query=String(query).trim().toLowerCase();return xs.filter(x=>(!query||x.name.toLowerCase().includes(query))&&(tag==='all'||x.tags.includes(tag))&&(status==='all'||x.status===status))}
export function getEligibleGames(xs,n){n=Number(n);return Number.isInteger(n)&&n>=1?xs.filter(x=>x.status==='want'&&x.minPlayers<=n&&x.maxPlayers>=n):[]}
export function pickRandom(xs,n,rng=Math.random){const a=getEligibleGames(xs,n);if(!a.length)return null;const r=Number(rng());return a[Math.min(a.length-1,Math.max(0,Math.floor((Number.isFinite(r)?r:0)*a.length)))]}
export function collectTags(xs){return [...new Set(xs.flatMap(x=>x.tags))].sort()}
export function isGame(x){return !!x&&typeof x.id==='string'&&!!x.id&&typeof x.name==='string'&&validateGame(x).length===0&&Array.isArray(x.tags)&&normalizeTags(x.tags).length===x.tags.length&&x.tags.every(t=>typeof t==='string'&&t.length<=24)&&Number.isFinite(x.createdAt)&&x.createdAt>0&&Number.isFinite(x.updatedAt)&&x.updatedAt>0}
export function validState(x){return !!x&&x.version===1&&Array.isArray(x.games)&&x.games.every(isGame)}
export const emptyState=()=>({version:1,games:[]});
export const stateError=error=>({ok:false,error,games:[],version:1});
export const statusesList=['want','played'];
