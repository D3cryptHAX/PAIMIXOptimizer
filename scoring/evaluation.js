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
