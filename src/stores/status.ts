import { defineStore } from 'pinia';

export default defineStore('status', () => {
	const yearSelectValue = ref('');
	const actTabValue = ref('');

	function setYearSelectValue(value: string) {
		yearSelectValue.value = value;
	}

	function setActTabValue(value: string) {
		actTabValue.value = value;
	}

	function getCurrentDate() {
		const val = yearSelectValue.value;
		if (!val) return null;
		const match = val.match(/^(\d{4})年(\d+)(?:-(\d+))?月$/);
		if (!match) return null;
		const year = Number(match[1]);
		const startMonth = Number(match[2]);
		const endMonth = match[3] ? Number(match[3]) : startMonth;
		const pad = (n: number) => String(n).padStart(2, '0');
		const lastDay = new Date(year, endMonth, 0).getDate();
		return {
			label: yearSelectValue.value,
			startTimeStr: `${year}-${pad(startMonth)}-01 00:00:00`,
			endTimeStr: `${year}-${pad(endMonth)}-${pad(lastDay)} 23:59:59`,
		};
	}

	return {
		yearSelectValue,
		setYearSelectValue,
		actTabValue,
		setActTabValue,
		getCurrentDate,
	};
});
