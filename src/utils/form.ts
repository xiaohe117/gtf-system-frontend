import { EmptyConst } from '@/utils';

/** 手机号码校验规则 */
export const mobileReg = /^1[3|4|5|7|8][0-9]{9}$/;
/** 固话校验规则 */
export const phoneReg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;



// 表单验证规则
export function handleRules(data: any[]): any {
  const arr: any[] = [{ required: true, message: '该字段不能为空', trigger: ['blur', 'change'] }];

  const rules: any = {};
  
  data.forEach((item: any) => {
    const list = ['textarea', 'text'];
    const defaultMax = item.type === 'textarea' ? 1000 : 250;
    const word: any = {
      min: item.minlength || 0,
      max: item.maxlength || defaultMax,
      message: `该字段范围为${item.minlength || 0}-${item.maxlength || defaultMax}个字符`,
      trigger: ['blur', 'change'],
    };

    // 字段类型校验
    const fieldType: any = {
      email: {
        trigger: ['blur', 'change'],
        validator: (_rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
            return;
          }
          const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
          if (mailReg.test(value)) {
            callback();
          } else {
            callback(new Error('请输入正确的邮箱'));
          }
        },
      },
      mob: {
        trigger: ['blur', 'change'],
        validator: (_rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
            return;
          }
          if (mobileReg.test(value)) {
            callback();
          } else {
            callback(new Error('请输入正确的手机号码'));
          }
        },
      },
      tel: {
        trigger: ['blur', 'change'],
        validator: (_rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
            return;
          }
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error('请输入正确的电话号码'));
          }
        },
      },
    };

    if (item.isRequired) {
      if (list.includes(item.type)) {
        const textArr: any[] = [
          { required: true, pattern: '[^ \x20]+', message: '该字段不能为空', trigger: ['blur', 'change'] },
        ];
        rules[item.prop] = textArr.concat([word]);
      } else {
        rules[item.prop] = [...arr];
      }
    } else if (list.includes(item.type)) {
      rules[item.prop] = [word];
    }

    if (item.fieldType && fieldType[item.fieldType]) {
      if (!rules[item.prop]) {
        rules[item.prop] = [];
      }
      rules[item.prop].push(fieldType[item.fieldType]);
    }

    if (item.rules && item.rules.length > 0) {
      if (!rules[item.prop]) {
        rules[item.prop] = [];
      }
      rules[item.prop] = rules[item.prop].concat(item.rules);
    }
  });

  return rules;
}

/**
 * 判断是否为空
 */
export function validatenull(val: any): boolean {
  if (typeof val === 'boolean') {
    return false;
  }
  if (typeof val === 'number') {
    return false;
  }
  if (val instanceof Array) {
    if (val.length === 0) return true;
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true;
  } else {
    if (
      val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === '' ||
      (typeof val === 'string' && val.trim() === '')
    ) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 深拷贝
 */
export function deepClone(source: any) {
	if (!source && typeof source !== 'object') {
		throw new Error('error arguments');
	}
	const targetObj: any = source.constructor === Array ? [] : {};
	Object.keys(source).forEach((keys) => {
		if (source[keys] && typeof source[keys] === 'object') {
			targetObj[keys] = deepClone(source[keys]);
		} else {
			targetObj[keys] = source[keys];
		}
	});
	return targetObj;
}


/** 空值占位展示 */
export const emptyPlaceholder = (val: any,unit?:string) => validatenull(val) ? EmptyConst : `${val}${unit || ''}`;
