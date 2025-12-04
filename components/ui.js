function $(id) {
    return document.getElementById(id);
}

function clearResult() {
    $("result").innerHTML = "";
}

function append(html) {
    $("result").insertAdjacentHTML("beforeend", html);
}
