<template>
	<div class="investment-dashboard">
		<div class="main-stats">
			<div class="stats-section">
				<div class="main-stats-title">
					<SmallTitle title="招商项目全流程管理" />
				</div>

				<div class="main-stats-content">
					<div class="total-projects">
						<img
							src="@/assets/images/nanshaDistrict/icon-5.png"
							alt=""
							class="icon-wrapper"
						/>
						<div class="number">{{ totalProjects }}</div>
						<div class="label">项目总数</div>
					</div>

					<div class="stats-grid">
						<div class="stat-item" v-for="item in sixBatchStats" :key="item.label">
							<img :src="item.icon" alt="" class="icon-wrapper" />
							<div class="stat-number">{{ item.value }}</div>
							<div class="stat-label">{{ item.label }}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="industry-section">
				<SmallTitle title="项目所属产业" />
				<div class="industry-chart-container">
					<div class="industry-legend">
						<span
							><img src="@/assets/images/nanshaDistrict/icon-12.png" alt="" />
							产业体系在谈项目数</span
						>
						<span class="total-number">2</span>
					</div>
					<ChartContainer :chartOption="barOption" class="bar-chart" />
				</div>
			</div>
		</div>

		<div class="charts-section">
			<div class="yearly-investment">
				<TitleBody name="年度招商情况"></TitleBody>
				<ChartContainer :chartOption="threeBarOption" class="three-bar-chart" />
			</div>

			<div class="key-activities">
				<TitleBody name="重点招商活动"></TitleBody>
				<div class="activity-stats">
					<div class="activity-item">
						<img
							src="@/assets/images/nanshaDistrict/icon-5.png"
							alt=""
							class="icon-wrapper"
						/>
						<div class="number">{{ totalNumber }}</div>
						<div class="label">活动总数</div>
					</div>
					<div class="activity-detail-content">
						<div class="activity-detail">
							<span class="detail-name">党政主要负责同志带队活动</span>
							<span class="detail-number">{{ number1 }}</span>
						</div>
						<div class="activity-detail">
							<span class="detail-name">区领导带队</span>
							<span class="detail-number">{{ number2 }}</span>
						</div>
					</div>
				</div>

				<div class="activity-list">
					<div class="activity-entry" v-for="activity in activities" :key="activity.id">
						<div class="activity-type">
							<span class="tag">{{ activity.tag }}</span>
							<span class="desc">{{ activity.description }}</span>
						</div>
						<div class="activity-meta">
							<span><i></i>{{ activity.content }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getUrl } from '@/utils';
import oneBarChartOption from './OneBarChartOption';
import threeBarChartOption from './ThreeBarChartOption';

interface StatItem {
	label: string;
	value: number;
	icon: any;
}

interface Activity {
	id: number;
	description: string;
	date: string;
	tag: string;
	content: string;
}

const totalProjects = ref<number>(763);
const totalNumber = ref<number>(51);
const number1 = ref<number>(6);
const number2 = ref<number>(13);
const barOption = ref<any>({});
const threeBarOption = ref<any>({});

const sixBatchStats = ref<StatItem[]>([
	{ label: '在谈', value: 2, icon: getUrl('nanshaDistrict/icon-6.png') },
	{ label: '签约', value: 233, icon: getUrl('nanshaDistrict/icon-7.png') },
	{ label: '注册(备案)', value: 473, icon: getUrl('nanshaDistrict/icon-8.png') },
	{ label: '落地', value: 48, icon: getUrl('nanshaDistrict/icon-9.png') },
	{ label: '开工', value: 7, icon: getUrl('nanshaDistrict/icon-11.png') },
	{ label: '投产(开票)', value: 0, icon: getUrl('nanshaDistrict/icon-10.png') },
]);

