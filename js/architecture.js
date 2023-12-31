import {promptChanged, gsChanged, seedChanged, expandTextVectorGeneratorL2, expandLatentDenoiserL2, compareButtonClicked, drawUmap} from "./function.js"

document.addEventListener("mouseup", (e) => {
    if (window.promptDropdownExpanded) {
        window.promptDropdownExpanded = false;
        let dropdownBox = document.getElementById("prompt-selector-dropdown").getBoundingClientRect()
        let left = dropdownBox.x
        let right = dropdownBox.x + dropdownBox.width
        let top = dropdownBox.y
        let bottom = dropdownBox.y + dropdownBox.height
        if (e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {}
        else {
            d3.select("#prompt-selector-dropdown").style("display", "none");
            d3.select("#compare-button-container").style("z-index", "")
        }
    }
})

let architectureLineWidth = 2;
let architectureTextLineColor = "#7fbc41"
let architectureImgLineColor = "#de77ae"
let architectureCompLineColor = "#92c5de"

window.textVectorGeneratorL2Expanded = false;
window.textVectorGeneratorL3Expanded = false;
window.latentDenoiserL2Expanded = false;
window.latentDenoiserL3Expanded = false;

d3.select("#architecture-container")
    .append("svg")
        .attr("height", 0)
        .attr("width", 0)
        .append("defs")
        .attr("id", "architecture-defs")
d3.select("#architecture-defs")
    .append("marker")
        .attr("id", "architecture-arrow-text-head")
        .attr("markerWidth", "10")
        .attr("markerHeight", "4")
        .attr("refX", "0")
        .attr("refY", "2")
        .attr("orient", "auto")
        .append("polygon")
            .attr("points", "0 0, 4 2, 0 4")
            .attr("fill", architectureTextLineColor)
d3.select("#architecture-defs")
    .append("marker")
        .attr("id", "architecture-arrow-img-head")
        .attr("markerWidth", "10")
        .attr("markerHeight", "4")
        .attr("refX", "0")
        .attr("refY", "2")
        .attr("orient", "auto")
        .append("polygon")
            .attr("points", "0 0, 4 2, 0 4")
            .attr("fill", architectureImgLineColor)
d3.select("#architecture-defs")
    .append("marker")
        .attr("id", "architecture-arrow-comp-head")
        .attr("markerWidth", "10")
        .attr("markerHeight", "4")
        .attr("refX", "0")
        .attr("refY", "2")
        .attr("orient", "auto")
        .append("polygon")
            .attr("points", "0 0, 4 2, 0 4")
            .attr("fill", architectureCompLineColor)

d3.select("#architecture-container")
    .append("div")
        .attr("id", "your-text-prompt")

d3.select("#your-text-prompt")
    .append("div")
        .attr("id", "prompt-selector-dropdown-container")
        .append("div")
            .attr("id", "prompt-selector-dropdown-box-container")
            .on("mouseover", () => {
                d3.select("#prompt-selector-dropdown-box-arrow-svg").style("display", "block")
            })
            .on("mouseout", () => {
                d3.select("#prompt-selector-dropdown-box-arrow-svg").style("display", "none")
            })
            .on("click", () => {
                if (window.promptDropdownExpanded) {
                    window.promptDropdownExpanded = false;
                    d3.select("#prompt-selector-dropdown").style("display", "none")
                    d3.select("#compare-button-container").style("z-index", "")
                }
                else {
                    window.promptDropdownExpanded = true
                    d3.select("#prompt-selector-dropdown").style("display", "block")
                    d3.select("#compare-button-container").style("z-index", "-1")
                }
            })
            .append("div")
                .attr("id", "prompt-selector-dropdown-box-text")
                .html(window.selectedPromptHtmlCode)
d3.select("#your-text-prompt")
    .append("div")
        .attr("id", "compare-button-container")
d3.select("#compare-button-container")
    .append("div")
        .attr("id", "compare-button-text")
        .text("Tweak prompt and compare")
d3.select("#compare-button-container")
    .append("label")
        .attr("class", "toggle-switch")
        .attr("id", "compare-button")
d3.select("#compare-button")
    .append("input")
        .attr("type", "checkbox")
        .on("click", compareButtonClicked)
d3.select("#compare-button")
    .append("span")
        .attr("class", "slider round")
let h = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
d3.select("#your-text-prompt").style("top", `${38.5-h/2}px`)
d3.select("#compare-button-container").style("top", `${h-3}px`)

d3.select("#prompt-selector-dropdown-box-container")
    .append("svg")
        .attr("id", "prompt-selector-dropdown-box-arrow-svg")
        .append("g")
            .attr("id", "prompt-selector-dropdown-box-arrow-g")
            .append("path")
                .attr("d", "M0 0 l 4.5 7 q 2 5 4 0 l 4.5 -7")
d3.select("#prompt-selector-dropdown-container")
    .append("div")
        .attr("id", "prompt-selector-dropdown")
        .selectAll("p")
        .data(window.prompts)
        .enter()
        .append("p")
            .attr("class", "prompt-selector-dropdown-options")
            .attr("id", (d,i) => `prompt-selector-dropdown-option-${i}`)
            .html((d,i) => window.promptsHtmlCode[i][0])
            .on("mouseover", function () {
                window.promptHovered = true;
                let groupIdx = +(this.id.split("-")[4])
                let p = d3.select(`#${this.id}`).text()
                let p2 = window.prompts[groupIdx][1]
                let pCode1 = window.promptsHtmlCode[groupIdx][0]
                let pCode2 = window.promptsHtmlCode[groupIdx][1]
                window.hoveredPrompt = p
                d3.select("#improved-latent-img").attr("src", `./assets/latent_viz/${p}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
                d3.select("#generated-image").attr("src", `./assets/img/${p}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
                d3.select("#improved-latent-img-2").attr("src", `./assets/latent_viz/${p2}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
                d3.select("#generated-image-2").attr("src", `./assets/img/${p2}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
                drawUmap(p,p2)
            })
            .on("mouseout", () => {
                window.promptHovered = false;
                window.hoveredPrompt = "";
                d3.select("#improved-latent-img").attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
                d3.select("#generated-image").attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
                d3.select("#improved-latent-img-2").attr("src", `./assets/latent_viz/${window.selectedPrompt2}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
                d3.select("#generated-image-2").attr("src", `./assets/img/${window.selectedPrompt2}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
                drawUmap()
            })
            .on("click", promptChanged)
d3.select(`#prompt-selector-dropdown-option-${selectedPromptGroupIdx}`).style("display","none")

d3.select("#architecture-container")
    .append("div")
        .attr("id", "prompt-text-vector-generator-container")
        .attr("class", "architecture-component-container architecture-arrow-container")
        .append("svg")
            .attr("id", "prompt-text-vector-generator-svg")
            .append("g")
                .append("line")
                    .attr("id", "prompt-text-vector-generator-arrow")
                    .attr("class", "architecture-arrow-text")
                    .attr("x1", "0")
                    .attr("y1", "10")
                    .attr("x2", "30")
                    .attr("y2", "10")
                    .attr("marker-end", "url(#architecture-arrow-text-head)")

d3.select("#architecture-container")
    .append("div")
        .attr("id", "text-vector-generator-container")
        .attr("class", "architecture-rectangle architecture-component-container denoise-latent-expand-move-to-left")
        .text("Text Representation Generator")
        .on("mouseover", () => {
            if (!window.textVectorGeneratorL2Expanded) d3.select("#text-vector-generator-container").style("background-color", "var(--text0)")
        })
        .on("mouseout", () => {
            d3.select("#text-vector-generator-container").style("background-color", "var(--text00)")
        })
        .on("click", expandTextVectorGeneratorL2)


d3.select("#architecture-container")
    .append("div")
        .attr("id", "text-vector-generator-latent-denoiser-container")
        .attr("class", "architecture-component-container architecture-arrow-container")
            .append("svg")
                .attr("id", "text-vector-generator-latent-denoiser-svg")
                .attr("class", "architecture-svg")
                .append("g")
                    .append("path")
                        .attr("id", "text-vector-generator-latent-denoiser-arrow")
                        .attr("class", "architecture-arrow-text")
                        .attr("d", "M 0 10 L 30 10 C 42,10 55,10 67,10 L 95 10")
                        .attr("marker-end", "url(#architecture-arrow-text-head)")
d3.select("#text-vector-generator-latent-denoiser-container")
    .append("div")
        .attr("id", "text-vector-generator-latent-denoiser-text")
d3.select("#text-vector-generator-latent-denoiser-text")
    .append("div")
        .text("Guidance for")
d3.select("#text-vector-generator-latent-denoiser-text")
    .append("div")
        .text("image generation")
d3.select("#text-vector-generator-latent-denoiser-text")
.on("mouseover", function() {
    d3.select("#text-vector-generator-latent-denoiser-text").style("color", window.compare?"#404040":"#276419")
})
.on("mouseout", function() {
    d3.select("#text-vector-generator-latent-denoiser-text").style("color", window.compare?"#808080":"#4d9221");
})
    .on("click", () => {
        if (window.gsControlDisplayed) {
            window.gsControlDisplayed = false;
            d3.select("#guidance-scale-control-container")
                .transition()
                .duration(500)
                    .style("opacity", "0")
                    .style("top", window.compare?"178px":"87px")
                    .style("left", "546px")
                .transition()
                    .style("display", "none")
                .on("interrupt", function() {
                    d3.select(this).style("display", "block")
                })
            d3.select("#guidance-scale-expl-container")
                .transition()
                .duration(500)
                    .style("opacity", "0")
                .transition()
                    .style("display", "none")
                .on("interrupt", function() {
                    d3.select(this).style("display", "block")
                })
            
        }
        else {
            window.gsControlDisplayed = true;
            d3.interrupt(d3.select("#guidance-scale-control-container"))    
            d3.interrupt(d3.select("#guidance-scale-expl-container"))    
            d3.select("#guidance-scale-control-container")
                .transition()
                    .style("display", "block")
                .transition()
                    .duration(500)
                    .style("opacity", "1")
                    .style("top", window.compare?"178px":"87px")
                    .style("left", "546px")
            d3.select("#guidance-scale-expl-container")
                .transition()
                    .style("display", "block")
                .transition()
                    .duration(500)
                    .style("opacity", "1")
        }
    })


// latent denoiser
d3.select("#architecture-container")
    .append("div")
        .attr("id", "latent-denoiser-container")
        .attr("class", "architecture-rectangle architecture-component-container denoise-latent-expand-move-to-left")
        .text("Image Representation Refiner")
        .on("mouseover", () => {
            if (!window.latentDenoiserL2Expanded) d3.select("#latent-denoiser-container").style("background-color", "var(--img0)")
        })
        .on("mouseout", () => {
            d3.select("#latent-denoiser-container").style("background-color", "var(--img00)")
        })
        .on("click", function (e) {
            if (!latentDenoiserL2Expanded) expandLatentDenoiserL2(e);
        })

// cycle
d3.select("#architecture-container")
    .append("div")
        .attr("id", "latent-denoiser-cycle-container")
        .attr("class", "architecture-component-container")
        .append("svg")
            .attr("id", "latent-denoiser-cycle-svg")
            .attr("class", "architecture-svg")
            .append("g")
                .append("path")
                    .attr("id", "latent-denoiser-cycle")
                    .attr("class", "architecture-dashed")
                    .attr("stroke-width", architectureLineWidth)
                    .attr("stroke", architectureImgLineColor)
                    .attr("marker-end", "url(#architecture-arrow-img-head)")
                    .attr("fill", "none")
                    .attr("d", "M 230 10 l 43,0 l0 -53 a5,5 0 0 0 -5,-5 l-213,0 a5,5 0 0 0 -5,5 l0,34 a5,5 0 0 0 5,5 l20,0")
                    .style("animation-name", "latent-denoiser-cycle-animation")
                    .style("animation-play-state", "paused")

// improved latent
d3.select("#architecture-container")
    .append("div")
        .attr("id", "improved-latent-container")
        .attr("class", "architecture-component-container")
        .append("img")
            .attr("id", "improved-latent-img")
            .attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${timestep}.jpg`)
d3.select("#improved-latent-container")
    .append("div")
        .attr("id", "improved-latent-timestep")
        .text(window.timestep)
d3.select("#improved-latent-container")
    .append("div")
        .attr("id", "improved-latent-expl-container")
d3.select("#improved-latent-expl-container").append("div").attr("id", "denoise-latent-out-noise-expl-text-1").text("Refined")
d3.select("#improved-latent-expl-container").append("div").attr("id", "denoise-latent-out-noise-expl-text-2").text("Representation")

// Improved latent - Generated image arrow
d3.select("#architecture-container")
    .append("div")
        .attr("id", "improved-latent-generated-image-container")
        .attr("class", "architecture-component-container architecture-arrow-container")
        .append("svg")
            .attr("id", "improved-latent-generated-image-svg")
            .append("g")
                .append("line")
                    .attr("id", "improved-latent-generated-image-arrow")
                    .attr("x1", "0")
                    .attr("y1", "10")
                    .attr("x2", "48")
                    .attr("y2", "10")
                    .attr("marker-end", "url(#architecture-arrow-img-head)")
d3.select("#improved-latent-generated-image-container")
    .append("div")
    .attr("id", "improved-latent-generated-image-text")
    .text("Upscale")

// Generated image
d3.select("#architecture-container")
    .append("div")
        .attr("id", "generated-image-container")
        .attr("class", "architecture-component-container text-vector-generator-expand-move-to-right  denoise-latent-expand-move-to-right")
        .append("img")
            .attr("id", "generated-image")
            .attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)

// Guidance scale controller
d3.select("#architecture-container")
    .append("div")
        .attr("id", "guidance-scale-control-container")
        .attr("class", "hyperparameter")
d3.select("#guidance-scale-control-container")
    .append("div")
        .attr("id", "guidance-scale-control-text")
        .text("Guidance Scale")
d3.select("#guidance-scale-control-container")
    .append("div")
        .attr("id", "guidance-scale-control-dropdown-container")
        .attr("class", "custom-select hyperparameter-dropdown-container")
            .append("select")
                .attr("id", "guidance-scale-control-dropdown-select")
                .on("change", gsChanged)
                .selectAll("option")
                    .data(["0.0","1.0","7.0","20.0"])
                    .enter()
                    .append("option")
                        .attr("value", d => d)
                        .text(d => d)
                        .property("selected", d => (d=="7.0"))

// Guidance scale explanations
d3.select("#architecture-container")
    .append("div")
        .attr("id", "guidance-scale-expl-container")
d3.select("#guidance-scale-expl-container")
    .append("svg")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("width", "25px")
    .style("height", "5px")
    .style("transform", "translate(-40px, -32px) rotate(25deg)")
    .append("g")
    .append("path")
        .attr("d", "M 15 10 Q 27.5 17, 40 10")
        .attr("stroke", "#bdbdbd")
        .attr("fill", "transparent")
d3.select("#guidance-scale-expl-container svg g")
    .append("path")
        .attr("d", "M 15 10 l 3 5")
        .attr("stroke", "#bdbdbd")
        .attr("fill", "transparent")
d3.select("#guidance-scale-expl-container svg g")
    .append("path")
        .attr("d", "M 15 10 l 7 0")
        .attr("stroke", "#bdbdbd")
        .attr("fill", "transparent")
d3.select("#guidance-scale-expl-container")
    .append("div")
    .attr("id", "guidance-scale-expl-text-container")
d3.select("#guidance-scale-expl-text-container")
    .append("div")
    .attr("id", "guidance-scale-expl-container-1")
d3.select("#guidance-scale-expl-container-1")
    .append("div")
        .attr("id", "guidance-scale-expl-container-1-1")
        .text("controls how well the")
d3.select("#guidance-scale-expl-container-1")
    .append("div")
        .attr("id", "guidance-scale-expl-container-1-2")
        .text("image representation")
d3.select("#guidance-scale-expl-text-container")
    .append("div")
        .attr("id", "guidance-scale-expl-container-2")
d3.select("#guidance-scale-expl-container-2")
    .append("div")
        .attr("id", "guidance-scale-expl-container-2-1")
        .text("adheres to")
d3.select("#guidance-scale-expl-container-2")
    .append("div")
        .attr("id", "guidance-scale-expl-container-2-2")
        .text("text prompt")
d3.select("#guidance-scale-expl-container-2")
    .append("div")
        .attr("id", "guidance-scale-expl-container-2-3")
        .text(".")
d3.select("#guidance-scale-expl-text-container")
    .append("div")
    .attr("id", "guidance-scale-expl-container-3")
d3.select("#guidance-scale-expl-container-3")
    .append("div")
        .attr("id", "guidance-scale-expl-container-3-1")
        .text("Higher means stronger adherence.")

d3.select("#architecture-container")
    .append("div")
        .attr("id", "timestep-0-random-noise-container")
d3.select("#timestep-0-random-noise-container")
    .append("svg")
        .attr("id", "timestep-0-random-noise-svg")
    .append("g")
    .append("path")
        .attr("id", "timestep-0-random-noise-line")
        .attr("d", "M0 5 a5,5 0 0 0 -5,-5 l-5 0")
        .attr("stroke-width", architectureLineWidth)
        .attr("stroke", architectureImgLineColor)
        .attr("fill", "none")
d3.select("#timestep-0-random-noise-container")
    .append("div")
    .attr("id", "timestep-0-random-noise-expl")
d3.select("#timestep-0-random-noise-expl")
    .append("div")
        .attr("id", "timestep-0-random-noise-expl-1-1")
        .text("Random noise")
        .on("mouseover", function() {
            d3.select("#timestep-0-random-noise-expl-1-1").style("color", window.compare?"#67001f":"#8e0152")
        })
        .on("mouseout", function() {
            d3.select("#timestep-0-random-noise-expl-1-1").style("color", window.compare?"#d6604d":"#c51b7d")
        })
        .on("click", function() {
            if (window.seedControlDisplayed) {
                window.seedControlDisplayed = false;
                d3.select("#seed-control-container")
                    .transition()
                    .duration(500)
                        .style("opacity", "0")
                    .transition()
                        .style("display", "none")
                    .on("interrupt", function() {
                        d3.select(this).style("display", "block")
                    })
                d3.select("#seed-control-container")
                    .transition("left")
                    .duration(1000)
                        .style("left", `${427}px`)
            }
            else {
                window.seedControlDisplayed = true;
                d3.select("#seed-control-container")
                    .transition()
                        .style("display", "block")
                    .transition()
                    .duration(500)
                        .style("opacity", "1")
                d3.select("#seed-control-container")
                    .transition("left")
                    .duration(1000)
                        .style("left", `${427}px`)
            }
        })
d3.select("#timestep-0-random-noise-expl")
    .append("div")
        .attr("id", "timestep-0-random-noise-expl-2")
        .text("at timestep 0")

// Seed selector
d3.select("#architecture-container")
    .append("div")
        .attr("id", "seed-control-container")
        .attr("class", "hyperparameter")
d3.select("#seed-control-container")
    .append("div")
        .attr("id", "seed-control-text")
        .text("Seed")
d3.select("#seed-control-container")
    .append("div")
    .attr("id", "seed-control-dropdown-container")
    .attr("class", "custom-select hyperparameter-dropdown-container")
    .append("select")
        .attr("id", "seed-control-dropdown-select")
        .on("change", seedChanged) 
        .selectAll("option")
            .data(["1","2","3"])
            .enter()
            .append("option")
                .attr("value", d => d)
                .text(d => d)
                .property("selected", d => (d==window.seed))
