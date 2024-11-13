

var selectedTab = "";
var selectedTabIndex = 0;

function setupTabs() {
    var navs = document.getElementById("nav").children;
    var tabs = document.getElementById("activ").children;

    for (let i = 0; i < navs.length; i++) {
        navs[i].onclick = (arg) => {
            for (let j = 0; j < tabs.length; j++) {
                tabs[j].className = "subPage";
            }

            tabs[i].className += " active";

            selectedTabIndex = i;
            selectedTab = tabs[i].id;
        }
    }

    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].classList.contains("active")) {
            selectedTab = tabs[i].id;
            selectedTabIndex = i;
        }
    }

}

setupTabs();