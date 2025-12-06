// Вес каждого стата (пример для DPS)
const statWeights = {
  hp: 0.5,
  atk: 1.0,
  def: 0.3,
  critRate: 2.0,
  critDmg: 2.0,
  elementalMastery: 1.5,
  energyRecharge: 1.2
};

// Перевод score в рейтинг
function getRating(score) {
  if(score < 20) return "F";
  if(score < 40) return "D";
  if(score < 60) return "C";
  if(score < 80) return "B";
  if(score < 100) return "B+";
  if(score < 120) return "A";
  if(score < 140) return "A+";
  if(score < 160) return "S";
  if(score < 180) return "S+";
  if(score < 200) return "SS";
  if(score < 220) return "SS+";
  if(score < 240) return "SSS";
  if(score < 260) return "SSS+";
  return "DESCENDANT";
}

// Расчет общего полезного значения билда
function calculateScore(stats) {
  let total = 0;
  for(const key in statWeights) {
    total += (stats[key] || 0) * statWeights[key];
  }
  return total;
}