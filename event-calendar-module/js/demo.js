var events;
// debugger;
// events = Array.isArray(getEvents_recur[0]) && typeof getEvents_recur[0] !== "undefined"
//                || typeof getEvents_recur[0] === "undefined" ? getEvents_recur : JSON.parse(getEvents_recur);
events = getEvents_recur;
var settings = {};
var calenderelement = document.getElementById('caleandar');
// debugger;
caleandar(calenderelement, events, settings);