const activities = ref<Activity[]>([
	{
		id: 1,
		description: '赴上海、青岛调研招商',
		date: '2025-11-14',
		tag: '拜访活动',
		content:
			'5月11日至14日，为引进更多知名国际航运企业到南沙落地，推进“五港联动”海港高质量发展，同时学习上海、青岛海港建设发展经验，曾胜中书记代表龙穴街会同区商务局赴上海、青岛调研招商。',
	},
	{
		id: 2,
		description: '赴上海拜访企业',
		date: '2025-11-14',
		tag: '拜访活动',
		content:
			'1.新新海运正在建立和拓展中俄航线通道，对我区航运物流政策表示兴趣，下一步将共同研究在船舶船员管理、船舶融资租赁等业务合作。\n2.地中海航运表示将出席我局后续将在上海举办的招商推介会。\n3.领穗贸易明确在南沙新设法人主体，开展大宗贸易业务。嘉吉贸易、丰益油脂将继续加大在南沙落地相关业务。',
	},
	{
		id: 3,
		description: '“领航星号”香港航季的首航仪式',
		date: '2025-11-14',
		tag: '拜访活动',
		content:
			'与丽星邮轮总裁吴明发就在南沙部署航线事宜交流，企业表示将积极探讨在南沙运营相关事宜。',
	},
	{
		id: 4,
		description: '拜访希慎兴业',
		date: '2025-11-14',
		tag: '拜访活动',
		content:
			'希慎兴业执行主席利蕴莲表示，集团正在持续关注南沙人口增长潜力及港澳消费联动效应，基于南沙得天独厚的地理位置优势，适合布局高端零售、文旅消费、免税消费，并表示将积极探讨在南沙布局商业业态。',
	},
	{
		id: 5,
		description: '调研国远（广东）物流有限公司',
		date: '2025-11-14',
		tag: '拜访活动',
		content:
			'南沙区管委会主任邢华、区投促局、大岗镇王剑镇长一行到在国药物流进行参观调研。国药物流工厂内，区领导详细了解了智能化物流系统和药品供应链管理情况。随后邢主任向国药物流了解了目前大岗先进制造园区的项目建设情况，要求企业加快建设，并表示指挥部专班会全力配合项目建设。',
	},
	{
		id: 6,
		description: '赴厦门建发招商考察',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'邀请厦门建发生活资材到南沙布局业务，推动其与存量企业给力咖啡进一步洽谈咖啡产业领域合作机遇，同时建议其考虑打造供应链创新平台，为南沙制造业企业、贸易商提供优质的融资解决方案。',
	},
	{
		id: 7,
		description: '赴上海招商',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'1.环世物流表示表示将研究将华南各个货代分公司的业务归集到南沙，成立货代华南区域总部，并研究将上海跨境电商总部公司迁移南沙。\n2.中远海发展表示未来五年将持续有新造船计划，将综合考虑南沙船舶租赁相关政策和环境。\n3.中国数联正在研究在大湾区设立区域子公司，广州、深圳是重点考虑区域，希望与广州探讨更多的数据合作场景，推动在省、市层面的合作。',
	},
	{
		id: 8,
		description: '拜访中国中石油国际事业有限公司',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'根据上级工作安排，参加孙志洋市长赴北京拜访中国中石油国际事业有限公司行程，沟通广东石化炼体一体化项目有关事宜。',
	},
	{
		id: 9,
		description: '广州市商务局关于请派员赴重庆、成都参加汽车出口项目对接的函',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'赴重庆、成都开展汽车出口项目对接，拜访赛力斯集团、澳康达集团等重点企业及行业协会，宣传南沙汽车出口支持政策，推进意向项目合作。',
	},
	{
		id: 10,
		description: '拜访京东集团',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'拜访京东零售家电家居事业群服务业务总监张永魁，以及京东七鲜小厨、京东旅行、京东健康板块业务负责人，进一步与京东集团探讨在消费、医美健康、酒店文旅领域的业务落地。',
	},
	{
		id: 11,
		description: '拜访京东集团',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'拜访京东集团高级副总裁贾晓波，以及汽车营销、零售家电相关负责人，进一步与京东集团探讨消费、汽车零售、游艇建造等业务的合作交流。',
	},
	{
		id: 12,
		description: '拜访深圳越海全球供应链股份有限公司',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'拜访深圳越海全球供应链股份有限公司资金管理中心总监张坤水、商务总监郑伟娟，宣传南沙政策体系及综合保税区投资环境，同步推介南沙港片区物流枢纽、跨境电商产业园等重点产业载体选址方案。',
	},
	{
		id: 13,
		description: '拜访中外运物流投资控股有限公司',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'拜访中外运物流投资控股有限公司总经理周建宁，宣传南沙政策体系，交流项目推进进展与难点，进一步探讨南沙与在物流供应链、汽车物流等领域的业务落地。',
	},
	{
		id: 14,
		description: '调研广东石化炼体一体化项目',
		date: '2025-11-13',
		tag: '拜访活动',
		content:
			'为推动华南中石油国际事业有限公司将广东石化项目通过保税物流方式，将外贸业务纳统到南沙的前期工作，储备外贸增长动能，2025年5月30日区政协副主席、商务局局长谢晓晖陪同市商务局一行拜访揭阳海关副关长郑润涛，就华南中石油申请保税仓库事宜进行了对接沟通。',
	},
	{
		id: 15,
		description:
			'拜访天津渤海租赁有限公司 、中航材（北京）融资租赁有限责任公司、交银金融租赁有限责任公司、上海宏信建设发展有限公司天津总部、天津东疆海关、天津东疆管委会，参加第十二届中国航空金融发展（东疆）国际论坛',
		date: '2025-11-12',
		tag: '拜访活动',
		content:
			'双方围绕国家规范招商引资情况下融资租赁奖励政策如何实施、东疆如何提升企业获得感及国企与地方政府如何配合构建融资租赁产业生态圈等方面展开深入交流。在历史友好合作和日前亲切交谈的基础上，进一步加强交流合作，争取渤海租赁后续增量飞机租赁业务优先落户南沙，后续可寻找机会拓展增量合作。',
	},
	{
		id: 16,
		description: '拜访中信金融租赁有限公司',
		date: '2025-11-12',
		tag: '拜访活动',
		content:
			'中信金租初步同意将福建马尾船厂生产的2-3艘船舶采用经营性租赁方式落户南沙，该批船舶预计2026年或2027年交付中远海散使用，届时将为我区带来约9000万美元固定资产投资和进出口指标。同时希望南沙提供绿色储能、高端装备、医疗设备等领域的租赁合作场景，我方表示支持中信金租诉求，已协调中信金租对接我区医疗设备资源，并请中信金租加快船舶业务落地，在春节前后完成南沙项目公司注册工作。',
	},
	{
		id: 17,
		description: '拜访玉皇山南基金小镇、旭杨私募基金管理有限公司',
		date: '2025-11-12',
		tag: '拜访活动',
		content:
			'玉皇山南基金小镇注重园区的整体规划，结合自然环境优势，合理划分功能区，已建成启用了小镇出入境服务站、基金经理人之家、全民健身中心、精品酒店等服务平台，实现“金融”+“旅游”有机结合，形成了入驻企业良好工作生活环境。下一步，我局将联动开发建设集团、明珠湾管理局推动期货产业园区周边基础设施、交通出行及商业配套等完善建设。同时，督促开发建设集团借鉴玉皇山南基金小镇“服务者”理念，健全园区管理服务体系，为入驻企业提供注册登记、政策申报、人才引进、法律财税等全流程专业化服务，提升企业满意度和落地效率，争取实现期货产业园“开园红”。旭杨私募基金管理有限公司（简称“旭杨私募”）于2023年在我区成立（注册资本金2000万元），总部设在上海市，现有员工7人，是中国私募基金管理业协会登记的私募证券管理人。该公司自营业务以量化投资业务为核心，已构建从底层数据到自建数据库的完整框架，拥有因子库、信息库和策略库，并开发了风险控制模块和主策略生成系统，可根据客户需求定制投研策略。目前，该公司已与中信证券、华泰证券、开元证券、国泰君安证券、东兴期货等机构进行合作，正在寻求潜在投资者，以开展深度合作并扩大市场影响力',
	},
	{
		id: 18,
		description:
			'拜访富途证券国际(香港)有限公司、中国国际金融股份有限公司、生态环境部对外合作与交流中心、生态环境部应对气候变化司',
		date: '2025-11-07',
		tag: '拜访活动',
		content:
			'会见富途证券国际(香港)有限公司副总裁王宁，会见中国国际金融股份有限公司执行总经理黄达飞，围绕南沙气候投融资试点工作及落实《南沙金融30条》重点任务进行深入交流。与生态环境部对外合作与交流中心党委委员、纪委书记丁辉寒暄并围绕2025年明珠湾国际气候投融资大会联合举办等方面进行沟通交流。与生态环境部应对气候变化司综合处处长侯芳（主持工作）寒暄并围绕国家级气候投融资试点下阶段工作开展等方面进行沟通交流。',
	},
	{
		id: 19,
		description: '拜访京东集团',
		date: '2025-11-07',
		tag: '拜访活动',
		content:
			'拜访京东集团高级副总裁贾晓波，以及汽车营销、零售家电相关负责人，进一步与京东集团探讨消费、汽车零售、游艇建造等业务的合作交流。',
	},
	{
		id: 20,
		description: '赴厦门建发招商考察',
		date: '2025-10-14',
		tag: '拜访活动',
		content:
			'邀请厦门建发生活资材到南沙布局业务，推动其与存量企业给力咖啡进一步洽谈咖啡产业领域合作机遇，同时建议其考虑打造供应链创新平台，为南沙制造业企业、贸易商提供优质的融资解决方案。\n深入探讨招商引资模式，寻找项目合作机会。',
	},
	{
		id: 21,
		description: '赴上海招商',
		date: '2025-10-14',
		tag: '拜访活动',
		content:
			'招商：\n1.拜访中远海发展，交流航运金融、船舶融资租赁合作机会； \n2.拜访环世物流，洽谈环世物流在南沙进一步落地子公司，并在南沙开展业务事宜；\n3.拜访中国数联，推动中国数联与广州市共同签署战略合作协议，将广州南沙作为未来华南的区域中心，并落地相关业务板块公司。\n活动效果：\n1.环世物流表示将研究将华南各个货代分公司的业务归集到南沙，成立货代华南区域总部，并研究将上海跨境电商总部公司迁移南沙。\n2.中远海发展表示未来五年将持续有新造船计划，将综合考虑南沙船舶租赁相关政策和环境。\n3.中国数联正在研究在大湾区设立区域子公司，广州、深圳是重点考虑区域，希望与广州探讨更多的数据合作场景，推动在省、市层面的合作。',
	},
	{
		id: 22,
		description: '调研国远（广东）物流有限公司',
		date: '2025-10-14',
		tag: '拜访活动',
		content:
			'拜访情况：南沙区管委会主任邢华、区投促局、大岗镇王剑镇长一行到在国药物流进行参观调研。国药物流工厂内，区领导详细了解了智能化物流系统和药品供应链管理情况。随后邢主任向国药物流了解了目前大岗先进制造园区的项目建设情况，要求企业加快建设，并表示指挥部专班会全力配合项目建设。',
	},
	{
		id: 23,
		description:
			'山西太原药业有限公司、山西锦波生物医药股份有限公司、商务部投促局、北京泰德制药股份有限公司',
		date: '2025-08-11',
		tag: '拜访活动',
		content: '向企业介绍了南沙的整体情况，洽谈项目落户南沙事宜。',
	},
	{
		id: 24,
		description: '总章农产品（国际）交易中心',
		date: '2025-08-11',
		tag: '拜访活动',
		content: '洽谈总章农产品（国际）交易中心项目方落户南沙事宜。',
	},
	{
		id: 25,
		description: '拜访北京爱奇艺科技有限公司',
		date: '2025-08-11',
		tag: '拜访活动',
		content: '洽谈企业项目落户南沙事宜。',
	},
	{
		id: 26,
		description: '考察清远先导科技生产基地',
		date: '2025-08-11',
		tag: '拜访活动',
		content:
			'赴清远市清城区考察先导科技生产基地，聚焦先导科技光芯片项目落地我区的出资诉求开展洽谈。',
	},
	{
		id: 27,
		description: '考察广东林顿智能装备有限公司',
		date: '2025-08-11',
		tag: '拜访活动',
		content:
			'考察广东林顿智能装备有限公司（肇庆），开展座谈交流，了解企业经营发展情况，进一步沟通合作事宜。',
	},
	{
		id: 28,
		description: '赴上海调研招商',
		date: '2025-08-11',
		tag: '拜访活动',
		content:
			'访中国远洋海运集团有限公司、马士基（上海）船务管理咨询有限公司、宏海箱运船务有限公司等企业，洽谈项目落户事宜。',
	},
	{
		id: 29,
		description: '赴上海、青岛拜访企业',
		date: '2025-08-11',
		tag: '拜访活动',
		content:
			'1.拜访马士基（上海）船务管理咨询有限公司、海杰航运有限公司、上海新海丰集装箱运输有限公司等船公司，争取企业在南沙新设航运、物流等子公司。\n2.拜访中国数联物流信息有限公司，探讨数字技术在港口领域的应用。\n3.拜访中国远洋海运集团有限公司，沟通加强与南沙子公司合作、争取船舶租赁、共建大湾区航运联合交易中心等事宜。\n4.拜访中联运通控股集团有限公司、上海欧恒供应链集团有限公司、合聚新国际物流有限公司等货代船代企业，争取企业在南沙做大业务。\n5.拜访洲际船务集团控股有限公司，争取企业在南沙落地业务。',
	},
	{
		id: 30,
		description: '赴上海拜访企业',
		date: '2025-08-11',
		tag: '拜访活动',
		content:
			'1.拜访领穗贸易，商谈企业在南沙新设公司事宜。\n2.拜访地中海航运，交流学习MSC业务布局和发展情况，探讨依托南沙港进一步加强在港口、航线、物流等领域合作，邀请出席南沙在上海举办航运招商推介会，并给予指导。\n3.拜访嘉吉贸易和益海嘉里，推动在南沙落地更多业务增量。\n4.拜访上港集团，调研学习上海港口岸通关先进经验。\n5.拜访爱达邮轮，就推动其在南沙部署更多常态化运营航线交流，提前谋划爱达“花城号”在南沙部署安排。\n6.拜访新新海运，争取在南沙进一步扩大业务，增设更多的航线，探讨在南沙设立子公司。',
	},
	{
		id: 31,
		description: '拜访希慎兴业',
		date: '2025-08-11',
		tag: '拜访活动',
		content:
			'就推动其投资南沙，落地旗下商业、消费品牌、新兴产业等业务事宜进行交流探讨。我局就《南沙方案》政策优势、商贸业政策、人才引进补贴等政策进行介绍，突出南沙作为粤港澳合作示范区的战略定位。',
	},
	{
		id: 32,
		description: '“领航星号”香港航季的首航仪式',
		date: '2025-08-11',
		tag: '拜访活动',
		content:
			'与丽星邮轮总裁吴明发就在南沙部署航线事宜交流，企业表示将积极探讨在南沙运营相关事宜。',
	},
	{
		id: 33,
		description: '赴上海、青岛调研招商',
		date: '2025-08-11',
		tag: '拜访活动',
		content:
			'5月11日至14日，为引进更多知名国际航运企业到南沙落地，推进“五港联动”海港高质量发展，同时学习上海、青岛海港建设发展经验，曾胜中书记代表龙穴街会同区商务局赴上海、青岛调研招商。',
	},
	{
		id: 34,
		description: '拜访厦门象屿集团',
		date: '2025-07-08',
		tag: '拜访活动',
		content:
			'向企业介绍了南沙的整体情况，并提出南沙与象屿的业务契合程度很高；邀请企业到南沙考察选址，与区属国企合作落地物流供应链项目；相关部门分别就商贸物流政策，海关政策，以及港口和码头，金融三十条作介绍。',
	},
	{
		id: 35,
		description: '拜访裕廊东集团等企业',
		date: '2025-07-08',
		tag: '拜访活动',
		content:
			'拜访裕廊东集团、超非凡（上海）医疗科技有限公司、京东集团，介绍南沙整体情况，探讨双方合作可能性。',
	},
	{
		id: 36,
		description: '拜访阿斯利康等企业',
		date: '2025-07-08',
		tag: '拜访活动',
		content: '对接项目投资计划，推动项目加快在南沙落地。',
	},
	{
		id: 37,
		description: '拜访深圳市卓驭科技有限公司',
		date: '2025-07-08',
		tag: '拜访活动',
		content:
			'洽谈企业系列项目激目雷达）、域控制器等智驾模组的生产基地、工程交付中心和数据标注中心落户南沙事宜。',
	},
	{
		id: 38,
		description: '拜访东软集团',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '对接项目落户事宜。',
	},
	{
		id: 39,
		description: '拜访百川集团',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '洽谈项目落户事宜。',
	},
	{
		id: 40,
		description: '拜访招商局集团、汇丰银行',
		date: '2025-05-08',
		tag: '拜访活动',
		content:
			'拜访招商局集团，探讨双方合作可能性。\n拜访汇丰银行香港总行，就汇丰全球培训中心项目推进情况进行洽谈。',
	},
	{
		id: 41,
		description: '拜访元亨科技',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '洽谈项目落户事宜。',
	},
	{
		id: 42,
		description: '拜访空中云汇公司',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '洽谈项目落户事宜。',
	},
	{
		id: 43,
		description: '拜访香港工业总会',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '探讨双方合作契机，邀请总会成员赴南沙投资。',
	},
	{
		id: 44,
		description: '拜访长沙银行',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '洽谈双方业务合作事宜。',
	},
	{
		id: 45,
		description: '拜会中国化学工程集团有限公司开展招商引资工作',
		date: '2025-04-08',
		tag: '拜访活动',
		content: '对接中国化学工程集团有限公司投资计划，推动项目落户广州。',
	},
	{
		id: 46,
		description: '考察大族激光智能装备总部',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '考察大族激光智能装备总部，洽谈项目业务导入事宜。',
	},
	{
		id: 47,
		description: '拜访五矿发展集团',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '洽谈项目业务发展事宜。',
	},
	{
		id: 48,
		description: '拜访北京爱奇艺科技有限公司',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '向企业推介南沙营商环境，洽谈项目落户的可能性。',
	},
	{
		id: 49,
		description: '拜访中国北方工业集团有限公司',
		date: '2025-05-08',
		tag: '拜访活动',
		content: '前往中国北方工业集团有限公司，洽谈项目落户事宜。',
	},
	{
		id: 50,
		description: '拜访华润集团等重点项目',
		date: '2025-04-08',
		tag: '拜访活动',
		content:
			'希望华润集团充分发挥多元化发展优势，与广州进一步创新合作模式，推动华润“菜篮子”等项目落户。',
	},
	{
		id: 51,
		description: '与国机集团座谈交流',
		date: '2025-04-08',
		tag: '拜访活动',
		content: '洽谈国机集团无人机研发中心和生产基地项目落户事宜。',
	},
]);

