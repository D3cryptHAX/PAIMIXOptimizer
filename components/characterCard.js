function renderCharacter(character, artifacts, profile) {
    append(`<h2>${character.name}</h2>`);

    artifacts.forEach(a => {
        const score = scoreArtifact(a, profile);
        const rank = scoreToRank(score);
        append(renderArtifactCard(a, score, rank));
    });
}
