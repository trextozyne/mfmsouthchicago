(function () {
    let r = document.getElementsByTagName('script');
    var interval = null;
    interval = setInterval(()=>{
        for (let i = (r.length-1); i >= 0; i--) {

            if(r[i].getAttribute('id') === 'events-calendar' || r[i].getAttribute('id') === 'events-calendar-demo'){
                r[i].parentNode.removeChild(r[i]);
            }
        }
    }, 100);

    setTimeout(()=> {
        console.clear();
        clearInterval(interval); // stop the interval
    }, 4000)
})();