onMounted(() => {
	setTimeout(() => {
		barOption.value = oneBarChartOption();
		threeBarOption.value = threeBarChartOption();
	}, 500);
});
</script>

<style lang="less" scoped>
.investment-dashboard {
	padding: 0 0.15rem;
	height: 7rem;
}

.main-stats {
	display: flex;
	margin-bottom: 0.15rem;
	align-items: flex-start;
}

.stats-section {
	width: 5.87rem;
}

.total-projects {
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #ffffff;
	width: 1.35rem;
	height: 2.8rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding-left: 0.2rem;
	box-sizing: border-box;
	margin-right: 0.16rem;
}

.icon-wrapper {
	width: 0.3rem;
	height: 0.3rem;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.16rem;
}

.stat-item {
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #fff;
	width: 1.35rem;
	height: 1.32rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding-left: 0.2rem;
	box-sizing: border-box;
}

.stat-icon {
	width: 40px;
	height: 40px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 10px auto;
	font-size: 18px;
}

.stat-number,
.number {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	font-size: 0.28rem;
	color: rgba(0, 0, 0, 0.85);
}

.stat-label,
.label {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
	font-size: @g-font-size-base;
	color: #666666;
}

.industry-section {
	flex: 1;
	margin-left: 0.2rem;
}

