import { getImagePixels } from './process.js';
import { kmeans } from './kmeans.js';
import { renderChart } from './Echarts.js';
import { rgb2lab } from './color.js';
import { analyzeColors } from './ai.js';

// ================= 全局状态 =================
let currentK = 5;
let currentPixels = null;
let currentChartType = 'pie';
let currentColorSpace = 'rgb';

// ================= 核心函数 =================
function runKmeansAndRender() {
    if (!currentPixels) return;

    let data;

    // 1️⃣ 构造带 index 的数据（关键🔥）
    if (currentColorSpace === 'lab') {
        data = currentPixels.map((p, i) => ({
            value: rgb2lab(p),
            index: i
        }));
    } else {
        data = currentPixels.map((p, i) => ({
            value: p,
            index: i
        }));
    }

    // 2️⃣ 提取 value 给 kmeans
    const pureData = data.map(d => d.value);

    const { centroids, clusters } = kmeans(pureData, currentK);

    // 3️⃣ 重新构造 cluster（带 index）
    const indexedClusters = clusters.map(cluster =>
        cluster.map(point => {
            const idx = pureData.indexOf(point);
            return data[idx];
        })
    );

    // 4️⃣ 用原始 RGB 计算颜色
    const result = indexedClusters.map(cluster => {
        if (cluster.length === 0) {
            return { color: [0, 0, 0], count: 0 };
        }

        let r = 0, g = 0, b = 0;

        cluster.forEach(item => {
            const p = currentPixels[item.index]; // ✅ 原始 RGB
            r += p[0];
            g += p[1];
            b += p[2];
        });

        const n = cluster.length;

        return {
            color: [
                Math.round(r / n),
                Math.round(g / n),
                Math.round(b / n)
            ],
            count: n
        };
    });

    console.log("重新聚类:", result);

    renderChart(result, currentChartType);

    // ================= 颜色块展示 =================
    const container = document.getElementById('colorBlocks');
    container.innerHTML = '';

    result.forEach(r => {
        const div = document.createElement('div');
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.borderRadius = '6px';
        div.style.background = `rgb(${r.color.join(',')})`;
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.color = '#fff';
        div.style.fontSize = '12px';

        div.innerText = r.count;
        div.title = `rgb(${r.color.join(',')})`;

        container.appendChild(div);
    });

    // ================= AI分析 =================
    const colors = result.map(r => `rgb(${r.color.join(',')})`);

    analyzeColors(colors).then(text => {
        document.getElementById('aiResult').innerText = text;
    });
}

// ================= 图片上传 =================
document.getElementById('upload').onchange = function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();

    img.onload = () => {
        currentPixels = getImagePixels(img);

        // 👉 加这一行（显示原图）
        document.getElementById('preview').src = img.src;

        console.log("像素数:", currentPixels.length);

        runKmeansAndRender();
    };

    img.src = URL.createObjectURL(file);
};

// ================= K值控制 =================
const kRange = document.getElementById('kRange');
const kValue = document.getElementById('kValue');

kRange.oninput = function () {
    currentK = parseInt(this.value);
    kValue.innerText = currentK;

    runKmeansAndRender();
};

// ================= 图表类型切换 =================
const chartTypeSelect = document.getElementById('chartType');

chartTypeSelect.onchange = function () {
    currentChartType = this.value;

    runKmeansAndRender();
};

// ================= 颜色空间切换 =================
const colorSpaceSelect = document.getElementById('colorSpace');

colorSpaceSelect.onchange = function () {
    currentColorSpace = this.value;

    runKmeansAndRender();
};

// ================= 测试 =================
console.log("LAB测试:", rgb2lab([255, 0, 0]));