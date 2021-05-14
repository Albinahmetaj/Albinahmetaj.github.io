//Variabler som representerar vilken sida vi befinner oss på
let defaultPage = 1;
let pagesTotal;
let pagesToShow = 10;




//Eventlistener för att få fram fösta sidan efter en sökning via onclick (kolla i html)
async function getSearchedImages()
{
    
    let warning = document.getElementById("searchtwo");
    

    
    if(warning.value.length == 0)
    {
        
        alert("No entry.... Please try again!");

    }
    else if(warning.value[0] == " ")
    {
        alert("No whitespace allowed as first character.... Please try again!");
    }
   
    else{
        defaultPage = 1;
        let images = await getImages();
        updateMainAndOverlay(images);
    }

};


//Eventlistener för att gå till föregående sida via onclick i html
async function getPreviousImages()
{
   
    defaultPage--;
    if (defaultPage >= 1) 
    {
        let images = await getImages();
        updateMainAndOverlay(images);
    }

};


//Eventlistener för att gå till nästa sida via onclick i html
async function getNextImages() 
{
    
    defaultPage++;
    if (defaultPage <= pagesTotal)
    {
        let images = await getImages();
        updateMainAndOverlay(images);
    }

};


async function getImages(){
    
    // queryselectors som låter oss lägga in respektive api queryparam som värde i select satserna
    // text = input i searchbaren, sort = select sortby etc
    let per_page = getSizePerPage();
    let text = document.querySelector("input").value;
    let sort = document.querySelector("select.Sortby").value;
    let tags = document.querySelector("select.tags").value;
   
    let notags = document.getElementsByClassName("notags").value;

    //urlförfrågan med apikey för att få svar från servern

    let apiUrl = `https://api.flickr.com/services/rest?api_key=b1eaa4ec93be98caf2889b9007a14324&method=flickr.photos.search&text=${text}&tag_mode=${notags}&tags=${tags}&sort=${sort}&per_page=${per_page}&page=${defaultPage}&format=json&nojsoncallback=1`;


    try{

        let manipulateApi = await fetch(apiUrl);
        //konverterar json innehållet efter fetchen från servern till javascript objekt
        let apiData = await manipulateApi.json();

        pagesTotal = apiData.photos.pages;

        // låter oss ändra och lägga in innehållet i paragraphen med id pages, vi sätter innehållet i innerHTML för att få tillbaka pagnation sidorna
        let pagenotationPages = `Page ${defaultPage} of ${pagesTotal}`
        
        document.getElementById("pages").innerHTML = pagenotationPages;
        
        return await apiData;
    }
//I catchen så hanterar vi felet vilket hamnar i konsolen
    catch(errorMsg){
        console.error(errorMsg)
    }
};



// Hämtar bilden/bilderna beroende på storlek och gör om
function imgUrl(imgUrl, suffixSize){

    let imgSize = "z" // z = size suffix class = medium px= 640
    if(suffixSize == "thumb") {imgSize = "q"}
    if(suffixSize =="large") {imgSize = "b"} // om en bild är i klassen thumb eller large så sätter vi bilden/bilderna till imgSize q = 150px b = 1024px
    
    let photoUrl = `https://farm${imgUrl.farm}.staticflickr.com/${imgUrl.server}/${imgUrl.id}_${imgUrl.secret}_${imgSize}.jpg`

    return photoUrl;
};



function updateMainAndOverlay(urlData){

//vi lägger in alla bilder i main
    let main = document.querySelector("main");
    main.innerHTML = "";

    urlData.photos.photo.forEach(img =>{

        if(img.farm !==0){
        let newImgElem = document.createElement("img");
        newImgElem.setAttribute("src", imgUrl(img, "thumb"));
        newImgElem.setAttribute("alt", img.title);
       
        // onclick event som förstorar bild vid musklick
        newImgElem.addEventListener("click", function() {
    
            let ellarge = document.createElement("img");
            ellarge.setAttribute("src", imgUrl(img, "large"));
            ellarge.setAttribute("alt", img.title);
    //Overlay effekt som triggas  igång när vi förstorar den specifika bilden
            document.querySelector(".overlay").appendChild(ellarge);
    
            /*skapar klassen show i overlay section när bilden förstoras och klassen hide, vi skapar sedan en overlay"show" effekt när vi klickar på bilden och
            och en overlay hide när vi vill tillbaka till default vyn av galleriet */
            document.querySelector(".overlay").classList.add("show");
            document.querySelector(".overlay").classList.remove("hide");
        });

       

        main.appendChild(newImgElem);
        }
        
    });

};



//En onclick eventlistener som responsivt reagerar för att tabort overlay effekten vid klick
//En eventlistener i html section overlay som triggas igång vid musklick
//Genom innerhtml så får vi tillgång till innehållet i overlay section
function clickOnImage() {
    
    document.querySelector(".overlay").innerHTML = "";

    document.querySelector(".overlay").classList.remove("show");
    document.querySelector(".overlay").classList.add("hide");

};



//Hämtar värdet av antal foton ska returneras per sida och en bredd som anpassar hur många bilder som får plats för varje sida i bredden
//Sedan kallar vi på funktionen i getImages()

function getSizePerPage(){

    let elem = document.querySelector("select.page");
    let returnValue = elem.value

    let elemPhone = document.querySelector("select.mobilepage");
    let returnValuePhone = elemPhone.value;

    if(window.innerWidth >= 375 ){
        return returnValue;
    }
    else{
        return returnValuePhone;
    }
};


//eventlistener som låter använder klicka på enter efter en sökning och då få upp resultat.

let enterKey = document.querySelector("input");
enterKey.addEventListener("keyup", function(event) {

  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector("button.search").click();
  }
});
