let divs = document.querySelector(".container");
let button = document.querySelector("button");
function generateGrid(length){
    divs.replaceChildren();
    let pipeBombAtX = Math.trunc(Math.random() * length);
    let pipeBombAtY = Math.trunc(Math.random() * length);
    for (let i = 0; i < length; i++){
        for (let j = 0; j < length; j++){
            let content = document.createElement("div");
            content.style.width = (800 / length) + "px";
            content.style.height = (800 / length) + "px";
            let a = Math.random() * 256;
            let b = Math.random() * 256;
            let c = Math.random() * 256;
            if (!landmine || !(pipeBombAtX == i && pipeBombAtY == j)){
            content.addEventListener("mouseover", () => 
                {
                    if (content.style.backgroundColor == ""){
                        console.log("success");
                        content.style.backgroundColor = 
                        "rgb(" + a + ", " + b + ", " + c + ")"
                        content.style.opacity = 1;
                    } else {
                        content.style.opacity -= 0.1;
                    }
                });
            } else {
                content.addEventListener("mouseover", () => {
                    alert("You're dead!")
                    generateGrid(length);
                    return;
                })
            }
            // content.addEventListener("mouseout", () => content.style.backgroundColor = "");
            divs.appendChild(content);
        }
    }
}
let landmine = true;
generateGrid(16);
button.addEventListener("click", () => {
    let num = Number(prompt("What should the grid's length be?"));
    num = Math.trunc(num);
    if (num && num <= 100 && num > 0){
        generateGrid(num);
    } else {
        alert("Invalid input! Must be a positive integer that is at most 100.");
    }
});