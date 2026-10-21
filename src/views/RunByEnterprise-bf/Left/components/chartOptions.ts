/*
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2025-08-12 15:47:54
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-10 16:13:02
 */
import { getSize, formatNumber, getUrl } from '@/utils';
import echarts from '@/utils/echarts';


const pieChartOption = (chartData: any) => {
  const color = [['#33A4FD', '#176BF9'], ['#FFDC68', '#FFB637'], ['#68EEFF', '#37D9FE'],];
  const option = {
    color,
    grid: {
      containLabel: true,
    },
    legend: {
      orient: 'vertical',
      icon: 'rect',
      bottom: getSize(5),
      itemGap: getSize(30),
      itemWidth: getSize(12),
      itemHeight: getSize(12),
      borderRadius: getSize(2),
      textStyle: {
        rich: {
          name: {
            color: '#4B4B4B',
            width: getSize(120),
            fontSize: getSize(14),
            fontWeight: 400,
            fontFamily: 'MicrosoftYaHei',
          },
          text: {
            color: '#4B4B4B',
            fontSize: getSize(14),
            fontWeight: 400,
            fontFamily: 'MicrosoftYaHei',
          },
          num: {
            color: '#4B4B4B',
            fontSize: getSize(14),
            // fontFamily: 'Bebas',
          }
        }
      },
      formatter: (name: string) => {
        const current = chartData.find((item: any) => item.name === name)
        return `{name|${name}} {num|${current.subValue || ''}} {text|${current.subUnit || ''}} {num|${formatNumber(current.value) || ''}} {text|${current.unit || ''}}`
      },
      tooltip: {
        show: true,
      }
    },
    series: [
      {
        type: 'pie', // 中心装饰圈
        zlevel: 4,
        radius: ['0%', '20%'],
        center: ['50%', '30%'],
        silent: true,
        clockwise: false,
        label: {
          show: false,
        },
        data: [{
          name: null,
          value: 0,
          itemStyle: {
            color: '#B0C6D7',
          },
        }],
      },
      {
        type: 'pie',
        radius: ['20%', '35%'],
        center: ['50%', '30%'],
        data: chartData,
        itemStyle: {
          color: (params: any) => {
            const index = params.dataIndex;
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color[index % 6][0] },
              { offset: 1, color: color[index % 6][1] }
            ])
          }
        },
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: getSize(13),
              fontWeight: 400,
              color: '#333',
              backgroundColor: '#E3EFFF',
              // height: getSize(27),
              lineHeight: getSize(27),
              borderRadius: getSize(7),
              padding: [0, getSize(4)],
              rich: {
                text: {
                  align: 'left',
                  fontFamily: 'MicrosoftYaHei',
                  fontSize: getSize(13),
                },
                num: {
                  color: '#333',
                  fontSize: getSize(15),
                  // fontFamily: 'Bebas',
                }
              }
            },
            formatter: "{text|{b}} {num|{c}}",
            position: 'outside',
            overflow: 'break',
          },
        },
        labelLine: {
          normal: {
            show: true,
            length: getSize(28),
            length2: getSize(10),
            minTurnAngle: 30
          },
        },
        emphasis: {
          scaleSize: getSize(20)
        }
      },
      {
        radius: ["20%", "25%"],
        center: ['50%', '30%'],
        type: "pie",
        emphasis: {
          scaleSize: 0
        },
        data: [
          {
            value: 1,
            itemStyle: {
              color: "rgba(0,0,0,0.2)",
            },
          },
        ],
      }
    ],
  };
  return option;
};
const lineChartOption = (chartData: any) => ({
  color: ['#5B8FF9'],
  grid: {
    bottom: 0,
    left: getSize(10),
    top: getSize(50),
    containLabel: true
  },
  tooltip: {
    show: true,
    trigger: 'item',
    backgroundColor: 'rgba(255,255,255,0.9)',
    textStyle: {
      fontSize: getSize(14),
      color: '#333',
      fontFamily: 'MicrosoftYaHei',
    },
    formatter: (params: any) => {
      const { marker, data } = params;
      const { name, value } = data;
      return `${marker} ${name}<br/> 有落地项目企业 ${formatNumber(value)}个`;
    },
  },
  xAxis: {
    type: 'category',
    data: chartData.map((item: any) => item.name),
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0,0,0,.1)'
      }
    },
    axisLabel: {
      color: 'rgba(0,0,0,.7)',
      fontFamily: 'MicrosoftYaHei',
      fontSize: getSize(14)
    },
  },
  yAxis: {
    type: 'value',
    name: '个',
    nameTextStyle: {
      color: 'rgba(0,0,0,.4)',
      fontSize: getSize(14),
      fontFamily: 'MicrosoftYaHei',
      align: 'right',
      padding: [0, getSize(10), 0, 0]
    },
    axisLabel: {
      color: 'rgba(0,0,0,.4)',
      fontFamily: 'MicrosoftYaHei',
      fontSize: getSize(14),
      padding: [0, 0, getSize(-4), 0]
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0,0,0,.3)'
      }
    }
  },
  series: [
    {
      type: 'bar',
      data: chartData,
      barWidth: getSize(11)
    }
  ]
})

