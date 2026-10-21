import type { InjectionKey } from 'vue';
import dayjs from 'dayjs';

const DAYJS_KEY = Symbol('dayjs') as InjectionKey<typeof dayjs>;

export default DAYJS_KEY;
