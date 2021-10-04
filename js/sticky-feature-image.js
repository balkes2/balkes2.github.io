
class ScrollRange{
    // Creates a scroll range of min to max y for a given element

    constructor(element) {
        this.min_scroll_val = element.offsetTop;;
        this.max_scroll_val = element.offsetTop + element.offsetHeight;;
    }

    boolIsInRange() {
        if (window.scrollY >= this.min_scroll_val && window.scrollY <= this.max_scroll_val){
            return true;
        }
        return false;
    }

    getDistanceFromRange() {
        if (window.scrollY < this.min_scroll_val){
            // Scroll position is less than range
            return this.min_scroll_val - window.scrollY;
        } else if (window.scrollY > this.max_scroll_val){
            // Scroll position is greater than range
            return window.scrollY - this.max_scroll_val;
        } else {
            // Scroll position is within range
            return 0;
        }

    }
}

class FeatureElement{
    // Class for features, which consist of an element containing an image
    // Includes functionality based on scroll position

    constructor(imageElement){
        this.scrollRange = new ScrollRange(imageElement);
        this.imageElement = imageElement;
        this.imgSrc = imageElement.querySelector("img").src;
    }

    static getNearestElement(arrayFeatureElements){
        // Returns the element nearest to the current Y scroll position

        var nearestElement = arrayFeatureElements[0];
        for (let i=1; i<arrayFeatureElements.length; i++){
            let currentNearestDistance = nearestElement.scrollRange.getDistanceFromRange();
            let thisElementDistance = arrayFeatureElements[i].scrollRange.getDistanceFromRange();
            if (thisElementDistance < currentNearestDistance) {
                nearestElement = arrayFeatureElements[i];
            }
        }
        return nearestElement;
    }

    setVisibility(bool_is_visible){
        if (bool_is_visible) {
            this.imageElement.classList.remove("hide");
        } else {
            this.imageElement.classList.add("hide");
        }
    }
}

class FeatureSet{

    constructor(featureSetElement){
        this.featureSetElement = featureSetElement;
        this.scrollRange = new ScrollRange(featureSetElement);
        this.arrayFeatureElements = []

        // Initialize array of feature elements
        let arrayDetailElements = this.featureSetElement.querySelectorAll(".feature-detail-image");
        for (let i=0; i<arrayDetailElements.length; i++){
            let featureElement = new FeatureElement(arrayDetailElements[i]);
            this.arrayFeatureElements.push(featureElement);
        }
    }

    setVisibilityDetailElements(bool_is_visible){
        for (let i=0; i<this.arrayFeatureElements.length; i++){
            this.arrayFeatureElements[i].setVisibility(bool_is_visible);
        }
    }

    getImageSrcNearestElement(){
        let nearestElement = FeatureElement.getNearestElement(this.arrayFeatureElements);
        return nearestElement.imgSrc;
    }

    boolIsInRange() {
        return this.scrollRange.boolIsInRange();
    }
}

const FEATURE_SET_APP = new FeatureSet(document.getElementById("app-features"));
const FEATURE_SET_MAP_BUILDER = new FeatureSet(document.getElementById("map-builder-features"));
const STICKY_IMAGE_DIV = document.getElementById("sticky-image-div");
const STICKY_IMAGE = STICKY_IMAGE_DIV.querySelector("img");
//window.addEventListener("resize", windowResize);
//windowResize();

function stickyImage(e){
    if (window.outerWidth <= 768){
        // mobile
        STICKY_IMAGE_DIV.classList.add("hide");
        FEATURE_SET_APP.setVisibilityDetailElements(true);
        FEATURE_SET_MAP_BUILDER.setVisibilityDetailElements(true);
        return
    }

    // desktop
    if (FEATURE_SET_APP.boolIsInRange()) {
        // show sticky app feature image
        console.log("App feature section")
        STICKY_IMAGE_DIV.classList.remove("hide");
        STICKY_IMAGE.src = FEATURE_SET_APP.getImageSrcNearestElement();
    } else if (FEATURE_SET_MAP_BUILDER.boolIsInRange()){
        // show sticky map builder feature image
        STICKY_IMAGE_DIV.classList.remove("hide");
        STICKY_IMAGE.src = FEATURE_SET_MAP_BUILDER.getImageSrcNearestElement();
        console.log("Map builder feature section")
    } else {
        // hide sticky image
        STICKY_IMAGE_DIV.classList.add("hide");
        console.log("Out of range")
    }
}

function windowResize(){
    if (window.innerWidth <= 768){
        // mobile
        window.removeEventListener("scroll", stickyImage);
        FEATURE_SET_APP.setVisibilityDetailElements(true);
        FEATURE_SET_MAP_BUILDER.setVisibilityDetailElements(true);
        STICKY_IMAGE_DIV.classList.add("hide");
    } else {
        // desktop
        window.addEventListener("scroll", stickyImage);
        FEATURE_SET_APP.setVisibilityDetailElements(false);
        FEATURE_SET_MAP_BUILDER.setVisibilityDetailElements(false);
    }
}