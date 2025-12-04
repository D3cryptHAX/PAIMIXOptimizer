async function getEnkaData(uid) {
    const target = `https://enka.network/u/${uid}/__data.json`;
    const corsUrl = `https://corsproxy.io/?${encodeURIComponent(target)}`;

    const res = await fetch(corsUrl);

    if (!res.ok) {
        throw new Error("Failed to fetch Enka data (CORS proxy error)");
    }

    return await res.json();
}