:deep(.small-title) {
	.title {
		color: #000;
		font-weight: 400;
	}
}

.industry-section h3 {
	color: #000;
	margin: 0 0 15px 0;
	font-size: 16px;
}

.industry-chart-container {
	height: 200px;
}

.industry-legend {
	width: 5.89rem;
	height: 0.56rem;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #ffffff;
	box-sizing: border-box;
	padding: 0 0.36rem 0 0.16rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	img {
		width: 0.3rem;
		height: 0.3rem;
		margin-right: 0.05rem;
	}
	span {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: @g-font-size-base;
		color: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
	}
	.total-number {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 500;
		font-size: 0.28rem;
		color: rgba(0, 0, 0, 0.85);
	}
}

.chart-container {
	width: 100%;
	height: 100%;
}

.charts-section {
	display: flex;
	align-items: flex-start;
}

.yearly-investment {
	width: 5.87rem;
}

.yearly-investment h3 {
	color: #000;
	margin: 0 0 15px 0;
	font-size: 16px;
}

.chart-legend {
	display: flex;
	gap: 20px;
	margin-bottom: 15px;
	color: #000;
	font-size: 12px;
}

.legend-dot {
	display: inline-block;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	margin-right: 5px;
}

.legend-dot.blue {
	background-color: #74c0fc;
}

