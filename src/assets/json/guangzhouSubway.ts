const img = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACldJREFUeNq8mmtMVdkVx7eIKOIDn4gvUFuQghjFR6dlfOA79ZFaR/2iNWZMJu2HdtKZpk07TZ0mpp1p06RN+8U2WtExgpgZUzS1GmtQ6wsRH/gCBRF8IiqoKApdvz1n32zO3HPOBbErWV65nLP3/q+19n+ttTddHj16pGpqatQbki6i3ZzPFtHmzhy8paVFjRo1SvXs2VNFA2LXrl2dtegU0TTRyaKpogmi0c7vW0UbRatES0WLRa+I1nV0whcvXqi1a9eqpKSk0CSvI2+JviM6TXSsaFw73q0UPSe6W7RQ9FZHFxEI5OXLl9qFSFRUlIqO1q8QLt8T/aHotx1vfEVaW1vbuqzLVx5LdnSRKPGdL/oX0XLebW5uVt26dQv3XvuAAGLBggUqISFBD9jU1KQKCwvfrq+v39C1a9dsP9BITEyMBm+Ehb169SoESsawfz9M9Meia+S5P2dnZ/8hPT390d69e9WNGzf0/B0GwqKGDRumVUgh7tixYx/V1dW9L4PG2M8AgAUNHDhQDRkyRD8/YMAA1atXrzZAiOmHDx+q27dva4K5c+eOevLkiQbkeBqJl58/KikpWSKx/wP5/5FOCS0sUVlZOWbr1q25Yqm3sLIJGxYWFxenxo0bpzIyMtTw4cNVjx49fMcbMWKEfh65f/++unLlijp//ryqra3VXgIQ4J8/f54pc/5b5v+V6O9fCwggzp07l1FcXFwglk8xIAgRJpw6dapWPNER4T108uTJ6uLFi+rIkSPq1q1bOiQBJZ+x8tineEn0lx0GIoNlFBUV/VPcm4T7EbGUtvzcuXNVcnJyp+QDDJaZmalSUlLU0aNHtRKuVrj9gi0n+tOOABkjWiCTJJlQwhNZWVlq3rx5gSHUEWHMnJwcbSghFfalvck/dPLQx+0Bwiq3OwlOg8BC06dP1xO9acEzffv2VTt37lT37t2zwawXrRDd5n4nymOs9U52Du2JadOm/V9AGIHyV6xYofr166eNaAkb/+uRAPmW6AfmB/YE4RQEwp38OkMggmXLlumQs/LTENHfudfuBoIP/2i+xxPEK3siqObZsWOH2rdvX+DihAH1Zo4UODkJYiGRWu98V3Sp3x7hgSnGwrDG/PnzVffu3X09wcYUmlaG2fCexThtpLq6Wh0/flxVVVWpOXPmRETdEyZM0PmmrKxMmRQg8jPRL0xFbXuEVfzItvLEiRPVyJEjfScBwJkzZ3QpzSSHDh1SJ0+e9Hy+oaFBP3fp0iW1adMmdeLEiTZljZdgHOawns0SnRcutNgb3zRlBxmbZOcn7J/Dhw+HyhA2JYxDlg8nhColCc8D5tmzZ9qb27dvV3fv3vWda9CgQXpcxrDkPVOw2kDeMT+zoLFjx+p6yU8oLaibCCMDfuHChap3795hnwfE06dPQ8AJRQARNps3b1ZSy/l6Z9KkSSo2NtbeK2/LGMk2EHqI2SE3yURk2qCC8uzZs6FFYSne8QMPENRdlgOGyppKd9u2bbqY9KJkQt3ySp/S0tIcG8goJ5Nrb+DGoUOH+gKRUl4nK6yKhViMV0gZefz4sR4/XH9hvHP16lW1ceNGvdfYp25JTU1VtsGFPHIIcQMkzalltKUTExN9mcodJlAj4LGYnzx48MD391gaMLQCFju1EdIBazOsKu3AN8SDIY7Msh8O8obxnIlVwAPEi3IjAYIxCE0qYRbr1RXGx8drpQVwGrMkmXe48UiqO6MGid0wITRRQUIRaC/cdIvmZ6pp+hW/1pYsD6lYpNBPDJQY5dDXQJPcKNDg6yDBvbjfeIUwCwqbxsbGEG1jLLxoFsTiSXiRZHyMZj8nGz4hymGsHgYIiwvqjzXNiVUAzDu4mNaVBXrVYICAIHhn5syZas2aNTrJmYKQMWArCCGSct9FFPFRTkYPPqYIYxXyBSHBImCw8vLyNvRs6irjhfT0dLVu3ToNBECEEhvb9PxkfWK/vWGtv5J/mti7xr0sIJKSgcFgKWNxPskrfFZUVKgtW7aogoKCEOcPHjxYLV68WPXv379NeALO7BXe9coh7jB1EUUTNEM8NBggWC5ciIRtIceMUadOnQq1qzdv3lS5ubn6+Ma0qgDwsKKW0aNHtwllTlmCBOq3RYxzz4xebYeEzS5BQLAwFjVGuHbtWggYSqcXRBo8ZzzrXmS4isJVHTSPHz/+jgFSaj8ciXuJ5wsXLoRAGI+ak0EmZB8EMSCFIxncjOHqBsPOCyGYlkHmqZF3qk0GO2Mfa8JAWCgcnxM+hNP169d1GLDwcGFjgMBufsJ5liEMU3f5CWQAGMKWNcr414TF6s0KoJv7hgapaL1ilY0GUAZkMK/kxSQwW9DCIAYzBu8EVdzUYoYcWIt0kMfZhwZIregpsynhfF4IJ9xHQKGzZ8/Wz7oZxAYStD/oQegYTWmDEbki8Ot/AG68h+Nlf/zLrn5bnbYxNKBkS894xcrkgtWrV+uSggnCUTYnIH5Cd0hFgEcc6+rxvOTy5cs6X1k1XbmQTbG7sfrChJdTVep2NOgcFzCzZs3S77jLbq8wwVu0x6h9ljxlyhTPwpNwArhL8uX7RjcQLlk+szc9bWxQTmGzc3AHIDI1zzMpC/IKLej9wIED2guEJwYgn/j1M4CGaKycQ474u9dx0J+cY0m9EBjFlBiRHNusWrVKH93wLupFvZThS5cu1WRAaPHJPYxX0oR4aLRcv+e08boXkAoHTGgv4BW7hvI9EZfFZ2dna+9gXb/zYUhj+fLluvdZtGhRqAIIR+O0wHjR2uREzydBJ42/FS2za6/du3cHnnK4uzgWF3TQDUPBgBx0eMn+/fv1XnXR+K/Vl5eqvkCou95lfxkrk0nz8/NVXV37LmAjufvzaxkIJ+5MXM/sFP1bpIfY/xX9uT0ZtMcJBxvuTQtkwfHrwYMH3ZehZc49Y0ukQJRzU7TBZFEGpDECTElJyRsDwV7Iy8vTnnBVDmxsbpJr2n1jxU2RJLUYCakPAMLA0Ct7hsw/Y8YMz03aXiH5QrFFRUWapVx7woC41KGrNwaXZujD06dPN0i3t55TPsMcVL4Ujlxscu0QdBTkV/1y0sh5MWFrjlMNYxFO8p0viEAgDMTClyxZ8rF4oko6wE8kNwx2Lip1IuOYk3KGLM+5L5/kCUB7xT/kQdGJV6mdIBHTAtiH6FLZ5sl370v/URtEHNGRMA9WWrly5T8yMzOPFhYWbmhqalrGdyiNEYsj17AwAAKE8r1Pnz6hOMcoJD8KUoBQipuDCzdzSca/LcXgb6Qw/Ss5BO8HHRgGXk8zEPnAsdhVmZjD7hWiPzHXc7Y1WRwWhuXCHe0YA3jQbr1orszxqQC9uWfPHh1uQa1AIBDTZNmVrdNI7ZD/8idF3xH9vugM9eVdeOhPM6wsHIlcFM0DBNUFQCsrK/W8Ef8tCg+HOyyO4ASD/3zu6NdEJ3If4xy/ciju1SExGcnosuh/RPkTDfj8aSQnJu4rP+P1aOI4LS3tddmz3NE852fuLKCxRNFY5+yMFT1w6qQaJ4xem7JNYfo/AQYAqpk3qBLp2UoAAAAASUVORK5CYII='
export default {
  nodeData: [
    // 地铁线路信息
    {
      name: '一号线',
      symbolSize: 0.1,
      value: [ 495, 840 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#F9E103',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    {
      name: '二号线',
      symbolSize: 0.1,
      value: [ 680, 500 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#6699CC',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    {
      name: '三号线',
      symbolSize: 0.1,
      value: [ 920, 1720 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#EA6632',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    {
      name: '四号线',
      symbolSize: 0.1,
      value: [ 1720, 260 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#66CC33',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '五号线',
      symbolSize: 0.1,
      value: [ 405, 963 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#F0134D',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '六号线',
      symbolSize: 0.1,
      value: [ 420, 1200 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#FF1493',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '七号线',
      symbolSize: 0.1,
      value: [ 890, 350 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#3FA37E',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '八号线',
      symbolSize: 0.1,
      value: [ 590, 1350 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#00CCFF',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '九号线',
      symbolSize: 0.1,
      value: [ 100, 1540 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#99C857',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '十三号线',
      symbolSize: 0.1,
      value: [ 2000, 650 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#A7B942',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '十四号线',
      symbolSize: 0.1,
      value: [ 1300, 1700 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#E066FF',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    {
      name: '十八号线',
      symbolSize: 0.1,
      value: [ 1200, 260 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#f3ff2f',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    {
      name: '二十一号线',
      symbolSize: 0.1,
      value: [ 1680, 1120 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#516DFB',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    {
      name: '二十二号线',
      symbolSize: 0.1,
      value: [ 846, 216 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#c84b2d',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '广佛线',
      symbolSize: 0.1,
      value: [ 300, 750 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#C9E887',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    {
      name: '佛山二号线',
      symbolSize: 0.1,
      value: [ 60, 640 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#00e7d6',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    {
      name: '佛山三号线',
      symbolSize: 0.1,
      value: [ 1250, 80 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#fbfe5e',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: 'APM线',
      symbolSize: 0.1,
      value: [ 1140, 840 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#00A1CB',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },

    {
      name: '广清城际',
      symbolSize: 0.1,
      value: [ 360, 1840 ],
      x: 800,
      y: 400,
      fixed: true,
      category: 1,
      label: {
        color: '#00CCFF',
        position: 'bottom',
        show: true,
        fontSize: 14,
        fontWeight: 1000,
        fontFamily: 'BoldCondensed,SourceHanSansCN',
      },
    },
    // 换乘站点信息
    {
      name: '昌岗',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 733.94, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '车陂南',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1358.46, 892.2 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '陈家祠',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 600.3, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大学城南',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1358.46, 589.04 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '东山口',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 947.53, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '公园前',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'insideBottom',
      },
      value: [ 733.94, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '广州东站',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1076.62, 1161.69 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '广州火车站',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'insideBottom',
      },
      value: [ 733.94, 1118.14 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '广州南站',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 733.94, 237.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '广州塔',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1076.62, 831.62 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '海珠广场',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'insideBottom',
      },
      value: [ 733.94, 933.67 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '黄村',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1437.5, 984.89 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '黄沙',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 561.819999999999, 933.67 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '嘉禾望岗',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 898.0, 1349.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '客村',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1076.62, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '沥滘',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1076.62, 626.35 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '南洲',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 733.94, 575.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '区庄',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'insideBottom',
      },
      value: [ 947.53, 1118.14 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '沙园',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 638.0, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '石壁',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 733.94, 315.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '苏元',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1902.9, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '坦尾',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 475.89, 1040.66 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '林和西',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1076.62, 1099.42 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '体育西路',
      symbol: img,
      type: 'effectScatter',
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1076.62, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '天河客运站',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1378.22, 1206.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '万胜围',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1358.46, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '文化公园',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'insideBottom',
      },
      value: [ 621.099999999999, 933.67 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '西村',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 638.26, 1118.14 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '西塱',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 561.819999999999, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '新和',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1275.0, 1726.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '燕塘',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1076.62, 1206.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '杨箕',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 994.72, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '鱼珠',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1467.14, 790.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '员村',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1245.88, 892.2 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '镇龙',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1902.9, 1556.11 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '珠江新城',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1076.62, 892.2 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },

    // 非换乘站点信息
    {
      name: '白江',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1896.4, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#A7B942',
          borderWidth: 2,
        },
      },
    },
    {
      name: '白云大道北',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 930.5, 1323.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '白云东平',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 950.0, 1401.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '白云公园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 761.5, 1213.3 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '白云文化广场',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 787.5, 1239.3 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '板桥',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1299.7, 563.3 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '深井',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1408.46, 589.04 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '长洲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1467.14, 589.04 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '洪圣沙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1467.14, 625.04 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '姬堂',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1693.92, 890.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '加庄',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1793.92, 990.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '科丰路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1893.92, 1090.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '燕山',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1840.92, 1400.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '宝岗大道',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 690.0, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '北京路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 807.78, 933.67 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '车陂',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1398.5, 939.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '赤草',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1431.0, 1882.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '赤岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1167.1, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '从化客运站',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1483.0, 1934.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大观南路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1437.5, 1023.89 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大剧院',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1100.02, 934.06 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00A1CB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大沙地',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1527.61, 790.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大沙东',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1593.92, 790.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '大石',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1076.62, 520.79 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大塘',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1076.62, 689.66 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大学城北',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1358.46, 648.32 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大涌',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1755.35, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '低涌',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1358.46, 351.92 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '东风',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1535.0, 1986.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '东湖',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 947.53, 933.67 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '东圃',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1391.35, 863.21 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '东晓南',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 733.94, 640.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '东涌',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1358.46, 292.64 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '动物园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 994.72, 1064.97 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '番禺广场',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1130.52, 350.02 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '市广路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 950, 237 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#c84b2d',
          borderWidth: 2,
        },
      },
    },
    {
      name: '陈头岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 600, 237 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#c84b2d',
          borderWidth: 2,
        },
      },
    },
    // 18号线
    {
      name: '冼村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1180, 930 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#f3ff2f',
          borderWidth: 2,
        },
      },
    },
    {
      name: '龙潭',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1190, 680 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#f3ff2f',
          borderWidth: 2,
        },
      },
    },
    {
      name: '沙溪',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1164, 600 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#f3ff2f',
          borderWidth: 2,
        },
      },
    },
    {
      name: '横沥',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1130, 200 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#f3ff2f',
          borderWidth: 2,
        },
      },
    },
    {
      name: '万顷沙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1280, 200 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#f3ff2f',
          borderWidth: 2,
        },
      },
    },
    {
      name: '芳村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 561.819999999999, 845.66 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '飞鹅岭',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 89.40, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '飞沙角',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1670.72, 159.13 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '飞翔公园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 733.94, 1187.3 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '枫下',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1501.98, 1716.66 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '凤岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1967.9, 1705.61 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '凤凰新村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 586.0, 835.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '妇儿中心',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1100.02, 993.99 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00A1CB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '岗顶',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1275.52, 1021.68 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '高塘石',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1614.3, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '官湖',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 2042.0, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#A7B942',
          borderWidth: 2,
        },
      },
    },
    {
      name: '官洲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1358.46, 707.6 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '广隆',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1670.72, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '广州北站',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 300, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '海傍',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1358.46, 411.33 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '海心沙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1100.02, 906.76 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00A1CB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '海心沙1',
      symbol: 'circle',
      symbolSize: [ 0, 0 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1100.02, 831.62 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00A1CB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '汉溪长隆',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1076.62, 468.53 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '何棠下',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1630.94, 1656.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '河沙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 468.35, 1118.01 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '鹤洞',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 601.599999999999, 698.76 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '横沙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 468.35, 1242.81 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '红卫',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1369.77, 1766.06 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花城大道',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1100.02, 961.23 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00A1CB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花地湾',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 561.819999999999, 773.77 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花都汽车城',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 193.399999999999, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '华师',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1332.33, 1064.06 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '黄陂',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1687.1, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '黄边',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 865.5, 1317.3 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '黄阁',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1532.53, 237.91 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '黄阁汽车城',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1449.59, 237.91 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '黄花岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1007.72, 1157.53 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '黄花岗1',
      symbol: 'circle',
      symbolSize: [ 0, 0 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 947.53, 1157.53 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '黄埔大道',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1100.02, 1017.65 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00A1CB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '会江',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 733.94, 380.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '机场北(2号航站楼)',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 898.0, 1650],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '机场南(1号航站楼)',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 898.0, 1560 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '纪念堂',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 733.94, 1040.66 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '江南西',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 733.94, 833.18 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '江泰路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 733.94, 705.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '江夏',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 839.5, 1291.3 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '蕉门',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1600.78, 237.91 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '滘口',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 415.309999999999, 981.64 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '金峰',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1766.4, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '金坑',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1902.9, 1465.11 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '金融高新区',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 444, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '金洲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1670.72, 237.91 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '京溪南方医院',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1020.2, 1253.6 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '菊树',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 522.819999999999, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '柯木塱',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1551.9, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '科学城',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1786.55, 1229.03 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '科韵路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1302.17, 892.2 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '坑贝',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1902.9, 1673.11 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '坑口',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 561.819999999999, 701.88 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '礌岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 364, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南桂路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 324, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '桂城',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 284, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '朝安',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 244, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '普君北路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 244, 570 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '祖庙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 244, 510 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '同济路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 244, 450 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '季华园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 244, 390 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '魁奇路',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 244, 330.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '澜石',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 244, 270 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '世纪莲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 300, 270 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '东平',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 360, 270 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '新城东',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 420, 270 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '烈士陵园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 882.27, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '猎德',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1133.3, 892.2 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    // {
    //   name: '林和西1',
    //   symbol: 'circle',
    //   symbolSize: [ 0, 0 ],
    //   label: {
    //     color: '#EFEFEF',
    //     position: 'top',
    //   },
    //   value: [ 1100.02, 1099.42000000001 ],
    //   x: 1000,
    //   y: 1000,
    //   fixed: true,
    //   category: 2,
    //   itemStyle: {
    //     normal: {
    //       color: '#112852',
    //       borderColor: '#00A1CB',
    //       borderWidth: 2,
    //     },
    //   },
    // },
    {
      name: '龙洞',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1486.9, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '龙归',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 898.0, 1401.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '人和',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 898.0, 1447.3 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '高增',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 898.0, 1485.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '龙溪',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 483.819999999999, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '鹭江',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 953.25, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '萝岗',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1961.4, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '洛溪',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 733.94, 510.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '马沥',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1210.0, 1661.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '梅花园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1050.1, 1230.2 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '磨碟沙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1216.89, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南村万博',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1134.6, 494.4 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1770.8, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#A7B942',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南海神庙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1593.5, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#A7B942',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南横',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1900.65, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南浦',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 733.94, 445.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南沙客运港',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1980.65, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南洲1',
      symbol: 'circle',
      symbolSize: [ 0, 0 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 712.099999999999, 575.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '农讲所',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 819.09, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '琶洲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1316.34, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '千灯湖',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 404, 629.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    // 9号线
    {
      name: '清塘',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 833.0, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '清㘵',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 768.0, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '莲塘',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 703.0, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '马鞍山公园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 651.0, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花都广场',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 547.0, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花果山公园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 480, 1550.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花城路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 390, 1550.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#99C857',
          borderWidth: 2,
        },
      },
    },
    {
      name: '庆盛',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1400.06, 267.94 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '区庄1',
      symbol: 'circle',
      symbolSize: [ 0, 0 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 994.72, 1118.14 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '如意坊',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 492.4, 998.28 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '三溪',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1426.58, 830.58 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '三元里',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 733.94, 1152.85 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '沙贝',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 468.35, 1180.41 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '沙村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1826.2, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#A7B942',
          borderWidth: 2,
        },
      },
    },
    {
      name: '沙河顶',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1007.72, 1182.49 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '沙涌',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 601.599999999999, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '厦滘',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1076.62, 574.74 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '山田',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 2097.9, 1770.61 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '神岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1379.0, 1830.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '神舟路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1670.2, 1169.36 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '石牌桥',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1213.12, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '石碁',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1358.46, 470.48 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '石溪',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 712.099999999999, 608.41 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '市二宫',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 733.94, 894.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '市桥',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1076.62, 400.53 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '双岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1520.18, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#A7B942',
          borderWidth: 2,
        },
      },
    },
    {
      name: '水西',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1902.9, 1368.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '太和',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1054.0, 1505.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '太平',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1327.0, 1778.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '潭村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1189.59, 892.2 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '汤村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1766.53, 1592.38 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '棠东',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1380.17, 984.89 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '塘坑',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1820.65, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '淘金',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 904.11, 1118.14 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '体育中心',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1206.23, 1115.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '体育中心1',
      symbol: 'circle',
      symbolSize: [ 0, 0 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1206.23, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '体育中心2',
      symbol: 'circle',
      symbolSize: [ 0, 0 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1206.23, 1161.69 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '体育中心南',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1100.02, 1073.68 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00A1CB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '天河公园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1289.17, 939.39 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '天河南',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1100.02, 1044.69 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00A1CB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '天河智慧城',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1553.85, 1109.69 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '天平架',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1038.4, 1206.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '天平架1',
      symbol: 'circle',
      symbolSize: [ 0, 0 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1007.72, 1206.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '同福西',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 603.55, 884.335 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '同和',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 990.3, 1277.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '团一大广场',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 878.5, 933.67 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '旺村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1698.15, 1624.88 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '文冲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1650.13, 790.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '双沙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1700.13, 790.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '庙头',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1700.13, 750.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '保利大道',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1671.5, 636.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '夏港',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1671.5, 586.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '黄埔新港',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1671.5, 536.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '五山',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1379.52, 1106.31 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '五羊邨',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 994.72, 892.2 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '西场',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 599.91, 1079.79 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '西门口',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'insideBottom',
      },
      value: [ 667.64, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '夏良',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1002.0, 1453.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '夏园',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1671.5, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '暹岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1826.2, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '香雪',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 2022.5, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '萧岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 813.5, 1265.3 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '小北',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 820.0, 1118.14 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '晓港',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 796.21, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '谢村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 831.7, 354.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大洲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 733.94, 180.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '陈村北',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 733.94, 120.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '陈村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 690, 120.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '锦龙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 640, 120.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南涌',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 590, 120.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '美的',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 530, 120.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '北滘公园',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 480, 120.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '美的大道',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 480, 180.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '新港东',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1266.55, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '新南',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1436.07, 1747.86 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '新沙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 2129.1, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#A7B942',
          borderWidth: 2,
        },
      },
    },
    {
      name: '新塘',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1965.3, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#A7B942',
          borderWidth: 2,
        },
      },
    },
    {
      name: '新造',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1358.46, 529.76 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#66CC33',
          borderWidth: 2,
        },
      },
    },
    {
      name: '浔峰岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 468.35, 1305.08 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '燕岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 712.099999999999, 673.41 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#C9E887',
          borderWidth: 2,
        },
      },
    },
    {
      name: '一德路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 667.25, 933.67 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '永泰',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 960.4, 1300.4 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#EA6632',
          borderWidth: 2,
        },
      },
    },
    {
      name: '裕丰围',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1467.14, 686.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '员岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1223.0, 532.1 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '越秀公园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 733.94, 1080.44 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#6699CC',
          borderWidth: 2,
        },
      },
    },
    {
      name: '增城广场',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 2227.9, 1834.31 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '长湴',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 1378.22, 1264.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '长平',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1902.9, 1413.11 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '长寿路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 561.819999999999, 982.55 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F9E103',
          borderWidth: 2,
        },
      },
    },
    {
      name: '镇龙北',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1838.16, 1558.58 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '镇龙西',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1902.9, 1517.11 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '知识城',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1563.73, 1688.71 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '植物园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1405.0, 1316.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#FF1493',
          borderWidth: 2,
        },
      },
    },
    {
      name: '中大',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 875.12, 768.05 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '中山八',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 561.3, 1041.18 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#F0134D',
          borderWidth: 2,
        },
      },
    },
    {
      name: '中新',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1902.9, 1608.11 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '钟村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 966.9, 417.7 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#3FA37E',
          borderWidth: 2,
        },
      },
    },
    {
      name: '钟岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 2162.9, 1801.81 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '钟落潭',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1158.0, 1609.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '朱村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 2032.9, 1738.11 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#516DFB',
          borderWidth: 2,
        },
      },
    },
    {
      name: '竹料',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 1106.0, 1557.8 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#E066FF',
          borderWidth: 2,
        },
      },
    },
    // 八号线北延段
    {
      name: '滘心',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 603.94, 1465.93 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '亭岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 603.94, 1427.2866 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '石井',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 621.1, 1388.6434 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '小坪',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 638.26, 1350.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '石潭',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 638.26, 1311.356 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '聚龙',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 638.26, 1272.7134 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '上步',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 638.26, 1234.07 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '同德',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 638.26, 1195.42667 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '鹅掌坦',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 638.26, 1156.783 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '华林寺',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 610.0, 960.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    // 广州东环城际
    {
      name: '花山镇',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 730, 1650 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花城街',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 463, 1650 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花都',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 300, 1570 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#FFFFFF',
        },
      },
    },
    {
      name: '乐同',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 300.0, 1620 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '狮岭',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 300.0, 1690 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '银盏',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 300.0, 1760 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '龙塘镇',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 300.0, 1830.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    {
      name: '清城',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 300.0, 1900.0 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00CCFF',
          borderWidth: 2,
        },
      },
    },
    // 佛山2号线
    {
      name: '林岳东',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 640, 360 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '林岳西',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 590, 360 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '石洲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 540, 360 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '仙涌',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 490, 360 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '花卉世界',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 440, 360 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '登洲',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 390, 360 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '湾华',
      symbol: img,
      symbolSize: [ 12, 12 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 340, 360 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#fff',
        },
      },
    },
    {
      name: '石梁',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 290, 360 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '沙岗',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 160, 330 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '石湾',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 110, 330 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '张槎',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 60, 330 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '智慧新城',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 60, 390 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '绿岛湖',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 60, 450 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '湖涌',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 60, 510 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    {
      name: '南庄',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 60, 560 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#00e7d6',
          borderWidth: 2,
        },
      },
    },
    // 佛山3号线
    {
      name: '镇安',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 540, 480 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '季华六路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 460, 480 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '亚艺公园',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 340, 480 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大墩',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 360, 220 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '岳步',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'right',
      },
      value: [ 360, 170 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '潭洲会展',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'left',
      },
      value: [ 360, 120 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '北滘西站',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 400, 120 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '高村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 440, 120 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '广教',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 530, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '伦教',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 590, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '荔村',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 640, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '顺德人民医院',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 730, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '环市北',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 830, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '大良钟楼',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 880, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '东乐路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 940, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '驹荣北路',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1000, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '顺德一中',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1060, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '顺德欢乐海岸',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'top',
      },
      value: [ 1120, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
    {
      name: '顺德学院站',
      symbol: 'circle',
      symbolSize: [ 8, 8 ],
      label: {
        color: '#EFEFEF',
        position: 'bottom',
      },
      value: [ 1180, 50 ],
      x: 1000,
      y: 1000,
      fixed: true,
      category: 2,
      itemStyle: {
        normal: {
          color: '#112852',
          borderColor: '#fbfe5e',
          borderWidth: 2,
        },
      },
    },
  ],
  edgeData: [
    // 佛山2号线
    {
      source: '广州南站',
      target: '林岳东',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '林岳东',
      target: '林岳西',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '林岳西',
      target: '石洲',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '石洲',
      target: '仙涌',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '仙涌',
      target: '花卉世界',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '花卉世界',
      target: '登洲',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '登洲',
      target: '湾华',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '湾华',
      target: '石梁',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '石梁',
      target: '魁奇路',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '魁奇路',
      target: '沙岗',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '沙岗',
      target: '石湾',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '石湾',
      target: '张槎',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '张槎',
      target: '智慧新城',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '智慧新城',
      target: '绿岛湖',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '绿岛湖',
      target: '湖涌',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    {
      source: '湖涌',
      target: '南庄',
      value: '佛山二号线',
      lineStyle: {
        normal: {
          color: '#00e7d6',
        },
      },
    },
    // 佛山3号线
    {
      source: '镇安',
      target: '季华六路',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '季华六路',
      target: '亚艺公园',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '亚艺公园',
      target: '湾华',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '湾华',
      target: '东平',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '东平',
      target: '大墩',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '大墩',
      target: '岳步',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '岳步',
      target: '潭洲会展',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '潭洲会展',
      target: '北滘西站',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '北滘西站',
      target: '高村',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '高村',
      target: '北滘公园',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '北滘公园',
      target: '广教',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '广教',
      target: '伦教',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '伦教',
      target: '荔村',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '荔村',
      target: '顺德人民医院',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '顺德人民医院',
      target: '环市北',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '环市北',
      target: '大良钟楼',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '大良钟楼',
      target: '东乐路',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '东乐路',
      target: '驹荣北路',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '驹荣北路',
      target: '顺德一中',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '顺德一中',
      target: '顺德欢乐海岸',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    {
      source: '顺德欢乐海岸',
      target: '顺德学院站',
      value: '佛山三号线',
      lineStyle: {
        normal: {
          color: '#fbfe5e',
        },
      },
    },
    // 13号线
    {
      source: '鱼珠',
      target: '裕丰围',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '裕丰围',
      target: '双岗',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '双岗',
      target: '南海神庙',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '南海神庙',
      target: '夏园',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '夏园',
      target: '南岗',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '南岗',
      target: '沙村',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '沙村',
      target: '白江',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '白江',
      target: '新塘',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '新塘',
      target: '官湖',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    {
      source: '官湖',
      target: '新沙',
      value: '十三号线',
      lineStyle: {
        normal: {
          color: '#A7B942',
        },
      },
    },
    // 十四号线
    {
      source: '嘉禾望岗',
      target: '白云东平',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '白云东平',
      target: '夏良',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '夏良',
      target: '太和',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '太和',
      target: '竹料',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '竹料',
      target: '钟落潭',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '钟落潭',
      target: '马沥',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '马沥',
      target: '新和',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '新和',
      target: '太平',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '太平',
      target: '神岗',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '神岗',
      target: '赤草',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '赤草',
      target: '从化客运站',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '从化客运站',
      target: '东风',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    // 14号线支线(知识城线)
    {
      source: '新和',
      target: '红卫',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '红卫',
      target: '新南',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '新南',
      target: '枫下',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '枫下',
      target: '知识城',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '知识城',
      target: '何棠下',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '何棠下',
      target: '旺村',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '旺村',
      target: '汤村',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '汤村',
      target: '镇龙北',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    {
      source: '镇龙北',
      target: '镇龙',
      value: '十四号线',
      lineStyle: {
        normal: {
          color: '#E066FF',
        },
      },
    },
    // 1号线
    {
      source: '西塱',
      target: '坑口',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '坑口',
      target: '花地湾',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '花地湾',
      target: '芳村',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '芳村',
      target: '黄沙',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '黄沙',
      target: '长寿路',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '长寿路',
      target: '陈家祠',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '陈家祠',
      target: '西门口',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '西门口',
      target: '公园前',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '公园前',
      target: '农讲所',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '农讲所',
      target: '烈士陵园',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '烈士陵园',
      target: '东山口',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '东山口',
      target: '杨箕',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '杨箕',
      target: '体育西路',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '体育西路',
      target: '体育中心1',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '体育中心1',
      target: '体育中心',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '体育中心',
      target: '体育中心2',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    {
      source: '体育中心2',
      target: '广州东站',
      value: '一号线',
      lineStyle: {
        normal: {
          color: '#F9E103',
        },
      },
    },
    // 21号线
    {
      source: '员村',
      target: '天河公园',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '天河公园',
      target: '棠东',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '棠东',
      target: '黄村',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '黄村',
      target: '大观南路',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '大观南路',
      target: '天河智慧城',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '天河智慧城',
      target: '神舟路',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '神舟路',
      target: '科学城',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '科学城',
      target: '苏元',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '苏元',
      target: '水西',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '水西',
      target: '长平',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '长平',
      target: '金坑',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '金坑',
      target: '镇龙西',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '镇龙西',
      target: '镇龙',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '镇龙',
      target: '中新',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '中新',
      target: '坑贝',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '坑贝',
      target: '凤岗',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '凤岗',
      target: '朱村',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '朱村',
      target: '山田',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '山田',
      target: '钟岗',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    {
      source: '钟岗',
      target: '增城广场',
      value: '二十一号线',
      lineStyle: {
        normal: {
          color: '#516DFB',
        },
      },
    },
    // 2号线
    {
      source: '嘉禾望岗',
      target: '黄边',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '黄边',
      target: '江夏',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '江夏',
      target: '萧岗',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '萧岗',
      target: '白云文化广场',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '白云文化广场',
      target: '白云公园',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '白云公园',
      target: '飞翔公园',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '飞翔公园',
      target: '三元里',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '三元里',
      target: '广州火车站',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '广州火车站',
      target: '越秀公园',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '越秀公园',
      target: '纪念堂',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '纪念堂',
      target: '公园前',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '公园前',
      target: '海珠广场',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '海珠广场',
      target: '市二宫',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '市二宫',
      target: '江南西',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '江南西',
      target: '昌岗',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '昌岗',
      target: '江泰路',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '江泰路',
      target: '东晓南',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '东晓南',
      target: '南洲',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '南洲',
      target: '洛溪',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '洛溪',
      target: '南浦',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '南浦',
      target: '会江',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '会江',
      target: '石壁',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    {
      source: '石壁',
      target: '广州南站',
      value: '二号线',
      lineStyle: {
        normal: {
          color: '#6699CC',
        },
      },
    },
    // 3号线
    {
      source: '天河客运站',
      target: '五山',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '五山',
      target: '华师',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '华师',
      target: '岗顶',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '岗顶',
      target: '石牌桥',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '石牌桥',
      target: '体育西路',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '体育西路',
      target: '珠江新城',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '珠江新城',
      target: '广州塔',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '广州塔',
      target: '客村',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '客村',
      target: '大塘',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '大塘',
      target: '沥滘',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '沥滘',
      target: '厦滘',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '厦滘',
      target: '大石',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '大石',
      target: '汉溪长隆',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '汉溪长隆',
      target: '市桥',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '市桥',
      target: '番禺广场',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    // 3号线北延段
    {
      source: '体育西路',
      target: '林和西',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '林和西',
      target: '广州东站',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '广州东站',
      target: '燕塘',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '燕塘',
      target: '梅花园',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '梅花园',
      target: '京溪南方医院',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '京溪南方医院',
      target: '同和',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '同和',
      target: '永泰',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '永泰',
      target: '白云大道北',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '白云大道北',
      target: '嘉禾望岗',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '嘉禾望岗',
      target: '龙归',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '龙归',
      target: '人和',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '人和',
      target: '高增',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '高增',
      target: '机场南(1号航站楼)',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    {
      source: '机场南(1号航站楼)',
      target: '机场北(2号航站楼)',
      value: '三号线',
      lineStyle: {
        normal: {
          color: '#EA6632',
        },
      },
    },
    // 4号线
    {
      source: '黄村',
      target: '车陂',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '车陂',
      target: '车陂南',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '车陂南',
      target: '万胜围',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '万胜围',
      target: '官洲',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '官洲',
      target: '大学城北',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '大学城北',
      target: '大学城南',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '大学城南',
      target: '新造',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '新造',
      target: '石碁',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '石碁',
      target: '海傍',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '海傍',
      target: '低涌',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '低涌',
      target: '东涌',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '东涌',
      target: '庆盛',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '庆盛',
      target: '黄阁汽车城',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '黄阁汽车城',
      target: '黄阁',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '黄阁',
      target: '蕉门',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '蕉门',
      target: '金洲',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '金洲',
      target: '飞沙角',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '飞沙角',
      target: '广隆',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '广隆',
      target: '大涌',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '大涌',
      target: '塘坑',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '塘坑',
      target: '南横',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    {
      source: '南横',
      target: '南沙客运港',
      value: '四号线',
      lineStyle: {
        normal: {
          color: '#66CC33',
        },
      },
    },
    // 5号线
    {
      source: '滘口',
      target: '坦尾',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '坦尾',
      target: '中山八',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '中山八',
      target: '西场',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '西场',
      target: '西村',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '西村',
      target: '广州火车站',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '广州火车站',
      target: '小北',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '小北',
      target: '淘金',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '淘金',
      target: '区庄',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '区庄',
      target: '区庄1',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '区庄1',
      target: '动物园',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '动物园',
      target: '杨箕',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '杨箕',
      target: '五羊邨',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '五羊邨',
      target: '珠江新城',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '珠江新城',
      target: '猎德',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '猎德',
      target: '潭村',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '潭村',
      target: '员村',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '员村',
      target: '科韵路',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '科韵路',
      target: '车陂南',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '车陂南',
      target: '东圃',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '东圃',
      target: '三溪',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '三溪',
      target: '鱼珠',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '鱼珠',
      target: '大沙地',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '大沙地',
      target: '大沙东',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '大沙东',
      target: '文冲',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '文冲',
      target: '双沙',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '双沙',
      target: '庙头',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '庙头',
      target: '夏园',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '夏园',
      target: '保利大道',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '保利大道',
      target: '夏港',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    {
      source: '夏港',
      target: '黄埔新港',
      value: '五号线',
      lineStyle: {
        normal: {
          color: '#F0134D',
        },
      },
    },
    // 6号线
    {
      source: '香雪',
      target: '萝岗',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '萝岗',
      target: '苏元',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '苏元',
      target: '暹岗',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '暹岗',
      target: '金峰',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '金峰',
      target: '黄陂',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '黄陂',
      target: '高塘石',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '高塘石',
      target: '柯木塱',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '柯木塱',
      target: '龙洞',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '龙洞',
      target: '植物园',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '植物园',
      target: '长湴',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '长湴',
      target: '天河客运站',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '天河客运站',
      target: '燕塘',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '燕塘',
      target: '天平架',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '天平架',
      target: '天平架1',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '天平架1',
      target: '沙河顶',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '沙河顶',
      target: '黄花岗',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '黄花岗',
      target: '黄花岗1',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '黄花岗1',
      target: '区庄',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '区庄',
      target: '东山口',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '东山口',
      target: '东湖',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '东湖',
      target: '团一大广场',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '团一大广场',
      target: '北京路',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '北京路',
      target: '海珠广场',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '海珠广场',
      target: '一德路',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '一德路',
      target: '文化公园',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '文化公园',
      target: '黄沙',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '黄沙',
      target: '如意坊',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '如意坊',
      target: '坦尾',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '坦尾',
      target: '河沙',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '河沙',
      target: '沙贝',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '沙贝',
      target: '横沙',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    {
      source: '横沙',
      target: '浔峰岗',
      value: '六号线',
      lineStyle: {
        normal: {
          color: '#FF1493',
        },
      },
    },
    // 7号线
    {
      source: '美的大道',
      target: '北滘公园',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '北滘公园',
      target: '美的',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '美的',
      target: '南涌',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '南涌',
      target: '锦龙',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '锦龙',
      target: '陈村',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '陈村',
      target: '陈村北',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '陈村北',
      target: '大洲',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '大洲',
      target: '广州南站',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '广州南站',
      target: '石壁',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '石壁',
      target: '谢村',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '谢村',
      target: '钟村',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '钟村',
      target: '汉溪长隆',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '汉溪长隆',
      target: '南村万博',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '南村万博',
      target: '员岗',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '员岗',
      target: '板桥',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '板桥',
      target: '大学城南',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '大学城南',
      target: '深井',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '深井',
      target: '长洲',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '长洲',
      target: '洪圣沙',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '洪圣沙',
      target: '裕丰围',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '裕丰围',
      target: '大沙东',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '大沙东',
      target: '姬堂',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '姬堂',
      target: '加庄',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '加庄',
      target: '科丰路',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '科丰路',
      target: '萝岗',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '萝岗',
      target: '水西',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    {
      source: '水西',
      target: '燕山',
      value: '七号线',
      lineStyle: {
        normal: {
          color: '#3FA37E',
        },
      },
    },
    // 8号线
    {
      source: '滘心',
      target: '亭岗',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '亭岗',
      target: '石井',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '石井',
      target: '小坪',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '小坪',
      target: '石潭',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '石潭',
      target: '聚龙',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '聚龙',
      target: '上步',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '上步',
      target: '同德',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '同德',
      target: '鹅掌坦',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '鹅掌坦',
      target: '西村',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '西村',
      target: '陈家祠',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '陈家祠',
      target: '华林寺',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '华林寺',
      target: '文化公园',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '文化公园',
      target: '同福西',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '同福西',
      target: '凤凰新村',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '凤凰新村',
      target: '沙园',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '沙园',
      target: '宝岗大道',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '宝岗大道',
      target: '昌岗',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '昌岗',
      target: '晓港',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '晓港',
      target: '中大',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '中大',
      target: '鹭江',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '鹭江',
      target: '客村',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '客村',
      target: '赤岗',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '赤岗',
      target: '磨碟沙',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '磨碟沙',
      target: '新港东',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '新港东',
      target: '琶洲',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '琶洲',
      target: '万胜围',
      value: '八号线',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    // 9号线
    {
      source: '高增',
      target: '清塘',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '清塘',
      target: '清㘵',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '清㘵',
      target: '莲塘',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '莲塘',
      target: '马鞍山公园',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '马鞍山公园',
      target: '花都广场',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '花都广场',
      target: '花果山公园',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '花果山公园',
      target: '花城路',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '花城路',
      target: '广州北站',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '广州北站',
      target: '花都汽车城',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    {
      source: '花都汽车城',
      target: '飞鹅岭',
      value: '九号线',
      lineStyle: {
        normal: {
          color: '#99C857',
        },
      },
    },
    // APM线
    {
      source: '林和西',
      target: '林和西1',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '林和西1',
      target: '体育中心南',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '体育中心南',
      target: '天河南',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '天河南',
      target: '黄埔大道',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '黄埔大道',
      target: '妇儿中心',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '妇儿中心',
      target: '花城大道',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '花城大道',
      target: '大剧院',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '大剧院',
      target: '海心沙',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '海心沙',
      target: '海心沙1',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    {
      source: '海心沙1',
      target: '广州塔',
      value: 'APM线',
      lineStyle: {
        normal: {
          color: '#00A1CB',
        },
      },
    },
    // 广佛线
    {
      source: '沥滘',
      target: '南洲',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '南洲',
      target: '南洲1',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '南洲1',
      target: '石溪',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '石溪',
      target: '燕岗',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '燕岗',
      target: '沙园',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '沙园',
      target: '沙涌',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '沙涌',
      target: '鹤洞',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '鹤洞',
      target: '西塱',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '西塱',
      target: '菊树',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '菊树',
      target: '龙溪',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '龙溪',
      target: '金融高新区',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '金融高新区',
      target: '千灯湖',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '千灯湖',
      target: '礌岗',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '礌岗',
      target: '南桂路',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '南桂路',
      target: '桂城',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '桂城',
      target: '朝安',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '朝安',
      target: '普君北路',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '普君北路',
      target: '祖庙',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '祖庙',
      target: '同济路',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '同济路',
      target: '季华园',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '季华园',
      target: '魁奇路',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '魁奇路',
      target: '澜石',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '澜石',
      target: '世纪莲',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '世纪莲',
      target: '东平',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '东平',
      target: '新城东',
      value: '广佛线',
      lineStyle: {
        normal: {
          color: '#C9E887',
        },
      },
    },
    {
      source: '机场北(2号航站楼)',
      target: '花山镇',
      value: '广州东环城际',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '花山镇',
      target: '花城街',
      value: '广州东环城际',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '花城街',
      target: '花都',
      value: '广州东环城际',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '花都',
      target: '乐同',
      value: '广清城际',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '乐同',
      target: '狮岭',
      value: '广清城际',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '狮岭',
      target: '银盏',
      value: '广清城际',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '银盏',
      target: '龙塘镇',
      value: '广清城际',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    {
      source: '龙塘镇',
      target: '清城',
      value: '广清城际',
      lineStyle: {
        normal: {
          color: '#00CCFF',
        },
      },
    },
    // 22号线
    {
      source: '番禺广场',
      target: '市广路',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#c84b2d',
        },
      },
    },
    {
      source: '市广路',
      target: '广州南站',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#c84b2d',
        },
      },
    },
    {
      source: '广州南站',
      target: '陈头岗',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#c84b2d',
        },
      },
    },
    // 18号线
    {
      source: '冼村',
      target: '磨碟沙',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#f3ff2f',
        },
      },
    },
    {
      source: '磨碟沙',
      target: '龙潭',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#f3ff2f',
        },
      },
    },
    {
      source: '龙潭',
      target: '沙溪',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#f3ff2f',
        },
      },
    },
    {
      source: '沙溪',
      target: '南村万博',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#f3ff2f',
        },
      },
    },
    {
      source: '南村万博',
      target: '番禺广场',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#f3ff2f',
        },
      },
    },
    {
      source: '番禺广场',
      target: '横沥',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#f3ff2f',
        },
      },
    },
    {
      source: '横沥',
      target: '万顷沙',
      value: '二十二号线',
      lineStyle: {
        normal: {
          color: '#f3ff2f',
        },
      },
    },
  ],
  linesData: [
    // 13号线
  {
    coords: [
      [ 1467.14, 790.93 ],
      [ 1467.14, 686.8 ],
      [ 1520.18, 686.8 ],
      [ 1593.5, 686.8 ],
      [ 1671.5, 686.8 ],
      [ 1750.8, 686.8 ],
      [ 1826.2, 686.8 ],
      [ 1896.4, 686.8 ],
      [ 1965.3, 686.8 ],
      [ 2042, 686.8 ],
      [ 2129.1, 686.8 ],
    ],
  },
  {
    coords: [
      [ 898, 1349.8 ],
      [ 950, 1401.8 ],
      [ 1002, 1453.8 ],
      [ 1054, 1505.8 ],
      [ 1106, 1557.8 ],
      [ 1158, 1609.8 ],
      [ 1210, 1661.8 ],
      [ 1275, 1726.8 ],
      [ 1327, 1778.8 ],
      [ 1379, 1830.8 ],
      [ 1431, 1882.8 ],
      [ 1483, 1934.8 ],
      [ 1535, 1986.8 ],
    ],
  },
  {
    coords: [
      [ 1275, 1726.8 ],
      [ 1369.77, 1766.06 ],
      [ 1436.07, 1747.86 ],
      [ 1501.98, 1716.66 ],
      [ 1563.73, 1688.71 ],
      [ 1630.94, 1656.86 ],
      [ 1698.15, 1624.88 ],
      [ 1766.53, 1592.38 ],
      [ 1838.16, 1558.58 ],
      [ 1902.9, 1556.11 ],
    ],
  },
  {
    coords: [
      [ 561.819999999999, 629.86 ],
      [ 561.819999999999, 701.88 ],
      [ 561.819999999999, 773.77 ],
      [ 561.819999999999, 845.66 ],
      [ 561.819999999999, 933.67 ],
      [ 561.819999999999, 982.55 ],
      [ 600.3, 982.55 ],
      [ 667.64, 982.55 ],
      [ 733.94, 982.55 ],
      [ 819.09, 982.55 ],
      [ 882.27, 982.55 ],
      [ 947.53, 982.55 ],
      [ 994.72, 982.55 ],
      [ 1076.62, 982.55 ],
      [ 1206.23, 982.55 ],
      [ 1206.23, 1115.8 ],
      [ 1206.23, 1161.69 ],
      [ 1076.62, 1161.69 ],
    ],
  },
  {
    coords: [
      [ 1245.88, 892.2 ],
      [ 1289.17, 939.39 ],
      [ 1380.17, 984.89 ],
      [ 1437.5, 984.89 ],
      [ 1437.5, 1023.89 ],
      [ 1553.85, 1109.69 ],
      [ 1670.2, 1169.36 ],
      [ 1786.55, 1229.03 ],
      [ 1902.9, 1316 ],
      [ 1902.9, 1368 ],
      [ 1902.9, 1413.11 ],
      [ 1902.9, 1465.11 ],
      [ 1902.9, 1517.11 ],
      [ 1902.9, 1556.11 ],
      [ 1902.9, 1608.11 ],
      [ 1902.9, 1673.11 ],
      [ 1967.9, 1705.61 ],
      [ 2032.9, 1738.11 ],
      [ 2097.9, 1770.61 ],
      [ 2162.9, 1801.81 ],
      [ 2227.9, 1834.31 ],
    ],
  },
  {
    coords: [
      [ 898, 1349.8 ],
      [ 865.5, 1317.3 ],
      [ 839.5, 1291.3 ],
      [ 813.5, 1265.3 ],
      [ 787.5, 1239.3 ],
      [ 761.5, 1213.3 ],
      [ 733.94, 1187.3 ],
      [ 733.94, 1152.85 ],
      [ 733.94, 1118.14 ],
      [ 733.94, 1080.44 ],
      [ 733.94, 1040.66 ],
      [ 733.94, 982.55 ],
      [ 733.94, 933.67 ],
      [ 733.94, 894.93 ],
      [ 733.94, 833.18 ],
      [ 733.94, 768.05 ],
      [ 733.94, 705 ],
      [ 733.94, 640 ],
      [ 733.94, 575 ],
      [ 733.94, 510 ],
      [ 733.94, 445 ],
      [ 733.94, 380 ],
      [ 733.94, 315 ],
      [ 733.94, 237 ],
    ],
  },
  // 3号线
  {
    coords: [
      [ 1378.22, 1206.8 ],
      [ 1379.52, 1106.31 ],
      [ 1332.33, 1064.06 ],
      [ 1275.52, 1021.68 ],
      [ 1213.12, 982.55 ],
      [ 1076.62, 982.55 ],
      [ 1076.62, 892.2 ],
      [ 1076.62, 831.62 ],
      [ 1076.62, 768.05 ],
      [ 1076.62, 689.66 ],
      [ 1076.62, 626.35 ],
      [ 1076.62, 574.74 ],
      [ 1076.62, 520.79 ],
      [ 1076.62, 468.53 ],
      [ 1076.62, 468.53 ],
      [ 1076.62, 400.53 ],
      [ 1130.52, 350.02 ],
    ],
  },
  // 3号线北延段
  {
    coords: [
      [ 1076.62, 982.55 ],
      [ 1076.62, 1206.8 ],
      [ 1050.1, 1230.2 ],
      [ 1020.2, 1253.6 ],
      [ 990.3, 1277 ],
      [ 960.4, 1300.4 ],
      [ 930.5, 1323.8 ],
      [ 898, 1349.8 ],
      [ 898, 1401.8 ],
      [ 898, 1650 ],
    ],
  },
  // 4号线
  {
    coords: [
      [ 1437.5, 984.89 ],
      [ 1398.5, 939 ],
      [ 1358.46, 892.2 ],
      [ 1358.46, 768.05 ],
      [ 1358.46, 707.6 ],
      [ 1358.46, 351.92 ],
      [ 1358.46, 292.64 ],
      [ 1400.06, 267.94 ],
      [ 1449.59, 237.91 ],
      [ 1532.53, 237.91 ],
      [ 1600.78, 237.91 ],
      [ 1670.72, 237.91 ],
      [ 1670.72, 50 ],
      [ 1980.65, 50 ],
    ],
  },
  // 5号线
  {
    coords: [
      [ 415.309999999999, 981.64 ],
      [ 475.89, 1040.66 ],
      [ 561.3, 1041.18 ],
      [ 599.91, 1079.79 ],
      [ 638.26, 1118.14 ],
      [ 733.94, 1118.14 ],
      [ 820, 1118.14 ],
      [ 904.11, 1118.14 ],
      [ 947.53, 1118.14 ],
      [ 994.72, 1118.14 ],
      [ 994.72, 1064.97 ],
      [ 994.72, 982.55 ],
      [ 994.72, 892.2 ],
      [ 1076.62, 892.2 ],
      [ 1133.3, 892.2 ],
      [ 1189.59, 892.2 ],
      [ 1245.88, 892.2 ],
      [ 1302.17, 892.2 ],
      [ 1358.46, 892.2 ],
      [ 1391.35, 863.21 ],
      [ 1426.58, 830.58 ],
      [ 1467.14, 790.93 ],
      [ 1547.61, 790.93 ],
      [ 1623.92, 790.93 ],
      [ 1704.13, 790.93 ],
      [ 1700.13, 750.93 ],
      [ 1671.5, 686.8 ],
      [ 1671.5, 536.8 ],
    ],
  },
  {
    coords: [
      [ 2022.5, 1316 ],
      [ 1961.4, 1316 ],
      [ 1902.9, 1316 ],
      [ 1826.2, 1316 ],
      [ 1766.4, 1316 ],
      [ 1687.1, 1316 ],
      [ 1614.3, 1316 ],
      [ 1551.9, 1316 ],
      [ 1486.9, 1316 ],
      [ 1405, 1316 ],
      [ 1378.22, 1264 ],
      [ 1378.22, 1206.8 ],
      [ 1076.62, 1206.8 ],
      [ 1038.4, 1206.8 ],
      [ 1007.72, 1206.8 ],
      [ 1007.72, 1182.49 ],
      [ 1007.72, 1157.53 ],
      [ 947.53, 1157.53 ],
      [ 947.53, 1118.14 ],
      [ 947.53, 982.55 ],
      [ 947.53, 933.67 ],
      [ 878.5, 933.67 ],
      [ 807.78, 933.67 ],
      [ 733.94, 933.67 ],
      [ 667.25, 933.67 ],
      [ 621.099999999999, 933.67 ],
      [ 561.819999999999, 933.67 ],
      [ 492.4, 998.28 ],
      [ 475.89, 1040.66 ],
      [ 468.35, 1118.01 ],
      [ 468.35, 1180.41 ],
      [ 468.35, 1242.81 ],
      [ 468.35, 1305.08 ],
    ],
  },
  // 7号线
  {
    coords: [
      [ 480, 180.0 ],
      [ 480, 120.0 ],
      [ 733.94, 120.0 ],
      [ 733.94, 237 ],
      [ 733.94, 315 ],
      [ 831.7, 354 ],
      [ 966.9, 417.7 ],
      [ 1076.62, 468.53 ],
      [ 1134.6, 494.4 ],
      [ 1223, 532.1 ],
      [ 1299.7, 563.3 ],
      [ 1358.46, 589.04 ],
      [ 1467.14, 589.04 ],
      [ 1467.14, 686.8 ],
      [ 1593.92, 790.93 ],
      [ 1693.92, 890.93 ],
      [ 1893.92, 1090.93 ],
      [ 1961.4, 1316.0 ],
      [ 1902.9, 1368.0 ],
      [ 1840.92, 1400.93 ],
    ],
  },
  {
    coords: [
      [ 603.94, 1465.93 ],
      [ 603.94, 1427.2866 ],
      [ 621.1, 1388.6434 ],
      [ 638.26, 1350.0 ],
      [ 638.26, 1311.356 ],
      [ 638.26, 1272.7134 ],
      [ 638.26, 1234.07 ],
      [ 638.26, 1195.42667 ],
      [ 638.26, 1156.783 ],
      [ 638.26, 1118.14 ],
      [ 600.3, 982.55 ],
      [ 610.0, 960.0 ],
      [ 621.099999999999, 933.67 ],
      [ 603.55, 884.335 ],
      [ 586, 835 ],
      [ 638, 768.05 ],
      [ 690, 768.05 ],
      [ 733.94, 768.05 ],
      [ 796.21, 768.05 ],
      [ 875.12, 768.05 ],
      [ 953.25, 768.05 ],
      [ 1076.62, 768.05 ],
      [ 1167.1, 768.05 ],
      [ 1216.89, 768.05 ],
      [ 1266.55, 768.05 ],
      [ 1316.34, 768.05 ],
      [ 1358.46, 768.05 ],
    ],
  },
  // 9号线
  {
    coords: [
      [ 898.0, 1485.0 ],
      [ 833.0, 1550.0 ],
      [ 89.40, 1550.0 ],
    ],
  },
  {
    coords: [
      [ 1076.62, 1099.42 ],
      [ 1100.02, 1099.42000000001 ],
      [ 1100.02, 1073.68 ],
      [ 1100.02, 1044.69 ],
      [ 1100.02, 1017.65 ],
      [ 1100.02, 993.99 ],
      [ 1100.02, 961.23 ],
      [ 1100.02, 934.06 ],
      [ 1100.02, 906.76 ],
      [ 1100.02, 831.62 ],
      [ 1076.62, 831.62 ],
    ],
  },
  // 广佛线
  {
    coords: [
      [ 1076.62, 626.35 ],
      [ 733.94, 575 ],
      [ 712.099999999999, 575 ],
      [ 712.099999999999, 608.41 ],
      [ 712.099999999999, 673.41 ],
      [ 638, 768.05 ],
      [ 601.599999999999, 768.05 ],
      [ 601.599999999999, 698.76 ],
      [ 561.819999999999, 629.86 ],
      [ 522.819999999999, 629.86 ],
      [ 483.819999999999, 629.86 ],
      [ 444.819999999999, 629.86 ],
      [ 364, 629.86 ],
      [ 244, 629.86 ],
      [ 244, 270 ],
      [ 420, 270 ],
    ],
  },
  // 广清城际
  {
    coords: [
      [ 898.0, 1650 ],
      [ 730, 1650 ],
      [ 463, 1650 ],
      [ 300, 1570 ],
      [ 300.0, 1570 ],
      [ 300.0, 1620 ],
      [ 300.0, 1690 ],
      [ 300.0, 1760 ],
      [ 300.0, 1830.0 ],
      [ 300.0, 1900.0 ],
    ],
  },
  // 22号线
  {
    coords: [
      [ 1130.52, 350.02 ],
      [ 950, 237 ],
      [ 733.94, 237.0 ],
      [ 600, 237 ],
    ],
  },
  // 18号线
  {
    coords: [
      [ 1180, 930 ],
      [ 1216.89, 768.05 ],
      [ 1190, 680 ],
      [ 1164, 600 ],
      [ 1134.6, 494.4 ],
      [ 1130.52, 350.02 ],
      [ 1130, 200 ],
      [ 1280, 200 ],
    ],
  },
  // 佛山2号线
  {
    coords: [
      [ 733.94, 237 ],
      [ 640, 360 ],
      [ 290, 360 ],
      [ 244, 330.0 ],
      [ 60, 330 ],
      [ 60, 560 ],
    ],
  },
  // 佛山3号线
  {
    coords: [
      [ 540, 480 ],
      [ 340, 480 ],
      [ 340, 360 ],
      [ 360, 270 ],
      [ 360, 120 ],
      [ 480, 120 ],
      [ 530, 50 ],
      [ 1180, 50 ],
    ],
  },
  ],
  lineData: [ {
    value: '1号线',
    label: '1号线',
  },
  {
    value: '2号线',
    label: '2号线',
  },
  {
    value: '3号线',
    label: '3号线',
  },
  {
    value: '4号线',
    label: '4号线',
  },
  {
    value: '5号线',
    label: '5号线',
  },
  {
    value: '6号线',
    label: '6号线',
  },
  {
    value: '7号线',
    label: '7号线',
  },
  {
    value: '8号线',
    label: '8号线',
  },
  {
    value: '9号线',
    label: '9号线',
  },
  {
    value: '13号线',
    label: '13号线',
  },
  {
    value: '14号线',
    label: '14号线',
  },
  {
    value: '21号线',
    label: '21号线',
  },
  {
    value: '广佛线',
    label: '广佛线',
  },
  {
    value: 'APM线',
    label: 'APM线',
  },
  {
    value: '广清城际线',
    label: '广清城际线',
  },
  {
    value: '广州东环城际线',
    label: '广州东环城际线',
  },
  ],
}
