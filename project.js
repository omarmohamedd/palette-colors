const colorDivs=document.querySelectorAll(".color");
const generateBtn=document.querySelector(".generate");
const sliders=document.querySelectorAll('input[type="Range"]');
const currentHexes=document.querySelectorAll(".color h2");
const popUp=document.querySelector(".copy-container");
const adjustBtn=document.querySelectorAll(".adjust");
const closeBtn=document.querySelectorAll(".close-adjustment");
const lockBtn=document.querySelectorAll(".lock");
const sliderContainer=document.querySelectorAll(".sliders");
let initialColors;
let savedPaletts=[];


sliders.forEach(slide=>{
    
   slide.addEventListener("input",controls) 
});


colorDivs.forEach((div,index)=>{
    
    div.addEventListener("change",()=>{
        
       updateText(index);
    });
});

currentHexes.forEach(hex =>{
    
    hex.addEventListener("click",()=>{
       
        copyToBoard(hex);
    });
   
});


 popUp.addEventListener("transitionend",function(){
         const popUpBox=popUp.children[0];
     popUpBox.classList.remove("active");
     popUp.classList.remove("active");
    });



adjustBtn.forEach((btn,index) =>{
    
    btn.addEventListener("click",()=>{
        
        openAdjustment(index);
    });
});

closeBtn.forEach((btn,index) =>{
    
    btn.addEventListener("click",()=>{
        
       closedAdjustment(index);
    });
});

generateBtn.addEventListener("click",randomColors);



lockBtn.forEach((btn,index)=>{
    
   btn.addEventListener("click",()=>{
      
       lockColor(index);
   }); 
});


function generateHex()
{
    const hexColor=chroma.random();
    return hexColor;
}


function randomColors()
{
    initialColors=[];
    colorDivs.forEach((div,index) =>{
      const randomColor=generateHex();
        const hexText=div.children[0];
        
        if(div.classList.contains("locked"))
            {
                initialColors.push(hexText.innerText)
                return;
            }
        else 
            {
                  initialColors.push(chroma(randomColor).hex());
            }
      
        div.style.backgroundColor=randomColor;
        hexText.innerText=randomColor;
        
        checkContrast(randomColor,hexText);
        
        const color =chroma(randomColor);
        
       const sliders=div.querySelectorAll(".sliders input");
        const hue=sliders[0];
        const brightness=sliders[1];
        const saturation=sliders[2];
        colorizeSliders(color,hue,brightness,saturation);
    });
     
    resetInputs();
    adjustBtn.forEach((btn,index)=>{
        checkContrast(initialColors[index],btn);
        checkContrast(initialColors[index],lockBtn[index]);
    });
}

randomColors();


function checkContrast(color,text)
{
    const luminance=chroma(color).luminance();
    if(luminance>0.5)
        {
            text.style.color="black";
        }
    else
        {
         text.style.color="white";   
        }
}

function colorizeSliders(color,hue,brightness,saturation)
{
  
    const noSat=color.set("hsl.s",0);
   const fullSat=color.set("hsl.s",1);
    const scaleSat=chroma.scale([noSat,color,fullSat]);
    const midBright=color.set("hsl.l",0.5);
    const scaleBright=chroma.scale(["black",midBright,"white"]);
    saturation.style.backgroundImage=`linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
     brightness.style.backgroundImage=`linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
     hue.style.backgroundImage=`linear-gradient(to right, rgb(255,0,0),rgb(0,0,255),rgb(255,127,80),rgb(0,255,255),rgb(255,0,255),rgb(128,0,0),rgb(0,128,128))`;
}




function controls(e)
{
    const index=e.target.getAttribute("data-bright")||
     e.target.getAttribute("data-hue")||
     e.target.getAttribute("data-sat") ;   
    
    let sliders=e.target.parentElement.querySelectorAll('input[type="Range"]');
   const hue=sliders[0];
    const brightness=sliders[1];
    const sat=sliders[2];
    const bgColor=initialColors[index];
    let color=chroma(bgColor)
    .set("hsl.s",sat.value)
    .set("hsl.l",brightness.value)
    .set("hsl.h",hue.value);
         
    
    colorDivs[index].style.backgroundColor=color;
    colorizeSliders(color,hue,brightness,sat);
}


function updateText(index)
{
    const activeDiv=colorDivs[index];
     const color =chroma(activeDiv.style.backgroundColor);
    const textHex=activeDiv.querySelector("h2");
    const icons=activeDiv.querySelectorAll(".controls button")
      checkContrast(color,textHex);
    icons.forEach(icon =>{
          checkContrast(color,icon);
    });
    textHex.innerText=color.hex();
    
}

