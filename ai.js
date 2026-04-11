export async function analyzeColors(colors) {
const prompt = `
你是一名设计师，请评价以下颜色搭配：

${colors.join(', ')}

要求：
1. 判断是否和谐
2. 描述整体风格
3. 给出适用场景

⚠️ 请用纯文本回答，不要使用Markdown符号（如#、*、-等），控制在50字以内
`;

    try {
        const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "sk-4T4zHboQ18tMUiNYkewdT6pRFdrDnPbAz2lmS1I1wgbv9RHW"
            },
            body: JSON.stringify({
                model: "moonshot-v1-8k",  // ✅ 推荐模型
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        console.log("AI返回:", data);

        return data.choices[0].message.content;

    } catch (error) {
        console.error("AI分析失败:", error);
        return "AI分析失败，请检查API配置";
    }
}