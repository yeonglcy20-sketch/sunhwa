
function addSchedule(){
  const day = document.getElementById("daySelect").value;
  const time = document.getElementById("timeInput").value.trim();
  const content = document.getElementById("contentInput").value.trim();
  if(!content) return;

  const box = document.getElementById(day);

  const item = document.createElement("div");
  item.className = "schedule-item";

  item.innerHTML = `
    <span class="item-label">시간</span>
    ${time || "-"}
    <br><br>
    <span class="item-label">내용</span>
    ${content}
  `;

  box.appendChild(item);

  document.getElementById("timeInput").value = "";
  document.getElementById("contentInput").value = "";
}

document.getElementById("bgUpload").addEventListener("change", function(e){
  const reader = new FileReader();
  reader.onload = function(evt){
    document.getElementById("bgImage").src = evt.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function clearAll(){
  document.querySelectorAll(".schedule-item").forEach(el=>el.remove());
}

async function saveJPG(){
  if(typeof html2canvas==="undefined"){ alert("잠시 후 다시 시도해주세요"); return;}
  const canvas = await html2canvas(document.getElementById("captureArea"),{scale:2});
  const link = document.createElement("a");
  link.download="baekseonhwa-schedule.jpg";
  link.href=canvas.toDataURL("image/jpeg",0.95);
  link.click();
}
