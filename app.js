$("searchBtn").onclick = async () => {
    const uid = $("uidInput").value.trim();
    if (!uid) return;

    clearResult();
    append("<h3>Loading Enka...</h3>");

    try {
        const data = await getEnkaData(uid);
        clearResult();

        if (!data.avatarInfoList) {
            append("<h2>Player has no characters shown</h2>");
            return;
        }

        for (const avatar of data.avatarInfoList) {
            const nameId = avatar.avatarId;
            const profile = CharacterProfiles["Hutao"]; // позже автоопределим

            const artifacts = avatar.equipList
                .filter(x => x.flat && x.flat.equipType)
                .map(transformArtifact);

            renderCharacter({ name: nameId }, artifacts, profile);
        }

    } catch (err) {
        clearResult();
        append(`<h2>Error: ${err.message}</h2>`);
    }
};


function transformArtifact(raw) {
    return {
        slot: raw.flat.equipType.replace("EQUIP_", ""),
        set: raw.flat.setNameTextMapHash,
        mainstat: mapStat(raw.flat.mainstat.mainPropId),
        substats: raw.flat.substats
            ? raw.flat.substats.map(s => ({
                key: mapStat(s.appendPropId),
                value: s.statValue
            }))
            : []
    };
}