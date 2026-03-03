function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

function addSchedule() {
  const day = document.getElementById("daySelect").value;
  const time = (document.getElementById("timeInput").value || "").trim();
  const content = (document.getElementById("contentInput").value || "").trim();
  if (!content) return;

  const dayBox = document.getElementById(day);

  const item = document.createElement("div");
  item.className = "schedule-item";

  const textSpan = document.createElement("div");
  textSpan.className = "text";
  textSpan.innerHTML = `<div class="si-time"><span class="item-label">시간</span><span class="item-value time-value">${time ? time : "-"}</span></div><div class="si-content"><span class="item-label">내용</span><span class="item-value content-value">${escapeHtml(content)}</span></div>`;

  const actions = document.createElement("div");
  actions.className = "item-actions";

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  delBtn.type = "button";
  delBtn.textContent = "삭제";
  delBtn.onclick = () => item.remove();

  actions.appendChild(delBtn);  item.appendChild(textSpan);
  item.appendChild(actions);

  dayBox.querySelector(".items").appendChild(item);

  document.getElementById("timeInput").value = "";
  document.getElementById("contentInput").value = "";
}

document.getElementById("bgUpload").addEventListener("change", function (event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("bgImage").src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function clearAll(){
  const days = ["mon","tue","wed","thu","fri","sat","sun"];
  for (const d of days){
    const box = document.getElementById(d);
    [...box.querySelectorAll(".schedule-item")].forEach(el => el.remove());
  }
}

async function saveJPG(){
  if (typeof html2canvas === "undefined"){
    alert("JPG 저장 라이브러리 로딩이 아직 안됐어요. 잠깐 후 다시 눌러줘!");
    return;
  }

  const hideControls = document.getElementById("hideControlsOnExport").checked;
  const controls = document.getElementById("controls");
  const captureArea = document.getElementById("captureArea");

  const prevDisplay = controls.style.display;
  if (hideControls) controls.style.display = "none";

  document.body.classList.add("exporting");
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const canvas = await html2canvas(captureArea, {
    useCORS: true,
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
  if (hideControls) controls.style.display = prevDisplay;
}
