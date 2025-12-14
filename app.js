const loadBtn = document.getElementById("loadBtn");
const uidInput = document.getElementById("uidInput");
const charactersDiv = document.getElementById("characters");

// Public CORS proxy
const CORS_PROXY = "https://corsproxy.io/?";

async function fetchProfileTables(uid) {
    const profileUrl = `https://genshin-builds.com/en/profile/${uid}`;
    const proxiedUrl = CORS_PROXY + encodeURIComponent(profileUrl);

    try {
        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            throw new Error("Failed to load profile page");
        }

        const html = await response.text();

        // Parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Find all tables
        const tables = Array.from(doc.querySelectorAll("table"));

        if (tables.length === 0) {
            return "<p>No tables found</p>";
        }

        // Combine tables HTML
        return tables.map(table => table.outerHTML).join("");

    } catch (error) {
        console.error("Fetch error:", error);
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

    const tablesHTML = await fetchProfileTables(uid);

    charactersDiv.innerHTML = tablesHTML;
});
