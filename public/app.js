const fields = ['weight', 'height', 'age', 'goal', 'level', 'days'];
const $ = (id) => document.getElementById(id);

function plan(data) {
  const weight = Number(data.weight);
  const height = Number(data.height);
  const age = Number(data.age);
  const days = Number(data.days);
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const bmiLabel = bmi < 18.5 ? 'Berat badan kurang' : bmi < 25 ? 'Ideal' : bmi < 30 ? 'Berlebih' : 'Obesitas';
  const maintenance = Math.round((10 * weight + 6.25 * height - 5 * age + 5) * (1.35 + days * 0.045));
  const calories = data.goal === 'muscle' ? maintenance + 250 : data.goal === 'strength' ? maintenance + 150 : maintenance - 100;
  const proteinLow = Math.round(weight * 1.6);
  const proteinHigh = Math.round(weight * 2.2);
  const water = (weight * 35 / 1000).toFixed(1);
  const duration = data.level === 'pemula' ? 45 : data.level === 'menengah' ? 60 : 75;
  const schedule = days <= 3
    ? ['Full Body A', 'Istirahat / jalan 30 menit', 'Full Body B', 'Istirahat', 'Full Body A', 'Mobilitas', 'Istirahat']
    : days === 4
      ? ['Upper Body', 'Lower Body', 'Istirahat', 'Upper Body', 'Lower Body', 'Mobilitas', 'Istirahat']
      : ['Push', 'Pull', 'Legs', 'Istirahat aktif', 'Upper', 'Lower', 'Istirahat'];
  const intensity = data.level === 'pemula'
    ? '2–3 set x 10–12 repetisi, fokus teknik dan jangan sampai gagal total.'
    : data.level === 'menengah'
      ? '3–4 set x 8–12 repetisi, sisakan 1–2 repetisi sebelum gagal.'
      : '4–5 set x 5–10 repetisi, progresif dan terukur.';
  const exercises = data.goal === 'health'
    ? ['Goblet squat', 'Incline push-up', 'Seated row / resistance band row', 'Romanian deadlift ringan', 'Dead bug', 'Farmer carry']
    : ['Squat / leg press', 'Bench press / push-up', 'Lat pulldown / pull-up', 'Romanian deadlift', 'Overhead press', 'Cable row / dumbbell row'];
  const note = bmi >= 30 ? 'Mulai dengan beban moderat, utamakan sendi aman, dan tambahkan jalan kaki.' : bmi < 18.5 ? 'Prioritaskan surplus kalori dan progres beban perlahan.' : 'Kondisi awal cukup baik untuk progres latihan terstruktur.';
  return { bmi, bmiLabel, calories, proteinLow, proteinHigh, water, duration, schedule, intensity, exercises, note };
}

function render() {
  const data = Object.fromEntries(fields.map((field) => [field, $(field).value]));
  const result = plan(data);
  $('days-label').textContent = `${data.days} hari`;
  $('bmi').textContent = result.bmi.toFixed(1);
  $('bmi-label').textContent = result.bmiLabel;
  $('calories').textContent = result.calories;
  $('protein').textContent = `${result.proteinLow}–${result.proteinHigh}g`;
  $('duration').textContent = `${result.duration}m`;
  $('note').textContent = result.note;
  $('schedule').innerHTML = result.schedule.map((item, index) => `<li><b>Hari ${index + 1}</b> ${item}</li>`).join('');
  $('exercises').innerHTML = result.exercises.map((item) => `<li>${item}</li>`).join('');
  $('nutrition-copy').textContent = `Minum ±${result.water}L air/hari. Pakai intensitas: ${result.intensity} Jika semua set terasa mudah dua sesi berturut-turut, naikkan beban 2,5–5%.`;
}

fields.forEach((field) => $(field).addEventListener('input', render));
render();
