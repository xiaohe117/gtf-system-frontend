// 对接计划
const dockPlan = {
  // 提请市领导对接
  leaderDock: [

    { companyName: '中国航天科技集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国航天科工集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国航空工业集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国航空发动机集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '国家石油天然气管网集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '东风汽车集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国联合网络通信集团有限公司', leader: '孙市长', time: '2026年9月' },
    { companyName: '中国电子信息产业集团有限公司', leader: '孙市长', time: '2026年9月' },
    { companyName: '中国一重集团有限公司', leader: '陈杰', time: '2026年9月' },
    { companyName: '中国核工业集团有限公司', leader: '孙市长', time: '2026年11月' },
    { companyName: '国家电网有限公司', leader: '孙市长', time: '2026年11月' },
    { companyName: '中国华能集团有限公司', leader: '孙市长', time: '2026年11月' },
    { companyName: '中国大唐集团有限公司', leader: '陈杰', time: '2026年11月' },
    { companyName: '国家电力投资集团有限公司', leader: '孙市长', time: '2026年11月' },
    { companyName: '中国长江三峡集团有限公司', leader: '陈杰', time: '2026年11月' },
    { companyName: '国家能源投资集团有限责任公司', leader: '孙市长', time: '2026年11月' },
    { companyName: '中国船舶集团有限公司', leader: '刘炜', time: '2026年' },
    { companyName: '中国兵器工业集团有限公司', leader: '王焕清', time: '2026年' },
    { companyName: '中国电子科技集团有限公司', leader: '江智涛', time: '2026年' },
    { companyName: '中国融通资产管理集团有限公司', leader: '王衍诗', time: '2026年' },
    { companyName: '中国石油天然气集团有限公司', leader: '王焕清', time: '2026年' },
    { companyName: '中国石油化工集团有限公司', leader: '王焕清', time: '2026年' },
    { companyName: '中国海洋石油集团有限公司', leader: '王焕清', time: '2026年' },
    { companyName: '中国南方电网有限责任公司', leader: '陈杰', time: '2026年' },
    { companyName: '中国华电集团有限公司', leader: '陈杰', time: '2026年' },
    { companyName: '中国电信集团有限公司', leader: '市政府秘书长', time: '2026年' },
    { companyName: '中国移动通信集团有限公司', leader: '市政府秘书长', time: '2026年' },
    { companyName: '中国卫星网络集团有限公司', leader: '陈杰', time: '2026年' },
    { companyName: '中国第一汽车集团有限公司', leader: '孙市长', time: '2026年' },
    { companyName: '中国机械工业集团有限公司', leader: '胡浩', time: '2026年' }


  ],
  // 市区联合对接
  districtDock: [
    {
      companyName: '中国航天科技集团有限公司',
      department: '市投发委办、市发展改革委',
      time: '2026年3月',
    },
    {
      companyName: '中国航天科工集团有限公司',
      department: '市投发委办、市发展改革委',
      time: '2026年3月',
    },
    {
      companyName: '中国航空工业集团有限公司',
      department: '市投发委办、市发展改革委',
      time: '2026年3月',
    },
    {
      companyName: '中国航空发动机集团有限公司',
      department: '市发展改革委',
      time: '2026年3月',
    },
    {
      companyName: '国家石油天然气管网集团有限公司',
      department: '市工业和信息化局',
      time: '2026年3月',
    },
    {
      companyName: '东风汽车集团有限公司',
      department: '市工业和信息化局',
      time: '2026年3月',
    },
    {
      companyName: '中国联合网络通信集团有限公司',
      department: '市工业和信息化局',
      time: '2026年9月',
    },
    {
      companyName: '中国电子信息产业集团有限公司',
      department: '市工业和信息化局',
      time: '2026年9月',
    },
    { companyName: '中国一重集团有限公司', department: '市发展改革委', time: '2026年9月' },
    {
      companyName: '中国核工业集团有限公司',
      department: '市发展改革委',
      time: '2026年11月',
    },
    { companyName: '国家电网有限公司', department: '市发展改革委', time: '2026年11月' },
    { companyName: '中国华能集团有限公司', department: '市发展改革委', time: '2026年11月' },
    { companyName: '中国大唐集团有限公司', department: '市发展改革委', time: '2026年11月' },
    {
      companyName: '国家电力投资集团有限公司',
      department: '市发展改革委',
      time: '2026年11月',
    },
    {
      companyName: '中国长江三峡集团有限公司',
      department: '市发展改革委',
      time: '2026年11月',
    },
    {
      companyName: '国家能源投资集团有限责任公司',
      department: '市发展改革委',
      time: '2026年11月',
    },
    { companyName: '中国船舶集团有限公司', department: '市工业和信息化局', time: '2026年' },
    {
      companyName: '中国兵器工业集团有限公司',
      department: '市投发委办、市工业和信息化局',
      time: '2026年',
    },
    {
      companyName: '中国电子科技集团有限公司',
      department: '市工业和信息化局',
      time: '2026年',
    },
    {
      companyName: '中国融通资产管理集团有限公司',
      department: '市投发委办、市住房城乡建设局',
      time: '2026年',
    },
    {
      companyName: '中国石油天然气集团有限公司',
      department: '市工业和信息化局',
      time: '2026年',
    },
    {
      companyName: '中国石油化工集团有限公司',
      department: '市工业和信息化局',
      time: '2026年',
    },
    {
      companyName: '中国海洋石油集团有限公司',
      department: '市工业和信息化局',
      time: '2026年',
    },
    { companyName: '中国南方电网有限责任公司', department: '市发展改革委', time: '2026年' },
    {
      companyName: '中国华电集团有限公司',
      department: '市投发委办、市发展改革委',
      time: '2026年',
    },
    {
      companyName: '中国电信集团有限公司',
      department: '市投发委办、市工业和信息化局',
      time: '2026年',
    },
    {
      companyName: '中国移动通信集团有限公司',
      department: '市投发委办、市工业和信息化局',
      time: '2026年',
    },
    {
      companyName: '中国卫星网络集团有限公司',
      department: '市投发委办、市发展改革委',
      time: '2026年',
    },
    {
      companyName: '中国第一汽车集团有限公司',
      department: '市工业和信息化局',
      time: '2026年',
    },
    {
      companyName: '中国机械工业集团有限公司',
      department: '市工业和信息化局',
      time: '2026年',
    }
  ]

}

