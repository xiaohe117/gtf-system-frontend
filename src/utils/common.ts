export const ChineseNumber = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九'
]
export const NumberUnit = ['', '十','百','千']

export function getChineseByNum(val: number) {
    const numStr = val.toString();
    const numArr = numStr.split('');
    let chinese = '';
    const len = numArr.length;

    numArr.forEach((v, index) => {
        const num = Number(v);
        const unit = NumberUnit[len - index - 1];

        // 处理 10、11、...、19 的情况（去掉开头的 "一"）
        if (len === 2 && index === 0 && num === 1) {
            chinese += unit; // 直接加单位 "十"，跳过 "一"
            return;
        }

        // 处理 0 的情况
        if (num === 0) {
            if (index === len - 1) {
                chinese += unit; // 个位的 0 加单位（如 "十"）
            } else if (index < len - 1) {
                chinese += '零';
            }
        } else {
            chinese += ChineseNumber[num - 1] + unit;
        }
    });

    return chinese;
}
