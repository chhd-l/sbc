/**
 * Created by feitingting on 2017/6/20.
 */
 import { Action, Actor, IMap } from 'plume2';

 export default class LeafletActor extends Actor {
   defaultState() {
     return {
       // 满赠规则数据
       leafletLevelList: [],
       leafletList: []
     };
   }
 
   constructor() {
     super();
   }
 
   @Action('leafletActor:init')
   init(state: IMap, data) {
     return state.merge(data);
   }
 }
 