$("searchBtn").onclick = async () => {
    const uid = $("uidInput").value.trim();
    if (!uid) return;

    clearResult();
    append("<h3>Loading...</h3>");

    try {
        const data = await getEnkaData(uid);
        clearResult();

        const char = data.avatarInfoList[0]; 
        const name = char.avatarName.hash; // но лучше переделать позже

        const profile = CharacterProfiles["Hutao"]; // временно

        const artifacts = char.equipList
            .filter(i => i.flat.equipType.includes("EQUIP"))
            .map(transformArtifact);

        renderCharacter({ name }, artifacts, profile);

    } catch (err) {
        clearResult();
        append("<h2>Error: " + err.message + "</h2>");
    }
};

function transformArtifact(raw) {
    const substats = (raw.flat.reliquarySubstats || []).map(s => ({
        key: mapStat(s.appendPropId),
        value: s.statValue
    }));

    return {
        slot: raw.flat.equipType.replace("EQUIP_", ""),
        set: raw.flat.setNameTextMapHash,
        mainstat: mapStat(raw.flat.mainStat.mainPropId),
        substats
    };
}

function mapStat(prop) {
    const map = {
        "FIGHT_PROP_CRITICAL": "critRate",
        "FIGHT_PROP_CRITICAL_HURT": "critDamage",
        "FIGHT_PROP_ATTACK_PERCENT": "atkPercent",
        "FIGHT_PROP_HP_PERCENT": "hpPercent",
        "FIGHT_PROP_DEFENSE_PERCENT": "defPercent",
        "FIGHT_PROP_ATTACK": "atkFlat",
        "FIGHT_PROP_HP": "hpFlat",
        "FIGHT_PROP_DEFENSE": "defFlat",
        "FIGHT_PROP_ELEMENT_MASTERY": "em",
        "FIGHT_PROP_CHARGE_EFFICIENCY": "er"
    };
    return map[prop] || prop;
}
