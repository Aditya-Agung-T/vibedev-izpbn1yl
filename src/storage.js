import {emptyState,validState,stateError} from './model.js';
export const KEY='board-game-night-planner:v1';
export function loadState(storage){try{const raw=storage.getItem(KEY);if(raw===null)return {ok:true,...emptyState()};const data=JSON.parse(raw);return validState(data)?{ok:true,...data}:stateError('Saved collection is invalid. Use Reset local collection to recover.')}catch(e){return stateError('Saved collection could not be read. Use Reset local collection to recover.')}}
export function saveState(storage,state){try{storage.setItem(KEY,JSON.stringify({version:1,games:state.games}));return {ok:true}}catch(e){return {ok:false,error:'Latest change could not be persisted.'}}}
export function resetState(storage){try{storage.removeItem(KEY);return {ok:true}}catch(e){return {ok:false,error:'Collection could not be reset.'}}}
