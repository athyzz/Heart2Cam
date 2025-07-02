const startBtn = document.getElementById('startBtn');
const cameraSection = document.getElementById('cameraSection');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const downloadBtn = document.getElementById('downloadBtn');
const stickerContainer = document.getElementById('stickerContainer');

const stickers = [
  'assets/heart.png',
  'assets/star.png',
  'assets/mic.png',
];
stickers.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.onclick = () => {
    const clone = img.cloneNode();
    clone.style.top = '20px';
    clone.style.left = '20px';
    clone.style.position = 'absolute';
    clone.draggable = true;
    stickerContainer.appendChild(clone);
    clone.onmousedown = drag;
  };
  stickerContainer.appendChild(img);
});

startBtn.onclick = () => {
  cameraSection.classList.remove('hidden');
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => alert('Kamera tidak bisa diakses 😢'));
};

captureBtn.onclick = () => {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  Array.from(stickerContainer.children).forEach(el => {
    if (el.tagName === 'IMG') {
      const rect = el.getBoundingClientRect();
      ctx.drawImage(el, el.offsetLeft, el.offsetTop, el.width, el.height);
    }
  });
  downloadBtn.classList.remove('hidden');
};

downloadBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = `heart2cam_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

function drag(e) {
  const el = e.target;
  const shiftX = e.clientX - el.getBoundingClientRect().left;
  const shiftY = e.clientY - el.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    el.style.left = pageX - shiftX + 'px';
    el.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);
  el.onmouseup = function () {
    document.removeEventListener('mousemove', onMouseMove);
    el.onmouseup = null;
  };
}
