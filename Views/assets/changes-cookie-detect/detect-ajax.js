// (function() {
//     var proxied = window.XMLHttpRequest.prototype.send;
//     var counter = 0;
//     window.XMLHttpRequest.prototype.send = function() {
//         // console.log( arguments );
//         //Here is where you can add any code to process the request.
//         //If you want to pass the Ajax request object, pass the 'pointer' below
//         var pointer = this;
//         var intervalId = window.setInterval(function(){
//             if(pointer.readyState !== 4){
//                 return;
//             }
//             // console.log( pointer.responseText );
//             // Check browser support
//             console.log("Outside: "+parseInt(localStorage.getItem("counter")));
//             if (parseInt(localStorage.getItem("counter")) !== 0 && parseInt(localStorage.getItem("counter")).toString() !== 'NaN'){
//                 // Retrieve
//                 console.log("inside: "+parseInt(localStorage.getItem("counter")));
//                 counter = parseInt(localStorage.getItem("counter"));
//             }
//
//             if(pointer.responseText.trim() === "" && counter < 3){
//                 console.log("in counter: "+counter);
//                 counter++;
//                 // Store
//                 localStorage.setItem("counter", counter.toString());
//                 if (counter < 3)
//                     window.location.reload(true);
//             }
//             if (counter === 3){
//                 // alert('There must be no Internet or server is down, please try again later');
//                 localStorage.setItem("counter", "0");
//             }
//             //Here is where you can add any code to process the response.
//             //If you want to pass the Ajax request object, pass the 'pointer' below
//             clearInterval(intervalId);
//
//         }, 1);//I found a delay of 1 to be sufficient, modify it as you need.
//         return proxied.apply(this, [].slice.call(arguments));
//     };
// })();