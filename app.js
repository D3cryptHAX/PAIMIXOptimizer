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

        // Парсим HTML через DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Ищем таблицу (берём первую)
        const table = doc.querySelector("table");

        if (!table) {
            return "<p>No table found on page</p>";
        }

        return table.outerHTML;

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