function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

function uid(){
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function addSchedule(){
  const day = document.getElementById("daySelect").value;
  const time = (document.getElementById("timeInput").value || "").trim();
  const content = (document.getElementById("contentInput").value || "").trim();
  if(!content) return;

  const dayBox = document.getElementById(day);
  const timeZone = dayBox.querySelector(".time-zone");
  const contentZone = dayBox.querySelector(".content-zone");
  const id = uid();

  // 시간: 요일 박스 상단
  const timeEl = document.createElement("div");
  timeEl.className = "time-pill";
  timeEl.dataset.id = id;
  timeEl.innerHTML = `
    <span class="time-label">시간</span>
    <span class="time-text">${time ? escapeHtml(time) : "-"}</span>
  `;

  // 내용: 요일 박스 중간
  const contentEl = document.createElement("div");
  contentEl.className = "content-card";
  contentEl.dataset.id = id;
  contentEl.innerHTML = `
    <div class="content-label">내용</div>
    <div class="content-text">${escapeHtml(content)}</div>
    <button class="del-btn" type="button">삭제</button>
  `;

  contentEl.querySelector(".del-btn").onclick = () => {
    // 같은 id의 시간/내용 둘 다 삭제
    dayBox.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.remove());
  };

  timeZone.appendChild(timeEl);
  contentZone.appendChild(contentEl);

  document.getElementById("timeInput").value = "";
  document.getElementById("contentInput").value = "";
}

document.getElementById("bgUpload").addEventListener("change", function (event) {
  const file = event.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e) => { document.getElementById("bgImage").src = e.target.result; };
  reader.readAsDataURL(file);
});

function clearAll(){
  document.querySelectorAll(".time-pill,[data-id].content-card").forEach(el => el.remove());
}

async function saveJPG(){
  if(typeof html2canvas === "undefined"){
    alert("JPG 저장 라이브러리 로딩이 아직 안됐어요. 잠깐 후 다시 눌러줘!");
    return;
  }
  const hideControls = document.getElementById("hideControlsOnExport").checked;
  const controls = document.getElementById("controls");
  const captureArea = document.getElementById("captureArea");

  const prevDisplay = controls.style.display;
  if(hideControls) controls.style.display = "none";

  document.body.classList.add("exporting");
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const canvas = await html2canvas(captureArea, {
    backgroundColor: "#ffffff",
    scale: 2,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
    scrollX: 0,
    scrollY: -window.scrollY
  });

  const jpgData = canvas.toDataURL("image/jpeg", 0.95);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
  a.href = jpgData;
  a.download = `baekseonhwa-schedule-${stamp}.jpg`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  document.body.classList.remove("exporting");
  if(hideControls) controls.style.display = prevDisplay;
}
