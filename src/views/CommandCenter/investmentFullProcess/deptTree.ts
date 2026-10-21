/** 全市对应 name 为 null，统一归一为 '' 供级联与接口使用 */
export const ALL_DEPT_VALUE = '';

export interface DeptTreeNode {
	name: string | null;
	code?: string;
	disabled?: boolean;
	desc: string;
	children?: DeptTreeNode[] | null;
}

export type DeptCascaderOption = Omit<DeptTreeNode, 'name' | 'children'> & {
	name: string;
	children?: DeptCascaderOption[];
};

/** 接口树数据 → el-cascader options（name 空值归一为 ''，去掉空 children） */
export function normalizeDeptTree(nodes: DeptTreeNode[] = []): DeptCascaderOption[] {
	return nodes.map((node) => {
		const item: DeptCascaderOption = {
			code: node.code,
			disabled: node.disabled,
			desc: node.desc,
			name: node.name ?? ALL_DEPT_VALUE,
		};

		if (node.children?.length) {
			item.children = normalizeDeptTree(node.children);
		}

		return item;
	});
}

/** 接口 dept 参数：全市传空字符串 */
export function toQueryDept(dept?: string | null) {
	return dept ?? ALL_DEPT_VALUE;
}
