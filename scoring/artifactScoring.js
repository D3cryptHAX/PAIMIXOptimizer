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
