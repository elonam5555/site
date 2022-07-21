
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

$(function () {
    scrollToTop()
    $('.contacts-link').on('click', scrollToBottom)
})

$(document).ready(function() {
    $('.contacts-section li>div>button').tooltipster({
        theme: 'tooltipster-noir'
    });
});
