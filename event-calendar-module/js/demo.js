let events;
debugger;
// events = Array.isArray(getEvents_recur[0]) && typeof getEvents_recur[0] !== "undefined"
//                || typeof getEvents_recur[0] === "undefined" ? getEvents_recur : JSON.parse(getEvents_recur);
events = getEvents_recur;
let settings = {};
let element = document.getElementById('caleandar');
debugger;
caleandar(element, events, settings);
