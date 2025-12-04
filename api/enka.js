async function getEnkaData(uid) {
    const url = `https://api.enka.network/uid/${uid}/`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed to load from api.enka.network: ${res.status}`);
    }

    return await res.json();
}