const toBlocksBody = (paragraphs: string[]) =>
  paragraphs
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph) => ({
      type: "paragraph",
      children: [
        {
          type: "text",
          text: paragraph,
        },
      ],
    }));

const createBody = (summary: string) =>
  toBlocksBody([
  summary,
  "学校将围绕课堂质量、学生成长体验与家校协同持续推进相关工作，并把阶段性成果整理为前台可直接展示的内容。",
  "后续你可以直接在 Strapi 后台修改标题、摘要、正文、发布时间和封面图，前端页面会自动读取最新数据。",
  ]);

const createPost = (
  title: string,
  publishedDate: string,
  slug: string,
  summary: string,
  highlights: string[],
  coverImageUrl?: string,
) => ({
  title,
  publishedDate,
  slug,
  summary,
  body: createBody(summary),
  highlights,
  coverImageUrl,
});

export const demoSeed = {
  site: {
    schoolName: "南部县第五小学",
    schoolNameEn: "Nanbu County Fifth Primary School",
    welcomeText: "欢迎访问南部县第五小学官方网站",
    address: "四川省南充市南部县",
    phone: "13890887770",
    logoUrl: "/assets/images/school-logo.jpg",
    principalTitle: "校长寄语",
    principalImageUrl: "/assets/images/校长寄语.jpg",
    principalParagraphs: [
      "网站的首页不追求栏目越多越好，而是让信息更有层次、更容易查找。把核心栏目收拢后，学校概况、新闻公告和师资展示会更清楚。",
      "后续随着学校资料逐步补齐，我们可以继续往各个栏目页里扩展内容，但首页始终保持简洁稳定。",
    ],
    heroSlides: [
      {
        id: "hero-1",
        kicker: "书香校园 育人为本",
        title: "让每一位孩子在温暖校园里自信成长",
        description:
          "首页只保留走进校园、校园新闻、校园公告、师资队伍四个核心栏目，信息更清楚，也更适合后续长期维护。",
        imageUrl: "/assets/images/hero-home-1.png",
        imageAlt: "南部县第五小学首页主视觉",
      },
      {
        id: "hero-2",
        kicker: "真实校园 稳定展示",
        title: "用本地图片和简洁结构搭建长期可维护的学校网站",
        description:
          "后续继续补资料时，只需要补栏目内容和教师档案，不需要再反复调整网站结构。",
        imageUrl: "/assets/images/hero-home-2.jpg",
        imageAlt: "校园环境展示照片",
      },
      {
        id: "hero-3",
        kicker: "家校协同 信息清晰",
        title: "重要信息集中展示，让访问路径更直接",
        description:
          "家长和来访者进入首页后，可以直接看到学校概况、新闻、公告和教师栏目，不会被过多入口打散注意力。",
        imageUrl: "/assets/images/hero-home-3.jpg",
        imageAlt: "校园活动展示照片",
      },
    ],
    campusStats: ["实时渲染", "支持拖拽旋转", "支持缩放观察", "支持固定视角切换"],
    campusIntro:
      "这一版把“走进校园”改成持续渲染的三维浏览模式。你可以拖拽旋转、滚轮缩放，也可以直接切换固定视角，从校门、俯瞰、教学楼和操场不同方向查看校园空间关系。",
    newsIntro:
      "用于发布学校近期新闻、主题活动、家校沟通、校园展示等内容，适合作为日常更新的主栏目。",
    noticeIntro:
      "用于发布放假通知、家长须知、活动安排、收费公示和重要提醒，让学校公告集中展示、便于查找。",
    teachersIntro:
      "首页只展示学科分组，点击进入对应学科后再查看老师列表和个人档案，方便后续继续扩充更多教师资料。",
    galleryIntro:
      "从已整理的校园活动照片中筛选出更适合浏览的内容，先看活动封面，再按主题展开查看，页面更清爽，照片也更容易管理。",
    teacherArchiveNote:
      "师资队伍首页先展示学科分组，点击进入后再查看对应老师列表和个人档案。这样老师人数增加以后，页面结构仍然清楚。",
  },
  newsPosts: [
    createPost(
      "春季主题教育活动有序开展，课堂与实践同步推进",
      "2026-04-05",
      "spring-theme-education",
      "学校围绕春季主题教育组织了课堂学习、校园观察和实践体验三类活动，让学生在真实情境中完成知识理解、表达分享和合作展示。",
      ["主题教育", "课堂实践", "家校协同"],
      "/assets/images/hero-home-2.jpg",
    ),
    createPost(
      "班级展示周启动，学生作品集中亮相校园公共空间",
      "2026-04-01",
      "classroom-showcase-week",
      "班级展示周面向不同年级同步展开，学校将学生作品、班级活动记录和专题学习成果集中布置在公共空间，形成开放式校园展示。",
      ["学生作品", "班级展示", "校园文化"],
      "/assets/images/featured/featured-01.jpg",
    ),
    createPost(
      "家校沟通日顺利举行，形成成长支持合力",
      "2026-03-27",
      "home-school-communication-day",
      "学校通过集中说明、分班交流和个别沟通三种形式开展家校沟通日活动，帮助家长更清楚地了解近期教学安排与学生成长状态。",
      ["家校沟通", "成长支持", "班级交流"],
      "/assets/images/featured/featured-02.jpg",
    ),
    createPost(
      "校园阅读月持续推进，班级阅读氛围进一步提升",
      "2026-03-23",
      "campus-reading-month",
      "阅读月活动继续围绕晨读、共读、分享和展示推进，各年级在班级空间和公共区域同步营造更加稳定的阅读氛围。",
      ["阅读活动", "书香校园", "班级建设"],
      "/assets/images/featured/featured-03.jpg",
    ),
    createPost(
      "学校组织主题升旗活动，强化责任意识与礼仪教育",
      "2026-03-18",
      "flag-raising-ceremony",
      "主题升旗活动以责任意识和文明礼仪为重点，结合学生代表发言、班级倡议与校园常规要求进行集中引导。",
      ["升旗活动", "礼仪教育", "责任意识"],
    ),
    createPost(
      "学生社团阶段展示完成，校园文化生活更加丰富",
      "2026-03-15",
      "student-club-showcase",
      "学生社团在阶段展示中呈现了阅读、艺术、运动和综合实践等不同方向的活动成果，进一步丰富了校园文化生活。",
      ["学生社团", "活动展示", "校园生活"],
    ),
    createPost(
      "后勤服务与校园环境整治同步推进，学习环境持续优化",
      "2026-03-10",
      "campus-environment-optimization",
      "学校围绕教室秩序、公共区域卫生和后勤保障流程同步优化，让教学与日常管理更好地支撑学生在校学习体验。",
      ["后勤服务", "环境优化", "校园治理"],
    ),
    createPost(
      "新学期常规工作平稳启动，课堂秩序与活动安排规范有序",
      "2026-03-03",
      "new-semester-routine",
      "新学期开始后，学校从作息、课程、课堂常规和校园活动四个方面同步推进，确保整体运行平稳有序。",
      ["新学期", "常规管理", "课堂秩序"],
    ),
  ],
  noticePosts: [
    createPost(
      "关于清明节假期安排及安全提醒的通知",
      "2026-04-03",
      "qingming-holiday-notice",
      "根据学校本学期校历安排，现将清明节假期时间、返校要求和假期安全注意事项整理如下，请家长和学生提前做好出行与学习安排。",
      ["放假安排", "返校时间", "安全提醒"],
    ),
    createPost(
      "春季校服与作息时间调整说明",
      "2026-03-29",
      "spring-uniform-schedule-adjustment",
      "结合天气变化和春季教学节奏，学校将对校服穿着建议与日常作息时间进行微调，请家长协助学生按新要求准备。",
      ["作息调整", "校服说明", "家校配合"],
    ),
    createPost(
      "家长开放日活动安排公告",
      "2026-03-20",
      "parent-open-day",
      "学校将按年级分批组织家长开放日，活动包含课堂观摩、班级交流和校园参观，请关注具体入校时间与秩序要求。",
      ["开放日", "入校安排", "课堂观摩"],
    ),
    createPost(
      "校园卫生与文明习惯专项提醒",
      "2026-03-15",
      "campus-health-reminder",
      "近期学校将围绕个人卫生、公共区域维护和文明行为习惯开展专项提醒，请家长与学校形成一致要求。",
      ["卫生习惯", "文明教育", "家校协同"],
    ),
    createPost(
      "关于学生社团报名与课程安排的公告",
      "2026-03-11",
      "club-registration-notice",
      "本学期学生社团将继续按照兴趣方向分组组织，请家长在规定时间内完成报名确认，并关注课程地点与时间安排。",
      ["社团报名", "课程安排", "兴趣培养"],
    ),
    createPost(
      "春季传染病预防与家庭健康管理提醒",
      "2026-03-08",
      "spring-health-management",
      "春季气温波动较大，学校提醒家长关注学生日常作息、个人卫生和身体状态变化，必要时及时与班主任沟通。",
      ["健康管理", "传染病预防", "缺勤沟通"],
    ),
    createPost(
      "学校收费项目及服务事项公示",
      "2026-03-05",
      "fee-disclosure",
      "为便于家长准确了解本学期相关服务事项，现对涉及的收费项目、服务内容和执行口径进行集中公示。",
      ["收费公示", "服务事项", "公开透明"],
    ),
    createPost(
      "本周校园活动安排与家长温馨提示",
      "2026-03-01",
      "weekly-campus-plan",
      "学校对本周主题活动、校园常规安排和家长配合事项做统一提醒，方便家庭提前做好时间与物品准备。",
      ["周计划", "活动提醒", "温馨提示"],
    ),
  ],
  teacherSubjects: [
    {
      name: "语文组",
      slug: "chinese",
      description:
        "聚焦阅读、表达与书香校园建设，后续可继续扩充班主任、阅读骨干与语文活动指导教师资料。",
      note: "当前示例 2 人",
      sortOrder: 1,
    },
    {
      name: "数学组",
      slug: "math",
      description:
        "围绕思维训练、课堂设计和学业评价组织内容，适合按年级逐步补充更多数学教师档案。",
      note: "当前示例 2 人",
      sortOrder: 2,
    },
    {
      name: "英语组",
      slug: "english",
      description:
        "强调口语表达、情境活动与单元整合，可继续补充英语节、口语展示和课程特色内容。",
      note: "当前示例 2 人",
      sortOrder: 3,
    },
    {
      name: "体育组",
      slug: "pe",
      description:
        "突出运动习惯、体能发展与校园赛事组织，后续可继续增加体育社团和训练教师资料。",
      note: "当前示例 2 人",
      sortOrder: 4,
    },
  ],
  teacherProfiles: [
    {
      name: "李清岚",
      slug: "liqinglan",
      subjectSlug: "chinese",
      subjectName: "语文组",
      avatar: "李",
      role: "语文教师 · 班主任 · 任教二、三年级语文",
      shortSummary:
        "注重用故事、绘本和口语表达打开课堂，让学生愿意说、敢于写、乐于阅读。",
      tags: ["阅读教学", "班级管理", "低段语文"],
      philosophy:
        "把阅读兴趣放在前面，把表达能力落到日常课堂里，让学生在愿意说、敢于写的过程中慢慢建立语文自信。",
      highlights: [
        "坚持晨读、绘本共读和小组分享相结合，帮助学生形成稳定阅读习惯。",
        "重视低段识字写字与口语表达的同步推进，降低学生入门焦虑。",
      ],
      growth: [
        "2026年春参加校级语文示范课展示，主题为“整本书阅读导入”。",
        "2025年担任班主任工作交流主讲，分享班级阅读角建设经验。",
      ],
      basicFacts: [
        { label: "任教学科", value: "语文" },
        { label: "任教年级", value: "二、三年级" },
        { label: "工作方向", value: "阅读与表达" },
        { label: "育人关键词", value: "温和、细致、耐心" }
      ],
      honors: ["校级优秀班主任示例教师", "语文组阅读活动组织骨干"],
      sortOrder: 1,
    },
    {
      name: "周语桐",
      slug: "zhouyutong",
      subjectSlug: "chinese",
      subjectName: "语文组",
      avatar: "周",
      role: "语文教师 · 任教四、五年级语文",
      shortSummary:
        "擅长把课堂学习与校园活动结合起来，重视学生观察、表达与习作兴趣培养。",
      tags: ["习作指导", "主题活动", "中段语文"],
      philosophy:
        "把语文学习放进真实生活和校园活动中，让学生在观察、表达与合作中形成更自然的语文能力。",
      highlights: ["习作教学强调“先说后写”。", "注重阅读与习作联动。"],
      growth: ["2026年承担校内习作专题分享。", "2025年参与学校阅读月课程设计。"],
      basicFacts: [
        { label: "任教学科", value: "语文" },
        { label: "任教年级", value: "四、五年级" },
        { label: "工作方向", value: "习作与活动融合" },
        { label: "育人关键词", value: "观察、表达、合作" }
      ],
      honors: ["校级学生作品指导示例教师", "语文活动课程设计骨干教师"],
      sortOrder: 2,
    },
    {
      name: "王晨曦",
      slug: "wangchenxi",
      subjectSlug: "math",
      subjectName: "数学组",
      avatar: "王",
      role: "数学教师 · 教研组成员 · 任教五、六年级数学",
      shortSummary:
        "注重用真实问题带动数学理解，帮助学生建立清晰的数量关系和解题路径。",
      tags: ["思维训练", "单元设计", "高段数学"],
      philosophy:
        "数学课堂不仅要教会解题，更要帮助学生建立分析问题、表达思路和验证结果的完整习惯。",
      highlights: ["强调“说思路、写过程、讲方法”。", "善于用真实问题情境引入新知。"],
      growth: ["2026年主持校级数学单元整体教学交流活动。", "2025年承担数学公开课。"],
      basicFacts: [
        { label: "任教学科", value: "数学" },
        { label: "任教年级", value: "五、六年级" },
        { label: "工作方向", value: "数学思维训练" },
        { label: "育人关键词", value: "严谨、清晰、务实" }
      ],
      honors: ["校级数学示范课执教教师", "高段数学教研骨干成员"],
      sortOrder: 3,
    },
    {
      name: "何思远",
      slug: "hesiyuan",
      subjectSlug: "math",
      subjectName: "数学组",
      avatar: "何",
      role: "数学教师 · 任教一、二年级数学",
      shortSummary:
        "课堂节奏明快，善于把操作活动和口头表达结合，帮助学生把会做题变成会思考。",
      tags: ["低段数学", "课堂活动", "学业评价"],
      philosophy:
        "低段数学更需要动手、动口、动脑结合，通过可操作的活动帮助孩子理解数感和基本关系。",
      highlights: ["使用学具操作、小组讨论和板演分享提升参与度。", "注重课堂反馈的即时性。"],
      growth: ["2026年参与低段数学活动课堂展示。", "2025年承担一年级数学入门课程衔接研究任务。"],
      basicFacts: [
        { label: "任教学科", value: "数学" },
        { label: "任教年级", value: "一、二年级" },
        { label: "工作方向", value: "低段数感培养" },
        { label: "育人关键词", value: "耐心、活泼、细化" }
      ],
      honors: ["低段数学活动设计示例教师", "擅长课堂学具使用与即时评价"],
      sortOrder: 4,
    },
    {
      name: "陈语欣",
      slug: "chenyuxin",
      subjectSlug: "english",
      subjectName: "英语组",
      avatar: "陈",
      role: "英语教师 · 任教三、四年级英语",
      shortSummary:
        "通过歌曲、角色对话和课堂任务激发兴趣，让学生在轻松氛围里开口说英语。",
      tags: ["情境口语", "课堂游戏", "中段英语"],
      philosophy:
        "让孩子先喜欢英语，再逐步建立规范表达。课堂要有情境、有节奏、有鼓励，才能真正让学生愿意开口。",
      highlights: ["通过歌曲、角色扮演和游戏任务提升课堂参与度。", "注重口语表达同步推进。"],
      growth: ["2026年执教校内英语展示课。", "2025年负责校园英语节班级展示组织工作。"],
      basicFacts: [
        { label: "任教学科", value: "英语" },
        { label: "任教年级", value: "三、四年级" },
        { label: "工作方向", value: "口语表达训练" },
        { label: "育人关键词", value: "自信、活力、鼓励" }
      ],
      honors: ["英语活动课展示教师", "校园英语节组织成员"],
      sortOrder: 5,
    },
    {
      name: "刘思妍",
      slug: "liusiyan",
      subjectSlug: "english",
      subjectName: "英语组",
      avatar: "刘",
      role: "英语教师 · 年级备课组成员 · 任教五、六年级英语",
      shortSummary:
        "重视语言积累和表达迁移，善于用任务单和合作活动提升学生参与度。",
      tags: ["单元整合", "书写训练", "高段英语"],
      philosophy:
        "高段英语既要关注基础巩固，也要帮助学生形成完整表达和自主学习能力，让学生敢说、能写、会用。",
      highlights: ["善于用任务单统整听说读写活动。", "重视英语书写与短文表达。"],
      growth: ["2026年参与英语单元整合教学专题交流。", "2025年承担高段英语复习课示范展示任务。"],
      basicFacts: [
        { label: "任教学科", value: "英语" },
        { label: "任教年级", value: "五、六年级" },
        { label: "工作方向", value: "高段整合教学" },
        { label: "育人关键词", value: "规范、清晰、合作" }
      ],
      honors: ["英语备课组核心成员", "擅长单元任务设计与课堂整合"],
      sortOrder: 6,
    },
    {
      name: "张骏",
      slug: "zhangjun",
      subjectSlug: "pe",
      subjectName: "体育组",
      avatar: "张",
      role: "体育教师 · 任教三至六年级体育",
      shortSummary:
        "课堂组织规范，善于通过分层训练提升学生体能，让孩子在运动中建立规则意识。",
      tags: ["田径训练", "队列常规", "校园赛事"],
      philosophy:
        "体育课不仅是体能训练，更是规则意识、合作精神和意志品质培养的重要课堂。",
      highlights: ["课堂组织清楚，重视热身、训练和放松环节。", "根据不同年级设置分层训练任务。"],
      growth: ["2026年参与校运会项目统筹。", "2025年承担体育公开课展示。"],
      basicFacts: [
        { label: "任教学科", value: "体育" },
        { label: "任教年级", value: "三至六年级" },
        { label: "工作方向", value: "体能与常规训练" },
        { label: "育人关键词", value: "自律、坚持、协作" }
      ],
      honors: ["校运会训练组织骨干教师", "擅长田径基础训练与课堂秩序管理"],
      sortOrder: 7,
    },
    {
      name: "杨帆",
      slug: "yangfan",
      subjectSlug: "pe",
      subjectName: "体育组",
      avatar: "杨",
      role: "体育教师 · 少先队活动协作教师 · 任教一至四年级体育",
      shortSummary:
        "注重课堂趣味性与安全规范并重，擅长组织趣味运动会和班级体育活动。",
      tags: ["趣味活动", "体育社团", "安全教育"],
      philosophy:
        "让孩子在有秩序的运动中感受快乐，在快乐中形成习惯，在习惯中建立体能和合作意识。",
      highlights: ["擅长设计趣味运动项目。", "重视体育安全教育和运动规则训练。"],
      growth: ["2026年组织校园趣味运动会项目设计与实施。", "2025年参与低段体育安全教育专题分享。"],
      basicFacts: [
        { label: "任教学科", value: "体育" },
        { label: "任教年级", value: "一至四年级" },
        { label: "工作方向", value: "趣味活动与安全教育" },
        { label: "育人关键词", value: "阳光、规范、合作" }
      ],
      honors: ["校园趣味运动项目组织教师", "擅长低段体育课堂活动设计"],
      sortOrder: 8,
    }
  ],
  campusSpots: [
    {
      key: "overview",
      type: "校园总览",
      name: "南部县第五小学三维导览",
      subtitle: "保持实时渲染，可持续拖拽和切换观察角度",
      description: "当前页面不会停在静态截图，而是持续进行实时渲染。你可以自由拖拽旋转，也可以点击下方视角按钮切换到校门、教学楼、操场或俯瞰观察方式。",
      imageUrl: "/assets/images/hero-home-1.png",
      tags: ["实时渲染", "自由观察", "视角切换"],
      facts: [
        { label: "渲染状态", value: "持续运行" },
        { label: "观察方式", value: "拖拽 / 缩放 / 按钮切换" },
        { label: "布局依据", value: "校园平面示意" }
      ],
      camera: [16, 18, 16],
      target: [0, 0.8, 1.2],
      quickLabel: "总览",
      quickDescription: "俯瞰整体校园关系",
      sortOrder: 0
    },
    {
      key: "gate",
      type: "校园入口",
      name: "校门入口",
      subtitle: "右下角主进入路线的起点视角",
      description: "从校门方向观察整个校园，更接近访客进入校园后的第一印象。",
      imageUrl: "/assets/images/hero-home-1.png",
      tags: ["入口视角", "访客动线", "右下区域"],
      facts: [
        { label: "空间位置", value: "右下角" },
        { label: "适合展示", value: "校门形象 / 导览牌" },
        { label: "观察重点", value: "入校方向" }
      ],
      camera: [17.5, 8.5, 2.8],
      target: [10.2, 0.6, -6.2],
      quickLabel: "校门入口",
      quickDescription: "右下进入校园",
      sortOrder: 1
    },
    {
      key: "teaching",
      type: "教学核心区",
      name: "主教学楼",
      subtitle: "左上 U 形楼体的主观察节点",
      description: "这个节点对应左上区域的 U 形主教学楼，适合继续接入教学空间、班级楼层和课堂照片。",
      imageUrl: "/assets/images/hero-home-2.jpg",
      tags: ["U 形楼", "教学区", "左上区域"],
      facts: [
        { label: "空间位置", value: "左上区域" },
        { label: "建筑形态", value: "U 形楼" },
        { label: "主要功能", value: "课堂教学" }
      ],
      camera: [-8.6, 10.5, 13.6],
      target: [-5.4, 1.3, 6.5],
      quickLabel: "主教学楼",
      quickDescription: "左上 U 形楼",
      sortOrder: 2
    },
    {
      key: "complex",
      type: "综合功能区",
      name: "综合楼",
      subtitle: "右上条形楼体的观察节点",
      description: "这个区域适合承载功能教室、综合教室或行政空间介绍。",
      imageUrl: "/assets/images/hero-home-3.jpg",
      tags: ["条形楼", "右上区域", "功能空间"],
      facts: [
        { label: "空间位置", value: "右上区域" },
        { label: "建筑形态", value: "条形楼" },
        { label: "推荐内容", value: "功能教室介绍" }
      ],
      camera: [12.5, 10.2, 12.8],
      target: [6.9, 1.3, 6.1],
      quickLabel: "综合楼",
      quickDescription: "右上条形楼",
      sortOrder: 3
    },
    {
      key: "library",
      type: "左侧独立楼",
      name: "办公楼",
      subtitle: "左侧小楼体，适合作为办公或教研节点",
      description: "左侧独立楼在整体布局上更适合作为办公楼或教研楼来展示。",
      imageUrl: "/assets/images/featured/featured-03.jpg",
      tags: ["独立楼", "办公空间", "左侧区域"],
      facts: [
        { label: "空间位置", value: "左侧区域" },
        { label: "空间特征", value: "独立楼体" },
        { label: "建议方向", value: "办公 / 教研" }
      ],
      camera: [-15.2, 8.5, 5.8],
      target: [-11.2, 1.1, 0.9],
      quickLabel: "办公楼",
      quickDescription: "左侧独立楼",
      sortOrder: 4
    },
    {
      key: "canteen",
      type: "中部连接区",
      name: "功能馆",
      subtitle: "中间连接体块，可作为功能馆或连廊节点",
      description: "中部这条细长体块适合做成功能馆、连廊或公共服务空间的节点。",
      imageUrl: "/assets/images/featured/featured-02.jpg",
      tags: ["中部区域", "连接节点", "可继续重命名"],
      facts: [
        { label: "空间位置", value: "中部区域" },
        { label: "形态特征", value: "细长连接体块" },
        { label: "后续处理", value: "替换为真实名称" }
      ],
      camera: [2.8, 9.2, 12.6],
      target: [1.5, 1.1, 5.4],
      quickLabel: "功能馆",
      quickDescription: "中间连接体块",
      sortOrder: 5
    },
    {
      key: "playground",
      type: "体育活动区",
      name: "操场",
      subtitle: "下方大面积活动区域的观察节点",
      description: "操场区域适合持续观察体育活动空间关系，也便于后续接入运动会、升旗仪式和课间活动内容。",
      imageUrl: "/assets/images/featured/featured-05.jpg",
      tags: ["下方区域", "体育活动", "开放空间"],
      facts: [
        { label: "空间位置", value: "中下区域" },
        { label: "区域形态", value: "操场 / 活动场地" },
        { label: "适合展示", value: "体育与集会" }
      ],
      camera: [-1.6, 10.5, -15.5],
      target: [-0.8, 0.4, -4.2],
      quickLabel: "操场",
      quickDescription: "下方活动区域",
      sortOrder: 6
    }
  ],
  galleryAlbums: [
    {
      title: "德育主题活动",
      slug: "moral-education",
      summary: "共 33 张照片，记录校园德育与班级展示片段",
      coverImageUrl: "/assets/images/wechat/article_1/img_001_7cca4efaec.jpg",
      externalUrl: "https://mp.weixin.qq.com/s/wLjNuc4UiD6O0Dey4eoiVg",
      selectedCount: 4,
      totalCount: 33,
      photos: [
        { imageUrl: "/assets/images/wechat/article_1/img_001_7cca4efaec.jpg", alt: "德育主题活动照片 1", caption: "活动现场记录" },
        { imageUrl: "/assets/images/wechat/article_1/img_007_99a56db2cc.jpg", alt: "德育主题活动照片 2", caption: "学生参与主题展示" },
        { imageUrl: "/assets/images/wechat/article_1/img_018_f2305fae65.jpg", alt: "德育主题活动照片 3", caption: "活动成果留影" },
        { imageUrl: "/assets/images/wechat/article_1/img_023_b2586cd7f9.jpg", alt: "德育主题活动照片 4", caption: "主题教育场景" }
      ],
      sortOrder: 1
    },
    {
      title: "课堂展示活动",
      slug: "classroom-showcase",
      summary: "共 38 张照片，聚焦课堂互动与学习过程",
      coverImageUrl: "/assets/images/wechat/article_2/img_001_cbb0ded97f.jpg",
      externalUrl: "https://mp.weixin.qq.com/s/U52yG1hCSGYzglo7KpeJOQ",
      selectedCount: 4,
      totalCount: 38,
      photos: [
        { imageUrl: "/assets/images/wechat/article_2/img_001_cbb0ded97f.jpg", alt: "课堂展示活动照片 1", caption: "课堂主题展示" },
        { imageUrl: "/assets/images/wechat/article_2/img_007_d9e01d80a1.jpg", alt: "课堂展示活动照片 2", caption: "学生合作交流" },
        { imageUrl: "/assets/images/wechat/article_2/img_021_fd1358bb24.jpg", alt: "课堂展示活动照片 3", caption: "教学活动留影" },
        { imageUrl: "/assets/images/wechat/article_2/img_022_cb82fedfac.jpg", alt: "课堂展示活动照片 4", caption: "学生专注学习" }
      ],
      sortOrder: 2
    },
    {
      title: "阅读成长活动",
      slug: "reading-growth",
      summary: "共 13 张照片，适合做专题活动的精简展示",
      coverImageUrl: "/assets/images/wechat/article_3/img_001_d478fc0221.jpg",
      externalUrl: "https://mp.weixin.qq.com/s/Lw5EoRGwLx4B6oEsaIw89g",
      selectedCount: 4,
      totalCount: 13,
      photos: [
        { imageUrl: "/assets/images/wechat/article_3/img_001_d478fc0221.jpg", alt: "阅读成长活动照片 1", caption: "阅读活动封面" },
        { imageUrl: "/assets/images/wechat/article_3/img_003_6529fe188d.jpg", alt: "阅读成长活动照片 2", caption: "学生阅读展示" },
        { imageUrl: "/assets/images/wechat/article_3/img_008_a652a2cc3c.jpg", alt: "阅读成长活动照片 3", caption: "学生阅读成果" },
        { imageUrl: "/assets/images/wechat/article_3/img_013_67ad1eadd1.jpg", alt: "阅读成长活动照片 4", caption: "活动合影留念" }
      ],
      sortOrder: 3
    },
    {
      title: "校园实践活动",
      slug: "campus-practice",
      summary: "共 49 张照片，适合集中展示大型活动过程",
      coverImageUrl: "/assets/images/wechat/article_4/img_001_43f846b3b1.jpg",
      externalUrl: "https://mp.weixin.qq.com/s/cBkflob7v2KpM8i6dI3R2g",
      selectedCount: 4,
      totalCount: 49,
      photos: [
        { imageUrl: "/assets/images/wechat/article_4/img_001_43f846b3b1.jpg", alt: "校园实践活动照片 1", caption: "校园活动主画面" },
        { imageUrl: "/assets/images/wechat/article_4/img_025_7b27f422d8.jpg", alt: "校园实践活动照片 2", caption: "学生参与实践" },
        { imageUrl: "/assets/images/wechat/article_4/img_027_9830a714d1.jpg", alt: "校园实践活动照片 3", caption: "班级团队协作" },
        { imageUrl: "/assets/images/wechat/article_4/img_050_f454f2ff33.jpg", alt: "校园实践活动照片 4", caption: "大型活动留影" }
      ],
      sortOrder: 4
    },
    {
      title: "成果展示活动",
      slug: "achievement-showcase",
      summary: "共 55 张照片，便于做学期成果归档展示",
      coverImageUrl: "/assets/images/wechat/article_5/img_001_d39c5dc3dc.jpg",
      externalUrl: "https://mp.weixin.qq.com/s/MIzk3E2MOTyBzAnv423zzg",
      selectedCount: 4,
      totalCount: 55,
      photos: [
        { imageUrl: "/assets/images/wechat/article_5/img_001_d39c5dc3dc.jpg", alt: "成果展示活动照片 1", caption: "成果展示封面" },
        { imageUrl: "/assets/images/wechat/article_5/img_013_5dafd12b70.jpg", alt: "成果展示活动照片 2", caption: "学生成果亮相" },
        { imageUrl: "/assets/images/wechat/article_5/img_023_587dedfdfb.jpg", alt: "成果展示活动照片 3", caption: "学习成果陈列" },
        { imageUrl: "/assets/images/wechat/article_5/img_040_f4ced11470.jpg", alt: "成果展示活动照片 4", caption: "展示活动过程" }
      ],
      sortOrder: 5
    }
  ]
};
