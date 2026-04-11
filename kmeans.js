export function kmeans(data, k, maxIter = 10) {
    // 1️⃣ 随机初始化中心
    let centroids = data.slice(0, k);

    let clusters = [];

    for (let iter = 0; iter < maxIter; iter++) {
        // 2️⃣ 初始化簇
        clusters = Array.from({ length: k }, () => []);

        // 3️⃣ 分配点
        for (let point of data) {
            let minDist = Infinity;
            let bestIndex = 0;

            for (let i = 0; i < k; i++) {
                const dist = distance(point, centroids[i]);
                if (dist < minDist) {
                    minDist = dist;
                    bestIndex = i;
                }
            }

            clusters[bestIndex].push(point);
        }

        // 4️⃣ 更新中心
        centroids = clusters.map(cluster => {
            if (cluster.length === 0) return data[Math.floor(Math.random() * data.length)];
            return mean(cluster);
        });
    }

    return { centroids, clusters };
}

// 欧几里得距离
function distance(a, b) {
    return Math.sqrt(
        (a[0] - b[0]) ** 2 +
        (a[1] - b[1]) ** 2 +
        (a[2] - b[2]) ** 2
    );
}

// 求均值
function mean(cluster) {
    let r = 0, g = 0, b = 0;

    for (let p of cluster) {
        r += p[0];
        g += p[1];
        b += p[2];
    }

    const n = cluster.length;

    return [
        Math.round(r / n),
        Math.round(g / n),
        Math.round(b / n)
    ];
}