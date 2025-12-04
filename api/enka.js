async function getEnkaData(uid) {
    const url = `https://enka.network/u/${uid}/__data.json`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch Enka data");

    return await res.json();
}