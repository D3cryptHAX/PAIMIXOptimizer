async function getEnkaData(uid) {
    const target = `https://api.enka.network/uid/${uid}/`;
    const corsUrl = `https://corsproxy.io/?${encodeURIComponent(target)}`;

    const res = await fetch(corsUrl);

    if (!res.ok) {
        throw new Error(`Failed to load from api.enka.network via CORS proxy: ${res.status}`);
    }

    return await res.json();
}