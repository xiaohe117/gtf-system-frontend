
/**
 * 当年值-招商任务完成率汇总
 */
export interface QueryAttractionCompletionRate {
    /** 落户区 */
    settleDistrict: string;

    /** 新签约项目数量 */
    signedProjSum: number;

    /** 新签约项目完成率（百分比字符串，如 "85%"） */
    signedCompletionRate: string;

    /** 项目入统备案注册金额（单位：亿元，字符串形式） */
    registeredAmount: string;

    /** 项目入统备案注册金额项目完成率（百分比字符串） */
    registeredCompletionRate: string;

    /** 新引进高质量项目数量 */
    highQualityProjSum: number;

    /** 新引进高质量项目完成率（百分比字符串） */
    highQualityCompletionRate: string;

    /** 十亿级项目数量 */
    billionProjSum: number;

    /** 十亿级项目完成率（百分比字符串） */
    billionCompletionRate: string;

    /** 百亿级项目数量 */
    tenbillionProjSum: number;

    /** 百亿级项目完成率（百分比字符串） */
    tenbillionCompletionRate: string;

    /** 央企项目数量 */
    stateOwnedProjSum: number;

    /** 央企项目完成率（百分比字符串） */
    stateOwnedCompletionRate: string;

    /** 所属单位/区域名称 */
    unit: string;
}

/**
 * 项目汇总信息（按区域）
 */
export interface ProjectSummaryByDistrict {
    /** 落户区 */
    settleDistrict: string;

    /** 报告批次（如“第一批”、“第二批”等） */
    reportBatch: string;

    /** 项目阶段（如“筹建”、“在建”、“投产”等） */
    projStage: string;

    /** 项目数量 */
    projSum: number;

    /** （预计）总投资（单位：亿元，字符串形式） */
    totalInvest: string;

    /** 预计达产年营收（单位：亿元，字符串形式） */
    revenueAtFull: string;

    /** 单位（固定为“亿元”） */
    unit: string;
}

/**
 * 各区域项目汇总数据（动态区域名）
 */
export interface DistrictProjectData {
  [districtName: string]: ProjectSummaryByDistrict[];
}

/**
 * 各阶段项目汇总数据（按业务阶段分类）
 */
export interface ProjectSummaryData {
  /** 在谈项目 */
  talking: ProjectSummaryByDistrict[];

  /** 开工项目 */
  commenceWork: ProjectSummaryByDistrict[];

  /** 投产项目 */
  putIntoProduction: ProjectSummaryByDistrict[];

  /** 注册项目 */
  register: ProjectSummaryByDistrict[];

  /** 签约项目 */
  signContract: ProjectSummaryByDistrict[];

  /** 供地项目 */
  land: ProjectSummaryByDistrict[];

  /** 累计总量 */
  totalAccumulate: ProjectSummaryByDistrict[];

  /** 当前总量 */
  totalNow: ProjectSummaryByDistrict[];
}

/**
 * 表格行数据
 */
export interface TableRowVo {
  /** 行标签（如区域名称） */
  label: string;

  /** 该行各列的值，顺序与 headers 一致 */
  values: number[];
}

/**
 * 十亿级项目表格数据
 */
export interface TenbillionProjectTableVo {
  /** 表头：列名数组 */
  headers: string[];

  /** 表格行数据 */
  rows: TableRowVo[];
}




