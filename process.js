export function getImagePixels(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // ================= 核心优化1：限制最大尺寸 =================
    const MAX_SIZE = 200;

    let width = img.width;
    let height = img.height;

    if (width > height) {
        if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
        }
    } else {
        if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
        }
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    const { data } = ctx.getImageData(0, 0, width, height);

    const pixels = [];

    // ================= 核心优化2：像素抽样 =================
    const SAMPLE_RATE = 4; // 每4个像素取1个

    for (let i = 0; i < data.length; i += 4 * SAMPLE_RATE) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // ================= 优化3：过滤透明像素 =================
        if (a < 10) continue;

        pixels.push([r, g, b]);
    }

    console.log("缩放后尺寸:", width, height);
    console.log("采样后像素数:", pixels.length);

    return pixels;
}