const pieChartOption2 = (chartData: any, unit: any) => {
  const colors = [
    {
      color1: '#33A4FD',
      color2: '#176BF9'
    },
    {
      color1: '#FFDC68',
      color2: '#FFB637'
    },
    {
      color1: '#47E7C7',
      color2: '#1EB092'
    },
    {
      color1: '#FF4D4F',
      color2: '#FF4D4F'
    },
    {
      color1: '#37D9FE',
      color2: '#37D9FE'
    },
    {
      color1: '#E16CFF',
      color2: '#E16CFF'
    },
  ];
  const total = chartData.reduce((sum: number, item: any) => sum + item.value, 0) || 0;

  const richStyles: any = {
    name: {
      color: '#4B4B4B',
      fontSize: getSize(14),
      width: getSize(120),
    },
    value: {
      color: '#1D2129',
      fontSize: getSize(16),
      align: 'right', // 数值右对齐
      width: getSize(50), // 固定数值宽度
      padding: [0, 0, 0, 0], // 调整 padding，使数值靠近单位
    },
    unit: {
      color: '#1D2129',
      fontSize: getSize(14),
      padding: [0, 0, 0, 0], // 单位紧贴数值
    },
  };
  chartData.forEach((item: any, index: number) => {
    const colorSet = colors[index % colors.length];
    richStyles[`value${index}`] = {
      ...richStyles.value, // 继承基础 value 样式
      color: colorSet.color1, // 使用对应的颜色
    };
  });
  // 创建中心文本的富文本样式
  const centerRichStyles: any = {
    total: {
      fontSize: getSize(16),
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: '@number-font',
    },
    unit: {
      fontSize: getSize(10),
      color: '#FFFFFF',
      padding: [2, 0, 0, 4],
      fontFamily: 'PingFangSC, PingFang SC',
    }
  };
  const option = {

    grid: {
      left: '1%',
      right: '1%',
      bottom: '0%',
    },
    color: chartData.map((item: any, index: number) => {
      const colorSet = colors[index % colors.length];
      // 创建线性渐变
      return {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: colorSet.color1
          },
          {
            offset: 1,
            color: colorSet.color2
          }
        ]
      };
    }),
    // 图例 (右侧垂直排列)
    legend: {
      orient: 'vertical',
      right: getSize(0),
      top: 'center',
      icon: 'rect',
      itemGap: getSize(18),
      itemWidth: getSize(10),
      itemHeight: getSize(10),
      data: chartData.map((d: any) => d.name),
      itemStyle: {
        borderCap: 'square',
        borderRadius: 0,
        borderColor: 'transparent',  // 设置边框为透明，消除白边
        borderWidth: 0
      },
      textStyle: {
        color: 'transparent', // 必须设置为透明
        fontSize: getSize(14),
        rich: richStyles
      },
      formatter: (name: string) => {
        const dataItem = chartData.find((d: any) => d.name === name);
        const index = chartData.findIndex((d: any) => d.name === name);
        // 使用对应索引的value样式，确保颜色一致
        return `{name|${name}}{value${index}|${dataItem?.value || 0}}{unit|${unit}}`;
      }
    },

    title: [
      {
        // 标题显示地区名称
        text: '中国',
        left: '26%',
        top: '35%',
        textAlign: 'center',
        textStyle: {
          fontSize: getSize(18),
          color: '#FFFFFF',
          fontFamily: 'PingFangSC, PingFang SC',
          fontWeight: '400'
        }
      },
      {
        // 标题显示total和unit，自动居中
        text: `{total|${total}}{unit|家}`,
        left: '26%',
        top: '53%',
        textAlign: 'center',
        textStyle: {
          width: getSize(110),
          align: 'center',
          rich: centerRichStyles
        }
      }
    ],
    // 图形元素
    graphic: [
      // 中心图片
      {
        type: 'image',
        left: '14.2%',
        top: '25%',
        style: {
          image: getUrl('runByEnterprise/right/pie-inner-target.png'),
          width: getSize(100),
          height: getSize(100),
          opacity: 1 // 确保图片不受外层透明度影响
        },
      },
    ],
    // 核心饼图配置
    series: [
      // 背景圆环配置
      {
        type: 'pie',
        center: ['26%', '50%'],
        radius: ['93%', '78%'],
        itemStyle: {
          color: 'rgba(169,181,255,0.08)',
          background: 'linear-gradient( 145deg, #A9CAFE 0%, #E8F2FC 100%)'
        },
        label: {
          show: true,
        },
        data: [0],
      },
      {
        type: 'pie',
        radius: ['55%', '80%'], // 环形图 [内半径, 外半径]
        center: ['26%', '50%'], // 左对齐
        avoidLabelOverlap: true,
        data: chartData,
        itemStyle: {
          borderWidth: getSize(2), // 描边线宽
          borderColor: '#ffffff',
        },
        label: {
          show: false,
          color: '#333333',
          fontSize: getSize(14),
          height: getSize(27),
          lineHeight: getSize(27),
          width: getSize(52),
          align: 'center',        // 水平居中
          verticalAlign: 'middle', // 垂直居中
          backgroundColor: '#E3EFFF', // 文字块背景色
          borderRadius: getSize(7),
          padding: [0, getSize(8), 0, getSize(8)],
          formatter: (params: any) => {
            if (params.value === 0) return '';
            if (params.name === '') return ''; // 空名称不显示
            const percent = ((params.value / total) * 100).toFixed(2); // 计算百分比
            return `${percent}%\n`; // 显示百分比（换行符可调整位置）
          },
          rich: {
            percent: {
              align: 'center',
              verticalAlign: 'middle',
              lineHeight: getSize(27),
              fontSize: getSize(14),
              color: '#333333',
            }
          }
        },
        labelLine: {
          show: true,
          symbol: 'roundRect',
          symbolKeepAspect: true,
          symbolSize: getSize(8),
          length: getSize(30),
          length2: getSize(15),
          lineStyle: {
            color: '#4B4B4B',
          },
        },
      },
    ],
  };
  return option;
};

export { pieChartOption, lineChartOption, pieChartOption2 }