function generateBracket() {
  const n = parseInt(document.getElementById('count').value);
  const names = [];
  for (let i = 1; i <= n; i++) names.push(`Peserta ${i}`);
  shuffle(names);

  const bracket = document.getElementById('bracket');
  bracket.innerHTML = '';

  // buat 1 kolom per ronde
  let round = names.map(name => `<div class="match">${name}</div>`).join('');
  bracket.insertAdjacentHTML('beforeend', `<div>${round}</div>`);

  // buat kolom kosong untuk pemenang
  while (n > 1) {
    n = Math.ceil(n / 2);
    const empty = Array(n).fill('<div class="match">-</div>').join('');
    bracket.insertAdjacentHTML('beforeend', `<div>${empty}</div>`);
  }
}
