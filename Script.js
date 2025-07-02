const startBtn = document.getElementById('startBtn');
const cameraSection = document.getElementById('cameraSection');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const downloadBtn = document.getElementById('downloadBtn');
const stickerContainer = document.getElementById('stickerContainer');
const bookingForm = document.getElementById('bookingForm');

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
    clone.draggable = true;
    stickerContainer.appendChild(clone);
    clone.onmousedown = drag;
  };
  stickerContainer.appendChild(img);
});

startBtn.onclick = () => {
  cameraSection.classList.remove('hidden');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 }}})
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(() => alert('Kamera tidak bisa diakses.'));
};

captureBtn.onclick = () => {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  Array.from(stickerContainer.children).forEach(el => {
    if (el.tagName === 'IMG') ctx.drawImage(el, el.offsetLeft, el.offsetTop, el.width, el.height);
  });
  downloadBtn.classList.remove('hidden');
};

downloadBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = `heart2cam_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

bookingForm.onsubmit = (e) => {
  e.preventDefault();
  const data = new FormData(bookingForm);
  const name = data.get('name');
  const date = data.get('date');
  const url = `https://wa.me/62xxxxxxxxxx?text=Hai%20Heart2Cam,%20aku%20mau%20booking%20nama%20${name}%20untuk%20tanggal%20${date}`;
  window.open(url, '_blank');
}; 1
