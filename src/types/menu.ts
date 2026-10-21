export interface MenuItem {
    path: string;
    name: string;
    component: string | (() => Promise<any>);
    redirect: string;
    expanded?: boolean | undefined;
    meta: {
      title: string;
      icon: string;
      link: string | null;
    };
    children?: MenuItem[];
  }
  
  export interface TabConfig {
    id: string;
    label: string;
    path: string;
  }
