let answers = `
        The Sunday service starts at 9.30am and ends 12:30pm
However, Sunday service opens with workers Prayer meeting from 9am to 9.30am | The Church is located at 8545 S Cottage Grove Ave, Chicago, IL 60619. Please refer to the “Contact Us”
page for directions. | The sermon is preached live on most Sundays. However, we usually have a Glorious Sunday Service once
in every quarter, and for this service, all MFM branches listen to the same sermon, delivered by video
often by Pastor D.K Olukoya.
Also, for our midweek service on Thursdays, the sermon is delivered by video twice a month during
Manna Water Service, often by Dr. D.K Olukoya, General Overseer of MFM Ministries, Nigeria. The other
2-3 times a month, the Thursday midweek bible Study, sermon and prayer session is coordinated by the
Local church ministers. | Of course! We love kids at MFM Home of Champions, and offer age-appropriate environments where
your kids (Birth – 5th grade) will learn about Jesus and the Bible on their level. We have excellent, well-
trained children&#39;s and nursery workers who have passed all the necessary background requirements. We
ask that you check your kids into our kids’ area so that your children can enjoy a service tailored
specifically for their age group. | Each service is typically goes from 2-3 hours, and has a time of worship, Prayer, Bible based preaching,
announcements, and offering, but not always in that order! | We have our own worship team with its own unique sound. Styles range from gospel, hymns,
contemporary, Christian rock, and more. Our worship team represents different cultures and creative
expressions, so you can expect anything. Our aim is to please God through these expressions rooted in
diversity and unity, and through that, we serve and lead our faith family into worshiping God. | We encourage modest dressing. Ladies are expected to have well covered clothing that doesn’t expose
intimate part of their bodies. Additionally, women are advised to cover their hair as instructed in the
bible. Men are also encouraged to dress modestly and decently to the church. | Yes. We know that coming to a new church for the first time can be intimidating. We would love for you
to take advantage of our First Time Guest team and plan your visit so we know when you are coming.
When you come for your visit, someone will greet you in the lobby and help get you and your family
where you need to be. Our team of dedicated volunteers will do everything they can to make sure you
have the best experience possible. | When we pray fall down and die, it is not a request for the physical death of any individual. It is a
command to freeze, paralyze, or terminate the power and influence of unseen evil powers and forces
(Ephesians 6:12) at work against those who have come to the Lord to seek refuge. The principle: In the
battlefield of life, you must stop them before they stop you.
    `;
let arrayOfAnswers = answers.split("|".trim());
let questions = document.getElementsByClassName('questions');

for (let i = 0; i < questions.length; i++) {
    questions[i].addEventListener('click', function() {
        //debugger;
        let wrapper = document.getElementsByClassName('wrapper')[0];
        wrapper.childNodes[0].textContent = "";
        document.querySelector('#answers p').classList.add('hide');
        setTimeout(function() {
            document.querySelector('#answers p').textContent = arrayOfAnswers[i];
        }, 500);
        setTimeout(function() {
            document.querySelector('#answers p').classList.remove('hide')
        }, 500);
        // document.querySelector('#answers p').innerHTML = arrayOfAnswers[i];
        document.getElementsByClassName('fade-out')[0].className = "fade-in";

        document.getElementsByClassName('inner-right-wrapper')[0].classList.remove("none");
    });
}