const loadBtn = document.getElementById("loadBtn");
const uidInput = document.getElementById("uidInput");
const charactersDiv = document.getElementById("characters");

// CORS Proxy (public)
const proxy = "https://corsproxy.io/?";

async function fetchProfileTable(uid) {
    const url = `https://genshin-builds.com/en/profile/${uid}`;
    const proxiedUrl = proxy + encodeURIComponent(url);

    try {
        const response = await fetch(proxiedUrl);
        if (!response.ok) throw new Error("Failed to load page");

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // 1. Ищем div.mt-4
        const mt4 = doc.querySelector("div.mt-4");
        if (!mt4) {
            return "<p>No mt-4 div found on page</p>";
        }

        // 2. Ищем внутри div.mt-4 блоки таблиц
        const cards = mt4.querySelectorAll("div.card.overflow-x-auto.p-1");

        if (!cards || cards.length === 0) {
            return "<p>No table container found inside mt-4</p>";
        }

        // 3. Собираем HTML: сначала mt-4, затем все таблицы внутри
        let result = `<div class="mt-4">`;
        cards.forEach(c => result += c.outerHTML);
        result += `</div>`;

        return result;

    } catch (err) {
        console.error(err);
        return "<p>Error loading data</p>";
    }
}

loadBtn.addEventListener("click", async () => {
    const uid = uidInput.value.trim();

    if (!uid) {
        alert("Enter UID!");
        return;
    }

    charactersDiv.innerHTML = "<p>Loading...</p>";

    // Получаем HTML таблицы
    const tableHTML = await fetchProfileTable(uid);

    charactersDiv.innerHTML = tableHTML;
});