.legend-dot.orange {
	background-color: #ffb366;
}

.legend-dot.green {
	background-color: #a6e3a1;
}

.yearly-investment .chart-container {
	height: 300px;
}

.key-activities {
	flex: 1;
	margin-left: 0.2rem;
}

.key-activities h3 {
	color: #000;
	margin: 0 0 20px 0;
	font-size: 16px;
}

.activity-stats {
	display: flex;
	margin-bottom: 0.16rem;
}

.activity-item {
	width: 1.35rem;
	height: 1.24rem;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #fff;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding-left: 0.2rem;
	box-sizing: border-box;
	margin-right: 0.16rem;
}

.activity-icon {
	font-size: 24px;
	color: #74c0fc;
	margin-bottom: 10px;
}

.activity-number {
	font-size: 32px;
	font-weight: bold;
	margin-bottom: 5px;
}

.activity-label {
	font-size: 14px;
	opacity: 0.9;
}

.activity-detail-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.activity-detail {
	width: 100%;
	height: 0.56rem;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #ffffff;
	box-sizing: border-box;
	padding: 0 0.16rem 0 0.16rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.detail-number {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	font-size: 0.28rem;
	color: rgba(0, 0, 0, 0.85);
}
.detail-name {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
	font-size:@g-font-size-base;
	color: rgba(0, 0, 0, 0.85);
	display: flex;
	align-items: center;
}

.activity-list {
	height: 1.6rem;
	overflow-y: auto;
}

.activity-entry {
	width: 6rem;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 1px solid #fff;
	padding: 0.08rem;
	margin-bottom: 0.16rem;
}

.activity-type {
	display: flex;
	align-items: center;
	margin-bottom: 0.08rem;
	.tag {
		background: #e6f7ff;
		border-radius: 0.02rem;
		border: 0.01rem solid #91d5ff;
		font-size: @g-font-size-small;
		color: #1890ff;
		line-height: 0.2rem;
		font-weight: 400;
		padding: 0.02rem 0.08rem;
		margin-right: 0.08rem;
	}
	.desc {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: @g-font-size-base;
		color: rgba(0, 0, 0, 0.85);
	}
}

.activity-description {
	font-size: @g-font-size-small;
	line-height: 1.4;
	margin-bottom: 8px;
}

.activity-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	span {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: @g-font-size-small;
		color: rgba(0, 0, 0, 0.65);
		i {
			display: inline-block;
			width: 0.12rem;
			height: 0.12rem;
			background: #ffffff;
			border: 0.02rem solid #408fff;
			border-radius: 50%;
			margin-right: 0.08rem;
		}
	}
}

.activity-date {
	white-space: nowrap;
}

.main-stats-content {
	display: flex;
}
.bar-chart {
	height: 2.2rem;
	margin-bottom: 0.32rem;
}
.three-bar-chart {
	height: 3.2rem !important;
}
</style>
