var closeCookieModal = document.getElementById("closeCookieModal");
var cookieModal = document.getElementById("cookieModal");

if (!localStorage.getItem("agreed")) {
    cookieModal.showModal();
    
    closeCookieModal.onclick = (ev) => {
        cookieModal.close();
        localStorage.setItem("agreed", true);
    };
}