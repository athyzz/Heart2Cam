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

// Load stiker dan bisa diklik
stickers.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.style.width = '80px';
  img.style.margin = '10px';
  img.style.cursor = 'pointer';
  img.onclick = () => {
    const clone = img.cloneNode();
    clone.style.position = 'absolute';
    clone.style.top = '100px';
    clone.style.left = '100px';
    clone.draggable = true;
    stickerContainer.appendChild(clone);
    enableDrag(clone);
  };
  stickerContainer.appendChild(img);
});

startBtn.onclick = () => {
  cameraSection.classList.remove('hidden');
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error(err);
      alert('Kamera tidak bisa diakses. Pastikan kamu sudah izinkan akses kamera yaa 😢');
    });
};

captureBtn.onclick = () => {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  const stickersOnScreen = stickerContainer.querySelectorAll('img');
  stickersOnScreen.forEach(sticker => {
    const rect = sticker.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();
    const x = rect.left - videoRect.left;
    const y = rect.top - videoRect.top;
    ctx.drawImage(sticker, x, y, sticker.width, sticker.height);
  });

  downloadBtn.classList.remove('hidden');
};

downloadBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = `heart2cam_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

function enableDrag(el) {
  el.onmousedown = function (e) {
    e.preventDefault();
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;

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
  };
  el.ondragstart = () => false;
}
