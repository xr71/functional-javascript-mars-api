let store = Immutable.Map({
      user: Immutable.Map({
        name: "Student"
    }),
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    view: 'Landing',
    current_rover: Immutable.Map({
      manifest: Immutable.Map({}),
      photos: Immutable.List([])
    })
});


// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    store = state.merge(newState);
    render(root, store);
}

const render = async (root, state) => {
    // console.log("Called render:")
    root.innerHTML = App(state);
}


// create content
const App = (state) => {

    let rovers = state.get("rovers");
    let apod = state.get("apod");

    switch (state.get("view")) {
        case "Landing":
            return viewLandingPage(rovers);
        case "apod":
            return viewApodComponent();
        case "Curiosity":
            return viewRoverComponent(store, "Curiosity");
        case "Opportunity":
            return viewRoverComponent(store, "Opportunity");
        case "Spirit":
            return viewRoverComponent(store, "Spirit");
        default:
            return viewLandingPage(rovers);
    }

    // return `
    //     <header> </header>
    //     <main>
    //         ${Greeting(state.getIn(["user", "name"]))}
    //         <section>
    //             <h3>Put things on the page!</h3>
    //             <p>Here is an example section.</p>
    //             <p>
    //                 One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
    //                 the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
    //                 This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
    //                 applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
    //                 explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
    //                 but generally help with discoverability of relevant imagery.
    //             </p>
    //             ${ImageOfTheDay(apod)}
    //         </section>
    //     </main>
    //     <footer>Xu Ren for Udacity JavaScript</footer>
    // `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
const HeaderComponent = () => {
    return `
      <header>
          <button onclick="hocMakeButton('Landing')">Click here to return to the main dashboard menu</button>
      </header>
    `
}

const viewLandingPage = (rovers) => {
    roversArr = rovers.toJS();

    let roverButtons = roversArr.map((rover) => {
        return `<div class="col-1">
            <button onclick="hocMakeButton('${rover}')" >${rover}</button>
        </div>`
    })

    return `
        <div>
            <h3>Welcome to Space Exploration with the NASA API</h3>
        </div>

        <div>
            <p>Explore Mars Rovers</p>
            <div class="row">
                ${roverButtons.join("")}
            </div>
        </div>

        <div>
            <p>Learn about the astronomical photo of the day</p>
            <button onclick="hocMakeButton('apod')">Show Image</button>
        </div>
    `
}

const viewRoverComponent = (state, rover) => {
    current_rover = state.get("current_rover").toJS();

    console.log(current_rover);


    if (!current_rover) {
        getRoverInfo(state, rover);
    }

    return HeaderComponent() + `Hello ${rover}`;
}

const hocMakeButton = (view) => {
    newState = store.set("view", view);
    updateStore(store, newState);

}

const viewApodComponent = () => {
    return HeaderComponent() + `Apod Image Goes Here`
}

// Example of a pure function that renders information requested from the backend
const ImageOfTheDay = (apod) => {
    if (!store.get("apod")) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS
const getImageOfTheDay = (state) => {
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(
            apod => {
                console.log(apod);

                const newState = state.set("apod", apod);
                updateStore(state, newState);

                return apod
            })
}

const getRoverInfo = (state, rover) => {
    return ""
}