function resetInputs()
{
    const sliders=document.querySelectorAll(".sliders input");
    
    sliders.forEach(slider=>{
        
        if(slider.name==='hue')
            {
                const hueColor=initialColors[slider.getAttribute("data-hue")];
                const hueVal=chroma(hueColor).hsl()[0];
                slider.value=Math.floor(hueVal);
            }
        
        
        
        if(slider.name==='brightness')
            {
                const brightColor=initialColors[slider.getAttribute("data-bright")];
                const brightVal=chroma(brightColor).hsl()[2];
                slider.value=Math.floor(brightVal*100)/100;
            }
        
        
        if(slider.name==='saturation')
            {
                const satColor=initialColors[slider.getAttribute("data-sat")];
                const satVal=chroma(satColor).hsl()[1];
           slider.value=Math.floor(satVal*100)/100;
            }
    });
    
}


function copyToBoard(hex)
{
    const el=document.createElement("textarea");
    el.value=hex.innerText;
    document.body.appendChild(el);
   el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    const popUpBox=popUp.children[0];
    popUpBox.classList.add("active");
    popUp.classList.add("active");
}


function openAdjustment(index)
{
 
    const slidersAdjutment=colorDivs[index].children[2];
    slidersAdjutment.classList.toggle("active");
}

function closedAdjustment(index)
{
 
    const slidersAdjutment=colorDivs[index].children[2];
    slidersAdjutment.classList.remove("active");
}



function lockColor(index)
{
    colorDivs[index].classList.toggle("locked");
    lockBtn[index].children[0].classList.toggle("fa-lock-open");
      lockBtn[index].children[0].classList.toggle("fa-lock");
}


//save and localStorage stuff

const saveBtn=document.querySelector(".save");
const submitSave=document.querySelector(".submit-save");
const closeSave=document.querySelector(".close-save");
const saveContainer=document.querySelector(".save-container");
const saveInput=document.querySelector(".save-container input");
const libraryContainer=document.querySelector(".library-container")
const libraryBtn=document.querySelector(".library")
const closeLibrary=document.querySelector(".close-library")
 
saveBtn.addEventListener("click",openPalette);
closeSave.addEventListener("click",closePalette);
submitSave.addEventListener("click",savePalette);
libraryBtn.addEventListener("click",openLibrary);
closeLibrary.addEventListener("click",closeLibraryy);
function openPalette(e)
{
   const popup2=saveContainer.children[0];
    saveContainer.classList.add("active");
    popup2.classList.add("active");
    
     
}


function closePalette(e)
{
   const popup2=saveContainer.children[0];
    saveContainer.classList.remove("active");
    popup2.classList.remove("active");

     
}

function openLibrary()
{
    const popup2=libraryContainer.children[0];
    libraryContainer.classList.add("active");
    popup2.classList.add("active");
    
}

function closeLibraryy()
{
    const popup2=libraryContainer.children[0];
    libraryContainer.classList.remove("active");
    popup2.classList.remove("active");
}

function savePalette(e)
{
    const popup2=saveContainer.children[0];
    saveContainer.classList.remove("active");
    popup2.classList.remove("active");
    const colors=[];
    const name=saveInput.value;
    currentHexes.forEach(hex=>{
       colors.push(hex.innerText); 
    });
    let paletteNum=savedPaletts.length;
    const paletteObj={name,colors,num:paletteNum};
    savedPaletts.push(paletteObj);
      saveToLocal(paletteObj);
    saveInput.value="";
    
    //
    
    const palette=document.createElement("div");
    palette.classList.add("custom-palette");
    
    const title=document.createElement("h4");
    title.innerText=paletteObj.name;
    
    const preview=document.createElement("div");
    preview.classList.add("small-preview");
    
    paletteObj.colors.forEach(smallColor=>{
        
       const smallDiv=document.createElement("div");
        smallDiv.style.backgroundColor=smallColor;
        preview.appendChild(smallDiv);
    });
    const paletteBtn=document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteObj.num);
    paletteBtn.innerText="select";
    
    
    paletteBtn.addEventListener("click",e =>{
    closeLibraryy();
    const paletteIndex=e.target.classList[1];
        savedPaletts[paletteIndex].colors.forEach((color,index) =>{
            
            initialColors.push(color);
            colorDivs[index].style.backgroundColor=color;
            const text=colorDivs[index].children[0];
             checkContrast(color,text);
            updateText(index);
            
        });
        resetInputs();
    });
    
    
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
    
}



function saveToLocal(paletteObj)
{
    let localPalettes;
    if(localStorage.getItem("palettes")===null)
        {
            localPalettes=[];
        }
    else
        {
            localPalettes=JSON.parse(localStorage.getItem("palettes"));
        }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes",JSON.stringify(localPalettes));
    
}











