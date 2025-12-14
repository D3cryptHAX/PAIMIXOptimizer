const loadBtn = document.getElementById("loadBtn");
const uidInput = document.getElementById("uidInput");
const charactersDiv = document.getElementById("characters");

// CORS Proxy (public)
const proxy = "https://corsproxy.io/?";

async function fetchProfileTable(uid) {
    const url = `https://akasha.cv/profile/${uid}`;
    const proxiedUrl = proxy + encodeURIComponent(url);

    try {
        const response = await fetch(proxiedUrl);
        if (!response.ok) throw new Error("Failed to load page");

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // 1. Ищем div.mt-4
        const mt4 = doc.querySelector("div.custom-table-wrapper");
        if (!mt4) {
            return "<p>No table</p>";
        }

        // 3. Собираем HTML: сначала mt-4, затем все таблицы внутри
        cards.forEach(c => c.outerHTML);
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