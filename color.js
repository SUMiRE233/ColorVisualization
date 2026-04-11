export function rgb2lab([r, g, b]) {
    // 1️⃣ RGB → [0,1]
    r /= 255;
    g /= 255;
    b /= 255;

    // 2️⃣ gamma校正（关键）
    [r, g, b] = [r, g, b].map(v =>
        v > 0.04045
            ? Math.pow((v + 0.055) / 1.055, 2.4)
            : v / 12.92
    );

    // 3️⃣ RGB → XYZ
    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    // 4️⃣ 归一化（D65白点）
    x /= 0.95047;
    y /= 1.00000;
    z /= 1.08883;

    // 5️⃣ XYZ → LAB
    function f(t) {
        return t > 0.008856
            ? Math.pow(t, 1 / 3)
            : (7.787 * t + 16 / 116);
    }

    const fx = f(x);
    const fy = f(y);
    const fz = f(z);

    const L = 116 * fy - 16;
    const A = 500 * (fx - fy);
    const B = 200 * (fy - fz);

    return [L, A, B];
}