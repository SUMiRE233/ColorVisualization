export function renderChart(data, type = 'pie') {
    const chartDom = document.getElementById('chart');
    const chart = echarts.init(chartDom);

    let option;

    if (type === 'pie') {
        option = {
            title: { text: '颜色聚类（饼图）', left: 'center' },
            series: [{
                type: 'pie',
                radius: '60%',
                data: data.map(d => ({
                    value: d.count,
                    name: `rgb(${d.color.join(',')})`,
                    itemStyle: {
                        color: `rgb(${d.color.join(',')})`
                    }
                }))
            }]
        };
    } else {
        option = {
            title: { text: '颜色聚类（柱状图）', left: 'center' },
            xAxis: {
                type: 'category',
                data: data.map(d => `rgb(${d.color.join(',')})`)
            },
            yAxis: { type: 'value' },
            series: [{
                type: 'bar',
                data: data.map(d => d.count),
                itemStyle: {
                    color: params => {
                        const c = data[params.dataIndex].color;
                        return `rgb(${c.join(',')})`;
                    }
                }
            }]
        };
    }

    chart.setOption(option);
}