// 调度计划
const schedulingPlan = {
  // 提请市领导调度
  leaderScheduling: [
    { companyName: '中国一重集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国航天科技集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国航天科工集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国航空工业集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国航空发动机集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '国家石油天然气管网集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '东风汽车集团有限公司', leader: '孙市长', time: '2026年3月' },
    { companyName: '中国联合网络通信集团有限公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '中国电子信息产业集团有限公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '中国核工业集团有限公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '国家电网有限公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '中国华能集团有限公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '中国大唐集团有限公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '国家电力投资集团有限公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '中国长江三峡集团有限公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '国家能源投资集团有限责任公司', leader: '孙市长', time: '2026年6月' },
    { companyName: '中国船舶集团有限公司', leader: '刘炜', time: '2026年' },
    { companyName: '中国兵器工业集团有限公司', leader: '王焕清', time: '2026年' },
    { companyName: '中国电子科技集团有限公司', leader: '江智涛', time: '2026年' },
    { companyName: '中国融通资产管理集团有限公司', leader: '王衍诗', time: '2026年' },
    { companyName: '中国石油天然气集团有限公司', leader: '王焕清', time: '2026年' },
    { companyName: '中国石油化工集团有限公司', leader: '王焕清', time: '2026年' },
    { companyName: '中国海洋石油集团有限公司', leader: '王焕清', time: '2026年' },
    { companyName: '中国南方电网有限责任公司', leader: '陈杰', time: '2026年' },
    { companyName: '中国华电集团有限公司', leader: '陈杰', time: '2026年' },
    { companyName: '中国电信集团有限公司', leader: '市政府秘书长', time: '2026年' },
    { companyName: '中国移动通信集团有限公司', leader: '市政府秘书长', time: '2026年' },
    { companyName: '中国卫星网络集团有限公司', leader: '陈杰', time: '2026年' },
    { companyName: '中国第一汽车集团有限公司', leader: '孙市长', time: '2026年' },
    { companyName: '中国机械工业集团有限公司', leader: '胡浩', time: '2026年' }
  ]
  ,
  // 市区联合调度
  districtScheduling: [
    { companyName: '中国核工业集团有限公司', department: '市发展改革委', time: '2026年6月' },
    { companyName: '国家电网有限公司', department: '市发展改革委', time: '2026年6月' },
    { companyName: '中国华能集团有限公司', department: '市发展改革委', time: '2026年6月' },
    { companyName: '中国大唐集团有限公司', department: '市发展改革委', time: '2026年6月' },
    { companyName: '国家电力投资集团有限公司', department: '市发展改革委', time: '2026年6月' },
    { companyName: '中国长江三峡集团有限公司', department: '市发展改革委', time: '2026年6月' },
    { companyName: '国家能源投资集团有限责任公司', department: '市发展改革委', time: '2026年6月' },
    { companyName: '中国联合网络通信集团有限公司', department: '市工业和信息化局', time: '2026年6月' },
    { companyName: '中国电子信息产业集团有限公司', department: '市工业和信息化局', time: '2026年6月' },
    { companyName: '中国一重集团有限公司', department: '市发展改革委', time: '2026年6月' },
    { companyName: '中国航天科技集团有限公司', department: '市投发委办、市发展改革委', time: '2026年3月' },
    { companyName: '中国航天科工集团有限公司', department: '市投发委办、市发展改革委', time: '2026年3月' },
    { companyName: '中国航空工业集团有限公司', department: '市投发委办、市发展改革委', time: '2026年3月' },
    { companyName: '中国航空发动机集团有限公司', department: '市发展改革委', time: '2026年3月' },
    { companyName: '国家石油天然气管网集团有限公司', department: '市工业和信息化局', time: '2026年3月' },
    { companyName: '东风汽车集团有限公司', department: '市工业和信息化局', time: '2026年3月' },
    { companyName: '中国船舶集团有限公司', department: '市工业和信息化局', time: '2026年' },
    { companyName: '中国兵器工业集团有限公司', department: '市投发委办、市工业和信息化局', time: '2026年' },
    { companyName: '中国电子科技集团有限公司', department: '市工业和信息化局', time: '2026年' },
    { companyName: '中国融通资产管理集团有限公司', department: '市投发委办、市住房城乡建设局', time: '2026年' },
    { companyName: '中国石油天然气集团有限公司', department: '市工业和信息化局', time: '2026年' },
    { companyName: '中国石油化工集团有限公司', department: '市工业和信息化局', time: '2026年' },
    { companyName: '中国海洋石油集团有限公司', department: '市工业和信息化局', time: '2026年' },
    { companyName: '中国南方电网有限责任公司', department: '市发展改革委', time: '2026年' },
    { companyName: '中国华电集团有限公司', department: '市投发委办、市发展改革委', time: '2026年' },
    { companyName: '中国电信集团有限公司', department: '市投发委办、市工业和信息化局', time: '2026年' },
    { companyName: '中国移动通信集团有限公司', department: '市投发委办、市工业和信息化局', time: '2026年' },
    { companyName: '中国卫星网络集团有限公司', department: '市投发委办、市发展改革委', time: '2026年' },
    { companyName: '中国第一汽车集团有限公司', department: '市工业和信息化局', time: '2026年' },
    { companyName: '中国机械工业集团有限公司', department: '市工业和信息化局', time: '2026年' }
  ]

}

export { dockPlan, schedulingPlan }