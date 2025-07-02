function loadPlayerData() {
  const raw = localStorage.getItem('farm_data');
  return raw ? JSON.parse(raw) : { trigo: 0 };
}

function savePlayerData(data) {
  localStorage.setItem('farm_data', JSON.stringify(data));
}
