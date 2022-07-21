
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

function scrollToBottom() {
    window.scrollTo({
        top: 9999,
        behavior: 'smooth'
    })
}

function bodyMove() {
    $('.body').css("top", "15px")
    $('.body').css("top", "-15px")
    $('.body').css("top", "0px")
}

async function connectBeacon() {
    setInterval(function () {
        $('.connect-button.disconnected').toggleClass("hover");
    }, 500)
}

$(function () {
    $('.contacts-link').on('click', scrollToBottom)
})

$(document).ready(function() {
    connectBeacon()
    bodyMove()
    scrollToTop()
    $('.contacts-section li>div>button').tooltipster({
        theme: 'tooltipster-noir'
    });
});
