// utils
function $(id) { return document.getElementById(id); }
function clearResult() { $("result").innerHTML = ""; }
function append(html) { $("result").insertAdjacentHTML("beforeend", html); }

// ===== Enka API =====
async function getEnkaData(uid) {
    const url = `https://api.enka.network/uid/${uid}/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load from api.enka.network: ${res.status}`);
    return await res.json();
}

// Доп. fetch для полной информации персонажа (артефакты, оружие)
async function getFullProfile(uid) {
    const url = `https://enka.network/api/get_profile_for_uid/?uid=${uid}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch full profile: ${res.status}`);
    return await res.json();
}

// ===== Парсер нового API =====
function parseEnkaResponse(resp) {
    const node = resp.nodes.find(n => n.type === "data" && Array.isArray(n.data));
    if (!node) return [];

    const dataArray = node.data;
    return dataArray
        .filter(d => d.avatarId)
        .map(d => ({
            avatarId: d.avatarId,
            name: d.nickname || "Unknown",
            level: d.level || 0
        }));
}

// ===== Scoring =====
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

const MAX_ROLL = {
    "critRate": 3.9,
    "critDamage": 7.8,
    "atkPercent": 5.8,
    "hpPercent": 5.8,
    "defPercent": 7.3,
    "em": 23,
    "er": 6.5
};

function scoreArtifact(artifact, profile) {
    let totalScore = 0;

    for (let sub of artifact.substats) {
        const key = sub.key;
        const value = sub.value;
        if (!profile.weights[key]) continue;

        const max = MAX_ROLL[key] * 6;
        const rollScore = Math.min(1, value / max);

        totalScore += rollScore * profile.weights[key] * 100;
    }

    const mainStatCoef = getMainStatCoef(artifact, profile);
    const setCoef = profile.preferredSets.includes(artifact.set) ? 1.15 : 1.0;

    return Math.round(totalScore * mainStatCoef * setCoef);
}

function getMainStatCoef(artifact, profile) {
    const preferred = profile.preferredMainStats[artifact.slot];
    if (!preferred) return 1.0;

    if (Array.isArray(preferred)) {
        return preferred.includes(artifact.mainstat) ? 1.2 : 0.8;
    }

    return artifact.mainstat === preferred ? 1.2 : 0.8;
}

function scoreToRank(score) {
    if (score === 100) return "DESCENDANT";
    if (score >= 99) return "SSS+";
    if (score >= 96) return "SSS";
    if (score >= 93) return "SS+";
    if (score >= 90) return "SS";
    if (score >= 85) return "S+";
    if (score >= 80) return "S";
    if (score >= 70) return "A+";
    if (score >= 60) return "A";
    if (score >= 50) return "B+";
    if (score >= 35) return "B";
    if (score >= 20) return "C";
    if (score >= 10) return "D";
    return "F";
}

// ===== UI =====
function renderArtifactCard(artifact, score, rank) {
    return `
    <div class="artifact">
        <h3>${artifact.slot} – ${artifact.set}</h3>
        <p>Main stat: ${artifact.mainstat}</p>
        <ul>
            ${artifact.substats.map(s => `<li>${s.key}: ${s.value}</li>`).join("")}
        </ul>
        <h2>Score: ${score} (${rank})</h2>
    </div>`;
}

function renderCharacter(character, artifacts, profile) {
    append(`<h2>${character.name}</h2>`);
    artifacts.forEach(a => {
        const score = scoreArtifact(a, profile);
        const rank = scoreToRank(score);
        append(renderArtifactCard(a, score, rank));
    });
}

// ===== Transform artifact from API =====
function transformArtifact(raw) {
    if (!raw.flat || !raw.flat.equipType) return null;

    return {
        slot: raw.flat.equipType.replace("EQUIP_", ""),
        set: raw.flat.setNameTextMapHash || null,
        mainstat: raw.flat.mainstat ? mapStat(raw.flat.mainstat.mainPropId) : null,
        substats: raw.flat.substats
            ? raw.flat.substats.map(s => ({ key: mapStat(s.appendPropId), value: s.statValue }))
            : []
    };
}

// ===== Main handler =====
$("searchBtn").onclick = async () => {
    const uid = $("uidInput").value.trim();
    if (!uid) return;

    clearResult();
    append("<h3>Loading player data...</h3>");

    try {
        // Получаем основной ответ
        const data = await getEnkaData(uid);
        clearResult();

        const characters = parseEnkaResponse(data);
        if (!characters.length) {
            append("<h2>Player has no public characters</h2>");
            return;
        }

        // Получаем полный профиль (артефакты)
        const fullProfile = await getFullProfile(uid);

        for (const char of characters) {
            const charData = fullProfile.avatarInfo.find(a => a.avatarId === char.avatarId);
            if (!charData) continue;

            const profile = CharacterProfiles["Hutao"]; // можно автоопределять по avatarId

            const artifacts = (charData.equipList || [])
                .map(transformArtifact)
                .filter(a => a != null);

            renderCharacter(char, artifacts, profile);
        }

    } catch (err) {
        clearResult();
        append(`<h2>Error: ${err.message}</h2>`);
        console.error(err);
    }
};