// 백선화 스케줄
// - 시간: 자유 텍스트
// - 내용 추가
// - 배경 업로드 (원본 크기 그대로 표시)
// - JPG 저장 (html2canvas)

function addSchedule() {
  const day = document.getElementById("daySelect").value;
  const time = (document.getElementById("timeInput").value || "").trim();
  const content = (document.getElementById("contentInput").value || "").trim();

  if (!content) return;

  const dayBox = document.getElementById(day);

  const item = document.createElement("div");
  item.className = "schedule-item";

  const timeSpan = document.createElement("div");
  timeSpan.className = "time";
  timeSpan.textContent = time ? time : "시간";

  const textSpan = document.createElement("div");
  textSpan.className = "text";
  textSpan.textContent = content;

  const actions = document.createElement("div");
  actions.className = "item-actions";

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  delBtn.type = "button";
  delBtn.textContent = "삭제";
  delBtn.onclick = () => item.remove();

  actions.appendChild(delBtn);

  item.appendChild(timeSpan);
  item.appendChild(textSpan);
  item.appendChild(actions);

  dayBox.appendChild(item);

  document.getElementById("timeInput").value = "";
  document.getElementById("contentInput").value = "";
}

// 배경 업로드: DataURL로 즉시 반영(새로고침하면 원복됨)
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
    // h2 제외하고 삭제
    [...box.querySelectorAll(".schedule-item")].forEach(el => el.remove());
  }
}

async function saveJPG(){
  // html2canvas 로드 확인
  if (typeof html2canvas === "undefined"){
    alert("JPG 저장 라이브러리 로딩이 아직 안됐어요. 잠깐 후 다시 눌러줘!");
    return;
  }

  const hideControls = document.getElementById("hideControlsOnExport").checked;
  const controls = document.getElementById("controls");
  const captureArea = document.getElementById("captureArea");

  // 저장할 때 입력창 숨기기(원하면 끄기 가능)
  const prevDisplay = controls.style.display;
  if (hideControls) controls.style.display = "none";

  document.body.classList.add("exporting");

  // 렌더 안정화 프레임
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const canvas = await html2canvas(captureArea, {
    useCORS: true,
    backgroundColor: null, // 배경 포함 그대로(고정 배경 이미지가 보이도록)
    scale: 2
  });

  // JPG로 저장
  const jpgData = canvas.toDataURL("image/jpeg", 0.95);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
  a.href = jpgData;
  a.download = `baekseonhwa-schedule-${stamp}.jpg`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // 원복
  document.body.classList.remove("exporting");
  if (hideControls) controls.style.display = prevDisplay;
}
