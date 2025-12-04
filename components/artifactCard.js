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
