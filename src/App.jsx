import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ════════════════════════════════════════════════════════
// FIREBASE CONFIG — เปลี่ยนค่าให้ตรงกับ Firebase project ของคุณ
// ════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "AIzaSyCmbRpZUC88ot0Ek5iPY_6HX3t9k12y9M8",
  authDomain:        "hrsg-fab-tracker.firebaseapp.com",
  projectId:         "hrsg-fab-tracker",
  storageBucket:     "hrsg-fab-tracker.appspot.com",
  messagingSenderId: "496528430726",
  appId:             "1:496528430726:web:518249181a606879cea307",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
// ════════════════════════════════════════════════════════
// INITIAL DATA (from documents)
// ════════════════════════════════════════════════════════
const INIT_FINNED_TUBE = [
{ id:"ft1", boxNo:"Box 6", item:"MT33", od:"31.8", thk:"2.7", material:"SA-192", length:"24892", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"2508", actualQty:"2508", planPct:20, actualPct:100, mcNo:"MC 1,2,3,4", duration:"21", start:"2025-12-05", finish:"2026-01-22" },
  { id:"ft3", boxNo:"Box 5", item:"MT33", od:"31.8", thk:"2.7", material:"SA-192", length:"24892", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"444", actualQty:"444", planPct:4, actualPct:100, mcNo:"MC 1,4", duration:"4", start:"2026-01-31", finish:"2026-02-04" },
  { id:"ft5", boxNo:"Box 5", item:"MT32", od:"31.8", thk:"2.7", material:"SA-192", length:"24748", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"111", actualQty:"111", planPct:1, actualPct:100, mcNo:"MC1", duration:"2", start:"2026-02-05", finish:"2026-02-06" },
  { id:"ft7", boxNo:"Box 5", item:"MT31", od:"31.8", thk:"2.7", material:"SA-192", length:"24790", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"222", actualQty:"222", planPct:2, actualPct:100, mcNo:"MC2", duration:"4", start:"2026-02-05", finish:"2026-02-09" },
  { id:"ft9", boxNo:"Box 5", item:"MT30", od:"31.8", thk:"2.7", material:"SA-192", length:"24880", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"105", actualQty:"8", planPct:1, actualPct:8, mcNo:"MC3", duration:"2", start:"2026-02-05", finish:"2026-02-06" },
  { id:"ft11", boxNo:"Box 5", item:"MT29", od:"31.8", thk:"2.7", material:"SA-192", length:"24800", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"222", actualQty:"104", planPct:2, actualPct:47, mcNo:"MC4", duration:"4", start:"2026-02-05", finish:"2026-02-09" },
  { id:"ft13", boxNo:"Box 5", item:"MT28", od:"31.8", thk:"2.7", material:"SA-192", length:"24754", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"222", actualQty:"0", planPct:2, actualPct:0, mcNo:"MC1", duration:"4", start:"2026-02-07", finish:"2026-02-11" },
  { id:"ft15", boxNo:"Box 5", item:"MT27", od:"31.8", thk:"2.7", material:"SA-192", length:"24802", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"111", actualQty:"111", planPct:1, actualPct:100, mcNo:"MC2", duration:"2", start:"2026-02-10", finish:"2026-02-11" },
  { id:"ft17", boxNo:"Box 5", item:"MT26", od:"31.8", thk:"2.7", material:"SA-192", length:"24838", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"222", actualQty:"222", planPct:2, actualPct:100, mcNo:"MC3", duration:"4", start:"2026-02-10", finish:"2026-02-13" },
  { id:"ft19", boxNo:"Box 5", item:"MT23", od:"31.8", thk:"2.7", material:"SA-192", length:"24892", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"420", actualQty:"420", planPct:3, actualPct:100, mcNo:"MC2,3", duration:"4", start:"2026-01-31", finish:"2026-02-04" },
  { id:"ft21", boxNo:"Box 5", item:"MT22", od:"31.8", thk:"2.7", material:"SA-192", length:"24802", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"105", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC2", duration:"2", start:"2026-02-12", finish:"2026-02-13" },
  { id:"ft23", boxNo:"Box 5", item:"MT21", od:"31.8", thk:"2.7", material:"SA-192", length:"24838", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"210", actualQty:"0", planPct:2, actualPct:0, mcNo:"MC1", duration:"4", start:"2026-02-23", finish:"2026-02-26" },
  { id:"ft25", boxNo:"Box 4", item:"MT30", od:"31.8", thk:"2.7", material:"SA-192", length:"24880", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"105", actualQty:"45", planPct:1, actualPct:43, mcNo:"MC3", duration:"2", start:"2026-02-07", finish:"2026-02-09" },
  { id:"ft27", boxNo:"Box 4", item:"MT29", od:"31.8", thk:"2.7", material:"SA-192", length:"24800", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"210", actualQty:"0", planPct:2, actualPct:0, mcNo:"MC4", duration:"4", start:"2026-02-10", finish:"2026-02-13" },
  { id:"ft29", boxNo:"Box 4", item:"MT28", od:"31.8", thk:"2.7", material:"SA-192", length:"24754", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"210", actualQty:"0", planPct:2, actualPct:0, mcNo:"MC4", duration:"4", start:"2026-02-24", finish:"2026-02-27" },
  { id:"ft31", boxNo:"Box 4", item:"MT27", od:"31.8", thk:"2.7", material:"SA-192", length:"24802", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"210", actualQty:"210", planPct:2, actualPct:100, mcNo:"MC3", duration:"4", start:"2026-02-23", finish:"2026-02-26" },
  { id:"ft33", boxNo:"Box 4", item:"MT26", od:"31.8", thk:"2.7", material:"SA-192", length:"24838", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"420", actualQty:"420", planPct:3, actualPct:100, mcNo:"MC2", duration:"8", start:"2026-02-23", finish:"2026-03-03" },
  { id:"ft35", boxNo:"Box 4", item:"MT23", od:"31.8", thk:"2.7", material:"SA-192", length:"24892", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"1260", actualQty:"1260", planPct:10, actualPct:100, mcNo:"MC3,4", duration:"13", start:"2026-02-27", finish:"2026-03-13" },
  { id:"ft37", boxNo:"Box 3", item:"MT25", od:"44.5", thk:"2.7", material:"SA-192", length:"24824", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"197", ftype:"SERRATED", unit:"0", planQty:"174", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC4", duration:"4", start:"2026-03-14", finish:"2026-03-18" },
  { id:"ft39", boxNo:"Box 3", item:"MT24", od:"44.5", thk:"2.7", material:"SA-192", length:"24772", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"197", ftype:"SERRATED", unit:"0", planQty:"138", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC4", duration:"3", start:"2026-03-19", finish:"2026-03-21" },
  { id:"ft41", boxNo:"Box 3", item:"MT23", od:"31.8", thk:"2.7", material:"SA-192", length:"24892", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"1050", actualQty:"1050", planPct:9, actualPct:100, mcNo:"MC2,3", duration:"11", start:"2026-03-17", finish:"2026-03-28" },
  { id:"ft43", boxNo:"Box 3", item:"MT22", od:"31.8", thk:"2.7", material:"SA-192", length:"24802", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"111", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC4", duration:"3", start:"2026-03-23", finish:"2026-03-25" },
  { id:"ft45", boxNo:"Box 3", item:"MT21", od:"31.8", thk:"2.7", material:"SA-192", length:"24838", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"307", ftype:"SERRATED", unit:"0", planQty:"222", actualQty:"0", planPct:2, actualPct:0, mcNo:"MC4", duration:"5", start:"2026-03-26", finish:"2026-03-31" },
  { id:"ft47", boxNo:"Box 3", item:"MT20", od:"31.8", thk:"2.7", material:"SA-192", length:"24802", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"276", ftype:"SERRATED", unit:"0", planQty:"222", actualQty:"0", planPct:2, actualPct:0, mcNo:"MC2", duration:"5", start:"2026-03-30", finish:"2026-04-03" },
  { id:"ft49", boxNo:"Box 3", item:"MT19", od:"31.8", thk:"2.7", material:"SA-192", length:"24838", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"276", ftype:"SERRATED", unit:"0", planQty:"444", actualQty:"0", planPct:4, actualPct:0, mcNo:"MC34", duration:"6", start:"2026-03-30", finish:"2026-04-04" },
  { id:"ft51", boxNo:"Box 2", item:"MT18", od:"31.8", thk:"2.7", material:"SA-192", length:"24802", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"197", ftype:"SERRATED", unit:"0", planQty:"111", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC1", duration:"3", start:"2026-02-28", finish:"2026-03-03" },
  { id:"ft53", boxNo:"Box 2", item:"MT17", od:"31.8", thk:"2.7", material:"SA-192", length:"24838", h:"12.7", t:"0.8", finMaterial:"A1008", finM:"197", ftype:"SERRATED", unit:"0", planQty:"222", actualQty:"0", planPct:2, actualPct:0, mcNo:"MC1", duration:"5", start:"2026-03-04", finish:"2026-03-09" },
  { id:"ft55", boxNo:"Box 2", item:"MT16", od:"31.8", thk:"2.7", material:"SA-192", length:"24802", h:"8", t:"0.8", finMaterial:"A1008", finM:"157", ftype:"SOLID", unit:"0", planQty:"111", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC2", duration:"3", start:"2026-03-04", finish:"2026-03-06" },
  { id:"ft57", boxNo:"Box 2", item:"MT15", od:"31.8", thk:"2.7", material:"SA-192", length:"24838", h:"8", t:"0.8", finMaterial:"A1008", finM:"157", ftype:"SOLID", unit:"0", planQty:"222", actualQty:"0", planPct:2, actualPct:0, mcNo:"MC2", duration:"5", start:"2026-03-07", finish:"2026-03-12" },
  { id:"ft59", boxNo:"Box 2", item:"MT14", od:"31.8", thk:"2.7", material:"SA-192", length:"24802", h:"8", t:"0.8", finMaterial:"A1008", finM:"79", ftype:"SOLID", unit:"0", planQty:"111", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC2", duration:"2", start:"2026-03-13", finish:"2026-03-14" },
  { id:"ft61", boxNo:"Box 2", item:"MT13", od:"31.8", thk:"2.7", material:"SA-192", length:"24838", h:"8", t:"0.8", finMaterial:"A1008", finM:"79", ftype:"SOLID", unit:"0", planQty:"222", actualQty:"194", planPct:2, actualPct:87, mcNo:"MC2", duration:"9", start:"2025-12-24", finish:"2026-03-16" },
  { id:"ft63", boxNo:"Box 2", item:"MT12", od:"38.1", thk:"3.5", material:"SA-231 T22", length:"24824", h:"12.7", t:"0.8", finMaterial:"T-409", finM:"276", ftype:"SERRATED", unit:"0", planQty:"222", actualQty:"222", planPct:2, actualPct:100, mcNo:"MC1", duration:"7", start:"2026-01-03", finish:"2026-01-10" },
  { id:"ft65", boxNo:"Box 2", item:"MT11", od:"57.2", thk:"3", material:"SA-213 T91", length:"24726", h:"8", t:"0.8", finMaterial:"T-409", finM:"146", ftype:"SOLID", unit:"0", planQty:"156", actualQty:"16", planPct:1, actualPct:10, mcNo:"MC1", duration:"6", start:"2026-03-10", finish:"2026-03-16" },
  { id:"ft67", boxNo:"Box 2", item:"MT10", od:"57.2", thk:"3", material:"SA-213 T91", length:"24726", h:"8", t:"0.8", finMaterial:"T-409", finM:"79", ftype:"SOLID", unit:"0", planQty:"156", actualQty:"156", planPct:1, actualPct:100, mcNo:"MC1", duration:"4", start:"2026-03-17", finish:"2026-03-20" },
  { id:"ft69", boxNo:"Box 2", item:"MT09", od:"44.5", thk:"8.5", material:"SA-213 T91", length:"24870", h:"8", t:"0.8", finMaterial:"T-409", finM:"138", ftype:"SOLID", unit:"0", planQty:"168", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC1", duration:"6", start:"2026-03-21", finish:"2026-03-27" },
  { id:"ft71", boxNo:"Box 2", item:"MT08", od:"44.5", thk:"8.5", material:"SA-213 T91", length:"24870", h:"8", t:"0.8", finMaterial:"T-409", finM:"83", ftype:"SOLID", unit:"0", planQty:"168", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC1", duration:"5", start:"2026-03-28", finish:"2026-04-02" },
  { id:"ft73", boxNo:"Box 1", item:"MT06", od:"44.5", thk:"5.5", material:"SA-213 T91", length:"23956", h:"8", t:"0.8", finMaterial:"T-409", finM:"228", ftype:"SOLID", unit:"0", planQty:"108", actualQty:"108", planPct:1, actualPct:100, mcNo:"MC1", duration:"5", start:"2026-01-03", finish:"2026-01-08" },
  { id:"ft75", boxNo:"Box 1", item:"MT05", od:"44.5", thk:"5.5", material:"SA-213 T91", length:"23956", h:"8", t:"0.8", finMaterial:"T-409", finM:"165", ftype:"SOLID", unit:"0", planQty:"108", actualQty:"108", planPct:1, actualPct:100, mcNo:"MC1", duration:"5", start:"2026-01-03", finish:"2026-01-08" },
  { id:"ft77", boxNo:"Box 1", item:"MT04", od:"57.2", thk:"3", material:"SA-213 T91", length:"23812", h:"12.7", t:"0.8", finMaterial:"T-409", finM:"272", ftype:"SERRATED", unit:"0", planQty:"168", actualQty:"168", planPct:1, actualPct:100, mcNo:"MC1", duration:"7", start:"2026-01-16", finish:"2026-04-03" },
  { id:"ft79", boxNo:"Box 1", item:"MT03", od:"57.2", thk:"3", material:"SA-213 T91", length:"23812", h:"8", t:"0.8", finMaterial:"T-409", finM:"169", ftype:"SOLID", unit:"0", planQty:"168", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC1", duration:"6", start:"2026-04-04", finish:"2026-04-10" },
  { id:"ft81", boxNo:"Box 1", item:"MT02", od:"44.5", thk:"6.9", material:"SA-213 T91", length:"23956", h:"8", t:"0.8", finMaterial:"T-409", finM:"110", ftype:"SOLID", unit:"0", planQty:"96", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC3", duration:"4", start:"2026-04-06", finish:"2026-04-09" },
  { id:"ft83", boxNo:"Box 1", item:"MT01", od:"44.5", thk:"6.9", material:"SA-213 T91", length:"23956", h:"8", t:"0.8", finMaterial:"T-409", finM:"91", ftype:"SOLID", unit:"0", planQty:"96", actualQty:"0", planPct:1, actualPct:0, mcNo:"MC2", duration:"4", start:"2026-04-04", finish:"2026-04-08" },
];

const INIT_HEADER_DRILL = [
  { id:"hdg1", groupName:"BOX 1", start:"", finish:"", headers:[
    { id:"hd1",  harpNo:"HPSH4", headerNo:"MH11", dimension:"Pipe Ø168.3x28.58", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd2",  harpNo:"HPSH4", headerNo:"MH12", dimension:"Pipe Ø168.3x31.75", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd3",  harpNo:"HPSH3", headerNo:"MH09", dimension:"Pipe Ø168.3x28.58", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd4",  harpNo:"HPSH3", headerNo:"MH10", dimension:"Pipe Ø168.3x31.75", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd5",  harpNo:"HPSH2", headerNo:"MH03", dimension:"Pipe Ø168.3x34.93", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd6",  harpNo:"HPSH2", headerNo:"MH04", dimension:"Pipe Ø168.3x28.58", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd7",  harpNo:"HPSH1", headerNo:"MH01", dimension:"Pipe Ø168.3x34.93", material:"SA335-P91-TP2",cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd8",  harpNo:"HPSH1", headerNo:"MH02", dimension:"Pipe Ø168.3x28.58", material:"SA335-P91-TP2",cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd9",  harpNo:"RHTR2", headerNo:"MH07", dimension:"Pipe Ø323.8x28.58", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd10", harpNo:"RHTR2", headerNo:"MH08", dimension:"Pipe Ø323.8x17.48", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd11", harpNo:"RHTR1", headerNo:"MH05", dimension:"Pipe Ø323.8x28.58", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd12", harpNo:"RHTR1", headerNo:"MH06", dimension:"Pipe Ø323.8x17.48", material:"SA335-P91",   cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
  ]},
  { id:"hdg2", groupName:"BOX 2", start:"", finish:"", headers:[
    { id:"hd13", harpNo:"HPEV4", headerNo:"MH29", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C",  cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd14", harpNo:"HPEV4", headerNo:"MH30", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C",  cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd15", harpNo:"HPEV3", headerNo:"MH27", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C",  cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd16", harpNo:"HPEV3", headerNo:"MH28", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C",  cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd17", harpNo:"HPEV2", headerNo:"MH25", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C",  cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd18", harpNo:"HPEV2", headerNo:"MH26", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C",  cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd19", harpNo:"HPEV1", headerNo:"MH13", dimension:"Pipe Ø219.1x31.75", material:"SA-106 GR.C",  cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd20", harpNo:"HPEV1", headerNo:"MH14", dimension:"Pipe Ø219.1x31.75", material:"SA-106 GR.C",  cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd21", harpNo:"HPSH7", headerNo:"MH23", dimension:"Pipe Ø219.1x31.75", material:"SA335-P22",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd22", harpNo:"HPSH7", headerNo:"MH24", dimension:"Pipe Ø219.1x31.75", material:"SA335-P22",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd23", harpNo:"HPSH6", headerNo:"MH17", dimension:"Pipe Ø168.3x31.75", material:"SA335-P91",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd24", harpNo:"HPSH6", headerNo:"MH18", dimension:"Pipe Ø168.3x18.26", material:"SA335-P91",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd25", harpNo:"HPSH5", headerNo:"MH15", dimension:"Pipe Ø168.3x31.75", material:"SA335-P91",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd26", harpNo:"HPSH5", headerNo:"MH16", dimension:"Pipe Ø168.3x18.26", material:"SA335-P91",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd27", harpNo:"RHTR4", headerNo:"MH21", dimension:"Pipe Ø323.8x14.27", material:"SA335-P91",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd28", harpNo:"RHTR4", headerNo:"MH22", dimension:"Pipe Ø323.8x14.27", material:"SA335-P91",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd29", harpNo:"RHTR3", headerNo:"MH19", dimension:"Pipe Ø323.8x14.27", material:"SA335-P91",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd30", harpNo:"RHTR3", headerNo:"MH20", dimension:"Pipe Ø323.8x14.27", material:"SA335-P91",    cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
  ]},
  { id:"hdg3", groupName:"BOX 3", start:"", finish:"", headers:[
    { id:"hd31", harpNo:"HPEC5",  headerNo:"MH49", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd32", harpNo:"HPEC5",  headerNo:"MH50", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd33", harpNo:"HPEC4",  headerNo:"MH47", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd34", harpNo:"HPEC4",  headerNo:"MH48", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd35", harpNo:"HPEC3",  headerNo:"MH45", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd36", harpNo:"HPEC3",  headerNo:"MH46", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd37", harpNo:"HPEC2",  headerNo:"MH39", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd38", harpNo:"HPEC2",  headerNo:"MH40", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd39", harpNo:"HPEC1",  headerNo:"MH37", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd40", harpNo:"HPEC1",  headerNo:"MH38", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd41", harpNo:"IPSH1",  headerNo:"MH43", dimension:"Pipe Ø219.1x12.7",  material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd42", harpNo:"IPSH1",  headerNo:"MH44", dimension:"Pipe Ø219.1x12.7",  material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd43", harpNo:"LPSH1",  headerNo:"MH41", dimension:"Pipe Ø273x12.7",    material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd44", harpNo:"LPSH1",  headerNo:"MH42", dimension:"Pipe Ø273x12.7",    material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd45", harpNo:"HPEV7",  headerNo:"MH35", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd46", harpNo:"HPEV7",  headerNo:"MH36", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd47", harpNo:"HPEV6",  headerNo:"MH33", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd48", harpNo:"HPEV6",  headerNo:"MH34", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd49", harpNo:"HPEV5",  headerNo:"MH31", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd50", harpNo:"HPEV5",  headerNo:"MH32", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
  ]},
  { id:"hdg4", groupName:"BOX 4", start:"", finish:"", headers:[
    { id:"hd51", harpNo:"HPEC11", headerNo:"MH69", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd52", harpNo:"HPEC11", headerNo:"MH70", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd53", harpNo:"HPEC10", headerNo:"MH65", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd54", harpNo:"HPEC10", headerNo:"MH66", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd55", harpNo:"HPEC9",  headerNo:"MH63", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd56", harpNo:"HPEC9",  headerNo:"MH64", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd57", harpNo:"HPEC8",  headerNo:"MH55", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd58", harpNo:"HPEC8",  headerNo:"MH56", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd59", harpNo:"HPEC7",  headerNo:"MH53", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd60", harpNo:"HPEC7",  headerNo:"MH54", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd61", harpNo:"HPEC6",  headerNo:"MH51", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd62", harpNo:"HPEC6",  headerNo:"MH52", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd63", harpNo:"IPEC1",  headerNo:"MH67", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd64", harpNo:"IPEC1",  headerNo:"MH68", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd65", harpNo:"IPEV3",  headerNo:"MH61", dimension:"Pipe Ø273x12.7",    material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd66", harpNo:"IPEV3",  headerNo:"MH62", dimension:"Pipe Ø273x12.7",    material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd67", harpNo:"IPEV2",  headerNo:"MH59", dimension:"Pipe Ø219.1x12.7",  material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd68", harpNo:"IPEV2",  headerNo:"MH60", dimension:"Pipe Ø219.1x12.7",  material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd69", harpNo:"IPEV1",  headerNo:"MH57", dimension:"Pipe Ø219.1x12.7",  material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd70", harpNo:"IPEV1",  headerNo:"MH58", dimension:"Pipe Ø219.1x12.7",  material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
  ]},
  { id:"hdg5", groupName:"BOX 5", start:"", finish:"", headers:[
    { id:"hd71", harpNo:"LPEC2",  headerNo:"MH87", dimension:"Pipe Ø141.3x9.53",  material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd72", harpNo:"LPEC2",  headerNo:"MH88", dimension:"Pipe Ø141.3x9.53",  material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd73", harpNo:"LPEC1",  headerNo:"MH85", dimension:"Pipe Ø141.3x9.53",  material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd74", harpNo:"LPEC1",  headerNo:"MH86", dimension:"Pipe Ø141.3x9.53",  material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd75", harpNo:"LPEV3",  headerNo:"MH83", dimension:"Pipe Ø273x12.7",    material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd76", harpNo:"LPEV3",  headerNo:"MH84", dimension:"Pipe Ø273x12.7",    material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd77", harpNo:"LPEV2",  headerNo:"MH81", dimension:"Pipe Ø219.1x10.31", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd78", harpNo:"LPEV2",  headerNo:"MH82", dimension:"Pipe Ø219.1x10.31", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd79", harpNo:"LPEV1",  headerNo:"MH79", dimension:"Pipe Ø273x12.7",    material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd80", harpNo:"LPEV1",  headerNo:"MH80", dimension:"Pipe Ø273x12.7",    material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd81", harpNo:"HPEC14", headerNo:"MH77", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd82", harpNo:"HPEC14", headerNo:"MH78", dimension:"Pipe Ø219.1x29.03", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd83", harpNo:"HPEC13", headerNo:"MH75", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd84", harpNo:"HPEC13", headerNo:"MH76", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd85", harpNo:"HPEC12", headerNo:"MH71", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd86", harpNo:"HPEC12", headerNo:"MH72", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd87", harpNo:"IPEC2",  headerNo:"MH73", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd88", harpNo:"IPEC2",  headerNo:"MH74", dimension:"Pipe Ø141.3x22.23", material:"SA-106 GR.C", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
  ]},
  { id:"hdg6", groupName:"BOX 6", start:"", finish:"", headers:[
    { id:"hd89", harpNo:"LPEC13", headerNo:"MH109", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd90", harpNo:"LPEC13", headerNo:"MH110", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd91", harpNo:"LPEC12", headerNo:"MH107", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd92", harpNo:"LPEC12", headerNo:"MH108", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd93", harpNo:"LPEC11", headerNo:"MH105", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd94", harpNo:"LPEC11", headerNo:"MH106", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd95", harpNo:"LPEC10", headerNo:"MH103", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd96", harpNo:"LPEC10", headerNo:"MH104", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd97", harpNo:"LPEC9",  headerNo:"MH101", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd98", harpNo:"LPEC9",  headerNo:"MH102", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd99", harpNo:"LPEC8",  headerNo:"MH99",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd100",harpNo:"LPEC8",  headerNo:"MH100", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd101",harpNo:"LPEC7",  headerNo:"MH97",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd102",harpNo:"LPEC7",  headerNo:"MH98",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd103",harpNo:"LPEC6",  headerNo:"MH95",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd104",harpNo:"LPEC6",  headerNo:"MH96",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd105",harpNo:"LPEC5",  headerNo:"MH93",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd106",harpNo:"LPEC5",  headerNo:"MH94",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd107",harpNo:"LPEC4",  headerNo:"MH91",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd108",harpNo:"LPEC4",  headerNo:"MH92",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd109",harpNo:"LPEC3",  headerNo:"MH89",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
    { id:"hd110",harpNo:"LPEC3",  headerNo:"MH90",  dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", cutting:0, drilling:0, endPlate:0, nozzle:0, nde:0, pwht:0, inspection:0 },
  ]},
];

const INIT_HEADER_FAB = [
  { id:"hf0", unit:"1", boxNo:"6", harp:"LPEC13", headerNo:"MH109", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf1", unit:"1", boxNo:"6", harp:"LPEC13", headerNo:"MH110", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf2", unit:"1", boxNo:"6", harp:"LPEC12", headerNo:"MH107", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf3", unit:"1", boxNo:"6", harp:"LPEC12", headerNo:"MH108", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf4", unit:"1", boxNo:"6", harp:"LPEC11", headerNo:"MH105", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf5", unit:"1", boxNo:"6", harp:"LPEC11", headerNo:"MH106", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf6", unit:"1", boxNo:"6", harp:"LPEC10", headerNo:"MH103", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf7", unit:"1", boxNo:"6", harp:"LPEC10", headerNo:"MH104", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf8", unit:"1", boxNo:"6", harp:"LPEC9", headerNo:"MH101", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf9", unit:"1", boxNo:"6", harp:"LPEC9", headerNo:"MH102", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf10", unit:"1", boxNo:"6", harp:"LPEC8", headerNo:"MH99", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf11", unit:"1", boxNo:"6", harp:"LPEC8", headerNo:"MH100", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf12", unit:"1", boxNo:"6", harp:"LPEC7", headerNo:"MH97", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf13", unit:"1", boxNo:"6", harp:"LPEC7", headerNo:"MH98", dimension:"Pipe Ø141.3x9.53", material:"SA-106 GR.B", qty:"1", planPct:0, actualPct:0 },
  { id:"hf98", unit:"1", boxNo:"1", harp:"HPSH4", headerNo:"MH11", dimension:"Pipe Ø168.3x28.58", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf99", unit:"1", boxNo:"1", harp:"HPSH4", headerNo:"MH12", dimension:"Pipe Ø168.3x31.75", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf100", unit:"1", boxNo:"1", harp:"HPSH3", headerNo:"MH09", dimension:"Pipe Ø168.3x28.58", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf101", unit:"1", boxNo:"1", harp:"HPSH3", headerNo:"MH10", dimension:"Pipe Ø168.3x31.75", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf102", unit:"1", boxNo:"1", harp:"HPSH2", headerNo:"MH03", dimension:"Pipe Ø168.3x34.93", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf103", unit:"1", boxNo:"1", harp:"HPSH2", headerNo:"MH04", dimension:"Pipe Ø168.3x28.58", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf104", unit:"1", boxNo:"1", harp:"HPSH1", headerNo:"MH01", dimension:"Pipe Ø168.3x34.93", material:"SA335-P91-TP2", qty:"1", planPct:0, actualPct:0 },
  { id:"hf105", unit:"1", boxNo:"1", harp:"HPSH1", headerNo:"MH02", dimension:"Pipe Ø168.3x28.58", material:"SA335-P91-TP2", qty:"1", planPct:0, actualPct:0 },
  { id:"hf106", unit:"1", boxNo:"1", harp:"RHTR2", headerNo:"MH07", dimension:"Pipe Ø323.8x28.58", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf107", unit:"1", boxNo:"1", harp:"RHTR2", headerNo:"MH08", dimension:"Pipe Ø323.8x17.48", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf108", unit:"1", boxNo:"1", harp:"RHTR1", headerNo:"MH05", dimension:"Pipe Ø323.8x28.58", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
  { id:"hf109", unit:"1", boxNo:"1", harp:"RHTR1", headerNo:"MH06", dimension:"Pipe Ø323.8x17.48", material:"SA335-P91", qty:"1", planPct:0, actualPct:0 },
];

const INIT_HARP_V2 = [
  { id:"hg1", groupName:"BOX 6", planQty:1672, start:"2026-01-07", finish:"2026-02-10", harps:[
    { id:"h1", boxNo:"Box 6A", harpNo:"LPEC13", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-07", finish:"2026-01-21" },
    { id:"h2", boxNo:"Box 6A", harpNo:"LPEC12", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-08", finish:"2026-01-22" },
    { id:"h3", boxNo:"Box 6A", harpNo:"LPEC11", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-09", finish:"2026-01-23" },
    { id:"h4", boxNo:"Box 6A", harpNo:"LPEC10", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-10", finish:"2026-01-24" },
    { id:"h5", boxNo:"Box 6A", harpNo:"LPEC9", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-26", finish:"2026-01-30" },
    { id:"h6", boxNo:"Box 6A", harpNo:"LPEC8", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-27", finish:"2026-01-31" },
    { id:"h7", boxNo:"Box 6A", harpNo:"LPEC7", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-28", finish:"2026-02-02" },
    { id:"h8", boxNo:"Box 6A", harpNo:"LPEC6", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-29", finish:"2026-02-03" },
    { id:"h9", boxNo:"Box 6A", harpNo:"LPEC5", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-04", finish:"2026-02-07" },
    { id:"h10", boxNo:"Box 6A", harpNo:"LPEC4", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-05", finish:"2026-02-09" },
    { id:"h11", boxNo:"Box 6A", harpNo:"LPEC3", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-06", finish:"2026-02-10" },
    { id:"h12", boxNo:"Box 6B", harpNo:"LPEC13", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-07", finish:"2026-01-21" },
    { id:"h13", boxNo:"Box 6B", harpNo:"LPEC12", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-08", finish:"2026-01-22" },
    { id:"h14", boxNo:"Box 6B", harpNo:"LPEC11", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-09", finish:"2026-01-23" },
    { id:"h15", boxNo:"Box 6B", harpNo:"LPEC10", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-10", finish:"2026-01-24" },
    { id:"h16", boxNo:"Box 6B", harpNo:"LPEC9", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-26", finish:"2026-01-30" },
    { id:"h17", boxNo:"Box 6B", harpNo:"LPEC8", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-27", finish:"2026-01-31" },
    { id:"h18", boxNo:"Box 6B", harpNo:"LPEC7", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-28", finish:"2026-02-02" },
    { id:"h19", boxNo:"Box 6B", harpNo:"LPEC6", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-29", finish:"2026-02-03" },
    { id:"h20", boxNo:"Box 6B", harpNo:"LPEC5", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-04", finish:"2026-02-07" },
    { id:"h21", boxNo:"Box 6B", harpNo:"LPEC4", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-05", finish:"2026-02-09" },
    { id:"h22", boxNo:"Box 6B", harpNo:"LPEC3", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-06", finish:"2026-02-10" },
    { id:"h23", boxNo:"Box 6C", harpNo:"LPEC13", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-07", finish:"2026-01-21" },
    { id:"h24", boxNo:"Box 6C", harpNo:"LPEC12", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-08", finish:"2026-01-22" },
    { id:"h25", boxNo:"Box 6C", harpNo:"LPEC11", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-09", finish:"2026-01-23" },
    { id:"h26", boxNo:"Box 6C", harpNo:"LPEC10", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-10", finish:"2026-01-24" },
    { id:"h27", boxNo:"Box 6C", harpNo:"LPEC9", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-26", finish:"2026-01-30" },
    { id:"h28", boxNo:"Box 6C", harpNo:"LPEC8", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-27", finish:"2026-01-31" },
    { id:"h29", boxNo:"Box 6C", harpNo:"LPEC7", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-28", finish:"2026-02-02" },
    { id:"h30", boxNo:"Box 6C", harpNo:"LPEC6", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-01-29", finish:"2026-02-03" },
    { id:"h31", boxNo:"Box 6C", harpNo:"LPEC5", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-04", finish:"2026-02-07" },
    { id:"h32", boxNo:"Box 6C", harpNo:"LPEC4", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-05", finish:"2026-02-09" },
    { id:"h33", boxNo:"Box 6C", harpNo:"LPEC3", unit:"Weld", planQty:152, completedQty:0, hydroDone:0, start:"2026-02-06", finish:"2026-02-10" }
  ] },
  { id:"hg2", groupName:"BOX 5", planQty:1596, start:"2026-02-23", finish:"2026-03-15", harps:[
    { id:"h34", boxNo:"Box 5A", harpNo:"LPEC2", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-02-23", finish:"2026-02-23" },
    { id:"h35", boxNo:"Box 5A", harpNo:"LPEC1", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-02-24", finish:"2026-02-24" },
    { id:"h36", boxNo:"Box 5A", harpNo:"LPEV3", unit:"Weld", planQty:296, completedQty:0, hydroDone:0, start:"2026-02-25", finish:"2026-03-01" },
    { id:"h37", boxNo:"Box 5A", harpNo:"LPEV2", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-03-04", finish:"2026-03-10" },
    { id:"h38", boxNo:"Box 5A", harpNo:"LPEV1", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-03-04", finish:"2026-03-10" },
    { id:"h39", boxNo:"Box 5A", harpNo:"HPEC14", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-09", finish:"2026-03-13" },
    { id:"h40", boxNo:"Box 5A", harpNo:"HPEC13", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-12", finish:"2026-03-14" },
    { id:"h41", boxNo:"Box 5A", harpNo:"HPEC12", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-13", finish:"2026-03-15" },
    { id:"h42", boxNo:"Box 5A", harpNo:"IPEC2", unit:"Weld", planQty:70, completedQty:0, hydroDone:0, start:"2026-03-09", finish:"2026-03-09" },
    { id:"h43", boxNo:"Box 5B", harpNo:"LPEC2", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-02-23", finish:"2026-03-02" },
    { id:"h44", boxNo:"Box 5B", harpNo:"LPEC1", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-02-24", finish:"2026-03-03" },
    { id:"h45", boxNo:"Box 5B", harpNo:"LPEV3", unit:"Weld", planQty:296, completedQty:0, hydroDone:0, start:"2026-02-25", finish:"2026-03-01" },
    { id:"h46", boxNo:"Box 5B", harpNo:"LPEV2", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-03-04", finish:"2026-03-10" },
    { id:"h47", boxNo:"Box 5B", harpNo:"LPEV1", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-03-05", finish:"2026-03-11" },
    { id:"h48", boxNo:"Box 5B", harpNo:"HPEC14", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-09", finish:"2026-03-14" },
    { id:"h49", boxNo:"Box 5B", harpNo:"HPEC13", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-12", finish:"2026-03-15" },
    { id:"h50", boxNo:"Box 5B", harpNo:"HPEC12", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-11", finish:"2026-03-14" },
    { id:"h51", boxNo:"Box 5B", harpNo:"IPEC2", unit:"Weld", planQty:70, completedQty:0, hydroDone:0, start:"2026-03-13", finish:"2026-03-13" },
    { id:"h52", boxNo:"Box 5C", harpNo:"LPEC2", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-02-23", finish:"2026-03-02" },
    { id:"h53", boxNo:"Box 5C", harpNo:"LPEC1", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-02-24", finish:"2026-03-03" },
    { id:"h54", boxNo:"Box 5C", harpNo:"LPEV3", unit:"Weld", planQty:296, completedQty:0, hydroDone:0, start:"2026-02-25", finish:"2026-03-03" },
    { id:"h55", boxNo:"Box 5C", harpNo:"LPEV2", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-03-05", finish:"2026-03-11" },
    { id:"h56", boxNo:"Box 5C", harpNo:"LPEV1", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-03-09", finish:"2026-03-13" },
    { id:"h57", boxNo:"Box 5C", harpNo:"HPEC14", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-09", finish:"2026-03-14" },
    { id:"h58", boxNo:"Box 5C", harpNo:"HPEC13", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-13", finish:"2026-03-15" },
    { id:"h59", boxNo:"Box 5C", harpNo:"HPEC12", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-12", finish:"2026-03-14" },
    { id:"h60", boxNo:"Box 5C", harpNo:"IPEC2", unit:"Weld", planQty:70, completedQty:0, hydroDone:0, start:"2026-03-15", finish:"2026-03-15" }
  ] },
  { id:"hg3", groupName:"BOX 4", planQty:1190, start:"2026-03-16", finish:"2026-04-03", harps:[
    { id:"h61", boxNo:"Box 4A", harpNo:"HPEC11", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-16", finish:"2026-03-19" },
    { id:"h62", boxNo:"Box 4A", harpNo:"HPEC10", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-16", finish:"2026-03-19" },
    { id:"h63", boxNo:"Box 4A", harpNo:"HPEC9", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-17", finish:"2026-03-20" },
    { id:"h64", boxNo:"Box 4A", harpNo:"HPEC8", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-18", finish:"2026-03-21" },
    { id:"h65", boxNo:"Box 4A", harpNo:"HPEC7", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-23", finish:"2026-03-26" },
    { id:"h66", boxNo:"Box 4A", harpNo:"HPEC6", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-23", finish:"2026-03-26" },
    { id:"h67", boxNo:"Box 4A", harpNo:"IPEC1", unit:"Weld", planQty:70, completedQty:0, hydroDone:0, start:"2026-03-24", finish:"2026-03-24" },
    { id:"h68", boxNo:"Box 4A", harpNo:"IPEV3", unit:"Weld", planQty:280, completedQty:0, hydroDone:0, start:"2026-03-25", finish:"2026-04-01" },
    { id:"h69", boxNo:"Box 4A", harpNo:"IPEV2", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-28", finish:"2026-04-02" },
    { id:"h70", boxNo:"Box 4A", harpNo:"IPEV1", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-30", finish:"2026-04-03" },
    { id:"h71", boxNo:"Box 4B", harpNo:"HPEC11", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-16", finish:"2026-03-19" },
    { id:"h72", boxNo:"Box 4B", harpNo:"HPEC10", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-17", finish:"2026-03-20" },
    { id:"h73", boxNo:"Box 4B", harpNo:"HPEC9", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-17", finish:"2026-03-20" },
    { id:"h74", boxNo:"Box 4B", harpNo:"HPEC8", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-18", finish:"2026-03-21" },
    { id:"h75", boxNo:"Box 4B", harpNo:"HPEC7", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-23", finish:"2026-03-26" },
    { id:"h76", boxNo:"Box 4B", harpNo:"HPEC6", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-24", finish:"2026-03-27" },
    { id:"h77", boxNo:"Box 4B", harpNo:"IPEC1", unit:"Weld", planQty:70, completedQty:0, hydroDone:0, start:"2026-03-24", finish:"2026-03-24" },
    { id:"h78", boxNo:"Box 4B", harpNo:"IPEV3", unit:"Weld", planQty:280, completedQty:0, hydroDone:0, start:"2026-03-25", finish:"2026-04-02" },
    { id:"h79", boxNo:"Box 4B", harpNo:"IPEV2", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-28", finish:"2026-04-03" },
    { id:"h80", boxNo:"Box 4B", harpNo:"IPEV1", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-30", finish:"2026-04-04" },
    { id:"h81", boxNo:"Box 4C", harpNo:"HPEC11", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-16", finish:"2026-03-19" },
    { id:"h82", boxNo:"Box 4C", harpNo:"HPEC10", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-17", finish:"2026-03-20" },
    { id:"h83", boxNo:"Box 4C", harpNo:"HPEC9", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-18", finish:"2026-03-21" },
    { id:"h84", boxNo:"Box 4C", harpNo:"HPEC8", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-18", finish:"2026-03-21" },
    { id:"h85", boxNo:"Box 4C", harpNo:"HPEC7", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-23", finish:"2026-03-26" },
    { id:"h86", boxNo:"Box 4C", harpNo:"HPEC6", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-03-24", finish:"2026-03-27" },
    { id:"h87", boxNo:"Box 4C", harpNo:"IPEC1", unit:"Weld", planQty:70, completedQty:0, hydroDone:0, start:"2026-03-25", finish:"2026-03-25" },
    { id:"h88", boxNo:"Box 4C", harpNo:"IPEV3", unit:"Weld", planQty:280, completedQty:0, hydroDone:0, start:"2026-03-25", finish:"2026-04-02" },
    { id:"h89", boxNo:"Box 4C", harpNo:"IPEV2", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-28", finish:"2026-04-03" },
    { id:"h90", boxNo:"Box 4C", harpNo:"IPEV1", unit:"Weld", planQty:210, completedQty:0, hydroDone:0, start:"2026-03-30", finish:"2026-04-04" }
  ] },
  { id:"hg4", groupName:"BOX 3", planQty:1574, start:"2026-04-18", finish:"2026-05-07", harps:[
    { id:"h91", boxNo:"Box 3A", harpNo:"HPEC5", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-18", finish:"2026-04-22" },
    { id:"h92", boxNo:"Box 3A", harpNo:"HPEC4", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-18", finish:"2026-04-22" },
    { id:"h93", boxNo:"Box 3A", harpNo:"HPEC3", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-20", finish:"2026-04-23" },
    { id:"h94", boxNo:"Box 3A", harpNo:"HPEC2", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-21", finish:"2026-04-24" },
    { id:"h95", boxNo:"Box 3A", harpNo:"HPEC1", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-25", finish:"2026-04-29" },
    { id:"h96", boxNo:"Box 3A", harpNo:"IPSH1", unit:"Weld", planQty:116, completedQty:0, hydroDone:0, start:"2026-04-25", finish:"2026-04-29" },
    { id:"h97", boxNo:"Box 3A", harpNo:"LPSH1", unit:"Weld", planQty:92, completedQty:0, hydroDone:0, start:"2026-04-27", finish:"2026-04-30" },
    { id:"h98", boxNo:"Box 3A", harpNo:"HPEV7", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-28", finish:"2026-05-04" },
    { id:"h99", boxNo:"Box 3A", harpNo:"HPEV6", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-05-02", finish:"2026-05-07" },
    { id:"h100", boxNo:"Box 3A", harpNo:"HPEV5", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-05-02", finish:"2026-05-07" },
    { id:"h101", boxNo:"Box 3B", harpNo:"HPEC5", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-18", finish:"2026-04-22" },
    { id:"h102", boxNo:"Box 3B", harpNo:"HPEC4", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-20", finish:"2026-04-23" },
    { id:"h103", boxNo:"Box 3B", harpNo:"HPEC3", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-20", finish:"2026-04-23" },
    { id:"h104", boxNo:"Box 3B", harpNo:"HPEC2", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-21", finish:"2026-04-24" },
    { id:"h105", boxNo:"Box 3B", harpNo:"HPEC1", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-25", finish:"2026-04-29" },
    { id:"h106", boxNo:"Box 3B", harpNo:"IPSH1", unit:"Weld", planQty:116, completedQty:0, hydroDone:0, start:"2026-04-27", finish:"2026-04-30" },
    { id:"h107", boxNo:"Box 3B", harpNo:"LPSH1", unit:"Weld", planQty:92, completedQty:0, hydroDone:0, start:"2026-04-27", finish:"2026-04-30" },
    { id:"h108", boxNo:"Box 3B", harpNo:"HPEV7", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-28", finish:"2026-05-04" },
    { id:"h109", boxNo:"Box 3B", harpNo:"HPEV6", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-05-02", finish:"2026-05-07" },
    { id:"h110", boxNo:"Box 3B", harpNo:"HPEV5", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-05-04", finish:"2026-05-08" },
    { id:"h111", boxNo:"Box 3C", harpNo:"HPEC5", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-18", finish:"2026-04-22" },
    { id:"h112", boxNo:"Box 3C", harpNo:"HPEC4", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-20", finish:"2026-04-23" },
    { id:"h113", boxNo:"Box 3C", harpNo:"HPEC3", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-21", finish:"2026-04-24" },
    { id:"h114", boxNo:"Box 3C", harpNo:"HPEC2", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-21", finish:"2026-04-24" },
    { id:"h115", boxNo:"Box 3C", harpNo:"HPEC1", unit:"Weld", planQty:140, completedQty:0, hydroDone:0, start:"2026-04-25", finish:"2026-04-29" },
    { id:"h116", boxNo:"Box 3C", harpNo:"IPSH1", unit:"Weld", planQty:116, completedQty:0, hydroDone:0, start:"2026-04-27", finish:"2026-04-30" },
    { id:"h117", boxNo:"Box 3C", harpNo:"LPSH1", unit:"Weld", planQty:92, completedQty:0, hydroDone:0, start:"2026-04-28", finish:"2026-05-01" },
    { id:"h118", boxNo:"Box 3C", harpNo:"HPEV7", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-28", finish:"2026-05-05" },
    { id:"h119", boxNo:"Box 3C", harpNo:"HPEV6", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-05-02", finish:"2026-05-08" },
    { id:"h120", boxNo:"Box 3C", harpNo:"HPEV5", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-05-04", finish:"2026-05-08" }
  ] },
  { id:"hg5", groupName:"BOX 2", planQty:1402, start:"2026-03-09", finish:"2026-04-17", harps:[
    { id:"h121", boxNo:"Box 2A", harpNo:"HPEV4", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-06", finish:"2026-04-15" },
    { id:"h122", boxNo:"Box 2A", harpNo:"HPEV3", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-07", finish:"2026-04-16" },
    { id:"h123", boxNo:"Box 2A", harpNo:"HPEV2", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-08", finish:"2026-04-17" },
    { id:"h124", boxNo:"Box 2A", harpNo:"HPEV1", unit:"Weld", planQty:156, completedQty:0, hydroDone:0, start:"2026-04-09", finish:"2026-04-14" },
    { id:"h125", boxNo:"Box 2A", harpNo:"HPSH7", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-03-09", finish:"2026-03-12" },
    { id:"h126", boxNo:"Box 2A", harpNo:"HPSH6", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-03-16", finish:"2026-03-19" },
    { id:"h127", boxNo:"Box 2A", harpNo:"HPSH5", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-03-23", finish:"2026-03-26" },
    { id:"h128", boxNo:"Box 2A", harpNo:"RHTR4", unit:"Weld", planQty:104, completedQty:0, hydroDone:0, start:"2026-03-30", finish:"2026-04-02" },
    { id:"h129", boxNo:"Box 2A", harpNo:"RHTR3", unit:"Weld", planQty:104, completedQty:0, hydroDone:0, start:"2026-04-06", finish:"2026-04-09" },
    { id:"h130", boxNo:"Box 2B", harpNo:"HPEV4", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-06", finish:"2026-04-15" },
    { id:"h131", boxNo:"Box 2B", harpNo:"HPEV3", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-07", finish:"2026-04-16" },
    { id:"h132", boxNo:"Box 2B", harpNo:"HPEV2", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-08", finish:"2026-04-17" },
    { id:"h133", boxNo:"Box 2B", harpNo:"HPEV1", unit:"Weld", planQty:156, completedQty:0, hydroDone:0, start:"2026-04-09", finish:"2026-04-14" },
    { id:"h134", boxNo:"Box 2B", harpNo:"HPSH7", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-03-10", finish:"2026-03-13" },
    { id:"h135", boxNo:"Box 2B", harpNo:"HPSH6", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-03-17", finish:"2026-03-20" },
    { id:"h136", boxNo:"Box 2B", harpNo:"HPSH5", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-03-24", finish:"2026-03-27" },
    { id:"h137", boxNo:"Box 2B", harpNo:"RHTR4", unit:"Weld", planQty:104, completedQty:0, hydroDone:0, start:"2026-03-31", finish:"2026-04-03" },
    { id:"h138", boxNo:"Box 2B", harpNo:"RHTR3", unit:"Weld", planQty:104, completedQty:0, hydroDone:0, start:"2026-04-07", finish:"2026-04-10" },
    { id:"h139", boxNo:"Box 2C", harpNo:"HPEV4", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-06", finish:"2026-04-15" },
    { id:"h140", boxNo:"Box 2C", harpNo:"HPEV3", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-07", finish:"2026-04-16" },
    { id:"h141", boxNo:"Box 2C", harpNo:"HPEV2", unit:"Weld", planQty:222, completedQty:0, hydroDone:0, start:"2026-04-08", finish:"2026-04-17" },
    { id:"h142", boxNo:"Box 2C", harpNo:"HPEV1", unit:"Weld", planQty:156, completedQty:0, hydroDone:0, start:"2026-04-09", finish:"2026-04-14" },
    { id:"h143", boxNo:"Box 2C", harpNo:"HPSH7", unit:"Weld", planQty:148, completedQty:0, hydroDone:0, start:"2026-03-11", finish:"2026-03-14" },
    { id:"h144", boxNo:"Box 2C", harpNo:"HPSH6", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-03-18", finish:"2026-03-21" },
    { id:"h145", boxNo:"Box 2C", harpNo:"HPSH5", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-03-25", finish:"2026-03-28" },
    { id:"h146", boxNo:"Box 2C", harpNo:"RHTR4", unit:"Weld", planQty:104, completedQty:0, hydroDone:0, start:"2026-04-01", finish:"2026-04-04" },
    { id:"h147", boxNo:"Box 2C", harpNo:"RHTR3", unit:"Weld", planQty:104, completedQty:0, hydroDone:0, start:"2026-04-08", finish:"2026-04-11" }
  ] },
  { id:"hg6", groupName:"BOX 1", planQty:496, start:"2026-04-13", finish:"2026-05-21", harps:[
    { id:"h148", boxNo:"Box 1A", harpNo:"HPSH4", unit:"Weld", planQty:72, completedQty:0, hydroDone:0, start:"2026-04-13", finish:"2026-04-16" },
    { id:"h149", boxNo:"Box 1A", harpNo:"HPSH3", unit:"Weld", planQty:72, completedQty:0, hydroDone:0, start:"2026-04-20", finish:"2026-04-23" },
    { id:"h150", boxNo:"Box 1A", harpNo:"HPSH2", unit:"Weld", planQty:64, completedQty:0, hydroDone:0, start:"2026-04-27", finish:"2026-04-30" },
    { id:"h151", boxNo:"Box 1A", harpNo:"HPSH1", unit:"Weld", planQty:64, completedQty:0, hydroDone:0, start:"2026-05-04", finish:"2026-05-06" },
    { id:"h152", boxNo:"Box 1A", harpNo:"RHTR2", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-05-11", finish:"2026-05-14" },
    { id:"h153", boxNo:"Box 1A", harpNo:"RHTR1", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-05-18", finish:"2026-05-21" },
    { id:"h154", boxNo:"Box 1B", harpNo:"HPSH4", unit:"Weld", planQty:72, completedQty:0, hydroDone:0, start:"2026-04-14", finish:"2026-04-17" },
    { id:"h155", boxNo:"Box 1B", harpNo:"HPSH3", unit:"Weld", planQty:72, completedQty:0, hydroDone:0, start:"2026-04-21", finish:"2026-04-24" },
    { id:"h156", boxNo:"Box 1B", harpNo:"HPSH2", unit:"Weld", planQty:64, completedQty:0, hydroDone:0, start:"2026-04-28", finish:"2026-05-01" },
    { id:"h157", boxNo:"Box 1B", harpNo:"HPSH1", unit:"Weld", planQty:64, completedQty:0, hydroDone:0, start:"2026-05-05", finish:"2026-05-09" },
    { id:"h158", boxNo:"Box 1B", harpNo:"RHTR2", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-05-12", finish:"2026-05-15" },
    { id:"h159", boxNo:"Box 1B", harpNo:"RHTR1", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-05-19", finish:"2026-05-22" },
    { id:"h160", boxNo:"Box 1C", harpNo:"HPSH4", unit:"Weld", planQty:72, completedQty:0, hydroDone:0, start:"2026-04-15", finish:"2026-04-18" },
    { id:"h161", boxNo:"Box 1C", harpNo:"HPSH3", unit:"Weld", planQty:72, completedQty:0, hydroDone:0, start:"2026-04-22", finish:"2026-04-25" },
    { id:"h162", boxNo:"Box 1C", harpNo:"HPSH2", unit:"Weld", planQty:64, completedQty:0, hydroDone:0, start:"2026-04-29", finish:"2026-05-02" },
    { id:"h163", boxNo:"Box 1C", harpNo:"HPSH1", unit:"Weld", planQty:64, completedQty:0, hydroDone:0, start:"2026-05-06", finish:"2026-05-09" },
    { id:"h164", boxNo:"Box 1C", harpNo:"RHTR2", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-05-13", finish:"2026-05-16" },
    { id:"h165", boxNo:"Box 1C", harpNo:"RHTR1", unit:"Weld", planQty:112, completedQty:0, hydroDone:0, start:"2026-05-20", finish:"2026-05-23" }
  ] },
];

const INIT_CASING = [
  {
    id:"cp1", name:"FABRICATION CASING — Build-up Beam",
    type:"build_up_beam", unit:"Ton", qty:"150.2",
    start:"2026-02-23", finish:"2026-05-22",
    activities:[
      { id:"ca1", task:"Cutting",      assignedTo:"CNC",  progress:0, start:"2026-02-23", finish:"2026-04-30" },
      { id:"ca2", task:"Build-up Beam",assignedTo:"HR04", progress:0, start:"2026-02-26", finish:"2026-05-05" },
      { id:"ca3", task:"Inspection",   assignedTo:"HR04", progress:0, start:"2026-03-10", finish:"2026-05-22" },
    ]
  },
  {
    id:"cp2", name:"TC60A Top Casing Box 6A",
    type:"top_casing", unit:"Ton", qty:"",
    start:"2026-04-08", finish:"2026-05-09",
    activities:[
      { id:"ca4",  task:"Cutting",            assignedTo:"CNC",    progress:0, start:"2026-04-08", finish:"2026-04-10" },
      { id:"ca5",  task:"Fit-up",             assignedTo:"TEAM 1", progress:0, start:"2026-04-10", finish:"2026-04-18" },
      { id:"ca6",  task:"Welding",            assignedTo:"TEAM 1", progress:0, start:"2026-04-18", finish:"2026-04-27" },
      { id:"ca7",  task:"Inspection",         assignedTo:"TEAM 1", progress:0, start:"2026-04-27", finish:"2026-04-28" },
      { id:"ca8",  task:"Blasting & Painting",assignedTo:"TEAM 1", progress:0, start:"2026-04-28", finish:"2026-05-05" },
      { id:"ca9",  task:"Insulation",         assignedTo:"PK TEAM",progress:0, start:"2026-05-05", finish:"2026-05-09" },
    ]
  },
  {
    id:"cp3", name:"TC50A Top Casing Box 5A",
    type:"top_casing", unit:"Ton", qty:"",
    start:"2026-04-16", finish:"2026-05-18",
    activities:[
      { id:"ca10", task:"Cutting",            assignedTo:"CNC",    progress:0, start:"2026-04-16", finish:"2026-04-18" },
      { id:"ca11", task:"Fit-up",             assignedTo:"TEAM 1", progress:0, start:"2026-04-18", finish:"2026-04-27" },
      { id:"ca12", task:"Welding",            assignedTo:"TEAM 1", progress:0, start:"2026-04-27", finish:"2026-05-06" },
      { id:"ca13", task:"Inspection",         assignedTo:"TEAM 1", progress:0, start:"2026-05-06", finish:"2026-05-07" },
      { id:"ca14", task:"Blasting & Painting",assignedTo:"TEAM 1", progress:0, start:"2026-05-07", finish:"2026-05-14" },
      { id:"ca15", task:"Insulation",         assignedTo:"PK TEAM",progress:0, start:"2026-05-14", finish:"2026-05-18" },
    ]
  },
  {
    id:"cp4", name:"TC40A Top Casing Box 4A",
    type:"top_casing", unit:"Ton", qty:"",
    start:"2026-05-06", finish:"2026-06-03",
    activities:[
      { id:"ca16", task:"Cutting",            assignedTo:"CNC",    progress:0, start:"2026-05-06", finish:"2026-05-08" },
      { id:"ca17", task:"Fit-up",             assignedTo:"TEAM 3", progress:0, start:"2026-05-08", finish:"2026-05-15" },
      { id:"ca18", task:"Welding",            assignedTo:"TEAM 3", progress:0, start:"2026-05-15", finish:"2026-05-22" },
      { id:"ca19", task:"Inspection",         assignedTo:"TEAM 3", progress:0, start:"2026-05-22", finish:"2026-05-23" },
      { id:"ca20", task:"Blasting & Painting",assignedTo:"TEAM 3", progress:0, start:"2026-05-23", finish:"2026-05-30" },
      { id:"ca21", task:"Insulation",         assignedTo:"PK TEAM",progress:0, start:"2026-05-30", finish:"2026-06-03" },
    ]
  },
  {
    id:"cp7", name:"TC10A Top Casing Box 1A",
    type:"top_casing", unit:"Ton", qty:"",
    start:"2026-05-22", finish:"2026-06-16",
    activities:[
      { id:"ca34", task:"Cutting",            assignedTo:"CNC",    progress:0, start:"2026-05-22", finish:"2026-05-24" },
      { id:"ca35", task:"Fit-up",             assignedTo:"TEAM 2", progress:0, start:"2026-05-24", finish:"2026-05-30" },
      { id:"ca36", task:"Welding",            assignedTo:"TEAM 2", progress:0, start:"2026-05-30", finish:"2026-06-05" },
      { id:"ca37", task:"Inspection",         assignedTo:"TEAM 2", progress:0, start:"2026-06-05", finish:"2026-06-06" },
      { id:"ca38", task:"Blasting & Painting",assignedTo:"TEAM 2", progress:0, start:"2026-06-06", finish:"2026-06-12" },
      { id:"ca39", task:"Insulation",         assignedTo:"PK TEAM",progress:0, start:"2026-06-12", finish:"2026-06-16" },
    ]
  },
];
const INIT_SHIPPING = { status: "in_progress", remark: "Started cutting & build-up beam" };
const INIT_PIPING = [
  { id:"iso1", isoNo:"ISO-001", boxNo:"6A", lineNo:"1-HP-001-6", size:"6in", sch:"SCH 80", material:"SA-106 GR.B", system:"HP Steam", totalJoints:3, joints:[
    { id:"j1", jNo:"J-01", fitup:0, weld:0, nde:0, pwht:0, remark:"" },
    { id:"j2", jNo:"J-02", fitup:0, weld:0, nde:0, pwht:0, remark:"" },
    { id:"j3", jNo:"J-03", fitup:0, weld:0, nde:0, pwht:0, remark:"" },
  ]},
  { id:"iso2", isoNo:"ISO-002", boxNo:"6A", lineNo:"1-HP-002-4", size:"4in", sch:"SCH 80", material:"SA-106 GR.B", system:"HP Steam", totalJoints:2, joints:[
    { id:"j4", jNo:"J-01", fitup:0, weld:0, nde:0, pwht:0, remark:"" },
    { id:"j5", jNo:"J-02", fitup:0, weld:0, nde:0, pwht:0, remark:"" },
  ]},
  { id:"iso3", isoNo:"ISO-003", boxNo:"6B", lineNo:"1-HP-003-6", size:"6in", sch:"SCH 80", material:"SA-106 GR.B", system:"HP Steam", totalJoints:2, joints:[
    { id:"j6", jNo:"J-01", fitup:0, weld:0, nde:0, pwht:0, remark:"" },
    { id:"j7", jNo:"J-02", fitup:0, weld:0, nde:0, pwht:0, remark:"" },
  ]},
];

const INIT_BOX_ASSEMBLY_V2 = [
  { id:"box1", name:"5332-HRG-1100 BOX 6A", boxNo:"6A", qty:"147.93", start:"2026-03-18", finish:"2026-06-01", activities:[
      { id:"ba1", task:"Support installing & leveling", qty:"", progress:0, start:"2026-03-18", finish:"2026-03-21" },
      { id:"ba2", task:"Install shipping frame", qty:"", progress:0, start:"2026-03-21", finish:"2026-03-26" },
      { id:"ba3", task:"Install top casing", qty:"", progress:0, start:"2026-03-26", finish:"2026-03-29" },
      { id:"ba4", task:"Loading harp", qty:"11", progress:0, start:"2026-03-29", finish:"2026-04-01" },
      { id:"ba5", task:"Final dimension for steel structure", qty:"", progress:0, start:"2026-04-01", finish:"2026-04-03" },
      { id:"ba6", task:"Install MA piping", qty:"", progress:0, start:"2026-04-03", finish:"2026-04-20" },
      { id:"ba7", task:"Final dimension for piping", qty:"", progress:0, start:"2026-04-20", finish:"2026-04-22" },
      { id:"ba8", task:"Painting touch-up", qty:"", progress:0, start:"2026-04-22", finish:"2026-05-02" },
      { id:"ba9", task:"Finishing & punch work", qty:"", progress:0, start:"2026-05-02", finish:"2026-06-01" }
  ] },
  { id:"box2", name:"5332-HRG-1100 BOX 5A", boxNo:"5A", qty:"143.47", start:"2026-04-01", finish:"2026-06-15", activities:[
      { id:"ba10", task:"Support installing & leveling", qty:"", progress:0, start:"2026-04-01", finish:"2026-04-04" },
      { id:"ba11", task:"Install shipping frame", qty:"", progress:0, start:"2026-04-04", finish:"2026-04-09" },
      { id:"ba12", task:"Install top casing", qty:"", progress:0, start:"2026-04-09", finish:"2026-04-12" },
      { id:"ba13", task:"Loading harp", qty:"9", progress:0, start:"2026-04-12", finish:"2026-04-15" },
      { id:"ba14", task:"Final dimension for steel structure", qty:"", progress:0, start:"2026-04-15", finish:"2026-04-17" },
      { id:"ba15", task:"Install MA piping", qty:"", progress:0, start:"2026-04-17", finish:"2026-05-04" },
      { id:"ba16", task:"Final dimension for piping", qty:"", progress:0, start:"2026-05-04", finish:"2026-05-06" },
      { id:"ba17", task:"Painting touch-up", qty:"", progress:0, start:"2026-05-06", finish:"2026-05-16" },
      { id:"ba18", task:"Finishing & punch work", qty:"", progress:0, start:"2026-05-16", finish:"2026-06-15" }
  ] },
  { id:"box7", name:"5332-HRG-1100 BOX 6B", boxNo:"6B", qty:"147.93", start:"2026-03-18", finish:"2026-06-01", activities:[
      { id:"ba55", task:"Support installing & leveling", qty:"", progress:0, start:"2026-03-18", finish:"2026-03-21" },
      { id:"ba56", task:"Install shipping frame", qty:"", progress:0, start:"2026-03-21", finish:"2026-03-26" },
      { id:"ba57", task:"Install top casing", qty:"", progress:0, start:"2026-03-26", finish:"2026-03-29" },
      { id:"ba58", task:"Loading harp", qty:"11", progress:0, start:"2026-03-29", finish:"2026-04-01" },
      { id:"ba59", task:"Final dimension for steel structure", qty:"", progress:0, start:"2026-04-01", finish:"2026-04-03" },
      { id:"ba60", task:"Install MA piping", qty:"", progress:0, start:"2026-04-03", finish:"2026-04-20" },
      { id:"ba61", task:"Final dimension for piping", qty:"", progress:0, start:"2026-04-20", finish:"2026-04-22" },
      { id:"ba62", task:"Painting touch-up", qty:"", progress:0, start:"2026-04-22", finish:"2026-05-02" },
      { id:"ba63", task:"Finishing & punch work", qty:"", progress:0, start:"2026-05-02", finish:"2026-06-01" }
  ] },
  { id:"box13", name:"5332-HRG-1100 BOX 6C", boxNo:"6C", qty:"147.93", start:"2026-03-24", finish:"2026-06-06", activities:[
      { id:"ba109", task:"Support installing & leveling", qty:"", progress:0, start:"2026-03-24", finish:"2026-03-27" },
      { id:"ba110", task:"Install shipping frame", qty:"", progress:0, start:"2026-03-27", finish:"2026-04-01" },
      { id:"ba111", task:"Install top casing", qty:"", progress:0, start:"2026-04-01", finish:"2026-04-04" },
      { id:"ba112", task:"Loading harp", qty:"11", progress:0, start:"2026-04-04", finish:"2026-04-07" },
      { id:"ba113", task:"Final dimension for steel structure", qty:"", progress:0, start:"2026-04-07", finish:"2026-04-09" },
      { id:"ba114", task:"Install MA piping", qty:"", progress:0, start:"2026-04-09", finish:"2026-04-26" },
      { id:"ba115", task:"Final dimension for piping", qty:"", progress:0, start:"2026-04-26", finish:"2026-04-28" },
      { id:"ba116", task:"Painting touch-up", qty:"", progress:0, start:"2026-04-28", finish:"2026-05-08" },
      { id:"ba117", task:"Finishing & punch work", qty:"", progress:0, start:"2026-05-08", finish:"2026-06-06" }
  ] },
];


// ════════════════════════════════════════════════════════
// COLORS & UTILS
// ════════════════════════════════════════════════════════
const C = {
  bg:       "#080e1a",
  panel:    "#0d1527",
  border:   "#1a2a44",
  accent:   "#00d4ff",
  amber:    "#f59e0b",
  green:    "#22c55e",
  red:      "#ef4444",
  muted:    "#3a5070",
  text:     "#c8dff0",
  dim:      "#4a6580",
};

function pct2color(p) {
  if (p === 0)   return C.muted;
  if (p < 30)    return "#ef4444";
  if (p < 70)    return C.amber;
  if (p < 100)   return "#4ade80";
  return C.green;
}

const MONO = "'DM Mono', 'Fira Code', 'Consolas', monospace";
const SANS = "'DM Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

function Bar({ value, max = 100, h = 6, label, color }) {
  const p = Math.min(100, Math.round((value / max) * 100));
  const col = color || pct2color(p);
  return (
    <div style={{ width: "100%" }}>
      {label !== undefined && (
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.dim, marginBottom:4, fontFamily:SANS }}>
          <span>{label}</span><span style={{ color:col, fontWeight:700 }}>{p}%</span>
        </div>
      )}
      <div style={{ background:"#0a1628", borderRadius:99, height:h, overflow:"hidden", border:`1px solid ${C.border}` }}>
        <div style={{ width:`${p}%`, height:"100%", background:`linear-gradient(90deg,${col}99,${col})`, borderRadius:99, transition:"width 0.5s ease", boxShadow: p>0?`0 0 8px ${col}66`:"none" }} />
      </div>
    </div>
  );
}

function Cell({ children, center, mono, style={} }) {
  return (
    <td style={{
      padding:"9px 12px", borderBottom:`1px solid ${C.border}`,
      textAlign: center?"center":"left",
      fontFamily: mono ? MONO : SANS,
      fontSize:14, color:C.text, ...style
    }}>
      {children}
    </td>
  );
}

function Th({ children, center, style={} }) {
  return (
    <th style={{
      padding:"10px 12px", background:"#081220", borderBottom:`2px solid ${C.accent}33`,
      textAlign:center?"center":"left", fontSize:14, color:"#7aa8c8",
      letterSpacing:"0.06em", fontFamily:SANS, fontWeight:700,
      whiteSpace:"nowrap", ...style
    }}>
      {children}
    </th>
  );
}

function SectionCard({ title, badge, children, accent = C.accent }) {
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", marginBottom:20 }}>
      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, background:"#0a1525" }}>
        <div style={{ width:3, height:20, background:accent, borderRadius:2, flexShrink:0 }} />
        <span style={{ fontFamily:SANS, fontSize:15, color:C.text, fontWeight:700 }}>{title}</span>
        {badge && <span style={{ marginLeft:"auto", background:`${accent}22`, border:`1px solid ${accent}55`, color:accent, borderRadius:4, padding:"3px 10px", fontSize:14, fontFamily:SANS, fontWeight:600 }}>{badge}</span>}
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  );
}

function InlineEdit({ value, onChange, type = "text", style = {}, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      style={{
        background:"#081220", border:`1px solid ${C.border}`, borderRadius:4,
        color: value ? C.text : C.dim, padding:"4px 8px", fontSize:14,
        fontFamily: type === "number" ? MONO : SANS, width:"100%",
        outline:"none", colorScheme:"dark",
        ...style
      }}
    />
  );
}

const STATUS_OPTS = [
  { val:"not_started", label:"Not Yet Started", color:"#64748b" },
  { val:"in_progress", label:"In Progress",     color:"#f59e0b" },
  { val:"complete",    label:"Complete",         color:"#22c55e" },
  { val:"hold",        label:"On Hold",          color:"#ef4444" },
];

function SingleStatusTab({ label, state, setState, color }) {
  const sopt = STATUS_OPTS.find(o=>o.val===state.status) || STATUS_OPTS[0];
  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ background:C.panel, border:`1px solid ${color}44`, borderRadius:12, padding:28 }}>
        <div style={{ fontSize:11, color:C.dim, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>{label}</div>
        <div style={{ marginBottom:20 }}>
          <span style={{ background:`${sopt.color}22`, border:`1px solid ${sopt.color}55`, color:sopt.color, borderRadius:6, padding:"6px 16px", fontSize:15, fontFamily:SANS, fontWeight:700 }}>
            {sopt.label}
          </span>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:13, color:"#7aa8c8", fontWeight:600, marginBottom:8 }}>Status</div>
          <select value={state.status} onChange={e=>setState(s=>({...s,status:e.target.value}))}
            style={{ background:"#081220", border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"10px 12px", fontSize:15, width:"100%", fontFamily:SANS }}>
            {STATUS_OPTS.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize:13, color:"#7aa8c8", fontWeight:600, marginBottom:8 }}>Remark</div>
          <textarea value={state.remark} onChange={e=>setState(s=>({...s,remark:e.target.value}))}
            rows={4} style={{ background:"#081220", border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"10px 12px", fontSize:15, width:"100%", resize:"vertical", fontFamily:SANS, boxSizing:"border-box" }} />
        </div>
      </div>
    </div>
  );
}

function DualBar({ planPct, actualPct }) {
  const diff = actualPct - planPct;
  const status = planPct === 0
    ? { label:"No Plan", col:"#64748b", bg:"#1e293b" }
    : diff > 2   ? { label:"Ahead",   col:"#22c55e", bg:"#14532d55" }
    : diff >= -2 ? { label:"As Plan", col:"#f59e0b", bg:"#78350f55" }
    :              { label:"Behind",  col:"#ef4444", bg:"#7f1d1d55" };
  const actualCol = planPct === 0 ? pct2color(actualPct) : status.col;
  return (
    <div>
      <div style={{ position:"relative", height:18, background:"#071018", borderRadius:5, overflow:"hidden", border:`1px solid ${actualCol}44`, marginBottom:4 }}>
        <div style={{ position:"absolute", top:0, left:0, width:`${actualPct}%`, height:"100%", background:`linear-gradient(90deg,${actualCol}77,${actualCol})`, borderRadius:5, transition:"width 0.4s" }}>
          {actualPct >= 16 && <span style={{ position:"absolute", right:5, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:10, color:"#fff", fontWeight:800, textShadow:"0 1px 3px #0008" }}>{actualPct}%</span>}
        </div>
        {planPct > 0 && (
          <div style={{ position:"absolute", top:0, left:0, width:`${planPct}%`, height:"100%", borderRight:`2px dashed ${C.amber}cc`, background:`repeating-linear-gradient(90deg,transparent,transparent 5px,${C.amber}15 5px,${C.amber}15 6px)`, pointerEvents:"none" }} />
        )}
        {actualPct < 16 && <span style={{ position:"absolute", left:`${actualPct+1}%`, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:10, color:actualCol, fontWeight:800 }}>{actualPct}%</span>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontFamily:SANS, fontSize:9, color:C.amber }}>P <b style={{color:C.amber}}>{planPct}%</b></span>
        <span style={{ color:C.border, fontSize:9 }}>|</span>
        <span style={{ fontFamily:SANS, fontSize:9, color:actualCol }}>A <b style={{color:actualCol}}>{actualPct}%</b></span>
        <span style={{ marginLeft:"auto", fontFamily:SANS, fontSize:9, fontWeight:700, color:status.col, background:status.bg, borderRadius:4, padding:"1px 6px", border:`1px solid ${status.col}44`, whiteSpace:"nowrap" }}>
          {planPct > 0 && (diff > 0 ? "▲ +" : diff < 0 ? "▼ " : "")}{planPct > 0 ? `${diff}% ` : ""}{status.label}
        </span>
      </div>
    </div>
  );
}

function Dashboard({ data }) {
  const ftAvg = data.finnedTube.length ? Math.round(data.finnedTube.reduce((s,r)=>{ const pq=Number(r.planQty)||0,aq=Number(r.actualQty)||0; return s+(pq>0?Math.min(100,Math.round(aq/pq*100)):0); },0)/data.finnedTube.length) : 0;
  const _allHdrHeaders = data.headerDrill.flatMap(g=>g.headers||[]);
  const _HDR_STEPS = ["cutting","drilling","endPlate","nozzle","nde","pwht","inspection"];
  const hdAvg = _allHdrHeaders.length ? Math.round(_allHdrHeaders.reduce((s,h)=>s+Math.round(_HDR_STEPS.filter(k=>k==="pwht"?(h.pwht===1||h.pwht===2):h[k]===1).length/_HDR_STEPS.length*100),0)/_allHdrHeaders.length) : 0;
  const hfActual = data.headerFab.length ? Math.round(data.headerFab.reduce((s,r)=>s+(Number(r.actualPct)||0),0)/data.headerFab.length) : 0;
  const _harpAllWelds = data.harpFab.flatMap(g=>g.harps);
  const _harpTotalPlan = data.harpFab.reduce((s,g)=>s+g.planQty,0);
  const _harpTotalDone = _harpAllWelds.reduce((s,h)=>s+(Number(h.completedQty)||0),0);
  const harpActual = _harpTotalPlan>0 ? Math.min(100,Math.round(_harpTotalDone/_harpTotalPlan*100)) : 0;
  const harpHT     = _harpAllWelds.length ? Math.round(_harpAllWelds.filter(h=>h.hydroDone===1).length/_harpAllWelds.length*100) : 0;
  const _today2=new Date(); _today2.setHours(0,0,0,0);
  const _tp2=(s,f)=>{ if(!s||!f) return 0; const sd=new Date(s),fd=new Date(f); if(isNaN(sd)||isNaN(fd)||fd<=sd) return 0; if(_today2<=sd) return 0; if(_today2>=fd) return 100; return Math.round((_today2-sd)/(fd-sd)*100); };
  const _HDR_S2=["cutting","drilling","endPlate","nozzle","nde","pwht","inspection"];
  const _lnk=b=>{ const bn=((b.boxNo||"").match(/(\d+)/)||[])[1]||""; const ft2=(data.finnedTube||[]).filter(r=>(r.boxNo||"").includes("Box "+bn)); const ftP2=ft2.length?Math.round(ft2.reduce((s,r)=>{ const pq=Number(r.planQty)||0,aq=Number(r.actualQty)||0; return s+(pq>0?Math.min(100,Math.round(aq/pq*100)):0); },0)/ft2.length):null; const hg2=(data.harpFab||[]).find(g=>(g.groupName||"").replace(/[^0-9]/g,"")===bn); const hpP2=hg2?(hg2.harps.length?Math.round(hg2.harps.reduce((s,h)=>s+(h.planQty>0?Math.min(100,Math.round((Number(h.completedQty)||0)/h.planQty*100)):0),0)/hg2.harps.length):0):null; const hdg2=(data.headerDrill||[]).find(g=>(g.groupName||"").replace(/[^0-9]/g,"")===bn); const hdP2=hdg2?(hdg2.headers.length?Math.round(hdg2.headers.reduce((s,h)=>s+Math.round(_HDR_S2.filter(k=>k==="pwht"?(h.pwht===1||h.pwht===2):h[k]===1).length/_HDR_S2.length*100),0)/hdg2.headers.length):0):null; const cp2=(data.casing||[]).filter(p=>{ const n=(p.name||"").toLowerCase(); return n.includes("box "+(b.boxNo||"").toLowerCase())||n.includes("box "+bn); }); const caP2=cp2.length?Math.round(cp2.reduce((s,p)=>s+(p.activities.length?Math.round(p.activities.reduce((ss,a)=>ss+(Number(a.progress)||0),0)/p.activities.length):0),0)/cp2.length):null; const asP2=b.activities.length?Math.round(b.activities.reduce((s,a)=>s+(Number(a.progress)||0),0)/b.activities.length):0; const v2=[ftP2,hpP2,hdP2,caP2,asP2].filter(x=>x!==null); return v2.length>1?Math.round(v2.reduce((s,x)=>s+x,0)/v2.length):asP2; };
  const boxAvg = data.boxAssemblyV2.length ? Math.round(data.boxAssemblyV2.reduce((s,b)=>s+_lnk(b),0)/data.boxAssemblyV2.length) : 0;
  const planOverall = data.boxAssemblyV2.length ? Math.round(data.boxAssemblyV2.reduce((s,b)=>s+_tp2(b.start,b.finish),0)/data.boxAssemblyV2.length) : 0;

  const casingAvg = (()=>{ const all=data.casing.flatMap(p=>p.activities); return all.length?Math.round(all.reduce((s,a)=>s+(Number(a.progress)||0),0)/all.length):0; })();
  const _hdrFabCount = data.headerFab.length;
  const _hdrTotal = _allHdrHeaders.length + _hdrFabCount;
  const headerAvg = _hdrTotal>0 ? Math.round((_allHdrHeaders.length*hdAvg + _hdrFabCount*hfActual)/_hdrTotal) : 0;
  const harpAvg   = Math.round((harpActual*2 + harpHT)/3);
  const subcomps = [
    { label:"Finned Tube",         pct:ftAvg,      color:"#38bdf8", tab:"finnedtube" },
    { label:"Header",              pct:headerAvg,  color:"#a78bfa", tab:"hdrill"     },
    { label:"Harp",                pct:harpAvg,    color:"#4ade80", tab:"harp"       },
    { label:"Casing & Modulation", pct:casingAvg,  color:"#f472b6", tab:"casing"     },
    { label:"Module Box Assembly",        pct:boxAvg,     color:"#e879f9", tab:"modbox"     },
    { label:"MA Piping",           pct:(()=>{ const allJ=data.piping.flatMap(r=>r.joints); return allJ.length?Math.round(allJ.filter(j=>j.weld===1).length/allJ.length*100):0; })(), color:"#60a5fa", tab:"piping" },
  ];

  const overall = boxAvg;
  const diff = overall - planOverall;
  const status = planOverall === 0
    ? { label:"No Plan", icon:"—", col:"#64748b", bg:"linear-gradient(135deg,#1e293b,#0f172a)" }
    : diff > 2  ? { label:"Ahead of Plan", icon:"▲", col:"#22c55e", bg:"linear-gradient(135deg,#052e16,#0a1f1a)" }
    : diff >= -2? { label:"On Schedule",   icon:"●", col:"#f59e0b", bg:"linear-gradient(135deg,#1c1200,#131005)" }
    :             { label:"Behind Plan",   icon:"▼", col:"#ef4444", bg:"linear-gradient(135deg,#2d0a0a,#1a0606)" };

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0d1f3a,#0a1525)", border:`1px solid ${C.accent}44`, borderRadius:12, padding:24, marginBottom:20 }}>
        <div style={{ fontSize:13, color:C.dim, letterSpacing:"0.08em", fontFamily:SANS, fontWeight:700, marginBottom:16, textTransform:"uppercase" }}>Overall Fabrication Progress</div>
        <div style={{ display:"flex", gap:20, alignItems:"stretch", marginBottom:20 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.amber, fontFamily:SANS, fontWeight:600, letterSpacing:"0.08em", marginBottom:4 }}>PLAN</div>
            <div style={{ fontSize:52, fontWeight:900, color:C.amber, fontFamily:MONO, lineHeight:1 }}>{planOverall}<span style={{ fontSize:22, color:`${C.amber}88` }}>%</span></div>
          </div>
          <div style={{ width:1, background:C.border, alignSelf:"stretch" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.accent, fontFamily:SANS, fontWeight:600, letterSpacing:"0.08em", marginBottom:4 }}>ACTUAL</div>
            <div style={{ fontSize:52, fontWeight:900, color:C.accent, fontFamily:MONO, lineHeight:1 }}>{overall}<span style={{ fontSize:22, color:`${C.accent}88` }}>%</span></div>
          </div>
          <div style={{ width:1, background:C.border, alignSelf:"stretch" }} />
          <div style={{ flex:1, background:status.bg, border:`1px solid ${status.col}66`, borderRadius:10, padding:"14px 20px", display:"flex", flexDirection:"column", justifyContent:"center", gap:6 }}>
            <div style={{ fontSize:11, color:`${status.col}99`, fontFamily:SANS, fontWeight:600, letterSpacing:"0.1em" }}>Current Status</div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:28, color:status.col }}>{status.icon}</span>
              <span style={{ fontSize:24, fontWeight:900, color:status.col, fontFamily:SANS }}>{status.label}</span>
            </div>
            {planOverall > 0 && <div style={{ fontFamily:MONO, fontSize:13, color:`${status.col}cc` }}>{diff >= 0 ? `+${diff}%` : `${diff}%`} vs Plan</div>}
          </div>
        </div>
        <div style={{ background:"#071018", borderRadius:6, height:10, overflow:"hidden", border:`1px solid ${C.amber}33`, marginBottom:8 }}>
          <div style={{ width:`${planOverall}%`, height:"100%", background:`linear-gradient(90deg,#b45309,#f59e0b)`, borderRadius:6 }} />
        </div>
        <div style={{ background:"#071018", borderRadius:6, height:14, overflow:"hidden", border:`1px solid ${status.col}44`, position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, width:`${planOverall}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}99`, pointerEvents:"none" }} />
          <div style={{ position:"relative", width:`${overall}%`, height:"100%", background:`linear-gradient(90deg,${status.col}88,${status.col})`, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
            {overall >= 10 && <span style={{ fontFamily:MONO, fontSize:11, color:"#fff", fontWeight:800, paddingRight:8, textShadow:"0 1px 3px #0006" }}>{overall}%</span>}
          </div>
        </div>
      </div>

      <SectionCard title="Module Box Assembly Status" accent="#e879f9">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
          {data.boxAssemblyV2.map(b => {
            const boxNo=b.boxNo||"", boxNum=((boxNo.match(/(\d+)/)||[])[1])||"";
            const ft=(data.finnedTube||[]).filter(r=>(r.boxNo||"").includes("Box "+boxNum));
            const ftP=ft.length?Math.round(ft.reduce((s,r)=>{ const pq=Number(r.planQty)||0,aq=Number(r.actualQty)||0; return s+(pq>0?Math.min(100,Math.round(aq/pq*100)):0); },0)/ft.length):null;
            const hg=(data.harpFab||[]).find(g=>(g.groupName||"").replace(/[^0-9]/g,"")===boxNum);
            const hpP=hg?(hg.harps.length?Math.round(hg.harps.reduce((s,h)=>s+(h.planQty>0?Math.min(100,Math.round((Number(h.completedQty)||0)/h.planQty*100)):0),0)/hg.harps.length):0):null;
            const HDR_S=["cutting","drilling","endPlate","nozzle","nde","pwht","inspection"];
            const hdg=(data.headerDrill||[]).find(g=>(g.groupName||"").replace(/[^0-9]/g,"")===boxNum);
            const hdP=hdg?(hdg.headers.length?Math.round(hdg.headers.reduce((s,h)=>s+Math.round(HDR_S.filter(k=>k==="pwht"?(h.pwht===1||h.pwht===2):h[k]===1).length/HDR_S.length*100),0)/hdg.headers.length):0):null;
            const cp=(data.casing||[]).filter(p=>{ const n=(p.name||"").toLowerCase(); return n.includes("box "+boxNo.toLowerCase())||n.includes("box "+boxNum); });
            const caP=cp.length?Math.round(cp.reduce((s,p)=>s+(p.activities.length?Math.round(p.activities.reduce((ss,a)=>ss+(Number(a.progress)||0),0)/p.activities.length):0),0)/cp.length):null;
            const asP=b.activities.length?Math.round(b.activities.reduce((s,a)=>s+(Number(a.progress)||0),0)/b.activities.length):0;
            const vals=[ftP,hpP,hdP,caP,asP].filter(v=>v!==null);
            const linked=vals.length>1?Math.round(vals.reduce((s,v)=>s+v,0)/vals.length):asP;
            const _t=new Date(); _t.setHours(0,0,0,0);
            const planPct=(()=>{ if(!b.start||!b.finish) return 0; const sd=new Date(b.start),fd=new Date(b.finish); if(isNaN(sd)||isNaN(fd)||fd<=sd) return 0; if(_t<=sd) return 0; if(_t>=fd) return 100; return Math.round((_t-sd)/(fd-sd)*100); })();
            const col=pct2color(linked);
            return (
              <div key={b.id} style={{ background:"#081220", border:`1px solid ${col}44`, borderRadius:8, padding:12 }}>
                <div style={{ fontSize:12, color:"#8ab0cc", fontFamily:SANS, fontWeight:600, marginBottom:8 }}>{b.boxNo}</div>
                <DualBar planPct={planPct} actualPct={linked} />
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div style={{ border:`1px solid ${C.accent}33`, borderRadius:12, padding:"18px 18px 14px", background:"#060e1a" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <span style={{ fontFamily:SANS, fontSize:11, fontWeight:700, color:C.accent, letterSpacing:"0.12em", textTransform:"uppercase" }}>Overall Progress — Each Component</span>
          <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${C.accent}44,transparent)` }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {subcomps.map(c => (
            <div key={c.label} style={{ background:C.panel, border:`1px solid ${c.color}33`, borderRadius:10, padding:16 }}>
              <div style={{ fontSize:13, color:"#8ab0cc", fontFamily:SANS, fontWeight:600, marginBottom:10 }}>{c.label}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:10 }}>
                <span style={{ fontSize:32, fontWeight:800, color:c.color, fontFamily:MONO }}>{c.pct}</span>
                <span style={{ color:C.muted, fontSize:16, fontFamily:MONO }}>%</span>
              </div>
              <Bar value={c.pct} h={5} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinnedTubeTab({ rows, setRows }) {
  const { useState: useS } = React;
  const [filter, setFilter] = useS({ boxNo:"", item:"" });

  const totalPlanQty  = rows.reduce((s,r)=>s+(Number(r.planQty)||0),0);
  const totalActualQty= rows.reduce((s,r)=>s+(Number(r.actualQty)||0),0);

  const _today = new Date(); _today.setHours(0,0,0,0);
  const _calcPlanPct = r => {
    if (!r.start || !r.finish) return 0;
    const s = new Date(r.start), f = new Date(r.finish);
    if (isNaN(s)||isNaN(f)||f<=s) return 0;
    if (_today<=s) return 0; if (_today>=f) return 100;
    return Math.round((_today-s)/(f-s)*100);
  };
  const _calcActualPct = r => {
    const pq = Number(r.planQty)||0, aq = Number(r.actualQty)||0;
    return pq>0 ? Math.min(100,Math.round(aq/pq*100)) : 0;
  };
  const avgPlanPct   = rows.length ? Math.round(rows.reduce((s,r)=>s+_calcPlanPct(r),0)/rows.length) : 0;
  const avgActualPct = rows.length ? Math.round(rows.reduce((s,r)=>s+_calcActualPct(r),0)/rows.length) : 0;

  const upd = (id, field, val) => setRows(p=>p.map(r=>r.id===id?{...r,[field]:val}:r));
  const delRow = id => setRows(p=>p.filter(r=>r.id!==id));
  const addRow = () => setRows(p=>[...p,{
    id:`ftn${Date.now()}`, boxNo:"", item:"", od:"", thk:"", material:"", length:"",
    h:"", t:"", finMaterial:"", finM:"", ftype:"SERRATED", unit:"0",
    planQty:"0", actualQty:"0", planPct:0, actualPct:0, mcNo:"", duration:"", start:"", finish:""
  }]);

  const filtered = rows.filter(r=>
    (!filter.boxNo || r.boxNo===filter.boxNo) &&
    (!filter.item  || r.item.includes(filter.item))
  );

  const boxSpans = filtered.map((r,i)=>{
    const start = i===0 || filtered[i-1].boxNo!==r.boxNo;
    let span=1;
    if(start){ let j=i+1; while(j<filtered.length&&filtered[j].boxNo===r.boxNo)j++; span=j-i; }
    return { start, span };
  });

  const boxes = [...new Set(rows.map(r=>r.boxNo))].filter(Boolean);
  const accent = "#38bdf8";
  const selSt = { background:"#081220", border:`1px solid ${C.border}`, borderRadius:5, color:C.text, padding:"5px 8px", fontSize:12, fontFamily:SANS };
  const summaryTotalPlanQty   = filtered.reduce((s,r)=>s+(Number(r.planQty)||0),0);
  const summaryTotalActualQty = filtered.reduce((s,r)=>s+(Number(r.actualQty)||0),0);

  const diff = avgActualPct - avgPlanPct;
  const status = avgPlanPct === 0
    ? { label:"No Plan", icon:"—", col:"#64748b", bg:"linear-gradient(135deg,#1e293b,#0f172a)" }
    : diff > 2  ? { label:"Ahead of Plan", icon:"▲", col:"#22c55e", bg:"linear-gradient(135deg,#052e16,#0a1f1a)" }
    : diff >= -2? { label:"On Schedule",   icon:"●", col:"#f59e0b", bg:"linear-gradient(135deg,#1c1200,#131005)" }
    :             { label:"Behind Plan",   icon:"▼", col:"#ef4444", bg:"linear-gradient(135deg,#2d0a0a,#1a0606)" };

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0d1f3a,#0a1525)", border:`1px solid ${accent}33`, borderRadius:10, padding:"16px 20px", marginBottom:20 }}>
        <div style={{ fontSize:11, color:C.dim, letterSpacing:"0.1em", fontFamily:SANS, fontWeight:700, textTransform:"uppercase", marginBottom:12 }}>Finned Tube — Overall Progress</div>
        <div style={{ display:"flex", gap:16, alignItems:"stretch", marginBottom:14 }}>
          <div style={{ textAlign:"center", minWidth:70 }}>
            <div style={{ fontSize:10, color:C.amber, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>PLAN</div>
            <div style={{ fontSize:38, fontWeight:900, color:C.amber, fontFamily:MONO, lineHeight:1 }}>{avgPlanPct}<span style={{ fontSize:16, color:`${C.amber}88` }}>%</span></div>
          </div>
          <div style={{ width:1, background:C.border }} />
          <div style={{ textAlign:"center", minWidth:70 }}>
            <div style={{ fontSize:10, color:status.col, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>ACTUAL</div>
            <div style={{ fontSize:38, fontWeight:900, color:status.col, fontFamily:MONO, lineHeight:1 }}>{avgActualPct}<span style={{ fontSize:16, color:`${status.col}88` }}>%</span></div>
          </div>
          <div style={{ width:1, background:C.border }} />
          <div style={{ flex:1, background:status.bg, border:`1px solid ${status.col}55`, borderRadius:8, padding:"10px 16px", display:"flex", flexDirection:"column", justifyContent:"center", gap:4 }}>
            <div style={{ fontSize:10, color:`${status.col}99`, fontFamily:SANS, fontWeight:600 }}>CURRENT STATUS</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20, color:status.col }}>{status.icon}</span>
              <span style={{ fontSize:18, fontWeight:900, color:status.col, fontFamily:SANS }}>{status.label}</span>
            </div>
            {avgPlanPct > 0 && <div style={{ fontFamily:MONO, fontSize:11, color:`${status.col}bb` }}>{diff >= 0 ? `+${diff}%` : `${diff}%`} vs Plan</div>}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:12 }}>
        {[
          { label:"Total Items",    val:rows.length,                    color:C.accent },
          { label:"Plan Qty",       val:totalPlanQty.toLocaleString(),  color:C.amber  },
          { label:"Actual Qty",     val:totalActualQty.toLocaleString(),color:C.green  },
          { label:"Avg. Progress",  val:`${avgActualPct}%`,             color:pct2color(avgActualPct) },
        ].map(c=>(
          <div key={c.label} style={{ background:C.panel, border:`1px solid ${c.color}33`, borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:13, color:C.dim, fontFamily:SANS, fontWeight:600, marginBottom:6 }}>{c.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:c.color, fontFamily:MONO }}>{c.val}</div>
          </div>
        ))}
      </div>

      <SectionCard title="TUBE FINNING" badge={`${filtered.length} / ${rows.length}`} accent={accent}>
        <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontSize:12, color:C.dim, fontWeight:600 }}>Filter:</span>
          <select value={filter.boxNo} onChange={e=>setFilter(f=>({...f,boxNo:e.target.value}))} style={selSt}>
            <option value="">All Boxes</option>
            {boxes.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
          <input placeholder="Item (MT…)" value={filter.item} onChange={e=>setFilter(f=>({...f,item:e.target.value}))}
            style={{ ...selSt, width:90 }} />
          {(filter.boxNo||filter.item) && (
            <button onClick={()=>setFilter({boxNo:"",item:""})}
              style={{ background:`${C.red}20`, border:`1px solid ${C.red}44`, color:C.red, borderRadius:5, padding:"5px 10px", cursor:"pointer", fontSize:12 }}>✕ Clear</button>
          )}
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
            <thead>
              <tr style={{ background:"#071018" }}>
                <Th center>Box No.</Th>
                <Th center>Item</Th>
                <Th center style={{ color:C.amber }}>Plan Q'TY</Th>
                <Th center style={{ color:C.green }}>Completed Q'TY</Th>
                <Th center style={{ minWidth:220 }}>% Progress</Th>
                <Th center>Start Date</Th>
                <Th center>Finish Date</Th>
                <Th center>—</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r,i) => {
                const sp = boxSpans[i];
                const today = new Date(); today.setHours(0,0,0,0);
                const planPct = (() => {
                  if (!r.start || !r.finish) return 0;
                  const s = new Date(r.start), f = new Date(r.finish);
                  if (isNaN(s)||isNaN(f)||f<=s) return 0;
                  if (today <= s) return 0; if (today >= f) return 100;
                  return Math.round((today-s)/(f-s)*100);
                })();
                const actualPct = (() => {
                  const pq = Number(r.planQty)||0, aq = Number(r.actualQty)||0;
                  return pq > 0 ? Math.min(100, Math.round(aq/pq*100)) : 0;
                })();
                const boxColor = ["#60a5fa","#fb923c","#34d399","#f472b6","#a78bfa","#38bdf8"][boxes.indexOf(r.boxNo)%6];
                const isFirstInBox = sp.start;
                const isLastInBox  = i===filtered.length-1 || filtered[i+1].boxNo!==r.boxNo;
                return (
                  <tr key={r.id} style={{
                    background:`${boxColor}0d`,
                    borderTop: isFirstInBox ? `2px solid ${boxColor}88` : `1px solid ${C.border}22`,
                    borderBottom: isLastInBox ? `2px solid ${boxColor}44` : "none",
                  }}>
                    <td style={{
                      padding:"8px 12px", textAlign:"center", fontFamily:MONO, fontWeight:800,
                      fontSize: isFirstInBox ? 15 : 13,
                      color: isFirstInBox ? boxColor : `${boxColor}60`,
                      background:`${boxColor}10`,
                      borderRight:`3px solid ${boxColor}${isFirstInBox?"cc":"44"}`,
                      verticalAlign:"middle", minWidth:88,
                      borderLeft: isFirstInBox ? `3px solid ${boxColor}` : `3px solid ${boxColor}44`,
                    }}>
                      {isFirstInBox
                        ? <span style={{ background:`${boxColor}22`, border:`1px solid ${boxColor}66`, borderRadius:6, padding:"3px 10px" }}>{r.boxNo}</span>
                        : <span style={{ color:`${boxColor}55`, fontSize:11 }}>{r.boxNo}</span>
                      }
                    </td>
                    <Cell center mono style={{ color:accent, fontWeight:700, fontSize:14, padding:"10px 12px" }}>{r.item}</Cell>
                    <Cell center>
                      <InlineEdit value={r.planQty} onChange={v=>upd(r.id,"planQty",v)} style={{ width:80, textAlign:"center", color:C.amber, fontWeight:700, fontSize:14 }} />
                    </Cell>
                    <Cell center>
                      <InlineEdit value={r.actualQty} onChange={v=>upd(r.id,"actualQty",v)} style={{ width:80, textAlign:"center", color:pct2color(actualPct), fontWeight:700, fontSize:14 }} />
                    </Cell>
                    <Cell style={{ minWidth:240, padding:"8px 14px" }}>
                      <DualBar planPct={planPct} actualPct={actualPct} />
                    </Cell>
                    <Cell center style={{ fontSize:13 }}>
                      <InlineEdit value={r.start||""} onChange={v=>upd(r.id,"start",v)} type="date" style={{ width:90, textAlign:"center", fontSize:12 }} />
                    </Cell>
                    <Cell center style={{ fontSize:13 }}>
                      <InlineEdit value={r.finish||""} onChange={v=>upd(r.id,"finish",v)} type="date" style={{ width:90, textAlign:"center", fontSize:12 }} />
                    </Cell>
                    <Cell center>
                      <button onClick={()=>delRow(r.id)} style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"2px 7px", cursor:"pointer", fontSize:11 }}>✕</button>
                    </Cell>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background:"#081220" }}>
                <td colSpan={2} style={{ padding:"8px 12px", fontFamily:SANS, fontSize:12, color:accent, fontWeight:700 }}>TOTAL</td>
                <td style={{ padding:"8px", textAlign:"center", fontFamily:MONO, fontWeight:700, color:C.amber }}>{summaryTotalPlanQty.toLocaleString()}</td>
                <td style={{ padding:"8px", textAlign:"center", fontFamily:MONO, fontWeight:700, color:C.green }}>{summaryTotalActualQty.toLocaleString()}</td>
                <td style={{ padding:"8px 12px" }}><DualBar planPct={avgPlanPct} actualPct={avgActualPct} /></td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop:14 }}>
          <button onClick={addRow} style={{ background:`${accent}15`, border:`1px dashed ${accent}55`, color:accent, borderRadius:7, padding:"9px 20px", cursor:"pointer", fontSize:13, fontFamily:SANS, fontWeight:600 }}>+ Add Item</button>
        </div>
      </SectionCard>
    </div>
  );
}

function HeaderDrillTab({ rows, setRows }) {
  const { useState: useS } = React;
  const [selId, setSelId] = useS(rows[0]?.id || null);
  const [filterHarp, setFilterHarp] = useS("");

  const selGroup = rows.find(g=>g.id===selId) || rows[0];
  const accent = "#a78bfa";
  const inspColor = "#fbbf24";

  const allHeaders = rows.flatMap(g=>g.headers);
  const totalHdrs     = allHeaders.length;
  const totalCutting  = allHeaders.filter(h=>h.cutting===1).length;
  const totalDrilling = allHeaders.filter(h=>h.drilling===1).length;
  const totalEndPlate = allHeaders.filter(h=>h.endPlate===1).length;
  const totalNozzle   = allHeaders.filter(h=>h.nozzle===1).length;
  const totalNde      = allHeaders.filter(h=>h.nde===1).length;
  const totalInsp     = allHeaders.filter(h=>h.inspection===1).length;
  const HDR_STEPS  = ["cutting","drilling","endPlate","nozzle","nde","pwht","inspection"];
  const hdrStepPct = h => Math.round(HDR_STEPS.filter(k=>k==="pwht"?(h.pwht===1||h.pwht===2):h[k]===1).length / HDR_STEPS.length * 100);
  const compPct    = totalHdrs ? Math.round(allHeaders.reduce((s,h)=>s+hdrStepPct(h),0)/totalHdrs) : 0;

  const grpInspPct = g => g.headers.length ? Math.round(g.headers.reduce((s,h)=>s+hdrStepPct(h),0)/g.headers.length) : 0;
  const grpCutPct  = g => g.headers.length ? Math.round(g.headers.filter(h=>h.cutting===1).length/g.headers.length*100) : 0;
  const grpPlanPct = g => {
    if(!g.start||!g.finish) return 0;
    const today=new Date(); today.setHours(0,0,0,0);
    const sd=new Date(g.start), fd=new Date(g.finish);
    if(isNaN(sd)||isNaN(fd)||fd<=sd) return 0;
    if(today<=sd) return 0; if(today>=fd) return 100;
    return Math.round((today-sd)/(fd-sd)*100);
  };

  const updHdr = (gid,hid,field,val) => setRows(prev=>prev.map(g=>g.id===gid?{...g,headers:g.headers.map(h=>h.id===hid?{...h,[field]:val}:h)}:g));
  const addHdr = gid => setRows(prev=>prev.map(g=>g.id===gid?{...g,headers:[...g.headers,{id:`hdn${Date.now()}`,harpNo:"",headerNo:"",dimension:"",material:"",cutting:0,drilling:0,endPlate:0,nozzle:0,nde:0,inspection:0}]}:g));
  const delHdr = (gid,hid) => setRows(prev=>prev.map(g=>g.id===gid?{...g,headers:g.headers.filter(h=>h.id!==hid)}:g));
  const addGrp = () => { const id=`hdg${Date.now()}`; setRows(prev=>[...prev,{id,groupName:`BOX ${prev.length+1}`,start:"",finish:"",headers:[]}]); setSelId(id); };

  const STEPS = [
    { key:"cutting",   label:"Cut",     color:C.amber   },
    { key:"drilling",  label:"Drill",   color:"#a78bfa" },
    { key:"endPlate",  label:"E.Plate", color:"#38bdf8" },
    { key:"nozzle",    label:"Nozzle",  color:"#f472b6" },
    { key:"nde",       label:"NDE",     color:"#34d399" },
    { key:"pwht",      label:"PWHT",    color:"#c084fc" },
    { key:"inspection",label:"Inspection",    color:"#fbbf24" },
  ];

  const [editingGrpId, setEditingGrpId] = useS(null);
  const [editingHdrId, setEditingHdrId] = useS(null);
  const filteredHdrs = selGroup ? (filterHarp ? selGroup.headers.filter(h=>h.harpNo.includes(filterHarp)) : selGroup.headers) : [];
  const harps = selGroup ? [...new Set(selGroup.headers.map(h=>h.harpNo))].filter(Boolean) : [];
  const selSt = { background:"#071018", border:`1px solid ${C.border}`, borderRadius:5, color:C.text, padding:"4px 8px", fontSize:12, fontFamily:SANS };

  return (
    <div>
      {/* Overall */}
      <div style={{ background:"linear-gradient(135deg,#0d1f3a,#0a1525)", border:`1px solid ${accent}33`, borderRadius:10, padding:"14px 20px", marginBottom:12 }}>
        <div style={{ fontSize:11, color:C.dim, fontFamily:SANS, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Header — Overall Progress</div>
        <div style={{ display:"flex", gap:20, alignItems:"stretch", marginBottom:12 }}>
          <div style={{ textAlign:"center", minWidth:70 }}>
            <div style={{ fontSize:10, color:accent, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>TOTAL HEADERS</div>
            <div style={{ fontSize:34, fontWeight:900, color:accent, fontFamily:MONO, lineHeight:1 }}>{totalHdrs}</div>
            <div style={{ fontSize:10, color:inspColor, fontFamily:SANS, fontWeight:700, marginTop:10, marginBottom:3 }}>COMPLETE</div>
            <div style={{ fontSize:28, fontWeight:900, color:inspColor, fontFamily:MONO, lineHeight:1 }}>{totalInsp}</div>
          </div>
          <div style={{ width:1, background:C.border }} />
          {(() => {
            const _planPct = (() => {
              const valid = rows.filter(r=>r.start&&r.finish);
              if (!valid.length) return 0;
              const t = new Date(); t.setHours(0,0,0,0);
              return Math.round(valid.reduce((s,r)=>{
                const st=new Date(r.start),fi=new Date(r.finish);
                if(isNaN(st)||isNaN(fi)||fi<=st) return s;
                if(t<=st) return s; if(t>=fi) return s+100;
                return s+Math.round((t-st)/(fi-st)*100);
              },0)/valid.length);
            })();
            const diff = compPct - _planPct;
            const st = _planPct===0
              ? { label:"No Plan", icon:"—", col:"#64748b", bg:"linear-gradient(135deg,#1e293b,#0f172a)" }
              : diff>2   ? { label:"Ahead of Plan", icon:"▲", col:"#22c55e", bg:"linear-gradient(135deg,#052e16,#0a1f1a)" }
              : diff>=-2 ? { label:"On Schedule",   icon:"●", col:"#f59e0b", bg:"linear-gradient(135deg,#1c1200,#131005)" }
              :             { label:"Behind Plan",   icon:"▼", col:"#ef4444", bg:"linear-gradient(135deg,#2d0a0a,#1a0606)" };
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:280 }}>
                <div style={{ display:"flex", gap:12, alignItems:"stretch" }}>
                  <div style={{ textAlign:"center", minWidth:60 }}>
                    <div style={{ fontSize:10, color:C.amber, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>PLAN</div>
                    <div style={{ fontSize:28, fontWeight:900, color:C.amber, fontFamily:MONO, lineHeight:1 }}>{_planPct}<span style={{ fontSize:13, color:`${C.amber}88` }}>%</span></div>
                  </div>
                  <div style={{ width:1, background:C.border }} />
                  <div style={{ textAlign:"center", minWidth:60 }}>
                    <div style={{ fontSize:10, color:C.accent, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>ACTUAL</div>
                    <div style={{ fontSize:28, fontWeight:900, color:C.accent, fontFamily:MONO, lineHeight:1 }}>{compPct}<span style={{ fontSize:13, color:`${C.accent}88` }}>%</span></div>
                  </div>
                  <div style={{ flex:1, background:st.bg, border:`1px solid ${st.col}55`, borderRadius:8, padding:"6px 12px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                    <div style={{ fontSize:9, color:`${st.col}99`, fontFamily:SANS, fontWeight:600 }}>CURRENT STATUS</div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:16, color:st.col }}>{st.icon}</span>
                      <span style={{ fontSize:13, fontWeight:900, color:st.col, fontFamily:SANS }}>{st.label}</span>
                    </div>
                    {_planPct>0 && <div style={{ fontFamily:MONO, fontSize:10, color:`${st.col}cc` }}>{diff>=0?`+${diff}%`:`${diff}%`} vs Plan</div>}
                  </div>
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <span style={{ fontSize:9, color:C.amber, fontWeight:600 }}>PLAN</span>
                    <span style={{ fontSize:9, fontFamily:MONO, color:C.amber }}>{_planPct}%</span>
                  </div>
                  <div style={{ background:"#071018", borderRadius:4, height:7, overflow:"hidden", border:`1px solid ${C.amber}33` }}>
                    <div style={{ width:`${_planPct}%`, height:"100%", background:`linear-gradient(90deg,#b45309,#f59e0b)`, borderRadius:4 }} />
                  </div>
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <span style={{ fontSize:9, color:C.accent, fontWeight:600 }}>ACTUAL</span>
                    <span style={{ fontSize:9, fontFamily:MONO, color:C.accent }}>{compPct}%</span>
                  </div>
                  <div style={{ background:"#071018", borderRadius:4, height:10, overflow:"hidden", border:`1px solid ${C.accent}44`, position:"relative" }}>
                    <div style={{ position:"absolute", top:0, left:0, width:`${_planPct}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}99`, pointerEvents:"none" }} />
                    <div style={{ position:"relative", width:`${compPct}%`, height:"100%", background:`linear-gradient(90deg,${C.accent}88,${C.accent})`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
                      {compPct>=10 && <span style={{ fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, paddingRight:4 }}>{compPct}%</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          <div style={{ width:1, background:C.border }} />
          <div style={{ flex:1 }}>
            {[
              { label:"CUTTING",       val:totalCutting,  color:C.amber   },
              { label:"DRILLING",      val:totalDrilling, color:"#a78bfa" },
              { label:"END PLATE WELD",val:totalEndPlate, color:"#38bdf8" },
              { label:"NOZZLE WELDING",val:totalNozzle,   color:"#f472b6" },
              { label:"NDE",           val:totalNde,      color:"#34d399" },
              { label:"PWHT",          val:allHeaders.filter(h=>h.pwht===1||h.pwht===2).length, color:"#c084fc" },
              { label:"INSPECTION",    val:totalInsp,     color:"#fbbf24" },
            ].map(s => {
              const pct = totalHdrs > 0 ? Math.round(s.val/totalHdrs*100) : 0;
              return (
                <div key={s.label} style={{ marginBottom:5 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <span style={{ fontSize:9, color:s.color, fontWeight:600 }}>{s.label} — {s.val} / {totalHdrs} hdrs</span>
                    <span style={{ fontSize:9, fontFamily:MONO, color:s.color, fontWeight:700 }}>{pct}%</span>
                  </div>
                  <div style={{ background:"#071018", borderRadius:3, height:5, overflow:"hidden", border:`1px solid ${s.color}33` }}>
                    <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${s.color}88,${s.color})`, borderRadius:3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-panel */}
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:14 }}>
        {/* LEFT */}
        <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"9px 14px", background:"#071018", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.dim, letterSpacing:"0.1em", textTransform:"uppercase" }}>Box Groups</span>
            <button onClick={addGrp} style={{ background:`${accent}20`, border:`1px solid ${accent}44`, color:accent, borderRadius:5, padding:"2px 8px", cursor:"pointer", fontSize:11 }}>+ Add</button>
          </div>
          {rows.map(g => {
            const actualPct = grpInspPct(g), planPct = grpPlanPct(g);
            const diff = actualPct - planPct;
            const sc = planPct===0?"#64748b":diff>2?"#22c55e":diff>=-2?"#f59e0b":"#ef4444";
            const actualCol = planPct===0 ? pct2color(actualPct) : sc;
            const isActive = selId===g.id;
            return (
              <div key={g.id} onClick={()=>{ setSelId(g.id); setFilterHarp(""); }} style={{
                padding:"9px 14px", cursor:"pointer", borderBottom:`1px solid ${C.border}22`,
                background: isActive ? `${accent}12` : "transparent",
                borderLeft: isActive ? `3px solid ${accent}` : "3px solid transparent",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                  {editingGrpId===g.id ? (
                    <input autoFocus value={g.groupName}
                      onChange={e=>setRows(p=>p.map(x=>x.id===g.id?{...x,groupName:e.target.value}:x))}
                      onBlur={()=>setEditingGrpId(null)}
                      onKeyDown={e=>{ if(e.key==="Enter"||e.key==="Escape") setEditingGrpId(null); }}
                      onClick={e=>e.stopPropagation()}
                      style={{ fontSize:13, fontWeight:700, color:accent, background:"#0d1a2e", border:`1px solid ${accent}66`, borderRadius:4, padding:"2px 6px", width:100, fontFamily:MONO, outline:"none" }}
                    />
                  ) : (
                    <span style={{ fontSize:13, fontWeight:700, color: isActive ? accent : C.text, fontFamily:MONO }}>{g.groupName}</span>
                  )}
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:9, fontWeight:700, color:sc, background:`${sc}18`, border:`1px solid ${sc}44`, borderRadius:3, padding:"1px 5px", whiteSpace:"nowrap" }}>
                      {planPct===0?"No Plan":diff>2?"▲ Ahead":diff>=-2?"● On Plan":"▼ Behind"}
                    </span>
                    <button onClick={e=>{ e.stopPropagation(); setEditingGrpId(g.id); }}
                      style={{ background:"none", border:`1px solid ${C.border}`, color:C.dim, borderRadius:4, padding:"1px 5px", cursor:"pointer", fontSize:9, lineHeight:1.4 }}>✏</button>
                  </div>
                </div>
                {/* Plan bar */}
                <div style={{ position:"relative", height:14, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${actualCol}33`, marginBottom:4 }}>
                  <div style={{ position:"absolute", top:0, left:0, width:`${actualPct}%`, height:"100%", background:`linear-gradient(90deg,${actualCol}77,${actualCol})`, borderRadius:4, transition:"width 0.4s" }} />
                  {planPct>0 && <div style={{ position:"absolute", top:0, left:0, width:`${planPct}%`, height:"100%", borderRight:`2px dashed ${C.amber}cc`, background:`repeating-linear-gradient(90deg,transparent,transparent 4px,${C.amber}12 4px,${C.amber}12 5px)`, pointerEvents:"none" }} />}
                  <span style={{ position:"absolute", right:4, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, textShadow:"0 1px 3px #0009" }}>{actualPct}%</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:9, color:C.amber, fontFamily:SANS }}>P <b style={{color:C.amber}}>{planPct}%</b></span>
                  <span style={{ fontSize:9, color:actualCol, fontFamily:SANS }}>A <b style={{color:actualCol}}>{actualPct}%</b></span>
                  <span style={{ fontSize:9, color:C.dim }}>{g.headers.length} hdrs</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        {selGroup && (
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"10px 16px", background:"#071018", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <span style={{ fontSize:14, fontWeight:700, color:accent }}>{selGroup.groupName}</span>
                <span style={{ fontSize:12, color:C.dim, marginLeft:10 }}>{selGroup.headers.length} headers</span>
                {selGroup.start && (
                  <span style={{ fontSize:11, marginLeft:12 }}>
                    <span style={{ color:C.amber, fontWeight:600 }}>Plan Start</span>
                    <span style={{ color:C.dim }}> {selGroup.start}</span>
                    <span style={{ color:"#2a4a6a", margin:"0 6px" }}>→</span>
                    <span style={{ color:C.amber, fontWeight:600 }}>Plan Finish</span>
                    <span style={{ color:C.dim }}> {selGroup.finish}</span>
                  </span>
                )}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <InlineEdit value={selGroup.start||""} onChange={v=>setRows(p=>p.map(g=>g.id===selGroup.id?{...g,start:v}:g))}
                  placeholder="Start" type="date" style={{ width:130, fontSize:11, textAlign:"center" }} />
                <span style={{ color:C.dim, fontSize:11 }}>→</span>
                <InlineEdit value={selGroup.finish||""} onChange={v=>setRows(p=>p.map(g=>g.id===selGroup.id?{...g,finish:v}:g))}
                  placeholder="Finish" type="date" style={{ width:130, fontSize:11, textAlign:"center" }} />
                <select value={filterHarp} onChange={e=>setFilterHarp(e.target.value)} style={selSt}>
                  <option value="">All Harps</option>
                  {harps.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
                {filterHarp && <button onClick={()=>setFilterHarp("")} style={{ background:`${C.red}20`, border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"3px 8px", cursor:"pointer", fontSize:11 }}>✕</button>}
                <button onClick={()=>{ setRows(p=>p.filter(g=>g.id!==selGroup.id)); setSelId(rows.find(g=>g.id!==selGroup.id)?.id||null); }}
                  style={{ background:"#2a0a0a", border:`1px solid ${C.red}44`, color:C.red, borderRadius:6, padding:"4px 12px", cursor:"pointer", fontSize:12, fontWeight:600, marginLeft:4 }}>
                  🗑 Delete Box
                </button>
              </div>
            </div>

            {harps.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(harps.length,4)},1fr)`, gap:8, padding:"10px 16px", borderBottom:`1px solid ${C.border}`, background:"#060d1a" }}>
                {harps.map(harpNo => {
                  const hdrs = selGroup.headers.filter(h=>h.harpNo===harpNo);
                  const stepPct = hdrs.length ? Math.round(hdrs.reduce((s,h)=>s+hdrStepPct(h),0)/hdrs.length) : 0;
                  const col = pct2color(stepPct);
                  return (
                    <div key={harpNo} style={{ background:"#081220", border:`1px solid ${col}33`, borderRadius:6, padding:"8px 10px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#fb923c", fontFamily:MONO }}>{harpNo}</span>
                        <span style={{ fontSize:9, color:C.dim }}>{hdrs.length} hdrs</span>
                      </div>
                      <div style={{ position:"relative", height:16, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${col}44`, marginBottom:4 }}>
                        <div style={{ width:`${stepPct}%`, height:"100%", background:`linear-gradient(90deg,${col}77,${col})`, borderRadius:4, transition:"width 0.4s" }} />
                        <span style={{ position:"absolute", right:4, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, textShadow:"0 1px 3px #0009" }}>{stepPct}%</span>
                      </div>
                      <div style={{ fontSize:9, color:col, fontWeight:700, fontFamily:SANS, textAlign:"center" }}>% Complete</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
                <thead>
                  <tr style={{ background:"#071018" }}>
                    <Th center>Harp No.</Th>
                    <Th center style={{ color:accent }}>Header No.</Th>
                    {STEPS.map(s=><Th key={s.key} center style={{ color:s.color }}>{s.label}</Th>)}
                    <Th center>% Complete</Th>
                    <Th center>—</Th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const harpList = [...new Set(filteredHdrs.map(h=>h.harpNo))];
                    const harpColors = ["#60a5fa","#fb923c","#34d399","#f472b6","#a78bfa","#38bdf8","#fbbf24","#e879f9","#4ade80","#f87171"];
                    const harpColorMap = {};
                    harpList.forEach((hp,i) => { harpColorMap[hp] = harpColors[i % harpColors.length]; });
                    return filteredHdrs.map((h,i) => {
                    const doneCnt = STEPS.filter(s=>s.key==="pwht" ? (h.pwht===1||h.pwht===2) : h[s.key]===1).length;
                    const donePct = Math.round(doneCnt/STEPS.length*100);
                    const allDone = doneCnt === STEPS.length;
                    const harpStart = i===0 || filteredHdrs[i-1].harpNo!==h.harpNo;
                    const harpEnd = i===filteredHdrs.length-1 || filteredHdrs[i+1].harpNo!==h.harpNo;
                    let harpSpan = 1;
                    if(harpStart){ let j=i+1; while(j<filteredHdrs.length&&filteredHdrs[j].harpNo===h.harpNo)j++; harpSpan=j-i; }
                    const harpCol = harpColorMap[h.harpNo] || "#94a3b8";
                    const rowBg = allDone ? "#0d2010" : `${harpCol}0d`;
                    const isEditing = editingHdrId === h.id;
                    return (
                      <tr key={h.id} style={{
                        background: isEditing ? "#0a1f3a" : rowBg,
                        borderTop: harpStart ? `2px solid ${harpCol}88` : `1px solid ${C.border}22`,
                        borderBottom: harpEnd ? `2px solid ${harpCol}44` : "none",
                        outline: isEditing ? `1px solid ${accent}55` : "none",
                      }}>
                        {harpStart && (
                          <td rowSpan={harpSpan} style={{
                            padding:"8px 12px", textAlign:"center", fontFamily:MONO, fontWeight:800, fontSize:12,
                            color: harpCol, background:`${harpCol}15`,
                            borderRight:`3px solid ${harpCol}cc`,
                            borderLeft:`3px solid ${harpCol}`,
                            verticalAlign:"middle", borderBottom:`1px solid ${C.border}`,
                          }}>
                            <span style={{ background:`${harpCol}22`, border:`1px solid ${harpCol}66`, borderRadius:6, padding:"3px 8px" }}>
                              {h.harpNo}
                            </span>
                          </td>
                        )}
                        <Cell center mono style={{ color:accent, fontWeight:700, fontSize:13 }}>
                          {isEditing
                            ? <InlineEdit value={h.headerNo} onChange={v=>updHdr(selGroup.id,h.id,"headerNo",v)}
                                placeholder="MH01" style={{ width:60, textAlign:"center", color:accent, fontWeight:700, fontSize:13 }} />
                            : <span style={{ background:`${accent}18`, border:`1px solid ${accent}44`, borderRadius:5, padding:"3px 10px", color:accent, fontWeight:800, fontSize:13, fontFamily:MONO }}>{h.headerNo||"—"}</span>
                          }
                        </Cell>

                        {STEPS.map(s=>{
                          if(s.key==="pwht") {
                            const v = h.pwht||0;
                            const next = v===0?1:v===1?2:0;
                            const cfg = v===0
                              ? { bg:"#1a1a2e", border:"#334155", color:"#64748b", label:"—" }
                              : v===1
                              ? { bg:"#14532d", border:"#22c55e", color:"#22c55e", label:"✓ Done" }
                              : { bg:"#1e1028", border:"#c084fc", color:"#c084fc", label:"N/A" };
                            return (
                              <Cell key={s.key} center>
                                <button onClick={()=>{ if(!isEditing) updHdr(selGroup.id,h.id,"pwht",next); }} style={{
                                  background:cfg.bg, border:`1px solid ${isEditing?"#1e3a5f":cfg.border}`,
                                  color: isEditing?"#2a4a6a":cfg.color, borderRadius:5, padding:"3px 8px",
                                  cursor: isEditing?"not-allowed":"pointer", fontSize:10, fontFamily:SANS, fontWeight:700,
                                  minWidth:52, transition:"all 0.2s", opacity: isEditing?0.4:1
                                }}>
                                  {cfg.label}
                                </button>
                              </Cell>
                            );
                          }
                          return (
                            <Cell key={s.key} center>
                              <button onClick={()=>{ if(!isEditing) updHdr(selGroup.id,h.id,s.key,h[s.key]===1?0:1); }} style={{
                                background: h[s.key]===1?"#14532d":"#1a1a2e",
                                border:`1px solid ${isEditing?"#1e3a5f":h[s.key]===1?"#22c55e":"#334155"}`,
                                color: isEditing?"#2a4a6a":h[s.key]===1?"#22c55e":"#64748b",
                                borderRadius:5, padding:"3px 8px", cursor: isEditing?"not-allowed":"pointer",
                                fontSize:10, fontFamily:SANS, fontWeight:700,
                                minWidth:44, transition:"all 0.2s", opacity: isEditing?0.4:1
                              }}>
                                {h[s.key]===1?"✓":"—"}
                              </button>
                            </Cell>
                          );
                        })}
                        <Cell center>
                          <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:pct2color(donePct) }}>{donePct}%</span>
                        </Cell>
                        <Cell center>
                          <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                            <button
                              onClick={()=>setEditingHdrId(isEditing?null:h.id)}
                              title={isEditing?"Lock row":"Edit row"}
                              style={{
                                background: isEditing?`${accent}22`:"#0a1628",
                                border:`1px solid ${isEditing?accent:C.border}`,
                                color: isEditing?accent:C.dim,
                                borderRadius:4, padding:"2px 7px", cursor:"pointer", fontSize:11,
                                transition:"all 0.2s"
                              }}
                            >Edit</button>
                            {isEditing && (
                              <button onClick={()=>{ delHdr(selGroup.id,h.id); setEditingHdrId(null); }}
                                style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"2px 6px", cursor:"pointer", fontSize:11 }}>✕</button>
                            )}
                          </div>
                        </Cell>
                      </tr>
                    );
                  });})()}
                </tbody>
                <tfoot>
                  <tr style={{ background:"#081220" }}>
                    <td colSpan={2} style={{ padding:"8px 12px", fontFamily:SANS, fontSize:12, color:accent, fontWeight:700 }}>TOTAL — {selGroup.groupName}</td>
                    {STEPS.map(s=>{
                      const cnt = selGroup.headers.filter(h=>s.key==="pwht" ? (h.pwht===1||h.pwht===2) : h[s.key]===1).length;
                      return <Cell key={s.key} center><span style={{ fontFamily:MONO, fontSize:13, fontWeight:800, color:s.color }}>{cnt}<span style={{ color:C.dim, fontSize:11 }}>/{selGroup.headers.length}</span></span></Cell>;
                    })}
                    <Cell center><span style={{ fontFamily:MONO, fontSize:13, fontWeight:800, color:pct2color(grpInspPct(selGroup)) }}>{grpInspPct(selGroup)}%</span></Cell>
                    <Cell />
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{ padding:12 }}>
              <button onClick={()=>addHdr(selGroup.id)} style={{ background:`${accent}15`, border:`1px dashed ${accent}55`, color:accent, borderRadius:7, padding:"8px 18px", cursor:"pointer", fontSize:12, fontFamily:SANS, fontWeight:600 }}>+ Add Header</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HeaderFabTab({ rows, setRows }) {
  const { useState: useS } = React;
  const [filter, setFilter] = useS({ unit:"", boxNo:"", harp:"" });

  const totalQty  = rows.reduce((s,r)=>s+(Number(r.qty)||0),0);
  const avgPlan   = rows.length ? Math.round(rows.reduce((s,r)=>s+(Number(r.planPct)||0),0)/rows.length) : 0;
  const avgActual = rows.length ? Math.round(rows.reduce((s,r)=>s+(Number(r.actualPct)||0),0)/rows.length) : 0;
  const doneCnt   = rows.filter(r=>Number(r.actualPct)>=100).length;

  const upd = (id, field, val) => setRows(p=>p.map(r=>r.id===id ? {...r,[field]:val} : r));
  const addRow = () => setRows(prev=>[...prev,{ id:`hfn${Date.now()}`, unit:"", boxNo:"", harp:"", headerNo:"", dimension:"", material:"", qty:"1", planPct:0, actualPct:0 }]);
  const delRow = (id) => setRows(prev=>prev.filter(r=>r.id!==id));

  const filtered = rows.filter(r =>
    (!filter.unit   || r.unit===filter.unit) &&
    (!filter.boxNo  || r.boxNo===filter.boxNo) &&
    (!filter.harp   || r.harp.includes(filter.harp))
  );

  const computedSpans = filtered.map((r, i) => {
    const unitStart = i===0 || filtered[i-1].unit!==r.unit;
    const boxStart  = i===0 || filtered[i-1].boxNo!==r.boxNo || filtered[i-1].unit!==r.unit;
    let unitSpan=1, boxSpan=1;
    if(unitStart){ let j=i+1; while(j<filtered.length&&filtered[j].unit===r.unit)j++; unitSpan=j-i; }
    if(boxStart) { let j=i+1; while(j<filtered.length&&filtered[j].boxNo===r.boxNo&&filtered[j].unit===r.unit)j++; boxSpan=j-i; }
    return { unitStart, boxStart, unitSpan, boxSpan };
  });

  const units  = [...new Set(rows.map(r=>r.unit))].filter(Boolean).sort();
  const boxes  = [...new Set(rows.filter(r=>!filter.unit||r.unit===filter.unit).map(r=>r.boxNo))].filter(Boolean).sort((a,b)=>Number(b)-Number(a));
  const accent = "#fb923c";
  const selStyle = { background:"#081220", border:`1px solid ${C.border}`, borderRadius:5, color:C.text, padding:"5px 8px", fontSize:12, fontFamily:SANS };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Q'ty",    val:totalQty,          color:C.accent  },
          { label:"Total Headers", val:rows.length,        color:"#fb923c" },
          { label:"Completed",     val:doneCnt,            color:C.green   },
          { label:"Avg. Actual %", val:`${avgActual}%`,    color:pct2color(avgActual) },
        ].map(c=>(
          <div key={c.label} style={{ background:C.panel, border:`1px solid ${c.color}33`, borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:13, color:C.dim, fontFamily:SANS, fontWeight:600, marginBottom:6 }}>{c.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:c.color, fontFamily:MONO }}>{c.val}</div>
          </div>
        ))}
      </div>

      <SectionCard title="HEADER FAB" badge={`${filtered.length} / ${rows.length}`} accent={accent}>
        <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontSize:12, color:C.dim, fontWeight:600 }}>Filter:</span>
          <select value={filter.unit} onChange={e=>setFilter(f=>({...f,unit:e.target.value,boxNo:""}))} style={selStyle}>
            <option value="">All Units</option>
            {units.map(u=><option key={u} value={u}>Unit {u}</option>)}
          </select>
          <select value={filter.boxNo} onChange={e=>setFilter(f=>({...f,boxNo:e.target.value}))} style={selStyle}>
            <option value="">All Boxes</option>
            {boxes.map(b=><option key={b} value={b}>Box {b}</option>)}
          </select>
          <input placeholder="Harp…" value={filter.harp} onChange={e=>setFilter(f=>({...f,harp:e.target.value}))}
            style={{ ...selStyle, width:90 }} />
          {(filter.unit||filter.boxNo||filter.harp) && (
            <button onClick={()=>setFilter({unit:"",boxNo:"",harp:""})}
              style={{ background:`${C.red}20`, border:`1px solid ${C.red}44`, color:C.red, borderRadius:5, padding:"5px 10px", cursor:"pointer", fontSize:12 }}>✕ Clear</button>
          )}
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:820 }}>
            <thead>
              <tr>
                <Th center>Unit</Th>
                <Th center>Box No.</Th>
                <Th center>Harp</Th>
                <Th center>Header no.</Th>
                <Th>Material Spect</Th>
                <Th center>Q'ty</Th>
                <Th center>Plan %</Th>
                <Th center>Actual %</Th>
                <Th center>—</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const sp = computedSpans[i];
                const unitColor = ["#fbbf24","#60a5fa","#f87171","#34d399","#c084fc","#fb923c"][Number(r.unit)%6];
                return (
                  <tr key={r.id} style={{ background: Number(r.actualPct)>=100?"#0d2010":"transparent" }}>
                    {sp.unitStart && (
                      <td rowSpan={sp.unitSpan} style={{ padding:"4px 8px", textAlign:"center", fontFamily:MONO, fontWeight:800, fontSize:15, color:unitColor, background:"#0c1a2e", borderRight:`2px solid ${unitColor}44`, verticalAlign:"middle", borderBottom:`1px solid ${C.border}` }}>
                        {r.unit}
                      </td>
                    )}
                    {sp.boxStart && (
                      <td rowSpan={sp.boxSpan} style={{ padding:"4px 8px", textAlign:"center", fontFamily:MONO, fontWeight:700, fontSize:14, color:accent, background:"#0e1e30", borderRight:`1px solid ${C.border}`, verticalAlign:"middle", borderBottom:`1px solid ${C.border}` }}>
                        {r.boxNo}
                      </td>
                    )}
                    <Cell center mono style={{ fontSize:12 }}>{r.harp}</Cell>
                    <Cell center>
                      <InlineEdit value={r.headerNo||""} onChange={v=>upd(r.id,"headerNo",v)} style={{ width:64, textAlign:"center", fontSize:12, color:C.accent }} />
                    </Cell>
                    <Cell style={{ fontSize:12 }}>
                      <InlineEdit value={r.material||""} onChange={v=>upd(r.id,"material",v)} style={{ width:110, fontSize:12 }} />
                    </Cell>
                    <Cell center mono style={{ fontSize:12 }}>
                      <InlineEdit value={r.qty||""} onChange={v=>upd(r.id,"qty",v)} style={{ width:40, textAlign:"center", fontSize:12 }} />
                    </Cell>
                    <Cell center>
                      <InlineEdit value={r.planPct} onChange={v=>upd(r.id,"planPct",Math.min(100,Math.max(0,Number(v))))} type="number" style={{ width:44, textAlign:"center", color:C.amber, fontSize:12 }} />
                      <span style={{ color:C.dim, fontSize:10 }}>%</span>
                    </Cell>
                    <Cell center>
                      <InlineEdit value={r.actualPct} onChange={v=>upd(r.id,"actualPct",Math.min(100,Math.max(0,Number(v))))} type="number" style={{ width:44, textAlign:"center", color:pct2color(Number(r.actualPct)), fontSize:12 }} />
                      <span style={{ color:C.dim, fontSize:10 }}>%</span>
                    </Cell>
                    <Cell center>
                      <button onClick={()=>delRow(r.id)} style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"2px 7px", cursor:"pointer", fontSize:11 }}>✕</button>
                    </Cell>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:14 }}>
          <button onClick={addRow} style={{ background:`${C.accent}15`, border:`1px dashed ${C.accent}55`, color:C.accent, borderRadius:7, padding:"9px 20px", cursor:"pointer", fontSize:13, fontFamily:SANS, fontWeight:600 }}>+ Add Row</button>
        </div>
      </SectionCard>
    </div>
  );
}

function HarpFabTab({ rows, setRows }) {
  const { useState: useS } = React;
  const [selId, setSelId] = useS(rows[0]?.id || null);
  const [filterBox, setFilterBox] = useS("");
  const [editingHarpId, setEditingHarpId] = useS(null);

  const selGroup = rows.find(g=>g.id===selId) || rows[0];
  const today = new Date(); today.setHours(0,0,0,0);
  const timePct = (s,f) => {
    if(!s||!f) return 0;
    const sd=new Date(s),fd=new Date(f);
    if(isNaN(sd)||isNaN(fd)||fd<=sd) return 0;
    if(today<=sd) return 0; if(today>=fd) return 100;
    return Math.round((today-sd)/(fd-sd)*100);
  };

  const weldPct  = h => h.planQty>0 ? Math.min(100,Math.round((Number(h.completedQty)||0)/h.planQty*100)) : 0;
  const hydroPct = h => h.hydroDone===1 ? 100 : 0;
  const groupWeldPct  = g => g.harps.length ? Math.round(g.harps.reduce((s,h)=>s+weldPct(h),0)/g.harps.length) : 0;
  const groupHydroPct = g => g.harps.length ? Math.round(g.harps.reduce((s,h)=>s+hydroPct(h),0)/g.harps.length) : 0;

  const allHarps = rows.flatMap(g=>g.harps);
  const totalPlanQty   = rows.reduce((s,g)=>s+g.planQty,0);
  const totalCompleted = allHarps.reduce((s,h)=>s+(Number(h.completedQty)||0),0);
  const totalHydro     = allHarps.filter(h=>h.hydroDone===1).length;
  const totalHarps     = allHarps.length;
  const overallWeld    = totalPlanQty>0 ? Math.min(100,Math.round(totalCompleted/totalPlanQty*100)) : 0;
  const overallHydro   = totalHarps>0 ? Math.round(totalHydro/totalHarps*100) : 0;

  // Overall Plan% = avg time-based plan across groups with dates
  const validGroups = rows.filter(g=>g.start&&g.finish);
  const overallPlan = validGroups.length
    ? Math.round(validGroups.reduce((s,g)=>s+timePct(g.start,g.finish),0)/validGroups.length)
    : 0;
  const weldDiff = overallWeld - overallPlan;
  const weldStatus = overallPlan===0
    ? { label:'No Plan', icon:'—', col:'#64748b', bg:'linear-gradient(135deg,#1e293b,#0f172a)' }
    : weldDiff>2   ? { label:'Ahead of Plan', icon:'▲', col:'#22c55e', bg:'linear-gradient(135deg,#052e16,#0a1f1a)' }
    : weldDiff>=-2 ? { label:'On Schedule',   icon:'●', col:'#f59e0b', bg:'linear-gradient(135deg,#1c1200,#131005)' }
    :                { label:'Behind Plan',   icon:'▼', col:'#ef4444', bg:'linear-gradient(135deg,#2d0a0a,#1a0606)' };

  const updHarp = (gid,hid,field,val) => setRows(prev=>prev.map(g=>g.id===gid?{...g,harps:g.harps.map(h=>h.id===hid?{...h,[field]:val}:h)}:g));
  const addHarp = gid => setRows(prev=>prev.map(g=>g.id===gid?{...g,harps:[...g.harps,{id:`hn${Date.now()}`,boxNo:"",harpNo:"",unit:"Weld",planQty:0,completedQty:0,hydroDone:0,start:"",finish:""}]}:g));
  const delHarp = (gid,hid) => setRows(prev=>prev.map(g=>g.id===gid?{...g,harps:g.harps.filter(h=>h.id!==hid)}:g));

  const accent = "#4ade80";
  const hydroColor = "#38bdf8";
  const filteredHarps = selGroup ? (filterBox ? selGroup.harps.filter(h=>h.boxNo===filterBox) : selGroup.harps) : [];
  const boxes = selGroup ? [...new Set(selGroup.harps.map(h=>h.boxNo))].filter(Boolean) : [];
  const selSt = { background:"#071018", border:`1px solid ${C.border}`, borderRadius:5, color:C.text, padding:"4px 8px", fontSize:12, fontFamily:SANS };

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0d1f3a,#0a1525)", border:`1px solid ${accent}33`, borderRadius:10, padding:"14px 20px", marginBottom:12 }}>
        <div style={{ fontSize:11, color:C.dim, fontFamily:SANS, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Harp — Overall Progress</div>
        <div style={{ display:"flex", gap:20, alignItems:"stretch" }}>
          {/* Col 1: Plan/Actual/Status + bars */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:280 }}>
            <div style={{ display:"flex", gap:12, alignItems:"stretch" }}>
              <div style={{ textAlign:"center", minWidth:60 }}>
                <div style={{ fontSize:10, color:C.amber, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>PLAN</div>
                <div style={{ fontSize:28, fontWeight:900, color:C.amber, fontFamily:MONO, lineHeight:1 }}>{overallPlan}<span style={{ fontSize:13, color:`${C.amber}88` }}>%</span></div>
              </div>
              <div style={{ width:1, background:C.border }} />
              <div style={{ textAlign:"center", minWidth:60 }}>
                <div style={{ fontSize:10, color:accent, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>ACTUAL</div>
                <div style={{ fontSize:28, fontWeight:900, color:accent, fontFamily:MONO, lineHeight:1 }}>{overallWeld}<span style={{ fontSize:13, color:`${accent}88` }}>%</span></div>
              </div>
              <div style={{ flex:1, background:weldStatus.bg, border:`1px solid ${weldStatus.col}55`, borderRadius:8, padding:"6px 12px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ fontSize:9, color:`${weldStatus.col}99`, fontFamily:SANS, fontWeight:600 }}>CURRENT STATUS</div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:16, color:weldStatus.col }}>{weldStatus.icon}</span>
                  <span style={{ fontSize:13, fontWeight:900, color:weldStatus.col, fontFamily:SANS }}>{weldStatus.label}</span>
                </div>
                {overallPlan>0 && <div style={{ fontFamily:MONO, fontSize:10, color:`${weldStatus.col}cc` }}>{weldDiff>=0?`+${weldDiff}%`:`${weldDiff}%`} vs Plan</div>}
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:9, color:C.amber, fontWeight:600 }}>PLAN</span>
                <span style={{ fontSize:9, fontFamily:MONO, color:C.amber }}>{overallPlan}%</span>
              </div>
              <div style={{ background:"#071018", borderRadius:4, height:7, overflow:"hidden", border:`1px solid ${C.amber}33` }}>
                <div style={{ width:`${overallPlan}%`, height:"100%", background:`linear-gradient(90deg,#b45309,#f59e0b)`, borderRadius:4 }} />
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:9, color:accent, fontWeight:600 }}>ACTUAL</span>
                <span style={{ fontSize:9, fontFamily:MONO, color:accent }}>{overallWeld}%</span>
              </div>
              <div style={{ background:"#071018", borderRadius:4, height:10, overflow:"hidden", border:`1px solid ${accent}44`, position:"relative" }}>
                <div style={{ position:"absolute", top:0, left:0, width:`${overallPlan}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}99`, pointerEvents:"none" }} />
                <div style={{ position:"relative", width:`${overallWeld}%`, height:"100%", background:`linear-gradient(90deg,${accent}88,${accent})`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
                  {overallWeld>=10 && <span style={{ fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, paddingRight:4 }}>{overallWeld}%</span>}
                </div>
              </div>
            </div>
          </div>
          <div style={{ width:1, background:C.border }} />
          {/* Col 2+3: big numbers + bars merged */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10, justifyContent:"center" }}>
            {[
              { label:"WELDING",   val:totalCompleted, total:totalPlanQty, unit:"welds", color:accent,     big:overallWeld  },
              { label:"HYDRO TEST",val:totalHydro,     total:totalHarps,   unit:"harps", color:hydroColor, big:overallHydro },
            ].map(s => {
              const pct = s.total>0 ? Math.min(100,Math.round(s.val/s.total*100)) : 0;
              return (
                <div key={s.label} style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ textAlign:"center", minWidth:90 }}>
                    <div style={{ fontSize:10, color:s.color, fontFamily:SANS, fontWeight:700, marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:30, fontWeight:900, color:s.color, fontFamily:MONO, lineHeight:1 }}>{s.big}<span style={{ fontSize:13, color:`${s.color}88` }}>%</span></div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:9, color:s.color, fontWeight:600 }}>{s.val.toLocaleString()} / {s.total.toLocaleString()} {s.unit}</span>
                      <span style={{ fontSize:9, fontFamily:MONO, color:s.color, fontWeight:700 }}>{pct}%</span>
                    </div>
                    <div style={{ background:"#071018", borderRadius:4, height:8, overflow:"hidden", border:`1px solid ${s.color}33` }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${s.color}88,${s.color})`, borderRadius:4 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        {[
          { label:"Total Boxes",               val:new Set(allHarps.map(h=>h.boxNo)).size, color:C.accent },
          { label:"Total Plan Weld Q'TY",      val:totalPlanQty.toLocaleString(),          color:accent   },
          { label:"Welding Done Q'TY",         val:totalCompleted.toLocaleString(),        color:C.amber  },
          { label:"Hydrotest Complete (Harps)",val:`${totalHydro} / ${totalHarps}`,        color:hydroColor },
        ].map(c=>(
          <div key={c.label} style={{ background:C.panel, border:`1px solid ${c.color}33`, borderRadius:8, padding:"12px 16px" }}>
            <div style={{ fontSize:12, color:C.dim, fontFamily:SANS, fontWeight:600, marginBottom:5 }}>{c.label}</div>
            <div style={{ fontSize:20, fontWeight:800, color:c.color, fontFamily:MONO }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:14 }}>
        <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"9px 14px", background:"#071018", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.dim, letterSpacing:"0.1em", textTransform:"uppercase" }}>Box Groups</span>
          </div>
          {rows.map(g => {
            const wp = groupWeldPct(g), hp = groupHydroPct(g);
            const isActive = selId===g.id;
            return (
              <div key={g.id} onClick={()=>{ setSelId(g.id); setFilterBox(""); }} style={{
                padding:"9px 14px", cursor:"pointer", borderBottom:`1px solid ${C.border}22`,
                background: isActive ? `${accent}12` : "transparent",
                borderLeft: isActive ? `3px solid ${accent}` : "3px solid transparent",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:700, color: isActive ? accent : C.text, fontFamily:MONO }}>{g.groupName}</span>
                  <span style={{ fontSize:10, color:C.dim }}>{g.harps.length} harps</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
                  <span style={{ fontSize:9, color:accent, width:10 }}>W</span>
                  <div style={{ flex:1, height:4, background:"#071018", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ width:`${wp}%`, height:"100%", background:accent, borderRadius:99 }} />
                  </div>
                  <span style={{ fontSize:9, color:accent, fontFamily:MONO, width:26, textAlign:"right" }}>{wp}%</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:9, color:hydroColor, width:10 }}>H</span>
                  <div style={{ flex:1, height:4, background:"#071018", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ width:`${hp}%`, height:"100%", background:hydroColor, borderRadius:99 }} />
                  </div>
                  <span style={{ fontSize:9, color:hydroColor, fontFamily:MONO, width:26, textAlign:"right" }}>{hp}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {selGroup && (
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"10px 16px", background:"#071018", borderBottom:`1px solid ${C.border}` }}>
              {/* Top row */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:0 }}>
                <div>
                  <span style={{ fontSize:14, fontWeight:700, color:accent }}>{selGroup.groupName}</span>
                  <span style={{ fontSize:12, color:C.dim, marginLeft:10 }}>{selGroup.harps.length} harps · {selGroup.planQty.toLocaleString()} welds</span>
                  <span style={{ fontSize:11, marginLeft:12 }}>
                    <span style={{ color:"#f59e0b", fontWeight:600 }}>Plan Start</span>
                    <span style={{ color:C.dim }}> {selGroup.start}</span>
                    <span style={{ color:"#2a4a6a", margin:"0 6px" }}>→</span>
                    <span style={{ color:"#f59e0b", fontWeight:600 }}>Plan Finish</span>
                    <span style={{ color:C.dim }}> {selGroup.finish}</span>
                  </span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <select value={filterBox} onChange={e=>setFilterBox(e.target.value)} style={selSt}>
                    <option value="">All Boxes</option>
                    {boxes.map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                  {filterBox && <button onClick={()=>setFilterBox("")} style={{ background:`${C.red}20`, border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"3px 8px", cursor:"pointer", fontSize:11 }}>✕</button>}
                </div>
              </div>
            </div>

            {/* Per-box breakdown bars */}
            {(() => {
              const boxList = [...new Set(selGroup.harps.map(h=>h.boxNo))].filter(Boolean);
              return (
                <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(boxList.length,3)},1fr)`, gap:8, padding:"10px 16px", borderBottom:`1px solid ${C.border}`, background:"#060d1a" }}>
                  {boxList.map(boxNo => {
                    const harps = selGroup.harps.filter(h=>h.boxNo===boxNo);
                    const totalPlan = harps.reduce((s,h)=>s+h.planQty,0);
                    const totalDone = harps.reduce((s,h)=>s+(Number(h.completedQty)||0),0);
                    const wPct = totalPlan>0 ? Math.min(100,Math.round(totalDone/totalPlan*100)) : 0;
                    const hydroDone = harps.filter(h=>h.hydroDone===1).length;
                    const hPct = harps.length>0 ? Math.round(hydroDone/harps.length*100) : 0;
                    const wCol = pct2color(wPct);
                    return (
                      <div key={boxNo} style={{ background:"#081220", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 10px" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:accent, fontFamily:MONO, marginBottom:6 }}>{boxNo}</div>
                        {/* Weld bar */}
                        <div style={{ marginBottom:5 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                            <span style={{ fontSize:9, color:accent, fontWeight:600 }}>WELDING — {totalDone.toLocaleString()} / {totalPlan.toLocaleString()} welds</span>
                            <span style={{ fontSize:9, fontFamily:MONO, color:wCol, fontWeight:700 }}>{wPct}%</span>
                          </div>
                          <div style={{ background:"#071018", borderRadius:3, height:6, overflow:"hidden", border:`1px solid ${wCol}33` }}>
                            <div style={{ width:`${wPct}%`, height:"100%", background:`linear-gradient(90deg,${wCol}88,${wCol})`, borderRadius:3 }} />
                          </div>
                        </div>
                        {/* Hydro bar */}
                        <div>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                            <span style={{ fontSize:9, color:"#38bdf8", fontWeight:600 }}>HYDRO TEST — {hydroDone} / {harps.length} Harps</span>
                            <span style={{ fontSize:9, fontFamily:MONO, color:"#38bdf8", fontWeight:700 }}>{hPct}%</span>
                          </div>
                          <div style={{ background:"#071018", borderRadius:3, height:6, overflow:"hidden", border:`1px solid #38bdf833` }}>
                            <div style={{ width:`${hPct}%`, height:"100%", background:"linear-gradient(90deg,#38bdf888,#38bdf8)", borderRadius:3 }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:780 }}>
                <thead>
                  <tr style={{ background:"#071018" }}>
                    <Th center>Box No.</Th>
                    <Th center>Harp No.</Th>
                    <Th center style={{ color:C.amber }}>Plan Q'TY</Th>
                    <Th center style={{ color:accent }}>Completed Q'TY</Th>
                    <Th center style={{ minWidth:180 }}>% PROGRESS (Weld)</Th>
                    <Th center style={{ color:hydroColor }}>Hydro Test</Th>
                    <Th center style={{ color:hydroColor }}>Hydro %</Th>
                    <Th center>START</Th>
                    <Th center>FINISH</Th>
                    <Th center>—</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHarps.map((h,i) => {
                    const wp = weldPct(h);
                    const hp_val = hydroPct(h);
                    const pp = timePct(h.start, h.finish);
                    const wdiff = wp-pp;
                    const wsc = pp===0
                      ? (wp===0?"#64748b":wp>=100?"#22c55e":"#38bdf8")
                      : wdiff>2?"#22c55e":wdiff>=-2?"#f59e0b":"#ef4444";
                    const isEditing = editingHarpId === h.id;
                    return (
                      <tr key={h.id} style={{ background: isEditing?"#0a1f3a":wp>=100&&hp_val>=100?"#0d2010":i%2===0?"transparent":"#050e1a", borderBottom:`1px solid ${C.border}22`, outline:isEditing?`1px solid ${accent}55`:"none" }}>
                        <Cell center mono style={{ fontSize:12, color:"#94a3b8" }}>
                          {isEditing
                            ? <InlineEdit value={h.boxNo||""} onChange={v=>updHarp(selGroup.id,h.id,"boxNo",v)} style={{ width:56, textAlign:"center", fontSize:12 }} />
                            : h.boxNo||"—"}
                        </Cell>
                        <Cell center mono style={{ fontSize:13, fontWeight:700, color:accent }}>
                          {isEditing
                            ? <InlineEdit value={h.harpNo||""} onChange={v=>updHarp(selGroup.id,h.id,"harpNo",v)} style={{ width:64, textAlign:"center", color:accent, fontWeight:700, fontSize:13 }} />
                            : <span style={{ background:`${accent}18`, border:`1px solid ${accent}44`, borderRadius:5, padding:"2px 8px" }}>{h.harpNo||"—"}</span>}
                        </Cell>
                        <Cell center>
                          <InlineEdit value={h.planQty} onChange={v=>updHarp(selGroup.id,h.id,"planQty",Math.max(0,Number(v)))} type="number"
                            style={{ width:60, textAlign:"center", color:C.amber, fontWeight:600, fontSize:13, opacity:isEditing?0.4:1, pointerEvents:isEditing?"none":"auto" }} />
                        </Cell>
                        <Cell center>
                          <InlineEdit value={Number(h.completedQty)||0} onChange={v=>updHarp(selGroup.id,h.id,"completedQty",Math.max(0,Number(v)))} type="number"
                            style={{ width:60, textAlign:"center", color:wsc, fontWeight:600, fontSize:13 }} />
                        </Cell>
                        <Cell style={{ padding:"7px 12px", minWidth:180 }}>
                          <div style={{ position:"relative", height:16, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${wsc}44`, marginBottom:3 }}>
                            {pp>0&&<div style={{ position:"absolute", top:0, left:0, width:`${pp}%`, height:"100%", borderRight:`2px dashed ${C.amber}cc`, background:`repeating-linear-gradient(90deg,transparent,transparent 5px,${C.amber}15 5px,${C.amber}15 6px)`, pointerEvents:"none" }} />}
                            <div style={{ position:"relative", width:`${wp}%`, height:"100%", background:`linear-gradient(90deg,${wsc}77,${wsc})`, borderRadius:4, transition:"width 0.3s", display:"flex", alignItems:"center", justifyContent:"flex-end", overflow:"hidden" }}>
                              {wp>=20&&<span style={{ fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, paddingRight:4 }}>{wp}%</span>}
                            </div>
                            {wp<20&&<span style={{ position:"absolute", left:`${wp+1}%`, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:wsc, fontWeight:800 }}>{wp}%</span>}
                          </div>
                          <div style={{ fontSize:9, color:C.dim }}>P <b style={{color:C.amber}}>{pp}%</b> | A <b style={{color:wsc}}>{wp}%</b></div>
                        </Cell>
                        <Cell center>
                          <button
                            onClick={()=>updHarp(selGroup.id,h.id,"hydroDone", h.hydroDone===1?0:1)}
                            style={{
                              background: h.hydroDone===1?"#14532d":"#1a1a2e",
                              border: `1px solid ${h.hydroDone===1?"#22c55e":"#334155"}`,
                              color: h.hydroDone===1?"#22c55e":"#64748b",
                              borderRadius:6, padding:"4px 12px", cursor:"pointer",
                              fontSize:11, fontFamily:SANS, fontWeight:700,
                              minWidth:100, transition:"all 0.2s"
                            }}>
                            {h.hydroDone===1?"✓ Complete":"Non-Complete"}
                          </button>
                        </Cell>
                        <Cell center>
                          {h.hydroDone===1
                            ? <span style={{ fontFamily:MONO, fontSize:12, color:"#22c55e", fontWeight:800 }}>100%</span>
                            : <span style={{ fontFamily:MONO, fontSize:12, color:"#64748b", fontWeight:600 }}>0%</span>
                          }
                        </Cell>
                        <Cell center style={{ fontSize:11 }}>
                          <InlineEdit value={h.start||""} onChange={v=>updHarp(selGroup.id,h.id,"start",v)} style={{ width:86, textAlign:"center", fontSize:11 }} />
                        </Cell>
                        <Cell center style={{ fontSize:11 }}>
                          <InlineEdit value={h.finish||""} onChange={v=>updHarp(selGroup.id,h.id,"finish",v)} style={{ width:86, textAlign:"center", fontSize:11 }} />
                        </Cell>
                        <Cell center>
                          <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                            <button onClick={()=>setEditingHarpId(isEditing?null:h.id)}
                              style={{ background:isEditing?`${accent}22`:"#0a1628", border:`1px solid ${isEditing?accent:C.border}`, color:isEditing?accent:C.dim, borderRadius:4, padding:"2px 7px", cursor:"pointer", fontSize:11, transition:"all 0.2s" }}>Edit</button>
                            {isEditing && (
                              <button onClick={()=>{ delHarp(selGroup.id,h.id); setEditingHarpId(null); }}
                                style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"2px 6px", cursor:"pointer", fontSize:11 }}>✕</button>
                            )}
                          </div>
                        </Cell>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background:"#081220" }}>
                    <td colSpan={3} style={{ padding:"8px 12px", fontFamily:SANS, fontSize:12, color:accent, fontWeight:700 }}>TOTAL — {selGroup.groupName}</td>
                    <Cell center mono style={{ fontWeight:700, color:C.amber }}>{selGroup.harps.reduce((s,h)=>s+h.planQty,0).toLocaleString()}</Cell>
                    <Cell center><span style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color:pct2color(groupWeldPct(selGroup)) }}>{groupWeldPct(selGroup)}%</span></Cell>
                    <Cell center mono style={{ fontWeight:700, color:hydroColor }}>{selGroup.harps.filter(h=>h.hydroDone===1).length} / {selGroup.harps.length}</Cell>
                    <Cell center><span style={{ fontFamily:MONO, fontWeight:700, color:hydroColor }}>{groupHydroPct(selGroup)}%</span></Cell>
                    <Cell colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{ padding:12 }}>
              <button onClick={()=>addHarp(selGroup.id)} style={{ background:`${accent}15`, border:`1px dashed ${accent}55`, color:accent, borderRadius:7, padding:"8px 18px", cursor:"pointer", fontSize:12, fontFamily:SANS, fontWeight:600 }}>+ Add Harp</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CasingTab({ rows, setRows }) {
  const { useState: useS } = React;
  const accent = "#38bdf8";

  const today = new Date(); today.setHours(0,0,0,0);
  const timePct = (s,f) => {
    if(!s||!f) return 0;
    const sd=new Date(s),fd=new Date(f);
    if(isNaN(sd)||isNaN(fd)||fd<=sd) return 0;
    if(today<=sd) return 0; if(today>=fd) return 100;
    return Math.round((today-sd)/(fd-sd)*100);
  };
  const partActual = p => p.activities.length
    ? Math.round(p.activities.reduce((s,a)=>s+(Number(a.progress)||0),0)/p.activities.length) : 0;
  const partPlan = p => timePct(p.start, p.finish);

  const getBox = p => { const m = p.name.match(/Box\s+(\S+)/i); return m ? `Box ${m[1]}` : "General"; };
  const TYPE_LABEL = { build_up_beam:"Build-up Beam", top_casing:"Top Casing", side_casing:"Side Casing", bottom_casing:"Bottom Casing", shipping_frame:"Shipping Frame", tube_sheet_baffle:"Tube Sheet & Baffle", other:"Other" };
  const TYPE_COLOR = { build_up_beam:"#fb923c", top_casing:"#60a5fa", side_casing:"#4ade80", bottom_casing:"#f472b6", shipping_frame:"#34d399", tube_sheet_baffle:"#a78bfa", other:"#94a3b8" };

  const boxGroups = [...new Set(rows.map(getBox))];
  const [selBox, setSelBox] = useS(boxGroups[0] || "General");
  const [expandedPart, setExpandedPart] = useS(null);
  const [newBoxName, setNewBoxName] = useS('');
  const [addingBox, setAddingBox] = useS(false);
  const [editingAct, setEditingAct] = useS(null); // {pid, aid}

  const updPart = (id,field,val) => setRows(prev=>prev.map(p=>p.id===id?{...p,[field]:val}:p));
  const updAct  = (pid,aid,field,val) => setRows(prev=>prev.map(p=>p.id===pid?{...p,activities:p.activities.map(a=>a.id===aid?{...a,[field]:val}:a)}:p));
  const addAct  = pid => setRows(prev=>prev.map(p=>p.id===pid?{...p,activities:[...p.activities,{id:`ca${Date.now()}`,task:"New Activity",assignedTo:"",progress:0,start:"",finish:""}]}:p));
  const delAct  = (pid,aid) => setRows(prev=>prev.map(p=>p.id===pid?{...p,activities:p.activities.filter(a=>a.id!==aid)}:p));
  const addPart = () => {
    const id=`cp${Date.now()}`;
    setRows(prev=>[...prev,{id,name:`New Part Box ${selBox.replace("Box ","")}`,type:"top_casing",unit:"",qty:"",start:"",finish:"",activities:[]}]);
    setExpandedPart(id);
  };
  const delPart = id => { setRows(prev=>prev.filter(p=>p.id!==id)); if(expandedPart===id) setExpandedPart(null); };

  const boxParts = rows.filter(p=>getBox(p)===selBox);
  const statusOf = (actual, plan) => plan===0
    ? { label:"No Plan", icon:"—", col:"#64748b" }
    : actual-plan>2  ? { label:"Ahead",   icon:"▲", col:"#22c55e" }
    : actual-plan>=-2? { label:"On Plan", icon:"●", col:"#f59e0b" }
    :                  { label:"Behind",  icon:"▼", col:"#ef4444" };

  const iSt = { background:"#071018", border:`1px solid ${C.border}`, borderRadius:5, color:C.text, padding:"4px 8px", fontSize:12, fontFamily:SANS };

  // Overall
  const overallActual = rows.length ? Math.round(rows.reduce((s,p)=>s+partActual(p),0)/rows.length) : 0;
  const overallPlan   = rows.length ? Math.round(rows.reduce((s,p)=>s+partPlan(p),0)/rows.length) : 0;
  const ovSt = statusOf(overallActual, overallPlan);

  return (
    <div>
      {/* Overall banner */}
      <div style={{ background:"linear-gradient(135deg,#0d1f3a,#0a1525)", border:`1px solid ${accent}33`, borderRadius:10, padding:"14px 20px", marginBottom:14 }}>
        <div style={{ fontSize:11, color:C.dim, fontFamily:SANS, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Casing & Modulation — Overall Progress</div>
        <div style={{ display:"flex", gap:20, alignItems:"stretch" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:300 }}>
            <div style={{ display:"flex", gap:12, alignItems:"stretch" }}>
              <div style={{ textAlign:"center", minWidth:60 }}>
                <div style={{ fontSize:10, color:C.amber, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>PLAN</div>
                <div style={{ fontSize:28, fontWeight:900, color:C.amber, fontFamily:MONO, lineHeight:1 }}>{overallPlan}<span style={{ fontSize:13, color:`${C.amber}88` }}>%</span></div>
              </div>
              <div style={{ width:1, background:C.border }} />
              <div style={{ textAlign:"center", minWidth:60 }}>
                <div style={{ fontSize:10, color:accent, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>ACTUAL</div>
                <div style={{ fontSize:28, fontWeight:900, color:accent, fontFamily:MONO, lineHeight:1 }}>{overallActual}<span style={{ fontSize:13, color:`${accent}88` }}>%</span></div>
              </div>
              <div style={{ flex:1, background:`linear-gradient(135deg,${ovSt.col}18,${ovSt.col}08)`, border:`1px solid ${ovSt.col}44`, borderRadius:8, padding:"6px 12px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ fontSize:9, color:`${ovSt.col}99`, fontFamily:SANS, fontWeight:600 }}>CURRENT STATUS</div>
                <div style={{ fontSize:14, fontWeight:900, color:ovSt.col, fontFamily:SANS }}>{ovSt.icon} {ovSt.label}</div>
                {overallPlan>0 && <div style={{ fontFamily:MONO, fontSize:10, color:`${ovSt.col}cc` }}>{overallActual-overallPlan>=0?"+":""}{overallActual-overallPlan}% vs Plan</div>}
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:9, color:C.amber, fontWeight:600 }}>PLAN</span>
                <span style={{ fontSize:9, fontFamily:MONO, color:C.amber }}>{overallPlan}%</span>
              </div>
              <div style={{ background:"#071018", borderRadius:4, height:7, overflow:"hidden", border:`1px solid ${C.amber}33` }}>
                <div style={{ width:`${overallPlan}%`, height:"100%", background:`linear-gradient(90deg,#b45309,#f59e0b)`, borderRadius:4 }} />
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:9, color:accent, fontWeight:600 }}>ACTUAL</span>
                <span style={{ fontSize:9, fontFamily:MONO, color:accent }}>{overallActual}%</span>
              </div>
              <div style={{ background:"#071018", borderRadius:4, height:10, overflow:"hidden", border:`1px solid ${accent}44`, position:"relative" }}>
                <div style={{ position:"absolute", top:0, left:0, width:`${overallPlan}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}99`, pointerEvents:"none" }} />
                <div style={{ position:"relative", width:`${overallActual}%`, height:"100%", background:`linear-gradient(90deg,${accent}88,${accent})`, borderRadius:4 }} />
              </div>
            </div>
          </div>
          <div style={{ width:1, background:C.border }} />
          {/* Per-box mini bars */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, justifyContent:"center" }}>
            {boxGroups.map(box => {
              const bp = rows.filter(p=>getBox(p)===box);
              const bA = Math.round(bp.reduce((s,p)=>s+partActual(p),0)/bp.length);
              const bP = Math.round(bp.reduce((s,p)=>s+partPlan(p),0)/bp.length);
              const bSt = statusOf(bA,bP);
              return (
                <div key={box} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>setSelBox(box)}>
                  <span style={{ fontSize:10, color:selBox===box?accent:C.text, fontFamily:MONO, fontWeight:700, minWidth:70 }}>{box}</span>
                  <div style={{ flex:1, position:"relative", height:12, background:"#071018", borderRadius:3, overflow:"hidden", border:`1px solid ${bSt.col}33` }}>
                    {bP>0 && <div style={{ position:"absolute", top:0, left:0, width:`${bP}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}88`, pointerEvents:"none" }} />}
                    <div style={{ position:"relative", width:`${bA}%`, height:"100%", background:`linear-gradient(90deg,${bSt.col}77,${bSt.col})`, borderRadius:3 }} />
                  </div>
                  <span style={{ fontSize:9, color:C.amber, fontFamily:MONO, minWidth:32 }}>P {bP}%</span>
                  <span style={{ fontSize:9, color:bSt.col, fontFamily:MONO, minWidth:32 }}>A {bA}%</span>
                  <span style={{ fontSize:9, fontWeight:700, color:bSt.col, background:`${bSt.col}18`, border:`1px solid ${bSt.col}44`, borderRadius:3, padding:"1px 6px", minWidth:52, textAlign:"center" }}>{bSt.icon} {bSt.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-panel */}
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:14 }}>
        {/* Sidebar: Box groups */}
        <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"9px 14px", background:"#071018", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.dim, letterSpacing:"0.1em", textTransform:"uppercase" }}>Box Groups</span>
            {addingBox ? (
              <div style={{ display:"flex", gap:4 }} onClick={e=>e.stopPropagation()}>
                <input autoFocus value={newBoxName} onChange={e=>setNewBoxName(e.target.value)}
                  placeholder="e.g. 6B" onKeyDown={e=>{
                    if(e.key==="Enter"&&newBoxName.trim()){
                      const boxLabel=`Box ${newBoxName.trim()}`;
                      const id=`cp${Date.now()}`;
                      setRows(prev=>[...prev,{id,name:`New Part ${boxLabel}`,type:"top_casing",unit:"",qty:"",start:"",finish:"",activities:[]}]);
                      setSelBox(boxLabel); setNewBoxName(''); setAddingBox(false);
                    } else if(e.key==="Escape"){ setAddingBox(false); setNewBoxName(''); }
                  }}
                  style={{ width:60, background:"#081220", border:`1px solid ${accent}66`, borderRadius:4, color:C.text, padding:"2px 6px", fontSize:11, outline:"none" }} />
                <button onClick={()=>{ if(newBoxName.trim()){ const boxLabel=`Box ${newBoxName.trim()}`; const id=`cp${Date.now()}`; setRows(prev=>[...prev,{id,name:`New Part ${boxLabel}`,type:"top_casing",unit:"",qty:"",start:"",finish:"",activities:[]}]); setSelBox(boxLabel); setNewBoxName(''); setAddingBox(false); }}}
                  style={{ background:`${accent}20`, border:`1px solid ${accent}44`, color:accent, borderRadius:4, padding:"2px 6px", cursor:"pointer", fontSize:11 }}>✓</button>
                <button onClick={()=>{ setAddingBox(false); setNewBoxName(''); }}
                  style={{ background:"none", border:`1px solid ${C.border}`, color:C.dim, borderRadius:4, padding:"2px 5px", cursor:"pointer", fontSize:11 }}>✕</button>
              </div>
            ) : (
              <button onClick={()=>setAddingBox(true)} style={{ background:`${accent}20`, border:`1px solid ${accent}44`, color:accent, borderRadius:5, padding:"2px 8px", cursor:"pointer", fontSize:11, fontFamily:SANS }}>+ Add</button>
            )}
          </div>
          {boxGroups.map(box => {
            const bp = rows.filter(p=>getBox(p)===box);
            const bA = Math.round(bp.reduce((s,p)=>s+partActual(p),0)/bp.length);
            const bP = Math.round(bp.reduce((s,p)=>s+partPlan(p),0)/bp.length);
            const bSt = statusOf(bA,bP);
            const isActive = selBox===box;
            return (
              <div key={box} onClick={()=>setSelBox(box)} style={{
                padding:"9px 14px", cursor:"pointer", borderBottom:`1px solid ${C.border}22`,
                background: isActive?`${accent}12`:"transparent",
                borderLeft: isActive?`3px solid ${accent}`:"3px solid transparent",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:isActive?accent:C.text, fontFamily:MONO }}>{box}</span>
                  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                    <span style={{ fontSize:9, fontWeight:700, color:bSt.col, background:`${bSt.col}18`, border:`1px solid ${bSt.col}44`, borderRadius:3, padding:"1px 5px" }}>{bSt.icon} {bSt.label}</span>
                    <button onClick={e=>{ e.stopPropagation(); setRows(prev=>prev.filter(p=>getBox(p)!==box)); if(selBox===box) setSelBox(boxGroups.find(b=>b!==box)||""); }}
                      style={{ background:"none", border:`1px solid ${C.red}33`, color:C.red, borderRadius:3, padding:"1px 5px", cursor:"pointer", fontSize:10, lineHeight:1.4 }}>✕</button>
                  </div>
                </div>
                <div style={{ position:"relative", height:14, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${bSt.col}33`, marginBottom:4 }}>
                  {bP>0 && <div style={{ position:"absolute", top:0, left:0, width:`${bP}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}cc`, pointerEvents:"none" }} />}
                  <div style={{ position:"absolute", top:0, left:0, width:`${bA}%`, height:"100%", background:`linear-gradient(90deg,${bSt.col}77,${bSt.col})`, borderRadius:4, transition:"width 0.4s" }} />
                  <span style={{ position:"absolute", right:4, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, textShadow:"0 1px 3px #0009" }}>{bA}%</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:9, color:C.amber }}>P <b>{bP}%</b></span>
                  <span style={{ fontSize:9, color:bSt.col }}>A <b>{bA}%</b></span>
                  <span style={{ fontSize:9, color:C.dim }}>{bp.length} parts</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main panel: parts for selected box */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:14, fontWeight:700, color:accent, fontFamily:MONO }}>{selBox}</span>
            <button onClick={addPart} style={{ background:`${accent}18`, border:`1px dashed ${accent}55`, color:accent, borderRadius:6, padding:"5px 14px", cursor:"pointer", fontSize:12, fontFamily:SANS, fontWeight:600 }}>+ Add Part</button>
          </div>

          {boxParts.length===0 && (
            <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, padding:32, textAlign:"center", color:C.dim, fontSize:14 }}>
              No parts in this box yet. Click + Add Part to begin.
            </div>
          )}

          {boxParts.map(p => {
            const ap = partActual(p), pp = partPlan(p);
            const pSt = statusOf(ap, pp);
            const tCol = TYPE_COLOR[p.type] || "#94a3b8";
            const isExpanded = expandedPart===p.id;
            return (
              <div key={p.id} style={{ background:C.panel, border:`1px solid ${tCol}33`, borderRadius:10, overflow:"hidden" }}>
                {/* Part header */}
                <div style={{ padding:"12px 16px", background:"#0a1525", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}
                  onClick={()=>setExpandedPart(isExpanded?null:p.id)}>
                  <div style={{ width:4, height:36, background:tCol, borderRadius:2, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:tCol }}>{TYPE_LABEL[p.type]||p.type}</span>
                      <span style={{ fontSize:11, color:C.dim, fontFamily:SANS }}>{p.name}</span>
                      <span style={{ fontSize:9, color:p.start?C.dim:"#2a3a50", marginLeft:"auto" }}>{p.start||"—"} → {p.finish||"—"}</span>
                    </div>
                    <div style={{ position:"relative", height:12, background:"#071018", borderRadius:3, overflow:"hidden", border:`1px solid ${pSt.col}33` }}>
                      {pp>0 && <div style={{ position:"absolute", top:0, left:0, width:`${pp}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}99`, pointerEvents:"none" }} />}
                      <div style={{ position:"relative", width:`${ap}%`, height:"100%", background:`linear-gradient(90deg,${pSt.col}77,${pSt.col})`, borderRadius:3 }} />
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
                    <span style={{ fontSize:10, color:C.amber }}>P <b>{pp}%</b></span>
                    <span style={{ fontSize:10, color:pSt.col }}>A <b>{ap}%</b></span>
                    <span style={{ fontSize:9, fontWeight:700, color:pSt.col, background:`${pSt.col}18`, border:`1px solid ${pSt.col}44`, borderRadius:4, padding:"2px 8px" }}>{pSt.icon} {pSt.label}</span>
                    <span style={{ fontSize:12, color:C.dim }}>{isExpanded?"▲":"▼"}</span>
                  </div>
                </div>

                {/* Expanded: part meta + activities */}
                {isExpanded && (
                  <div style={{ borderTop:`1px solid ${C.border}` }}>
                    {/* Part meta row */}
                    <div style={{ padding:"12px 18px", background:"#060d1a", borderBottom:`1px solid ${C.border}22` }}>
                      <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center", marginBottom:10 }}>
                        <div style={{ flex:1, minWidth:180 }}>
                          <div style={{ fontSize:10, color:C.dim, fontWeight:600, marginBottom:4, letterSpacing:"0.06em" }}>PART NAME</div>
                          <InlineEdit value={p.name} onChange={v=>updPart(p.id,"name",v)} style={{ width:"100%", fontSize:13, fontWeight:600 }} />
                        </div>
                        <div style={{ minWidth:150 }}>
                          <div style={{ fontSize:10, color:C.dim, fontWeight:600, marginBottom:4, letterSpacing:"0.06em" }}>TYPE</div>
                          <select value={p.type} onChange={e=>updPart(p.id,"type",e.target.value)}
                            style={{ ...iSt, width:"100%", padding:"5px 8px", fontSize:12 }}>
                            <option value="build_up_beam">Build-up Beam</option>
                            <option value="top_casing">Top Casing</option>
                            <option value="side_casing">Side Casing</option>
                            <option value="bottom_casing">Bottom Casing</option>
                            <option value="shipping_frame">Shipping Frame</option>
                            <option value="tube_sheet_baffle">Tube Sheet & Baffle</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:C.dim, fontWeight:600, marginBottom:4, letterSpacing:"0.06em" }}>START</div>
                          <InlineEdit value={p.start||""} onChange={v=>updPart(p.id,"start",v)} style={{ width:96, fontSize:12 }} />
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:C.dim, fontWeight:600, marginBottom:4, letterSpacing:"0.06em" }}>FINISH</div>
                          <InlineEdit value={p.finish||""} onChange={v=>updPart(p.id,"finish",v)} style={{ width:96, fontSize:12 }} />
                        </div>
                        <button onClick={()=>delPart(p.id)} style={{ alignSelf:"flex-end", background:`${C.red}15`, border:`1px solid ${C.red}44`, color:C.red, borderRadius:6, padding:"6px 14px", cursor:"pointer", fontSize:12, fontFamily:SANS, fontWeight:600, whiteSpace:"nowrap" }}>🗑 Delete</button>
                      </div>
                    </div>

                    {/* Activities */}
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead>
                        <tr style={{ background:"#071018" }}>
                          <Th>Activity</Th>
                          <Th center style={{ minWidth:220 }}>Progress</Th>
                          <Th center>Start</Th>
                          <Th center>Finish</Th>
                          <Th center>—</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.activities.map((a,i)=>{
                          const aAct=Number(a.progress)||0;
                          const aPlan=timePct(a.start,a.finish);
                          const df=aAct-aPlan;
                          const sc=aPlan===0?"#64748b":df>2?"#22c55e":df>=-2?"#f59e0b":"#ef4444";
                          return (
                            <tr key={a.id} style={{ background:aAct>=100?"#0d2010":i%2===0?"transparent":"#050e1a", borderBottom:`1px solid ${C.border}22` }}>
                              <Cell style={{ fontWeight:600, minWidth:150 }}>
                                <InlineEdit value={a.task} onChange={v=>updAct(p.id,a.id,"task",v)} style={{ width:"100%", fontWeight:600 }} />
                              </Cell>
                              <Cell style={{ minWidth:220, padding:"8px 12px" }}>
                                <div style={{ position:"relative", height:18, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${sc}44`, marginBottom:4 }}>
                                  <div style={{ position:"absolute", top:0, left:0, width:`${aAct}%`, height:"100%", background:`linear-gradient(90deg,${sc}77,${sc})`, borderRadius:4, transition:"width 0.3s" }}>
                                    {aAct>=16&&<span style={{ position:"absolute", right:4, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800 }}>{aAct}%</span>}
                                  </div>
                                  {aPlan>0&&<div style={{ position:"absolute", top:0, left:0, width:`${aPlan}%`, height:"100%", borderRight:`2px dashed ${C.amber}cc`, background:`repeating-linear-gradient(90deg,transparent,transparent 5px,${C.amber}15 5px,${C.amber}15 6px)`, pointerEvents:"none" }} />}
                                  {aAct<16&&<span style={{ position:"absolute", left:`${aAct+1}%`, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:sc, fontWeight:800 }}>{aAct}%</span>}
                                </div>
                                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                  <span style={{ fontSize:10, color:C.amber }}>P <b>{aPlan}%</b></span>
                                  <span style={{ color:C.border, fontSize:9 }}>|</span>
                                  <span style={{ fontSize:10, color:sc }}>A</span>
                                  <input type="number" value={aAct} min={0} max={100}
                                    onChange={e=>updAct(p.id,a.id,"progress",Math.min(100,Math.max(0,Number(e.target.value))))}
                                    style={{ width:42, textAlign:"center", fontSize:12, color:sc, fontWeight:700, background:"#071018", border:`1px solid ${sc}66`, borderRadius:4, padding:"2px 4px", fontFamily:MONO }} />
                                  <span style={{ fontSize:10, color:sc }}>%</span>
                                  <span style={{ marginLeft:"auto", fontSize:9, fontWeight:700, color:sc, background:`${sc}20`, borderRadius:3, padding:"1px 5px", border:`1px solid ${sc}44`, whiteSpace:"nowrap" }}>
                                    {aPlan>0&&(df>0?"▲+":df<0?"▼":"")}{aPlan>0?`${df}% `:""}{aPlan===0?"No Plan":df>2?"Ahead":df>=-2?"On Track":"Behind"}
                                  </span>
                                </div>
                              </Cell>
                              <Cell center style={{ fontSize:12 }}>
                                <InlineEdit value={a.start||""} onChange={v=>updAct(p.id,a.id,"start",v)} style={{ width:90, fontSize:11, textAlign:"center" }} />
                              </Cell>
                              <Cell center style={{ fontSize:12 }}>
                                <InlineEdit value={a.finish||""} onChange={v=>updAct(p.id,a.id,"finish",v)} style={{ width:90, fontSize:11, textAlign:"center" }} />
                              </Cell>
                              <Cell center>
                                <button onClick={()=>delAct(p.id,a.id)} style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"2px 6px", cursor:"pointer", fontSize:11 }}>✕</button>
                              </Cell>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div style={{ padding:10, borderTop:`1px solid ${C.border}22` }}>
                      <button onClick={()=>addAct(p.id)} style={{ background:`${tCol}15`, border:`1px dashed ${tCol}55`, color:tCol, borderRadius:6, padding:"6px 16px", cursor:"pointer", fontSize:12, fontFamily:SANS, fontWeight:600 }}>+ Add Activity</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ModBoxTab({ rows, setRows, allData }) {
  const subProgress = (b) => {
    const boxNo = b.boxNo||"", boxNum=((boxNo.match(/(\d+)/)||[])[1])||"";
    const ft=(allData?.finnedTube||[]).filter(r=>(r.boxNo||"").includes("Box "+boxNum));
    const ftP=ft.length?Math.round(ft.reduce((s,r)=>{ const pq=Number(r.planQty)||0,aq=Number(r.actualQty)||0; return s+(pq>0?Math.min(100,Math.round(aq/pq*100)):0); },0)/ft.length):null;
    const hg=(allData?.harpFab||[]).find(g=>(g.groupName||"").replace(/[^0-9]/g,"")===boxNum);
    const hpP=hg?(hg.harps.length?Math.round(hg.harps.reduce((s,h)=>s+(h.planQty>0?Math.min(100,Math.round((Number(h.completedQty)||0)/h.planQty*100)):0),0)/hg.harps.length):0):null;
    const HDR_S=["cutting","drilling","endPlate","nozzle","nde","pwht","inspection"];
    const hdg=(allData?.headerDrill||[]).find(g=>(g.groupName||"").replace(/[^0-9]/g,"")===boxNum);
    const hdP=hdg?(hdg.headers.length?Math.round(hdg.headers.reduce((s,h)=>s+Math.round(HDR_S.filter(k=>k==="pwht"?(h.pwht===1||h.pwht===2):h[k]===1).length/HDR_S.length*100),0)/hdg.headers.length):0):null;
    const cp=(allData?.casing||[]).filter(p=>{ const n=(p.name||"").toLowerCase(); return n.includes("box "+boxNo.toLowerCase())||n.includes("box "+boxNum); });
    const caP=cp.length?Math.round(cp.reduce((s,p)=>s+(p.activities.length?Math.round(p.activities.reduce((ss,a)=>ss+(Number(a.progress)||0),0)/p.activities.length):0),0)/cp.length):null;
    const asP=b.activities.length?Math.round(b.activities.reduce((s,a)=>s+(Number(a.progress)||0),0)/b.activities.length):0;
    const comps=[
      {label:"Fin Tube",pct:ftP,color:"#38bdf8"},{label:"Harp",pct:hpP,color:"#4ade80"},
      {label:"Header",pct:hdP,color:"#a78bfa"},{label:"Casing",pct:caP,color:"#f472b6"},
      {label:"Assembly",pct:asP,color:"#e879f9"},
    ];
    const vals=comps.filter(c=>c.pct!==null);
    return { comps, linked:vals.length>1?Math.round(vals.reduce((s,c)=>s+c.pct,0)/vals.length):asP };
  };
  const { useState: useS } = React;
  const [selId, setSelId] = useS(rows[0]?.id || null);
  const selBox = rows.find(p=>p.id===selId) || rows[0];

  const today = new Date(); today.setHours(0,0,0,0);
  const timePct = (s,f) => {
    if(!s||!f) return 0;
    const sd=new Date(s),fd=new Date(f);
    if(isNaN(sd)||isNaN(fd)||fd<=sd) return 0;
    if(today<=sd) return 0; if(today>=fd) return 100;
    return Math.round((today-sd)/(fd-sd)*100);
  };
  const boxActual = b => { if(!allData) return b.activities.length?Math.round(b.activities.reduce((s,a)=>s+(Number(a.progress)||0),0)/b.activities.length):0; return subProgress(b).linked; };
  const boxPlan   = b => timePct(b.start, b.finish);

  const updBox = (id,field,val) => setRows(prev=>prev.map(b=>b.id===id?{...b,[field]:val}:b));
  const updAct = (bid,aid,field,val) => setRows(prev=>prev.map(b=>b.id===bid?{...b,activities:b.activities.map(a=>a.id===aid?{...a,[field]:val}:a)}:b));
  const addBox = () => { const id=`bx${Date.now()}`; setRows(prev=>[...prev,{id,name:"New Box",boxNo:"",qty:"",start:"",finish:"",activities:[]}]); setSelId(id); };
  const delBox = id => { setRows(prev=>prev.filter(b=>b.id!==id)); if(selId===id) setSelId(rows[0]?.id); };
  const addAct = bid => setRows(prev=>prev.map(b=>b.id===bid?{...b,activities:[...b.activities,{id:`ba${Date.now()}`,task:"New Activity",qty:"",progress:0,start:"",finish:""}]}:b));
  const delAct = (bid,aid) => setRows(prev=>prev.map(b=>b.id===bid?{...b,activities:b.activities.filter(a=>a.id!==aid)}:b));

  const overallAvg = rows.length ? Math.round(rows.reduce((s,b)=>s+boxActual(b),0)/rows.length) : 0;
  const planAvg    = rows.length ? Math.round(rows.reduce((s,b)=>s+boxPlan(b),0)/rows.length) : 0;
  const diff = overallAvg - planAvg;
  const status = planAvg===0
    ? { label:"No Plan",       icon:"—", col:"#64748b", bg:"linear-gradient(135deg,#1e293b,#0f172a)" }
    : diff>2  ? { label:"Ahead of Plan", icon:"▲", col:"#22c55e", bg:"linear-gradient(135deg,#052e16,#0a1f1a)" }
    : diff>=-2? { label:"On Schedule",   icon:"●", col:"#f59e0b", bg:"linear-gradient(135deg,#1c1200,#131005)" }
    :           { label:"Behind Plan",   icon:"▼", col:"#ef4444", bg:"linear-gradient(135deg,#2d0a0a,#1a0606)" };

  const accent = "#e879f9";
  const UNIT_COLORS = { A:"#60a5fa", B:"#fb923c", C:"#34d399" };
  const boxColor = b => UNIT_COLORS[b.boxNo?.slice(-1)] || "#94a3b8";

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0d1f3a,#0a1525)", border:`1px solid ${accent}33`, borderRadius:10, padding:"16px 20px", marginBottom:16 }}>
        <div style={{ fontSize:11, color:C.dim, letterSpacing:"0.1em", fontFamily:SANS, fontWeight:700, textTransform:"uppercase", marginBottom:12 }}>Box Assembly — Overall Progress</div>
        <div style={{ display:"flex", gap:16, alignItems:"stretch" }}>
          {/* Left: Plan/Actual + bars */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:280 }}>
            <div style={{ display:"flex", gap:12, alignItems:"stretch" }}>
              <div style={{ textAlign:"center", minWidth:60 }}>
                <div style={{ fontSize:10, color:C.amber, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>PLAN</div>
                <div style={{ fontSize:28, fontWeight:900, color:C.amber, fontFamily:MONO, lineHeight:1 }}>{planAvg}<span style={{ fontSize:13, color:`${C.amber}88` }}>%</span></div>
              </div>
              <div style={{ width:1, background:C.border }} />
              <div style={{ textAlign:"center", minWidth:60 }}>
                <div style={{ fontSize:10, color:C.accent, fontFamily:SANS, fontWeight:700, marginBottom:3 }}>ACTUAL</div>
                <div style={{ fontSize:28, fontWeight:900, color:C.accent, fontFamily:MONO, lineHeight:1 }}>{overallAvg}<span style={{ fontSize:13, color:`${C.accent}88` }}>%</span></div>
              </div>
              <div style={{ flex:1, background:status.bg, border:`1px solid ${status.col}55`, borderRadius:8, padding:"6px 12px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ fontSize:9, color:`${status.col}99`, fontFamily:SANS, fontWeight:600 }}>CURRENT STATUS</div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:16, color:status.col }}>{status.icon}</span>
                  <span style={{ fontSize:13, fontWeight:900, color:status.col, fontFamily:SANS }}>{status.label}</span>
                </div>
                {planAvg>0 && <div style={{ fontFamily:MONO, fontSize:10, color:`${status.col}cc` }}>{diff>=0?`+${diff}%`:`${diff}%`} vs Plan</div>}
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:9, color:C.amber, fontWeight:600 }}>PLAN</span>
                <span style={{ fontSize:9, fontFamily:MONO, color:C.amber }}>{planAvg}%</span>
              </div>
              <div style={{ background:"#071018", borderRadius:4, height:7, overflow:"hidden", border:`1px solid ${C.amber}33` }}>
                <div style={{ width:`${planAvg}%`, height:"100%", background:`linear-gradient(90deg,#b45309,#f59e0b)`, borderRadius:4 }} />
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:9, color:C.accent, fontWeight:600 }}>ACTUAL</span>
                <span style={{ fontSize:9, fontFamily:MONO, color:C.accent }}>{overallAvg}%</span>
              </div>
              <div style={{ background:"#071018", borderRadius:4, height:10, overflow:"hidden", border:`1px solid ${C.accent}44`, position:"relative" }}>
                <div style={{ position:"absolute", top:0, left:0, width:`${planAvg}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}99`, pointerEvents:"none" }} />
                <div style={{ position:"relative", width:`${overallAvg}%`, height:"100%", background:`linear-gradient(90deg,${C.accent}88,${C.accent})`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
                  {overallAvg>=10 && <span style={{ fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, paddingRight:4 }}>{overallAvg}%</span>}
                </div>
              </div>
            </div>
          </div>
          <div style={{ width:1, background:C.border }} />
          {/* Right: stat cards + per-box group breakdown */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, justifyContent:"center" }}>
            <div style={{ background:"#081220", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 20px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:C.dim, fontFamily:SANS, fontWeight:600, marginBottom:4 }}>Boxes</div>
              <div style={{ fontSize:30, fontWeight:900, color:C.accent, fontFamily:MONO }}>{new Set(rows.map(b=>{ const m=(b.boxNo||"").match(/(\d+)/); return m?m[1]:b.boxNo; })).size}</div>
            </div>
            <div style={{ background:"#081220", border:`1px solid ${C.green}33`, borderRadius:8, padding:"10px 20px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:C.dim, fontFamily:SANS, fontWeight:600, marginBottom:4 }}>Completed</div>
              <div style={{ fontSize:30, fontWeight:900, color:C.green, fontFamily:MONO }}>{rows.filter(b=>boxActual(b)===100).length}</div>
            </div>
          </div>
          <div style={{ width:1, background:C.border }} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, justifyContent:"center" }}>
            {(()=>{
              // Group by leading number e.g. "6A","6B" → "Box 6"
              const getBoxNum = b => { const m = (b.boxNo||"").match(/(\d+)/); return m ? `Box ${m[1]}` : b.boxNo||"?"; };
              const groups = [...new Set(rows.map(b=>getBoxNum(b)))].sort((a,z)=>{ const na=Number(a.replace(/\D/g,"")),nz=Number(z.replace(/\D/g,"")); return nz-na; });
              return groups.map(grp => {
                const gBoxes = rows.filter(b=>getBoxNum(b)===grp);
                const gActual = Math.round(gBoxes.reduce((s,b)=>s+boxActual(b),0)/gBoxes.length);
                const gPlan   = Math.round(gBoxes.reduce((s,b)=>s+boxPlan(b),0)/gBoxes.length);
                const gDiff   = gActual-gPlan;
                const gCol    = gPlan===0?"#64748b":gDiff>2?"#22c55e":gDiff>=-2?"#f59e0b":"#ef4444";
                const aCol    = gPlan===0?pct2color(gActual):gCol;
                return (
                  <div key={grp} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ minWidth:56 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.text, fontFamily:MONO }}>{grp}</div>
                      <div style={{ fontSize:9, color:C.dim }}>{gBoxes.map(b=>b.boxNo).join(", ")}</div>
                    </div>
                    <div style={{ flex:1, position:"relative", height:14, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${aCol}33` }}>
                      {gPlan>0 && <div style={{ position:"absolute", top:0, left:0, width:`${gPlan}%`, height:"100%", background:`${C.amber}20`, borderRight:`2px dashed ${C.amber}88`, pointerEvents:"none" }} />}
                      <div style={{ position:"absolute", top:0, left:0, width:`${gActual}%`, height:"100%", background:`linear-gradient(90deg,${aCol}77,${aCol})`, borderRadius:4 }} />
                      <span style={{ position:"absolute", right:4, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, textShadow:"0 1px 3px #0009" }}>{gActual}%</span>
                    </div>
                    <span style={{ fontSize:9, color:C.amber, fontFamily:MONO, minWidth:32 }}>P {gPlan}%</span>
                    <span style={{ fontSize:9, color:aCol, fontFamily:MONO, minWidth:32 }}>A {gActual}%</span>
                    <span style={{ fontSize:9, fontWeight:700, color:gCol, background:`${gCol}18`, border:`1px solid ${gCol}44`, borderRadius:3, padding:"1px 6px", minWidth:52, textAlign:"center", whiteSpace:"nowrap" }}>
                      {gPlan===0?"No Plan":gDiff>2?"▲ Ahead":gDiff>=-2?"● On Plan":"▼ Behind"}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:14 }}>
        <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"10px 14px", background:"#071018", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.dim, letterSpacing:"0.1em", textTransform:"uppercase" }}>Boxes</span>
            <button onClick={addBox} style={{ background:`${accent}20`, border:`1px solid ${accent}44`, color:accent, borderRadius:5, padding:"2px 8px", cursor:"pointer", fontSize:11 }}>+ Add</button>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {rows.map(b => {
              const ap = boxActual(b), pp = boxPlan(b), diff2 = ap-pp;
              const bc = boxColor(b);
              const sc = pp===0?"#64748b":diff2>2?"#22c55e":diff2>=-2?"#f59e0b":"#ef4444";
              const actualCol = pp===0 ? pct2color(ap) : sc;
              const isActive = selId===b.id;
              return (
                <div key={b.id} onClick={()=>setSelId(b.id)} style={{
                  padding:"9px 14px", cursor:"pointer", borderBottom:`1px solid ${C.border}22`,
                  background: isActive ? `${accent}12` : "transparent",
                  borderLeft: isActive ? `3px solid ${accent}` : "3px solid transparent",
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:700, color: isActive ? accent : bc, fontFamily:MONO }}>{b.boxNo || "—"}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:sc, background:`${sc}18`, border:`1px solid ${sc}44`, borderRadius:3, padding:"1px 5px", whiteSpace:"nowrap" }}>
                      {pp===0?"No Plan":diff2>2?"▲ Ahead":diff2>=-2?"● On Plan":"▼ Behind"}
                    </span>
                  </div>
                  <div style={{ fontSize:10, color:C.dim, marginBottom:5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{b.name}</div>
                  <div style={{ position:"relative", height:14, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${actualCol}33`, marginBottom:4 }}>
                    <div style={{ position:"absolute", top:0, left:0, width:`${ap}%`, height:"100%", background:`linear-gradient(90deg,${actualCol}77,${actualCol})`, borderRadius:4, transition:"width 0.4s" }} />
                    {pp>0 && <div style={{ position:"absolute", top:0, left:0, width:`${pp}%`, height:"100%", borderRight:`2px dashed ${C.amber}cc`, background:`repeating-linear-gradient(90deg,transparent,transparent 4px,${C.amber}12 4px,${C.amber}12 5px)`, pointerEvents:"none" }} />}
                    <span style={{ position:"absolute", right:4, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800, textShadow:"0 1px 3px #0009" }}>{ap}%</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:9, color:C.amber, fontFamily:SANS }}>P <b style={{color:C.amber}}>{pp}%</b></span>
                    <span style={{ fontSize:9, color:actualCol, fontFamily:SANS }}>A <b style={{color:actualCol}}>{ap}%</b></span>
                    <span style={{ fontSize:9, color:C.dim }}>{b.activities.length} acts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selBox && (
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", background:"#071018", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <InlineEdit value={selBox.name} onChange={v=>updBox(selBox.id,"name",v)}
                  style={{ fontSize:15, fontWeight:700, color:accent, background:"transparent", flex:1 }} />
                <button onClick={()=>delBox(selBox.id)} style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:5, padding:"3px 10px", cursor:"pointer", fontSize:11, marginLeft:8 }}>Delete Box</button>
              </div>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                {[["Box No.", "boxNo", 60], ["Q'ty (Ton)", "qty", 72], ["Start", "start", 96], ["Finish", "finish", 96]].map(([label, field, w]) => (
                  <div key={field} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ fontSize:11, color:C.dim }}>{label}:</span>
                    <InlineEdit value={selBox[field]||""} onChange={v=>updBox(selBox.id,field,v)} style={{ width:w, fontSize:11 }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:560 }}>
                <thead>
                  <tr style={{ background:"#071018" }}>
                    {["Activity","Q'ty","Progress","Start","Finish","—"].map(h=>(
                      <Th key={h} center={!["Activity"].includes(h)}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selBox.activities.map((a,i) => {
                    const ap = Number(a.progress)||0;
                    const pp = timePct(a.start, a.finish);
                    const diff3 = ap-pp;
                    const sc = pp===0
                      ? (ap===0?"#64748b":ap>=100?"#22c55e":ap>=50?"#f59e0b":"#38bdf8")
                      : diff3>2?"#22c55e":diff3>=-2?"#f59e0b":"#ef4444";
                    const statusLabel = pp===0
                      ? (ap===0?"Not Started":ap>=100?"Complete":"In Progress")
                      : diff3>2?"Ahead":diff3>=-2?"On Track":"Behind";
                    return (
                      <tr key={a.id} style={{ background: ap>=100?"#0d2010":i%2===0?"transparent":"#050e1a", borderBottom:`1px solid ${C.border}22` }}>
                        <Cell style={{ fontWeight:600, minWidth:200 }}>
                          <InlineEdit value={a.task} onChange={v=>updAct(selBox.id,a.id,"task",v)} style={{ width:"100%", fontWeight:600 }} />
                        </Cell>
                        <Cell center>
                          <InlineEdit value={a.qty||""} onChange={v=>updAct(selBox.id,a.id,"qty",v)} style={{ width:44, textAlign:"center", fontSize:12 }} />
                        </Cell>
                        <Cell style={{ minWidth:210, padding:"8px 12px" }}>
                          <div style={{ position:"relative", height:18, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${sc}44`, marginBottom:4 }}>
                            <div style={{ position:"absolute", top:0, left:0, width:`${ap}%`, height:"100%", background:`linear-gradient(90deg,${sc}77,${sc})`, borderRadius:4, transition:"width 0.3s" }}>
                              {ap>=16&&<span style={{ position:"absolute", right:4, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:"#fff", fontWeight:800 }}>{ap}%</span>}
                            </div>
                            {pp>0&&<div style={{ position:"absolute", top:0, left:0, width:`${pp}%`, height:"100%", borderRight:`2px dashed ${C.amber}cc`, background:`repeating-linear-gradient(90deg,transparent,transparent 5px,${C.amber}15 5px,${C.amber}15 6px)`, pointerEvents:"none" }} />}
                            {ap<16&&<span style={{ position:"absolute", left:`${ap+1}%`, top:"50%", transform:"translateY(-50%)", fontFamily:MONO, fontSize:9, color:sc, fontWeight:800 }}>{ap}%</span>}
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:10, color:C.amber, fontWeight:600 }}>P <b>{pp}%</b></span>
                            <span style={{ color:C.border, fontSize:9 }}>|</span>
                            <span style={{ fontSize:10, color:sc, fontWeight:600 }}>A</span>
                            <InlineEdit value={ap} onChange={v=>updAct(selBox.id,a.id,"progress",Math.min(100,Math.max(0,Number(v))))} type="number"
                              style={{ width:42, textAlign:"center", fontSize:12, color:sc, fontWeight:700, background:"#071018", border:`1px solid ${sc}66`, borderRadius:4, padding:"2px 4px" }} />
                            <span style={{ fontSize:10, color:sc }}>%</span>
                            <span style={{ marginLeft:"auto", fontSize:9, fontWeight:700, color:sc, background:`${sc}20`, borderRadius:3, padding:"1px 5px", border:`1px solid ${sc}44`, whiteSpace:"nowrap" }}>
                              {pp>0&&(diff3>0?"▲+":diff3<0?"▼":"")}{pp>0?`${diff3}% `:""}{pp===0?"No Plan":diff3>2?"Ahead":diff3>=-2?"On Track":"Behind"}
                            </span>
                          </div>
                        </Cell>
                        <Cell center style={{ fontSize:12 }}>
                          <InlineEdit value={a.start||""} onChange={v=>updAct(selBox.id,a.id,"start",v)} style={{ width:88, fontSize:11, textAlign:"center" }} />
                        </Cell>
                        <Cell center style={{ fontSize:12 }}>
                          <InlineEdit value={a.finish||""} onChange={v=>updAct(selBox.id,a.id,"finish",v)} style={{ width:88, fontSize:11, textAlign:"center" }} />
                        </Cell>
                        <Cell center>
                          <button onClick={()=>delAct(selBox.id,a.id)} style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"2px 6px", cursor:"pointer", fontSize:11 }}>✕</button>
                        </Cell>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding:12 }}>
              <button onClick={()=>addAct(selBox.id)} style={{ background:`${accent}15`, border:`1px dashed ${accent}55`, color:accent, borderRadius:7, padding:"8px 18px", cursor:"pointer", fontSize:12, fontFamily:SANS, fontWeight:600 }}>+ Add Activity</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BoxAssemblyTab({ rows, setRows }) {
  const avgActual = rows.length ? Math.round(rows.reduce((s,r)=>s+r.actualPct,0)/rows.length) : 0;
  const avgPlan   = rows.length ? Math.round(rows.reduce((s,r)=>s+(Number(r.planPct)||0),0)/rows.length) : 0;
  const upd = (boxId, field, val) => setRows(p=>p.map(r=>r.boxId===boxId?{...r,[field]:val}:r));

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Boxes",   val:rows.length,                              color:C.accent  },
          { label:"Completed",     val:rows.filter(r=>r.actualPct===100).length, color:C.green   },
          { label:"Avg. Progress", val:`${avgActual}%`,                          color:"#e879f9" },
        ].map(c=>(
          <div key={c.label} style={{ background:C.panel, border:`1px solid ${c.color}33`, borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:13, color:C.dim, fontFamily:MONO, marginBottom:6 }}>{c.label}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c.color, fontFamily:MONO }}>{c.val}</div>
          </div>
        ))}
      </div>

      <SectionCard title="MODULE BOX ASSEMBLY STATUS" accent="#e879f9">
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>{["Box","Q'ty","Progress","Remark"].map(h=><Th key={h} center={!["Box","Remark"].includes(h)}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.boxId} style={{ background:r.actualPct===100?"#0d2010":"transparent" }}>
                <Cell mono><span style={{ color:"#e879f9", fontWeight:700 }}>{r.boxId}</span></Cell>
                <Cell center mono>{r.qty}</Cell>
                <Cell style={{ minWidth:220 }}>
                  <DualBar planPct={Number(r.planPct)||0} actualPct={Number(r.actualPct)||0} />
                </Cell>
                <Cell><InlineEdit value={r.remark||""} onChange={v=>upd(r.boxId,"remark",v)} style={{ width:140 }} /></Cell>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background:"#081220" }}>
              <td colSpan={2} style={{ padding:"8px 10px", fontFamily:MONO, fontSize:13, color:"#e879f9", fontWeight:700 }}>AVG</td>
              <Cell style={{ minWidth:220 }}><DualBar planPct={avgPlan} actualPct={avgActual} /></Cell>
              <Cell />
            </tr>
          </tfoot>
        </table>
      </SectionCard>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════
const DEFAULT_PROJECT = {
  projectNo: "V17566",
  projectName: "Tallgrass I",
  client: "",
  contractNo: "",
  location: "",
  startDate: "",
  targetDate: "",
  engineer: "Lee Supolchai",
  units: [
    {
      unitNo: "1",
      boxes: ["1A","1B","1C","2A","2B","2C","3A","3B","3C","4A","4B","4C","5A","5B","5C","6A","6B","6C"],
    }
  ],
};

const TABS = [
  { id:"dashboard",  label:"Dashboard"         },
  { id:"harp",       label:"Harp"              },
  { id:"finnedtube", label:"Finned Tube"       },
  { id:"hdrill",     label:"Header"            },
  { id:"casing",     label:"Casing & Modulation" },
  { id:"modbox",     label:"Module Box Assembly"      },
  { id:"piping",     label:"MA Piping"         },
];

function PipingTab({ rows, setRows }) {
  const { useState: useS } = React;
  const accent = "#60a5fa";
  const STEPS = [
    { key:"fitup",  label:"Fit-up",  color:"#f59e0b" },
    { key:"weld",   label:"Weld",    color:"#4ade80" },
    { key:"nde",    label:"NDE",     color:"#a78bfa" },
    { key:"pwht",   label:"PWHT",    color:"#f472b6" },
  ];

  const [selId, setSelId] = useS(rows[0]?.id || null);
  const [editingJId, setEditingJId] = useS(null);
  const [addingIso, setAddingIso] = useS(false);
  const [newIso, setNewIso] = useS({ isoNo:"", boxNo:"", lineNo:"", size:"", sch:"", material:"", system:"" });

  const selIso = rows.find(r=>r.id===selId) || rows[0];
  const isoPct  = iso => iso.joints.length ? Math.round(iso.joints.filter(j=>j.weld===1).length/iso.joints.length*100) : 0;
  const allJoints = rows.flatMap(r=>r.joints);
  const totalJ = allJoints.length;
  const weldDone = allJoints.filter(j=>j.weld===1).length;
  const ndeDone  = allJoints.filter(j=>j.nde===1).length;
  const pwhtDone = allJoints.filter(j=>j.pwht===1||j.pwht===2).length;
  const totalISO = rows.length;
  const isoPctCalc = iso => iso.joints.length ? Math.round(iso.joints.filter(j=>j.weld===1).length/iso.joints.length*100) : 0;
  const isoComplete = rows.filter(r=>isoPctCalc(r)===100).length;

  const updIso = (id,field,val) => setRows(prev=>prev.map(r=>r.id===id?{...r,[field]:val}:r));
  const updJoint = (iid,jid,field,val) => setRows(prev=>prev.map(r=>r.id===iid?{...r,joints:r.joints.map(j=>j.id===jid?{...j,[field]:val}:j)}:r));
  const addJoint = iid => setRows(prev=>prev.map(r=>r.id===iid?{...r,joints:[...r.joints,{id:`j${Date.now()}`,jNo:`J-${String(r.joints.length+1).padStart(2,"0")}`,fitup:0,weld:0,nde:0,pwht:0,remark:""}]}:r));
  const delJoint = (iid,jid) => setRows(prev=>prev.map(r=>r.id===iid?{...r,joints:r.joints.filter(j=>j.id!==jid)}:r));
  const addIso = () => { const id=`iso${Date.now()}`; setRows(prev=>[...prev,{id,...newIso,totalJoints:0,joints:[]}]); setSelId(id); setNewIso({isoNo:"",boxNo:"",lineNo:"",size:"",sch:"",material:"",system:""}); setAddingIso(false); };
  const delIso = id => { setRows(prev=>prev.filter(r=>r.id!==id)); if(selId===id) setSelId(rows.find(r=>r.id!==id)?.id||null); };
  const iSt = { background:"#071018", border:`1px solid ${C.border}`, borderRadius:4, color:C.text, padding:"4px 8px", fontSize:12, fontFamily:SANS, outline:"none" };

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0d1f3a,#0a1525)", border:`1px solid ${accent}33`, borderRadius:10, padding:"14px 20px", marginBottom:14 }}>
        <div style={{ fontSize:11, color:C.dim, fontFamily:SANS, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>MA Piping — Overall Progress</div>
        <div style={{ display:"flex", gap:20, alignItems:"stretch" }}>
          {/* Stats: Total ISO + Complete */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, justifyContent:"center", minWidth:80 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:accent, fontFamily:SANS, fontWeight:700, marginBottom:2 }}>TOTAL ISO</div>
              <div style={{ fontSize:30, fontWeight:900, color:accent, fontFamily:MONO, lineHeight:1 }}>{totalISO}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:C.green, fontFamily:SANS, fontWeight:700, marginBottom:2 }}>COMPLETE</div>
              <div style={{ fontSize:26, fontWeight:900, color:C.green, fontFamily:MONO, lineHeight:1 }}>{isoComplete}</div>
            </div>
          </div>
          <div style={{ width:1, background:C.border }} />
          {/* Plan / Actual */}
          <div style={{ display:"flex", flexDirection:"column", gap:6, justifyContent:"center", minWidth:120 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:C.amber, fontFamily:SANS, fontWeight:700, marginBottom:2 }}>ACTUAL</div>
              <div style={{ fontSize:30, fontWeight:900, color:pct2color(totalJ>0?Math.round(weldDone/totalJ*100):0), fontFamily:MONO, lineHeight:1 }}>{totalJ>0?Math.round(weldDone/totalJ*100):0}<span style={{ fontSize:13 }}>%</span></div>
              <div style={{ fontSize:9, color:C.dim, marginTop:2 }}>{weldDone} / {totalJ} joints</div>
            </div>
          </div>
          <div style={{ width:1, background:C.border }} />
          {/* Per-Box bars */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7, justifyContent:"center" }}>
            {(()=>{
              const boxes = [...new Set(rows.map(r=>r.boxNo||"—"))].sort();
              return boxes.map(boxNo => {
                const isos = rows.filter(r=>(r.boxNo||"—")===boxNo);
                const bJoints = isos.flatMap(r=>r.joints);
                const bWeld = bJoints.filter(j=>j.weld===1).length;
                const bTotal = bJoints.length;
                const bPct = bTotal>0?Math.round(bWeld/bTotal*100):0;
                const bIsoComplete = isos.filter(r=>isoPctCalc(r)===100).length;
                const col = pct2color(bPct);
                return (
                  <div key={boxNo} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ minWidth:52 }}>
                      <span style={{ fontSize:11, fontWeight:800, color:accent, fontFamily:MONO }}>Box {boxNo}</span>
                      <div style={{ fontSize:9, color:C.dim }}>{bIsoComplete}/{isos.length} ISOs</div>
                    </div>
                    <div style={{ flex:1, position:"relative", height:12, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${col}33` }}>
                      <div style={{ width:`${bPct}%`, height:"100%", background:`linear-gradient(90deg,${col}77,${col})`, borderRadius:4 }} />
                    </div>
                    <span style={{ fontSize:10, fontFamily:MONO, color:col, fontWeight:700, minWidth:36 }}>{bPct}%</span>
                    <span style={{ fontSize:9, color:C.dim, minWidth:60 }}>{bWeld}/{bTotal} joints</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:14 }}>
        <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"9px 14px", background:"#071018", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.dim, letterSpacing:"0.1em", textTransform:"uppercase" }}>Boxes</span>
            <button onClick={()=>setAddingIso(s=>!s)} style={{ background:`${accent}20`, border:`1px solid ${accent}44`, color:accent, borderRadius:5, padding:"2px 8px", cursor:"pointer", fontSize:11 }}>+ Add ISO</button>
          </div>
          {addingIso && (
            <div style={{ padding:"12px 14px", background:"#060d1a", borderBottom:`1px solid ${accent}33` }}>
              <div style={{ fontSize:10, color:accent, fontWeight:700, marginBottom:8 }}>NEW ISO DWG</div>
              {[["Box No.","boxNo","6A"],["ISO No.","isoNo","ISO-004"],["Line No.","lineNo","1-HP-004"]].map(([lbl,fld,ph])=>(
                <div key={fld} style={{ marginBottom:5 }}>
                  <div style={{ fontSize:10, color:C.dim, marginBottom:2 }}>{lbl}</div>
                  <input value={newIso[fld]||""} onChange={e=>setNewIso(f=>({...f,[fld]:e.target.value}))} placeholder={ph}
                    style={{ ...iSt, width:"100%", boxSizing:"border-box", padding:"4px 8px", fontSize:11 }} />
                </div>
              ))}
              <div style={{ display:"flex", gap:6, marginTop:8 }}>
                <button onClick={addIso} style={{ flex:1, background:`${accent}22`, border:`1px solid ${accent}66`, color:accent, borderRadius:6, padding:"5px 0", cursor:"pointer", fontSize:12, fontWeight:700 }}>Create</button>
                <button onClick={()=>setAddingIso(false)} style={{ background:"#0a1628", border:`1px solid ${C.border}`, color:C.dim, borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:12 }}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{ flex:1, overflowY:"auto" }}>
            {(()=>{
              const boxes = [...new Set(rows.map(r=>r.boxNo||"—"))].sort();
              return boxes.map(boxNo => {
                const isos = rows.filter(r=>(r.boxNo||"—")===boxNo);
                const boxWeld = isos.flatMap(r=>r.joints).filter(j=>j.weld===1).length;
                const boxTotal = isos.flatMap(r=>r.joints).length;
                const boxPct = boxTotal>0?Math.round(boxWeld/boxTotal*100):0;
                const boxCol = pct2color(boxPct);
                return (
                  <div key={boxNo}>
                    {/* Box header */}
                    <div style={{ padding:"8px 14px", background:"#060d1a", borderBottom:`1px solid ${C.border}22`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, fontWeight:800, color:accent, fontFamily:MONO }}>Box {boxNo}</span>
                      <span style={{ fontSize:10, color:boxCol, fontWeight:700, fontFamily:MONO }}>{boxPct}%</span>
                    </div>
                    {/* ISO list under box */}
                    {isos.map(iso => {
                      const pct = isoPct(iso);
                      const col = pct2color(pct);
                      const isActive = selId===iso.id;
                      return (
                        <div key={iso.id} onClick={()=>setSelId(iso.id)} style={{
                          padding:"7px 14px 7px 22px", cursor:"pointer", borderBottom:`1px solid ${C.border}11`,
                          background: isActive?`${accent}12`:"transparent",
                          borderLeft: isActive?`3px solid ${accent}`:"3px solid transparent",
                        }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                            <span style={{ fontSize:11, fontWeight:700, color: isActive?accent:C.text, fontFamily:MONO }}>{iso.isoNo}</span>
                            <span style={{ fontSize:9, color:col, fontWeight:700 }}>{pct}%</span>
                          </div>
                          <div style={{ position:"relative", height:4, background:"#071018", borderRadius:99, overflow:"hidden" }}>
                            <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:99 }} />
                          </div>
                          <div style={{ fontSize:9, color:C.dim, marginTop:2 }}>{iso.joints.filter(j=>j.weld===1).length}/{iso.joints.length} joints</div>
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {selIso ? (
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", background:"#071018", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:16, fontWeight:800, color:accent, fontFamily:MONO }}>{selIso.isoNo}</span>
                <button onClick={()=>delIso(selIso.id)} style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:5, padding:"3px 10px", cursor:"pointer", fontSize:11 }}>Delete ISO</button>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:10, color:C.dim }}>ISO DWG:</span>
                <span style={{ fontSize:13, fontWeight:800, color:accent, fontFamily:MONO }}>{selIso.isoNo}</span>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:"10px 16px", borderBottom:`1px solid ${C.border}`, background:"#060d1a" }}>
              {[
                { label:"Fit-up",  val:selIso.joints.filter(j=>j.fitup===1).length, color:"#f59e0b" },
                { label:"Welding", val:selIso.joints.filter(j=>j.weld===1).length,  color:"#4ade80" },
                { label:"NDE",     val:selIso.joints.filter(j=>j.nde===1).length,   color:"#a78bfa" },
                { label:"PWHT",    val:selIso.joints.filter(j=>j.pwht===1||j.pwht===2).length, color:"#f472b6" },
              ].map(s=>{ const pct=selIso.joints.length>0?Math.round(s.val/selIso.joints.length*100):0; return (
                <div key={s.label} style={{ background:"#081220", border:`1px solid ${s.color}33`, borderRadius:6, padding:"8px 12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:s.color }}>{s.label}</span>
                    <span style={{ fontSize:11, fontFamily:MONO, color:s.color, fontWeight:800 }}>{pct}%</span>
                  </div>
                  <div style={{ height:8, background:"#071018", borderRadius:4, overflow:"hidden", border:`1px solid ${s.color}22`, marginBottom:3 }}>
                    <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${s.color}77,${s.color})`, borderRadius:4 }} />
                  </div>
                  <div style={{ fontSize:10, color:C.dim }}>{s.val} / {selIso.joints.length} joints</div>
                </div>
              );})}
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:580 }}>
                <thead>
                  <tr style={{ background:"#071018" }}>
                    <Th center>Joint No.</Th>
                    {STEPS.map(s=><Th key={s.key} center style={{ color:s.color }}>{s.label}</Th>)}
                    <Th>Remark</Th>
                    <Th center>—</Th>
                  </tr>
                </thead>
                <tbody>
                  {selIso.joints.map((j,i) => {
                    const allDone = j.fitup&&j.weld&&j.nde&&j.pwht;
                    const isEd = editingJId===j.id;
                    return (
                      <tr key={j.id} style={{ background:allDone?"#0d2010":isEd?"#0a1f3a":i%2===0?"transparent":"#050e1a", borderBottom:`1px solid ${C.border}22`, outline:isEd?`1px solid ${accent}55`:"none" }}>
                        <Cell center mono style={{ color:accent, fontWeight:700, fontSize:13 }}>
                          {isEd ? <InlineEdit value={j.jNo} onChange={v=>updJoint(selIso.id,j.id,"jNo",v)} style={{ width:52, textAlign:"center", color:accent, fontWeight:700 }} />
                                : <span style={{ background:`${accent}18`, border:`1px solid ${accent}44`, borderRadius:5, padding:"2px 8px" }}>{j.jNo}</span>}
                        </Cell>
                        {STEPS.map(s => {
                          const val = j[s.key]||0;
                          if(s.key==="pwht") {
                            const next = val===0?1:val===1?2:0;
                            const cfg = val===0?{ bg:"#1a1a2e", border:"#334155", color:"#64748b", label:"—" }:val===1?{ bg:"#14532d", border:"#22c55e", color:"#22c55e", label:"Done" }:{ bg:"#1e1028", border:s.color, color:s.color, label:"N/A" };
                            return <Cell key={s.key} center><button onClick={()=>updJoint(selIso.id,j.id,s.key,next)} style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.color, borderRadius:5, padding:"3px 8px", cursor:"pointer", fontSize:10, fontFamily:SANS, fontWeight:700, minWidth:48, transition:"all 0.2s" }}>{cfg.label}</button></Cell>;
                          }
                          return <Cell key={s.key} center><button onClick={()=>updJoint(selIso.id,j.id,s.key,val===1?0:1)} style={{ background:val===1?`${s.color}22`:"#1a1a2e", border:`1px solid ${val===1?s.color:"#334155"}`, color:val===1?s.color:"#64748b", borderRadius:5, padding:"3px 10px", cursor:"pointer", fontSize:11, fontFamily:SANS, fontWeight:700, minWidth:44, transition:"all 0.2s" }}>{val===1?"✓":"—"}</button></Cell>;
                        })}
                        <Cell>
                          {isEd ? <InlineEdit value={j.remark||""} onChange={v=>updJoint(selIso.id,j.id,"remark",v)} style={{ width:"100%", fontSize:12 }} />
                                : <span style={{ fontSize:12, color:C.dim }}>{j.remark||""}</span>}
                        </Cell>
                        <Cell center>
                          <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                            <button onClick={()=>setEditingJId(isEd?null:j.id)} style={{ background:isEd?`${accent}22`:"#0a1628", border:`1px solid ${isEd?accent:C.border}`, color:isEd?accent:C.dim, borderRadius:4, padding:"2px 7px", cursor:"pointer", fontSize:11 }}>Edit</button>
                            {isEd && <button onClick={()=>{ delJoint(selIso.id,j.id); setEditingJId(null); }} style={{ background:"none", border:`1px solid ${C.red}44`, color:C.red, borderRadius:4, padding:"2px 6px", cursor:"pointer", fontSize:11 }}>✕</button>}
                          </div>
                        </Cell>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background:"#081220" }}>
                    <td style={{ padding:"8px 12px", fontFamily:SANS, fontSize:12, color:accent, fontWeight:700 }}>TOTAL — {selIso.isoNo}</td>
                    {STEPS.map(s => { const cnt=s.key==="pwht"?selIso.joints.filter(j=>j.pwht===1||j.pwht===2).length:selIso.joints.filter(j=>j[s.key]===1).length; return <Cell key={s.key} center><span style={{ fontFamily:MONO, fontSize:13, fontWeight:800, color:s.color }}>{cnt}<span style={{ color:C.dim, fontSize:11 }}>/{selIso.joints.length}</span></span></Cell>; })}
                    <Cell /><Cell />
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{ padding:12 }}>
              <button onClick={()=>addJoint(selIso.id)} style={{ background:`${accent}15`, border:`1px dashed ${accent}55`, color:accent, borderRadius:7, padding:"8px 18px", cursor:"pointer", fontSize:12, fontFamily:SANS, fontWeight:600 }}>+ Add Joint</button>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", color:C.dim, fontSize:14, background:C.panel, border:`1px solid ${C.border}`, borderRadius:10 }}>
            Select an ISO line from the left
          </div>
        )}
      </div>
    </div>
  );
}


function ReportModal({ data, project, onClose }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  const accent = "#38bdf8";

  // ── Helpers ──
  const pct2col = p => p>=100?"#22c55e":p>=70?"#4ade80":p>=40?"#f59e0b":p>=10?"#fb923c":"#ef4444";
  const HDR_S = ["cutting","drilling","endPlate","nozzle","nde","pwht","inspection"];
  const HDR_L = ["Cutting","Drilling","End Plate","Nozzle","NDE","PWHT","Inspection"];
  const timePct = (s,f) => { const t=new Date(); t.setHours(0,0,0,0); if(!s||!f) return 0; const sd=new Date(s),fd=new Date(f); if(isNaN(sd)||isNaN(fd)||fd<=sd) return 0; if(t<=sd) return 0; if(t>=fd) return 100; return Math.round((t-sd)/(fd-sd)*100); };

  // ── Finned Tube ──
  const ftPct = r => { const pq=Number(r.planQty)||0,aq=Number(r.actualQty)||0; return pq>0?Math.min(100,Math.round(aq/pq*100)):0; };
  const ftAvg = data.finnedTube.length ? Math.round(data.finnedTube.reduce((s,r)=>s+ftPct(r),0)/data.finnedTube.length) : 0;
  const ftPlanAvg = data.finnedTube.length ? Math.round(data.finnedTube.reduce((s,r)=>s+timePct(r.start,r.finish),0)/data.finnedTube.length) : 0;
  const ftTotalPlan = data.finnedTube.reduce((s,r)=>s+(Number(r.planQty)||0),0);
  const ftTotalActual = data.finnedTube.reduce((s,r)=>s+(Number(r.actualQty)||0),0);

  // ── Harp ──
  const allHarps = data.harpFab.flatMap(g=>g.harps);
  const harpTotalPlan = data.harpFab.reduce((s,g)=>s+g.planQty,0);
  const harpTotalDone = allHarps.reduce((s,h)=>s+(Number(h.completedQty)||0),0);
  const harpWeldPct = harpTotalPlan>0?Math.min(100,Math.round(harpTotalDone/harpTotalPlan*100)):0;
  const harpHydroDone = allHarps.filter(h=>h.hydroDone===1).length;
  const harpHydroPct = allHarps.length?Math.round(harpHydroDone/allHarps.length*100):0;
  const harpOverall = Math.round((harpWeldPct*2+harpHydroPct)/3);
  const harpPlanPct = data.harpFab.length?Math.round(data.harpFab.reduce((s,g)=>s+timePct(g.start,g.finish),0)/data.harpFab.length):0;

  // ── Header ──
  const allHdrs = data.headerDrill.flatMap(g=>g.headers||[]);
  const hdrStepPct = h => Math.round(HDR_S.filter(k=>k==="pwht"?(h.pwht===1||h.pwht===2):h[k]===1).length/HDR_S.length*100);
  const hdrAvg = allHdrs.length?Math.round(allHdrs.reduce((s,h)=>s+hdrStepPct(h),0)/allHdrs.length):0;
  const hdrComplete = allHdrs.filter(h=>hdrStepPct(h)===100).length;
  const hdrPlanAvg = data.headerDrill.length?Math.round(data.headerDrill.reduce((s,g)=>s+timePct(g.start,g.finish),0)/data.headerDrill.length):0;

  // ── Casing ──
  const casingActPct = p => p.activities.length?Math.round(p.activities.reduce((s,a)=>s+(Number(a.progress)||0),0)/p.activities.length):0;
  const casingAvg = data.casing.length?Math.round(data.casing.reduce((s,p)=>s+casingActPct(p),0)/data.casing.length):0;
  const casingPlanAvg = data.casing.length?Math.round(data.casing.reduce((s,p)=>s+timePct(p.start,p.finish),0)/data.casing.length):0;

  // ── Module Box Assembly (auto-linked from sub-components) ──
  const _HDR_S_R = ["cutting","drilling","endPlate","nozzle","nde","pwht","inspection"];
  const boxActPct = b => {
    const boxNum = ((b.boxNo||"").match(/(\d+)/)||[])[1]||"";
    const ft=(data.finnedTube||[]).filter(r=>(r.boxNo||"").includes("Box "+boxNum));
    const ftP=ft.length?Math.round(ft.reduce((s,r)=>{ const pq=Number(r.planQty)||0,aq=Number(r.actualQty)||0; return s+(pq>0?Math.min(100,Math.round(aq/pq*100)):0); },0)/ft.length):null;
    const hg=(data.harpFab||[]).find(g=>(g.groupName||"").replace(/[^0-9]/g,"")===boxNum);
    const hpP=hg?(hg.harps.length?Math.round(hg.harps.reduce((s,h)=>s+(h.planQty>0?Math.min(100,Math.round((Number(h.completedQty)||0)/h.planQty*100)):0),0)/hg.harps.length):0):null;
    const hdg=(data.headerDrill||[]).find(g=>(g.groupName||"").replace(/[^0-9]/g,"")===boxNum);
    const hdP=hdg?(hdg.headers.length?Math.round(hdg.headers.reduce((s,h)=>s+Math.round(_HDR_S_R.filter(k=>k==="pwht"?(h.pwht===1||h.pwht===2):h[k]===1).length/_HDR_S_R.length*100),0)/hdg.headers.length):0):null;
    const cp=(data.casing||[]).filter(p=>{ const n=(p.name||"").toLowerCase(); return n.includes("box "+(b.boxNo||"").toLowerCase())||n.includes("box "+boxNum); });
    const caP=cp.length?Math.round(cp.reduce((s,p)=>s+(p.activities.length?Math.round(p.activities.reduce((ss,a)=>ss+(Number(a.progress)||0),0)/p.activities.length):0),0)/cp.length):null;
    const asP=b.activities.length?Math.round(b.activities.reduce((s,a)=>s+(Number(a.progress)||0),0)/b.activities.length):0;
    const vals=[ftP,hpP,hdP,caP,asP].filter(v=>v!==null);
    return vals.length>1?Math.round(vals.reduce((s,v)=>s+v,0)/vals.length):asP;
  };
  const boxAvg = data.boxAssemblyV2.length?Math.round(data.boxAssemblyV2.reduce((s,b)=>s+boxActPct(b),0)/data.boxAssemblyV2.length):0;
  const boxPlanAvg = data.boxAssemblyV2.length?Math.round(data.boxAssemblyV2.reduce((s,b)=>s+timePct(b.start,b.finish),0)/data.boxAssemblyV2.length):0;
  const boxComplete = data.boxAssemblyV2.filter(b=>boxActPct(b)===100).length;

  // ── MA Piping ──
  const allJoints = data.piping.flatMap(r=>r.joints);
  const pipingWeld = allJoints.filter(j=>j.weld===1).length;
  const pipingPct = allJoints.length?Math.round(pipingWeld/allJoints.length*100):0;

  // ── Overall ──
  const overallActual = Math.round([ftAvg,harpOverall,hdrAvg,casingAvg,boxAvg,pipingPct].reduce((s,v)=>s+v,0)/6);
  const overallPlan = Math.round([ftPlanAvg,harpPlanPct,hdrPlanAvg,casingPlanAvg,boxPlanAvg,0].reduce((s,v)=>s+v,0)/6);
  const diff = overallActual - overallPlan;
  const statusLabel = overallPlan===0?"No Plan":diff>2?"Ahead of Plan":diff>=-2?"On Schedule":"Behind Plan";
  const statusCol = overallPlan===0?"#64748b":diff>2?"#22c55e":diff>=-2?"#f59e0b":"#ef4444";

  const handlePrint = () => {
    const el = document.getElementById("rpt-content");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${project.projectNo} — Fabrication Progress Report</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:"Segoe UI",Arial,sans-serif;background:#f0f4f8;color:#111;font-size:11px}
      @page{size:A4 landscape;margin:10mm 12mm}
      @media print{
        body{background:#fff}
        .no-print{display:none!important}
        .page{page-break-after:always;box-shadow:none!important;margin:0!important;border:none!important;border-radius:0!important}
        .page:last-child{page-break-after:avoid}
      }
      .toolbar{background:#1a2a3a;color:#fff;padding:10px 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:99}
      .toolbar h3{flex:1;font-size:13px;color:#38bdf8}
      .toolbar button{padding:6px 16px;border-radius:5px;border:none;cursor:pointer;font-size:12px;font-weight:700}
      .btn-print{background:#38bdf8;color:#000}
      .btn-close{background:#334155;color:#fff}
      .page{background:#fff;margin:12px auto;max-width:1100px;padding:16px 20px;border-radius:8px;border:1px solid #e2e8f0;box-shadow:0 1px 4px #0001}
      .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #111}
      .page-title{font-size:18px;font-weight:900;color:#111}
      .page-sub{font-size:11px;color:#64748b;margin-top:2px}
      .section-title{font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.08em;border-bottom:1.5px solid #cbd5e1;padding-bottom:3px;margin:14px 0 8px}
      .card{border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px;background:#fafafa}
      .label{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px}
      .big{font-size:24px;font-weight:900;line-height:1.1}
      .bar-bg{background:#e2e8f0;border-radius:3px;height:7px;overflow:hidden;margin:4px 0 2px}
      .bar-fill{height:100%;border-radius:3px}
      table{width:100%;border-collapse:collapse;font-size:10px;margin-top:4px}
      thead tr{background:#f1f5f9}
      th{padding:5px 7px;text-align:left;font-weight:700;border-bottom:1.5px solid #cbd5e1;color:#334155;white-space:nowrap}
      td{padding:3px 7px;border-bottom:1px solid #f1f5f9;white-space:nowrap}
      tr:hover td{background:#f8fafc}
      .badge{display:inline-block;padding:1px 7px;border-radius:3px;font-size:9px;font-weight:700;border:1px solid currentColor}
      .footer{margin-top:16px;padding-top:8px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:9px;color:#94a3b8}
    </style></head><body>
    <div class="toolbar no-print">
      <h3>📄 ${project.projectNo} — ${project.projectName} | Fabrication Progress Report &nbsp;|&nbsp; ${dateStr}</h3>
      <button class="btn-print" onclick="window.print()">🖨 Print / Save PDF</button>
      <button class="btn-close" onclick="window.close()">✕ Close</button>
    </div>
    ${el.innerHTML}
    </body></html>`;
    // Inject print styles + report content into current page then print
    const styleId = "rpt-print-style";
    let existing = document.getElementById(styleId);
    if(existing) existing.remove();
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `@media print {
      body > *:not(#rpt-print-wrapper) { display: none !important; }
      #rpt-print-wrapper { display: block !important; }
      @page { size: A4 landscape; margin: 10mm 12mm; }
    }
    #rpt-print-wrapper { display: none; position: fixed; inset: 0; z-index: 99999; background: #fff; overflow: auto; }
    #rpt-print-wrapper .no-print { display: none !important; }`;
    document.head.appendChild(style);

    let wrapper = document.getElementById("rpt-print-wrapper");
    if(!wrapper){ wrapper = document.createElement("div"); wrapper.id = "rpt-print-wrapper"; document.body.appendChild(wrapper); }
    wrapper.innerHTML = `<style>
      body{font-family:"Segoe UI",Arial,sans-serif;color:#111;font-size:11px}
      .page{background:#fff;margin:12px auto;max-width:1100px;padding:16px 20px;border-radius:8px;border:1px solid #e2e8f0}
      .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #111}
      .section-title{font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.08em;border-bottom:1.5px solid #cbd5e1;padding-bottom:3px;margin:14px 0 8px}
      .card{border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px;background:#fafafa}
      .label{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px}
      .bar-bg{background:#e2e8f0;border-radius:3px;height:7px;overflow:hidden;margin:4px 0 2px}
      table{width:100%;border-collapse:collapse;font-size:10px}
      th{padding:5px 7px;text-align:left;font-weight:700;border-bottom:1.5px solid #cbd5e1;background:#f1f5f9}
      td{padding:3px 7px;border-bottom:1px solid #f1f5f9}
      .badge{display:inline-block;padding:1px 7px;border-radius:3px;font-size:9px;font-weight:700;border:1px solid currentColor}
      .footer{margin-top:16px;padding-top:8px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:9px;color:#94a3b8}
    </style>
    <div style="background:#1a2a3a;color:#fff;padding:10px 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:99" class="no-print">
      <span style="flex:1;font-size:13px;color:#38bdf8">📄 Report Preview — ${project.projectNo} ${project.projectName}</span>
      <button onclick="window.print()" style="background:#38bdf8;color:#000;padding:6px 16px;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-weight:700">🖨 Print / Save PDF</button>
      <button onclick="document.getElementById('rpt-print-wrapper').remove()" style="background:#334155;color:#fff;padding:6px 16px;border:none;border-radius:5px;cursor:pointer;font-size:12px">✕ Close</button>
    </div>
    ${el.innerHTML}`;
    wrapper.style.display = "block";
  };

  const S = { // section style
    page: { background:"#fff", padding:"16px 20px", fontFamily:"Arial,sans-serif", color:"#111", fontSize:11 },
    sectionTitle: { fontSize:11, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:"0.08em", borderBottom:"2px solid #222", paddingBottom:3, marginBottom:10 },
    card: { border:"1px solid #ddd", borderRadius:6, padding:"8px 10px" },
    label: { fontSize:9, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:2 },
    big: (col) => ({ fontSize:26, fontWeight:900, color:col||"#111", lineHeight:1 }),
    barBg: { background:"#eee", borderRadius:3, height:8, overflow:"hidden", margin:"3px 0" },
    bar: (pct, col) => ({ width:`${pct}%`, height:"100%", background:col||"#333", borderRadius:3 }),
    table: { width:"100%", borderCollapse:"collapse", fontSize:10 },
    th: { background:"#f5f5f5", padding:"4px 6px", textAlign:"left", fontWeight:700, border:"1px solid #ddd" },
    td: { padding:"3px 6px", border:"1px solid #eee" },
  };

  const PctCard = ({label, pct, plan, col, sub}) => (
    <div style={S.card}>
      <div style={S.label}>{label}</div>
      <div style={S.big(col)}>{pct}<span style={{fontSize:13}}>%</span></div>
      {sub && <div style={{fontSize:9,color:"#888",marginTop:1}}>{sub}</div>}
      <div style={S.barBg}><div style={S.bar(pct,col)}/></div>
      {plan!==undefined && <div style={{fontSize:9,color:"#aaa"}}>Plan: {plan}%</div>}
    </div>
  );

  const StatusBadge = ({label,col}) => (
    <span style={{display:"inline-block",padding:"2px 8px",borderRadius:4,background:col+"22",border:`1px solid ${col}`,color:col,fontSize:10,fontWeight:700}}>{label}</span>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"#000b",zIndex:300,display:"flex",flexDirection:"column"}}>
      {/* Toolbar */}
      <div style={{background:"#0a1525",borderBottom:"1px solid #1e3a5f",padding:"10px 20px",display:"flex",alignItems:"center",gap:12}} className="no-print">
        <span style={{fontSize:14,fontWeight:700,color:accent,flex:1}}>📄 Fabrication Progress Report — {project.projectNo} {project.projectName}</span>
        <span style={{fontSize:11,color:"#64748b"}}>{dateStr}</span>
        <button onClick={handlePrint} style={{background:"#1e3a5f",border:"1px solid #38bdf8",color:"#38bdf8",borderRadius:6,padding:"6px 16px",cursor:"pointer",fontSize:12,fontWeight:700}}>🖨 Print / Export PDF &nbsp;(PDF)</button>
        <button onClick={onClose} style={{background:"none",border:"1px solid #334155",color:"#94a3b8",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:12}}>✕ Close</button>
      </div>

      {/* Report Content */}
      <div style={{flex:1,overflowY:"auto",background:"#e8edf3",padding:16}}>
      <div id="rpt-content">

        {/* ── PAGE 1: Cover + Overall ── */}
        <div style={{...S.page,pageBreakAfter:"always",marginBottom:12,borderRadius:8,border:"1px solid #e2e8f0",boxShadow:"0 1px 6px #0001"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,paddingBottom:10,borderBottom:"2px solid #111"}}>
            <div>
              <div style={{fontSize:18,fontWeight:900,color:"#111"}}>{project.projectNo} — {project.projectName}</div>
              <div style={{fontSize:11,color:"#555",marginTop:2}}>MA Box Fabrication Progress Report &nbsp;|&nbsp; Prepared: {dateStr}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:"#888",marginBottom:2}}>© Copyright</div>
              <div style={{fontSize:12,fontWeight:800,color:"#111"}}>{project.engineer||"Lee Supolchai"}</div>
              <div style={{fontSize:9,color:"#aaa",marginTop:1}}>All rights reserved</div>
            </div>
          </div>

          {/* Overall Progress */}
          <div style={S.sectionTitle}>1. Overall Fabrication Progress</div>
          <div style={{display:"grid",gridTemplateColumns:"auto auto 1fr",gap:16,alignItems:"center",marginBottom:16}}>
            <div style={S.card}>
              <div style={S.label}>Plan</div>
              <div style={S.big("#b45309")}>{overallPlan}<span style={{fontSize:13}}>%</span></div>
            </div>
            <div style={S.card}>
              <div style={S.label}>Actual</div>
              <div style={S.big(pct2col(overallActual))}>{overallActual}<span style={{fontSize:13}}>%</span></div>
            </div>
            <div style={{...S.card,background:"#f8f8f8"}}>
              <div style={S.label}>Current Status</div>
              <div style={{marginTop:4}}><StatusBadge label={statusLabel} col={statusCol}/></div>
              {overallPlan>0&&<div style={{fontSize:10,color:statusCol,marginTop:4}}>{diff>=0?`+${diff}%`:`${diff}%`} vs Plan</div>}
            </div>
          </div>

          {/* Each Component */}
          <div style={S.sectionTitle}>2. Progress by Component</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:16}}>
            {[
              {label:"Finned Tube", pct:ftAvg, plan:ftPlanAvg, col:"#0ea5e9"},
              {label:"Header",     pct:hdrAvg,  plan:hdrPlanAvg, col:"#8b5cf6"},
              {label:"Harp",       pct:harpOverall, plan:harpPlanPct, col:"#22c55e"},
              {label:"Casing",     pct:casingAvg, plan:casingPlanAvg, col:"#ec4899"},
              {label:"Mod Box Asm",pct:boxAvg,  plan:boxPlanAvg, col:"#e879f9"},
              {label:"MA Piping",  pct:pipingPct, plan:0, col:"#60a5fa"},
            ].map(c=><PctCard key={c.label} {...c}/>)}
          </div>

          {/* Module Box Assembly Status */}
          <div style={S.sectionTitle}>3. Module Box Assembly Status</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
            {data.boxAssemblyV2.map(b=>{
              const ap=boxActPct(b), pp=timePct(b.start,b.finish), col=pct2col(ap);
              return (
                <div key={b.id} style={{...S.card,textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#333",marginBottom:4}}>{b.boxNo}</div>
                  <div style={{fontSize:16,fontWeight:900,color:col}}>{ap}%</div>
                  <div style={S.barBg}><div style={S.bar(ap,col)}/></div>
                  {pp>0&&<div style={{fontSize:8,color:"#aaa"}}>P {pp}%</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PAGE 2: Harp + Finned Tube ── */}
        <div style={{...S.page,pageBreakAfter:"always",marginBottom:12,borderRadius:8,border:"1px solid #e2e8f0",boxShadow:"0 1px 6px #0001"}}>
          {/* Harp Section */}
          <div style={S.sectionTitle}>4. Harp Fabrication</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
            <PctCard label="Overall" pct={harpOverall} plan={harpPlanPct} col={pct2col(harpOverall)}/>
            <PctCard label="Welding" pct={harpWeldPct} col="#22c55e" sub={`${harpTotalDone.toLocaleString()} / ${harpTotalPlan.toLocaleString()} welds`}/>
            <PctCard label="Hydro Test" pct={harpHydroPct} col="#38bdf8" sub={`${harpHydroDone} / ${allHarps.length} harps`}/>
            <div style={S.card}><div style={S.label}>Total Boxes</div><div style={S.big("#555")}>{data.harpFab.length}</div></div>
          </div>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Box Group</th><th style={S.th}>Plan Start</th><th style={S.th}>Plan Finish</th>
              <th style={S.th}>Plan Q'ty</th><th style={S.th}>Actual Q'ty</th><th style={S.th}>Weld%</th>
              <th style={S.th}>Hydro Done</th><th style={S.th}>Status</th>
            </tr></thead>
            <tbody>
              {data.harpFab.map(g=>{
                const done=g.harps.reduce((s,h)=>s+(Number(h.completedQty)||0),0);
                const wp=g.planQty>0?Math.min(100,Math.round(done/g.planQty*100)):0;
                const hy=g.harps.filter(h=>h.hydroDone===1).length;
                const pp=timePct(g.start,g.finish);
                const d2=wp-pp;
                const sc=pp===0?"No Plan":d2>2?"▲ Ahead":d2>=-2?"● On Plan":"▼ Behind";
                return (
                  <tr key={g.id}>
                    <td style={{...S.td,fontWeight:700}}>{g.groupName}</td>
                    <td style={S.td}>{g.start||"—"}</td><td style={S.td}>{g.finish||"—"}</td>
                    <td style={S.td}>{g.planQty.toLocaleString()}</td>
                    <td style={S.td}>{done.toLocaleString()}</td>
                    <td style={{...S.td,fontWeight:700,color:pct2col(wp)}}>{wp}%</td>
                    <td style={S.td}>{hy}/{g.harps.length}</td>
                    <td style={S.td}>{sc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{height:16}}/>

          {/* Finned Tube Section */}
          <div style={S.sectionTitle}>5. Finned Tube</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
            <PctCard label="Avg Progress" pct={ftAvg} plan={ftPlanAvg} col={pct2col(ftAvg)}/>
            <div style={S.card}><div style={S.label}>Total Items</div><div style={S.big("#555")}>{data.finnedTube.length}</div></div>
            <PctCard label="Plan Q'ty" pct={100} col="#b45309" sub={ftTotalPlan.toLocaleString()} plan={undefined}/>
            <PctCard label="Actual Q'ty" pct={ftTotalPlan>0?Math.round(ftTotalActual/ftTotalPlan*100):0} col={pct2col(ftAvg)} sub={ftTotalActual.toLocaleString()} plan={undefined}/>
          </div>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Box No.</th><th style={S.th}>Item</th><th style={S.th}>OD</th>
              <th style={S.th}>Plan Q'ty</th><th style={S.th}>Actual Q'ty</th><th style={S.th}>Progress%</th>
              <th style={S.th}>Start</th><th style={S.th}>Finish</th>
            </tr></thead>
            <tbody>
              {data.finnedTube.map(r=>{
                const ap=ftPct(r);
                return (
                  <tr key={r.id}>
                    <td style={S.td}>{r.boxNo}</td><td style={{...S.td,fontWeight:700}}>{r.item}</td>
                    <td style={S.td}>{r.od}</td>
                    <td style={S.td}>{Number(r.planQty).toLocaleString()}</td>
                    <td style={S.td}>{Number(r.actualQty).toLocaleString()}</td>
                    <td style={{...S.td,fontWeight:700,color:pct2col(ap)}}>{ap}%</td>
                    <td style={S.td}>{r.start||"—"}</td><td style={S.td}>{r.finish||"—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── PAGE 3: Header + Casing ── */}
        <div style={{...S.page,pageBreakAfter:"always",marginBottom:12,borderRadius:8,border:"1px solid #e2e8f0",boxShadow:"0 1px 6px #0001"}}>
          <div style={S.sectionTitle}>6. Header Fabrication</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
            <PctCard label="Overall" pct={hdrAvg} plan={hdrPlanAvg} col={pct2col(hdrAvg)}/>
            <div style={S.card}><div style={S.label}>Total Headers</div><div style={S.big("#555")}>{allHdrs.length}</div></div>
            <div style={S.card}><div style={S.label}>Complete</div><div style={S.big("#22c55e")}>{hdrComplete}</div></div>
            <div style={S.card}>
              <div style={S.label}>Steps Progress</div>
              {HDR_L.map((l,i)=>{
                const cnt=allHdrs.filter(h=>HDR_S[i]==="pwht"?(h.pwht===1||h.pwht===2):h[HDR_S[i]]===1).length;
                const p=allHdrs.length?Math.round(cnt/allHdrs.length*100):0;
                return <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:1}}><span>{l}</span><span style={{fontWeight:700,color:pct2col(p)}}>{p}%</span></div>;
              })}
            </div>
          </div>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Box Group</th>
              {HDR_L.map(l=><th key={l} style={S.th}>{l}</th>)}
              <th style={S.th}>Overall%</th>
            </tr></thead>
            <tbody>
              {data.headerDrill.map(g=>{
                const steps = HDR_S.map(k=>{
                  const cnt=(g.headers||[]).filter(h=>k==="pwht"?(h.pwht===1||h.pwht===2):h[k]===1).length;
                  const tot=(g.headers||[]).length;
                  return tot>0?Math.round(cnt/tot*100):0;
                });
                const avg=steps.length?Math.round(steps.reduce((a,b)=>a+b,0)/steps.length):0;
                return (
                  <tr key={g.id}>
                    <td style={{...S.td,fontWeight:700}}>{g.groupName}</td>
                    {steps.map((p,i)=><td key={i} style={{...S.td,color:pct2col(p),fontWeight:p>0?700:400}}>{p}%</td>)}
                    <td style={{...S.td,fontWeight:700,color:pct2col(avg)}}>{avg}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{height:16}}/>

          {/* Casing */}
          <div style={S.sectionTitle}>7. Casing & Modulation</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            <PctCard label="Overall" pct={casingAvg} plan={casingPlanAvg} col={pct2col(casingAvg)}/>
            <div style={S.card}><div style={S.label}>Total Parts</div><div style={S.big("#555")}>{data.casing.length}</div></div>
            <div style={S.card}><div style={S.label}>Complete</div><div style={S.big("#22c55e")}>{data.casing.filter(p=>casingActPct(p)===100).length}</div></div>
          </div>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Part Name</th><th style={S.th}>Start</th><th style={S.th}>Finish</th>
              <th style={S.th}>Plan%</th><th style={S.th}>Actual%</th><th style={S.th}>Status</th>
            </tr></thead>
            <tbody>
              {data.casing.map(p=>{
                const ap=casingActPct(p), pp=timePct(p.start,p.finish), d=ap-pp;
                const sc=pp===0?"No Plan":d>2?"▲ Ahead":d>=-2?"● On Plan":"▼ Behind";
                return (
                  <tr key={p.id}>
                    <td style={{...S.td,fontWeight:700}}>{p.name}</td>
                    <td style={S.td}>{p.start||"—"}</td><td style={S.td}>{p.finish||"—"}</td>
                    <td style={S.td}>{pp}%</td>
                    <td style={{...S.td,fontWeight:700,color:pct2col(ap)}}>{ap}%</td>
                    <td style={S.td}>{sc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── PAGE 4: Module Box Assembly + MA Piping ── */}
        <div style={{...S.page,marginBottom:12,borderRadius:8,border:"1px solid #e2e8f0",boxShadow:"0 1px 6px #0001"}}>
          <div style={S.sectionTitle}>8. Module Box Assembly Detail</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
            <PctCard label="Overall" pct={boxAvg} plan={boxPlanAvg} col={pct2col(boxAvg)}/>
            <div style={S.card}><div style={S.label}>Total Boxes</div><div style={S.big("#555")}>{data.boxAssemblyV2.length}</div></div>
            <div style={S.card}><div style={S.label}>Complete</div><div style={S.big("#22c55e")}>{boxComplete}</div></div>
            <div style={S.card}><div style={S.label}>In Progress</div><div style={S.big("#f59e0b")}>{data.boxAssemblyV2.filter(b=>{ const p=boxActPct(b); return p>0&&p<100; }).length}</div></div>
          </div>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Box No.</th><th style={S.th}>Name</th><th style={S.th}>Q'ty (Ton)</th>
              <th style={S.th}>Start</th><th style={S.th}>Finish</th><th style={S.th}>Plan%</th>
              <th style={S.th}>Actual%</th><th style={S.th}>Status</th>
            </tr></thead>
            <tbody>
              {data.boxAssemblyV2.map(b=>{
                const ap=boxActPct(b), pp=timePct(b.start,b.finish), d=ap-pp;
                const sc=pp===0?"No Plan":d>2?"▲ Ahead":d>=-2?"● On Plan":"▼ Behind";
                return (
                  <tr key={b.id}>
                    <td style={{...S.td,fontWeight:700}}>{b.boxNo}</td>
                    <td style={S.td}>{b.name}</td><td style={S.td}>{b.qty||"—"}</td>
                    <td style={S.td}>{b.start||"—"}</td><td style={S.td}>{b.finish||"—"}</td>
                    <td style={S.td}>{pp}%</td>
                    <td style={{...S.td,fontWeight:700,color:pct2col(ap)}}>{ap}%</td>
                    <td style={S.td}>{sc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{height:16}}/>

          {/* MA Piping */}
          <div style={S.sectionTitle}>9. MA Piping</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
            <PctCard label="Overall Weld" pct={pipingPct} col={pct2col(pipingPct)} sub={`${pipingWeld}/${allJoints.length} joints`}/>
            <div style={S.card}><div style={S.label}>Total ISO DWGs</div><div style={S.big("#555")}>{data.piping.length}</div></div>
            <div style={S.card}><div style={S.label}>Complete</div><div style={S.big("#22c55e")}>{data.piping.filter(r=>r.joints.length&&r.joints.every(j=>j.weld===1)).length}</div></div>
            <div style={S.card}><div style={S.label}>Total Joints</div><div style={S.big("#555")}>{allJoints.length}</div></div>
          </div>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Box</th><th style={S.th}>ISO DWG</th><th style={S.th}>Line No.</th>
              <th style={S.th}>Joints</th><th style={S.th}>Fit-up</th><th style={S.th}>Weld</th>
              <th style={S.th}>NDE</th><th style={S.th}>PWHT</th><th style={S.th}>Weld%</th>
            </tr></thead>
            <tbody>
              {data.piping.map(iso=>{
                const jn=iso.joints.length;
                const fu=iso.joints.filter(j=>j.fitup===1).length;
                const wd=iso.joints.filter(j=>j.weld===1).length;
                const nd=iso.joints.filter(j=>j.nde===1).length;
                const pw=iso.joints.filter(j=>j.pwht===1||j.pwht===2).length;
                const wp=jn>0?Math.round(wd/jn*100):0;
                return (
                  <tr key={iso.id}>
                    <td style={S.td}>{iso.boxNo||"—"}</td>
                    <td style={{...S.td,fontWeight:700}}>{iso.isoNo}</td>
                    <td style={S.td}>{iso.lineNo||"—"}</td>
                    <td style={S.td}>{jn}</td>
                    <td style={S.td}>{fu}/{jn}</td><td style={S.td}>{wd}/{jn}</td>
                    <td style={S.td}>{nd}/{jn}</td><td style={S.td}>{pw}/{jn}</td>
                    <td style={{...S.td,fontWeight:700,color:pct2col(wp)}}>{wp}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{marginTop:20,paddingTop:10,borderTop:"1px solid #ddd",display:"flex",justifyContent:"space-between",fontSize:9,color:"#aaa"}}>
            <span>{project.projectNo} — {project.projectName} | MA Box Fabrication Tracker</span>
            <span>Report Generated: {dateStr}</span>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}


function makeUnitData(boxes) {
  return {
    finnedTube:  INIT_FINNED_TUBE.map(r=>({...r})),
    headerDrill: INIT_HEADER_DRILL.map(g=>({...g, headers:g.headers.map(h=>({...h}))})),
    headerFab:   INIT_HEADER_FAB.map(r=>({...r})),
    harpFab: INIT_HARP_V2.map(g=>({...g, harps:g.harps.map(h=>({...h}))})),
    casing:      INIT_CASING.map(p=>({...p, activities:p.activities.map(a=>({...a}))})),
    shipping:    {...INIT_SHIPPING},
    piping:      INIT_PIPING.map(r=>({...r, joints:r.joints.map(j=>({...j}))})),
    boxAssemblyV2: INIT_BOX_ASSEMBLY_V2.map(b=>({...b, activities:b.activities.map(a=>({...a}))})),
    boxAssembly: ["6A","6B","6C","5A","5B","5C","4A","4B","4C","3A","3B","3C","2A","2B","2C","1A","1B","1C"].map(b=>({ boxId:`Box ${b}`, qty:1, planPct:0, actualPct:0, remark:"" })),
  };
}

function ProjectInfoModal({ project, setProject, onReset, onClose }) {
  const [form, setForm] = useState({ ...project });
  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { setProject(form); onClose(); };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000bb", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:C.panel, border:`1px solid ${C.border}`, borderRadius:16,
        width:"min(680px,95vw)", maxHeight:"90vh", overflowY:"auto",
        boxShadow:"0 0 80px #00000099",
      }}>
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0a1525", position:"sticky", top:0, zIndex:1 }}>
          <div style={{ fontSize:18, fontWeight:800, color:C.text }}>Project Information</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.dim, fontSize:22, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ padding:"24px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            {[
              { key:"projectNo",   label:"Project No.",  placeholder:"เช่น V17566" },
              { key:"projectName", label:"Project Name", placeholder:"เช่น Tallgrass I" },
              { key:"startDate",   label:"Start Date",   type:"date" },
              { key:"targetDate",  label:"Target Date",  type:"date" },
            ].map(f => (
              <label key={f.key} style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <span style={{ fontSize:13, color:"#7aa8c8", fontWeight:600 }}>{f.label}</span>
                <input type={f.type||"text"} value={form[f.key]||""} onChange={e=>setField(f.key,e.target.value)} placeholder={f.placeholder||""}
                  style={{ background:"#081220", border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"10px 12px", fontSize:15, fontFamily:SANS, outline:"none", colorScheme:"dark" }}
                  onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}
                />
              </label>
            ))}
          </div>

          {/* Boxes section */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:13, color:"#7aa8c8", fontWeight:600, marginBottom:8 }}>Boxes (Unit 1)</div>
            <div style={{ background:"#081220", border:`1px solid ${C.border}`, borderRadius:6, padding:"12px 14px" }}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                {(form.units?.[0]?.boxes||[]).map(b => (
                  <div key={b} style={{ display:"flex", alignItems:"center", gap:4, background:`${C.accent}15`, border:`1px solid ${C.accent}44`, borderRadius:5, padding:"3px 8px" }}>
                    <span style={{ fontSize:12, color:C.accent, fontFamily:"monospace" }}>Box {b}</span>
                    <button onClick={()=>setForm(p=>({...p,units:[{...p.units[0],boxes:p.units[0].boxes.filter(x=>x!==b)},...p.units.slice(1)]}))}
                      style={{ background:"none", border:"none", color:C.dim, cursor:"pointer", fontSize:11, padding:"0 2px", lineHeight:1 }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <input id="newBoxInput" placeholder="e.g. 7A" style={{ background:"#0a1628", border:`1px solid ${C.border}`, borderRadius:5, color:C.text, padding:"5px 10px", fontSize:13, fontFamily:"monospace", width:80, outline:"none" }}
                  onKeyDown={e=>{ if(e.key==="Enter"){ const v=e.target.value.trim(); if(v){ setForm(p=>({...p,units:[{...p.units[0],boxes:[...p.units[0].boxes,v]},...p.units.slice(1)]})); e.target.value=""; }}}}
                />
                <button onClick={()=>{ const inp=document.getElementById("newBoxInput"); const v=(inp?.value||"").trim(); if(v){ setForm(p=>({...p,units:[{...p.units[0],boxes:[...p.units[0].boxes,v]},...p.units.slice(1)]})); if(inp) inp.value=""; }}}
                  style={{ background:`${C.accent}20`, border:`1px solid ${C.accent}44`, color:C.accent, borderRadius:5, padding:"5px 12px", cursor:"pointer", fontSize:12, fontFamily:SANS }}>+ Add</button>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:16, borderTop:`1px solid ${C.border}` }}>
            <button onClick={()=>{ onReset(); onClose(); }}
              style={{ background:"#2a0a0a", border:`1px solid ${C.red}44`, color:C.red, borderRadius:8, padding:"9px 18px", cursor:"pointer", fontSize:13, fontWeight:600 }}>
              🔄 Reset & Start Over
            </button>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={onClose} style={{ background:"#1a2a3a", border:`1px solid ${C.border}`, color:C.dim, borderRadius:8, padding:"9px 20px", cursor:"pointer", fontSize:14 }}>ยกเลิก</button>
              <button onClick={handleSave} style={{ background:C.accent, border:"none", color:"#000", borderRadius:8, padding:"9px 28px", cursor:"pointer", fontSize:14, fontWeight:800 }}>บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // ── Project ID จาก URL param (?project=tallgrass) ──────────────────────
  const projectId = useMemo(() => {
    const p = new URLSearchParams(window.location.search).get("project");
    return (p || "default").toLowerCase().replace(/[^a-z0-9_-]/g, "");
  }, []);

  const docRef = useMemo(() => doc(db, "projects", projectId), [projectId]);

  // ── States ─────────────────────────────────────────────────────────────
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saveMsg,  setSaveMsg]  = useState("");
  const [project,  setProject]  = useState(DEFAULT_PROJECT);
  const [tab,      setTab]      = useState("dashboard");
  const [activeUnitIdx, setActiveUnitIdx] = useState(0);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showReportModal,  setShowReportModal]  = useState(false);

  const [unitDataMap, setUnitDataMap] = useState(() => {
    const map = {};
    DEFAULT_PROJECT.units.forEach(u => { map[u.unitNo] = makeUnitData(u.boxes); });
    return map;
  });

  const saveTimer = useRef(null);

  // ── Load from Firestore on mount / project change ──────────────────────
  useEffect(() => {
    setLoading(true);
    getDoc(docRef).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.project)     setProject(d.project);
        if (d.unitDataMap) setUnitDataMap(d.unitDataMap);
      }
    }).catch(e => console.error("Load error:", e))
      .finally(() => setLoading(false));
  }, [docRef]);

  // ── Auto-save to Firestore (debounce 1.5s) ─────────────────────────────
  const triggerSave = useCallback((proj, udm) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true); setSaveMsg("");
      try {
        await setDoc(docRef, { project: proj, unitDataMap: udm });
        setSaveMsg("✓ Saved");
        setTimeout(() => setSaveMsg(""), 2500);
      } catch (e) {
        console.error("Save error:", e);
        setSaveMsg("✗ Save failed");
      }
      setSaving(false);
    }, 1500);
  }, [docRef]);

  // ── Wrap setUnitDataMap เพื่อ trigger save ─────────────────────────────
  const setUnitDataMapAndSave = useCallback((updater) => {
    setUnitDataMap(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      triggerSave(project, next);
      return next;
    });
  }, [project, triggerSave]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleReset = () => {
    setProject(DEFAULT_PROJECT);
    const map = {};
    DEFAULT_PROJECT.units.forEach(u => { map[u.unitNo] = makeUnitData(u.boxes); });
    setUnitDataMap(map);
    triggerSave(DEFAULT_PROJECT, map);
  };

  const handleProjectSave = (proj) => {
    setUnitDataMap(prev => {
      const map = { ...prev };
      proj.units.forEach(u => {
        if (!map[u.unitNo]) map[u.unitNo] = makeUnitData(u.boxes);
      });
      triggerSave(proj, map);
      return map;
    });
    setProject(proj);
    if (activeUnitIdx >= proj.units.length) setActiveUnitIdx(0);
  };

  const currentUnit = project.units[activeUnitIdx] || project.units[0];
  const unitKey = currentUnit?.unitNo;
  const uData = unitDataMap[unitKey] || makeUnitData(currentUnit?.boxes || []);

  const setUField = (field) => (valOrFn) => {
    setUnitDataMapAndSave(prev => ({
      ...prev,
      [unitKey]: {
        ...prev[unitKey],
        [field]: typeof valOrFn === "function" ? valOrFn(prev[unitKey]?.[field]) : valOrFn,
      }
    }));
  };

  const data = uData;
  const multiUnit = project.units.length > 1;

  // ── Loading screen ─────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:C.bg, gap:16 }}>
      <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTop:`3px solid ${C.accent}`, borderRadius:"50%", animation:"spin 0.9s linear infinite" }} />
      <div style={{ color:C.dim, fontFamily:SANS, fontSize:14 }}>Loading <span style={{ color:C.accent, fontWeight:700 }}>{projectId}</span>…</div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily:SANS, background:C.bg, minHeight:"100vh", color:C.text, fontSize:14 }}>
      {showReportModal && <ReportModal data={uData} project={project} onClose={()=>setShowReportModal(false)} />}
      {showProjectModal && (
        <ProjectInfoModal
          project={project}
          setProject={handleProjectSave}
          onReset={handleReset}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      <div style={{ background:"#050c1a", borderBottom:`1px solid ${C.border}`, padding:"0 24px" }}>
        {/* Save status bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"4px 0", borderBottom:`1px solid ${C.border}22`, minHeight:24 }}>
          <span style={{ fontSize:11, fontFamily:MONO, color:"#2a4a6a", letterSpacing:"0.08em" }}>
            project: <span style={{ color:C.accent }}>{projectId}</span>
          </span>
          {saving && (
            <span style={{ marginLeft:16, fontSize:11, color:C.amber, fontFamily:SANS, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:C.amber, animation:"pulse 1s ease-in-out infinite" }} />
              Saving…
            </span>
          )}
          {!saving && saveMsg && (
            <span style={{ marginLeft:16, fontSize:11, color:C.green, fontFamily:SANS }}>{saveMsg}</span>
          )}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </div>
        {multiUnit && (
          <div style={{ display:"flex", alignItems:"center", gap:0, borderBottom:`1px solid ${C.border}`, marginLeft:-24, marginRight:-24, paddingLeft:24 }}>
            <span style={{ fontSize:11, color:C.dim, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginRight:16, whiteSpace:"nowrap" }}>Unit</span>
            {project.units.map((u, i) => (
              <button key={u.unitNo} onClick={()=>setActiveUnitIdx(i)} style={{
                background: activeUnitIdx===i ? `${C.amber}22` : "transparent",
                border:"none",
                borderBottom: activeUnitIdx===i ? `2px solid ${C.amber}` : "2px solid transparent",
                borderRight:`1px solid ${C.border}`,
                color: activeUnitIdx===i ? C.amber : "#5a7a96",
                padding:"8px 22px", cursor:"pointer", fontSize:13, fontFamily:SANS,
                fontWeight: activeUnitIdx===i ? 700 : 500,
                transition:"all 0.15s", whiteSpace:"nowrap",
              }}>
                Unit {u.unitNo}
              </button>
            ))}
          </div>
        )}

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:16, paddingBottom:10 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <span style={{ fontSize:11, color:"#2a4a6a", letterSpacing:"0.18em", fontFamily:SANS, fontWeight:700, textTransform:"uppercase" }}>HRSG FAB TRACKER</span>
              <span style={{ color:"#1a3050", fontSize:10 }}>•</span>
              <span style={{ fontSize:10, color:"#3a5a7a", fontFamily:SANS }}>© All rights reserved : </span>
              <span style={{ fontSize:11, fontFamily:SANS, fontWeight:800, letterSpacing:"0.08em", background:"linear-gradient(90deg,#00d4ff,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                {project.engineer||"Lee Supolchai"}
              </span>
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:C.accent, fontFamily:SANS, letterSpacing:"0.02em" }}>
              {project.projectNo && <span style={{ color:C.amber }}>{project.projectNo} </span>}
              {project.projectName || "MA BOX"}
              {multiUnit && <span style={{ fontSize:14, color:C.amber, fontWeight:600, marginLeft:10 }}>— Unit {currentUnit?.unitNo}</span>}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button onClick={()=>setShowProjectModal(true)} style={{
              background:`${C.accent}18`, border:`1px solid ${C.accent}44`, color:C.accent,
              borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13,
              fontFamily:SANS, fontWeight:600, transition:"all 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.background=`${C.accent}30`}
              onMouseLeave={e=>e.currentTarget.style.background=`${C.accent}18`}
            >⚙ Project Info</button>
            <button onClick={()=>setShowReportModal(true)} style={{
              background:"#14532d", border:"1px solid #22c55e66", color:"#22c55e",
              borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13,
              fontFamily:SANS, fontWeight:700, transition:"all 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="#166534"}
              onMouseLeave={e=>e.currentTarget.style.background="#14532d"}
            >📄 Gen Report</button>
            {!multiUnit && (
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:12, color:C.dim, fontFamily:SANS, fontWeight:600, textTransform:"uppercase" }}>Unit</div>
                <div style={{ fontSize:26, fontWeight:800, color:C.amber, fontFamily:MONO }}>{currentUnit?.unitNo || "—"}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:8, paddingBottom:4, display:"flex", flexWrap:"wrap", gap:4 }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              background: tab===t.id ? `${C.accent}22` : "#0a1828",
              border: tab===t.id ? `1px solid ${C.accent}66` : `1px solid ${C.border}`,
              borderRadius:6,
              color: tab===t.id ? C.accent : "#5a7a96",
              padding:"6px 14px", cursor:"pointer", fontSize:12, fontFamily:SANS,
              fontWeight: tab===t.id ? 700 : 400,
              transition:"all 0.15s", whiteSpace:"nowrap",
              boxShadow: tab===t.id ? `0 0 8px ${C.accent}22` : "none",
            }}
              onMouseEnter={e=>{ if(tab!==t.id){ e.currentTarget.style.borderColor=`${C.accent}44`; e.currentTarget.style.color="#8ab4cc"; }}}
              onMouseLeave={e=>{ if(tab!==t.id){ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color="#5a7a96"; }}}
            >{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"24px", maxWidth:1400, margin:"0 auto" }}>
        {tab==="piping"     && <PipingTab rows={uData.piping} setRows={setUField("piping")} />}
        {tab==="modbox"     && <ModBoxTab rows={uData.boxAssemblyV2} setRows={setUField("boxAssemblyV2")} allData={uData} />}
        {tab==="dashboard"  && <Dashboard data={data} />}
        {tab==="harp"       && <HarpFabTab rows={uData.harpFab} setRows={setUField("harpFab")} />}
        {tab==="finnedtube" && <FinnedTubeTab rows={uData.finnedTube} setRows={setUField("finnedTube")} />}
        {tab==="hdrill"     && <HeaderDrillTab rows={uData.headerDrill} setRows={setUField("headerDrill")} />}
        {tab==="casing"     && <CasingTab rows={uData.casing} setRows={setUField("casing")} />}
      </div>
    </div>
  );
}
