import { AnalysisResult } from "./types";

export interface ExampleCase {
  id: string;
  name: string;
  description: string;
  result: AnalysisResult;
}

export const getExamples = (lang: string = "ko"): ExampleCase[] => {
  return lang === "ko" ? EXAMPLES_KO : EXAMPLES_EN;
};

const EXAMPLES_KO: ExampleCase[] = [
  {
    id: "spring-warm",
    name: "Spring Warm (봄 웜톤)",
    description: "밝고 따뜻하며 생기 넘치는 사랑스러운 스타일",
    result: {
      summary: {
        title: "봄 웜톤 로맨틱 걸",
        keywords: ["러블리", "생기발랄", "따뜻함", "플로럴"],
        description: "당신은 따뜻한 봄 햇살처럼 밝고 생기 넘치는 에너지를 가지고 있습니다. 사랑스럽고 여성스러운 스타일이 당신의 매력을 극대화합니다."
      },
      analysis: {
        colorSeason: "봄 웜톤 (Spring Warm)",
        bodyType: "모래시계형",
        faceShape: "계란형",
        personalityVibe: "밝고 명랑하며 친근함"
      },
      fashion: {
        overview: "파스텔 톤과 부드러운 소재, 플로럴 패턴이 잘 어울립니다. 과한 디테일보다는 은은한 포인트가 좋습니다.",
        tops: "프릴 블라우스, 셔링 티셔츠, 파스텔 니트",
        bottoms: "A라인 스커트, 밝은 데님, 플레어 팬츠",
        outerwear: "트렌치 코트, 카디건, 트위드 재킷",
        shoes: "메리제인 슈즈, 발레 플랫, 샌들",
        accessories: "진주 목걸이, 골드 주얼리, 머리띠",
        colorsToWear: ["피치", "코랄", "아이보리", "옐로우"],
        colorsToAvoid: ["블랙", "차콜", "블루", "퍼플"]
      },
      beauty: {
        overview: "투명하고 맑은 피부 표현과 생기 있는 립 컬러가 핵심입니다.",
        foundation: "촉촉하고 얇은 글로우 파운데이션",
        eyeMakeup: "브라운 음영 섀도우, 얇은 아이라인",
        lipColor: "코랄 핑크, 피치 오렌지 틴트",
        blush: "피치, 살구빛 블러셔",
        hairStyle: "굵은 웨이브, 레이어드 컷",
        hairColor: "밀크 브라운, 초코 브라운"
      },
      actionItems: [
        "옷장에 파스텔 톤이나 아이보리 계열 상의를 더해보세요.",
        "메이크업 시 코랄 컬러 립을 사용하여 생기를 더하세요.",
        "액세서리는 실버보다 골드 톤을 선택하여 피부 톤과 조화를 이루세요.",
        "플로럴 패턴 원피스로 봄의 느낌을 연출해보세요."
      ]
    }
  },
  {
    id: "summer-cool",
    name: "Summer Cool (여름 쿨톤)",
    description: "청량하고 우아하며 세련된 도시적인 스타일",
    result: {
      summary: {
        title: "여름 쿨톤 엘레강스",
        keywords: ["우아함", "청량감", "소프트", "세련됨"],
        description: "부드럽고 시원한 여름의 이미지입니다. 차분하면서도 세련된 분위기가 당신의 트레이드마크입니다."
      },
      analysis: {
        colorSeason: "여름 쿨톤 (Summer Cool)",
        bodyType: "슬림한 직사각형",
        faceShape: "긴 얼굴형",
        personalityVibe: "차분하고 지적인 분위기"
      },
      fashion: {
        overview: "채도가 낮고 명도가 높은 쿨톤 컬러가 잘 어울립니다. 심플하고 깔끔한 라인의 옷을 추천합니다.",
        tops: "실크 셔츠, 린넨 블라우스, 화이트 티셔츠",
        bottoms: "슬랙스, H라인 스커트, 와이드 팬츠",
        outerwear: "린넨 재킷, 그레이 코트, 숏 재킷",
        shoes: "로퍼, 뮬, 스텔레토 힐",
        accessories: "실버 주얼리, 시계, 스카프",
        colorsToWear: ["스카이블루", "라벤더", "그레이", "화이트"],
        colorsToAvoid: ["오렌지", "골드", "카키", "브라운"]
      },
      beauty: {
        overview: "깔끔하고 매트한 피부 표현과 쿨 핑크 계열 포인트가 좋습니다.",
        foundation: "세미 매트 파운데이션",
        eyeMakeup: "모브 핑크, 그레이 브라운 섀도우",
        lipColor: "로즈 핑크, 푸시아 핑크",
        blush: "라벤더, 쿨 핑크 블러셔",
        hairStyle: "긴 생머리, C컬 펌",
        hairColor: "애쉬 브라운, 블랙, 다크 그레이"
      },
      actionItems: [
        "화이트 셔츠나 블라우스로 깔끔한 이미지를 연출해보세요.",
        "립스틱은 오렌지빛이 없는 핑크 계열을 선택하세요.",
        "액세서리는 실버나 화이트 골드 계열이 돋보입니다.",
        "그레이 톤의 재킷으로 지적인 무드를 완성하세요."
      ]
    }
  },
  {
    id: "autumn-warm",
    name: "Autumn Warm (가을 웜톤)",
    description: "깊이 있고 분위기 있는 무드 여신 스타일",
    result: {
      summary: {
        title: "가을 웜톤 무드 여신",
        keywords: ["분위기", "고혹적", "내추럴", "빈티지"],
        description: "깊이 있고 그윽한 가을의 정취를 닮았습니다. 자연스러우면서도 고급스러운 분위기를 자아냅니다."
      },
      analysis: {
        colorSeason: "가을 웜톤 (Autumn Warm)",
        bodyType: "글래머러스",
        faceShape: "각진 얼굴형",
        personalityVibe: "성숙하고 여유로움"
      },
      fashion: {
        overview: "톤 다운된 따뜻한 컬러와 질감이 돋보이는 소재가 잘 어울립니다. 레이어드 룩을 시도해보세요.",
        tops: "터틀넥 니트, 체크 셔츠, 브라운 블라우스",
        bottoms: "코듀로이 팬츠, 롱 스커트, 부츠컷 진",
        outerwear: "트렌치 코트, 가죽 재킷, 야상 점퍼",
        shoes: "앵클 부츠, 워커, 로퍼",
        accessories: "가죽 벨트, 골드 이어링, 페도라",
        colorsToWear: ["브라운", "카키", "머스타드", "베이지"],
        colorsToAvoid: ["블루", "핫핑크", "그레이", "실버"]
      },
      beauty: {
        overview: "매트하고 보송한 피부 표현과 깊이 있는 음영 메이크업이 포인트입니다.",
        foundation: "매트 파운데이션",
        eyeMakeup: "골드 브라운, 레드 브라운 음영",
        lipColor: "칠리 레드, 벽돌색, 누드 베이지",
        blush: "피치 베이지, 오렌지 브라운",
        hairStyle: "굵은 S컬 웨이브, 히피펌",
        hairColor: "다크 브라운, 레드 브라운"
      },
      actionItems: [
        "베이지나 브라운 계열의 톤온톤 코디를 시도해보세요.",
        "말린 장미 컬러의 립스틱으로 분위기를 더하세요.",
        "골드 액세서리와 가죽 아이템을 매치해보세요.",
        "트렌치 코트로 가을 분위기를 한껏 살려보세요."
      ]
    }
  },
  {
    id: "winter-cool",
    name: "Winter Cool (겨울 쿨톤)",
    description: "선명하고 카리스마 있는 모던 시크 스타일",
    result: {
      summary: {
        title: "겨울 쿨톤 모던 시크",
        keywords: ["카리스마", "도시적", "선명함", "콘트라스트"],
        description: "차가운 겨울 바람처럼 강렬하고 선명한 인상을 줍니다. 모던하고 시크한 스타일이 누구보다 잘 어울립니다."
      },
      analysis: {
        colorSeason: "겨울 쿨톤 (Winter Cool)",
        bodyType: "직선적인 체형",
        faceShape: "샤프한 얼굴형",
        personalityVibe: "도도하고 세련됨"
      },
      fashion: {
        overview: "블랙&화이트의 대비가 강한 스타일이나 비비드한 원색 포인트가 잘 어울립니다. 깔끔하고 딱 떨어지는 핏을 추천합니다.",
        tops: "블랙 터틀넥, 화이트 셔츠, 비비드한 니트",
        bottoms: "블랙 슬랙스, 가죽 스커트, 다크 데님",
        outerwear: "블랙 코트, 퍼 재킷, 블레이저",
        shoes: "워커, 롱 부츠, 펌프스 힐",
        accessories: "볼드한 실버 주얼리, 선글라스",
        colorsToWear: ["블랙", "화이트", "로얄블루", "버건디"],
        colorsToAvoid: ["베이지", "오렌지", "브라운", "카키"]
      },
      beauty: {
        overview: "잡티 없는 깨끗한 피부 표현과 립 포인트 메이크업이 베스트입니다.",
        foundation: "밝고 화사한 세미 매트 파운데이션",
        eyeMakeup: "깔끔한 아이라인, 실버 펄 섀도우",
        lipColor: "레드, 플럼, 딥 와인",
        blush: "생략하거나 아주 연한 라벤더",
        hairStyle: "칼단발, 흑발 생머리, 포니테일",
        hairColor: "블루 블랙, 딥 블랙"
      },
      actionItems: [
        "블랙 앤 화이트 룩으로 깔끔하고 시크한 매력을 뽐내보세요.",
        "레드 립스틱 하나로 강렬한 포인트를 주세요.",
        "볼드한 실버 액세서리로 화려함을 더하세요.",
        "직선적인 실루엣의 재킷을 활용해보세요."
      ]
    }
  }
];

const EXAMPLES_EN: ExampleCase[] = [
  {
    id: "spring-warm",
    name: "Spring Warm",
    description: "Bright, warm, and lively lovely style",
    result: {
      summary: {
        title: "Spring Warm Romantic Girl",
        keywords: ["Lovely", "Lively", "Warm", "Floral"],
        description: "You have bright and lively energy like warm spring sunshine. Lovely and feminine style maximizes your charm."
      },
      analysis: {
        colorSeason: "Spring Warm",
        bodyType: "Hourglass",
        faceShape: "Oval",
        personalityVibe: "Bright, cheerful, and friendly"
      },
      fashion: {
        overview: "Pastel tones, soft fabrics, and floral patterns suit you well. Subtle points are better than excessive details.",
        tops: "Frill blouse, shirring t-shirt, pastel knit",
        bottoms: "A-line skirt, bright denim, flare pants",
        outerwear: "Trench coat, cardigan, tweed jacket",
        shoes: "Mary Jane shoes, ballet flats, sandals",
        accessories: "Pearl necklace, gold jewelry, headband",
        colorsToWear: ["Peach", "Coral", "Ivory", "Yellow"],
        colorsToAvoid: ["Black", "Charcoal", "Blue", "Purple"]
      },
      beauty: {
        overview: "Transparent and clear skin expression and lively lip color are key.",
        foundation: "Moist and thin glow foundation",
        eyeMakeup: "Brown shading shadow, thin eyeliner",
        lipColor: "Coral pink, peach orange tint",
        blush: "Peach, apricot blush",
        hairStyle: "Thick waves, layered cut",
        hairColor: "Milk brown, choco brown"
      },
      actionItems: [
        "Add pastel tone or ivory tops to your wardrobe.",
        "Use coral color lip to add vitality when doing makeup.",
        "Choose gold tone accessories over silver to match your skin tone.",
        "Create a spring feel with a floral pattern dress."
      ]
    }
  },
  {
    id: "summer-cool",
    name: "Summer Cool",
    description: "Cool, elegant, and sophisticated urban style",
    result: {
      summary: {
        title: "Summer Cool Elegance",
        keywords: ["Elegance", "Cool", "Soft", "Sophisticated"],
        description: "Soft and cool image of summer. A calm yet sophisticated atmosphere is your trademark."
      },
      analysis: {
        colorSeason: "Summer Cool",
        bodyType: "Slim Rectangle",
        faceShape: "Long",
        personalityVibe: "Calm and intellectual"
      },
      fashion: {
        overview: "Cool tones with low saturation and high brightness suit you well. Simple and clean lines are recommended.",
        tops: "Silk shirt, linen blouse, white t-shirt",
        bottoms: "Slacks, H-line skirt, wide pants",
        outerwear: "Linen jacket, gray coat, short jacket",
        shoes: "Loafers, mules, stiletto heels",
        accessories: "Silver jewelry, watch, scarf",
        colorsToWear: ["Sky Blue", "Lavender", "Gray", "White"],
        colorsToAvoid: ["Orange", "Gold", "Khaki", "Brown"]
      },
      beauty: {
        overview: "Clean and matte skin expression and cool pink points are good.",
        foundation: "Semi-matte foundation",
        eyeMakeup: "Mauve pink, gray brown shadow",
        lipColor: "Rose pink, fuchsia pink",
        blush: "Lavender, cool pink blush",
        hairStyle: "Long straight hair, C-curl perm",
        hairColor: "Ash brown, black, dark gray"
      },
      actionItems: [
        "Create a clean image with a white shirt or blouse.",
        "Choose pink lipsticks without orange tones.",
        "Silver or white gold accessories stand out.",
        "Complete an intellectual mood with a gray tone jacket."
      ]
    }
  },
  {
    id: "autumn-warm",
    name: "Autumn Warm",
    description: "Deep and atmospheric mood goddess style",
    result: {
      summary: {
        title: "Autumn Warm Mood Goddess",
        keywords: ["Atmospheric", "Alluring", "Natural", "Vintage"],
        description: "Resembles the deep and rich sentiment of autumn. Creates a natural yet luxurious atmosphere."
      },
      analysis: {
        colorSeason: "Autumn Warm",
        bodyType: "Glamorous",
        faceShape: "Angled",
        personalityVibe: "Mature and relaxed"
      },
      fashion: {
        overview: "Toned-down warm colors and textured fabrics suit you well. Try a layered look.",
        tops: "Turtleneck knit, check shirt, brown blouse",
        bottoms: "Corduroy pants, long skirt, bootcut jeans",
        outerwear: "Trench coat, leather jacket, field jacket",
        shoes: "Ankle boots, walkers, loafers",
        accessories: "Leather belt, gold earrings, fedora",
        colorsToWear: ["Brown", "Khaki", "Mustard", "Beige"],
        colorsToAvoid: ["Blue", "Hot Pink", "Gray", "Silver"]
      },
      beauty: {
        overview: "Matte and soft skin expression and deep shading makeup are points.",
        foundation: "Matte foundation",
        eyeMakeup: "Gold brown, red brown shading",
        lipColor: "Chili red, brick, nude beige",
        blush: "Peach beige, orange brown",
        hairStyle: "Thick S-curl waves, hippie perm",
        hairColor: "Dark brown, red brown"
      },
      actionItems: [
        "Try tone-on-tone coordination with beige or brown tones.",
        "Add atmosphere with dried rose colored lipstick.",
        "Match gold accessories with leather items.",
        "Maximize the autumn vibe with a trench coat."
      ]
    }
  },
  {
    id: "winter-cool",
    name: "Winter Cool",
    description: "Vivid and charismatic modern chic style",
    result: {
      summary: {
        title: "Winter Cool Modern Chic",
        keywords: ["Charisma", "Urban", "Vivid", "Contrast"],
        description: "Gives a strong and vivid impression like cold winter wind. Modern and chic style suits you better than anyone."
      },
      analysis: {
        colorSeason: "Winter Cool",
        bodyType: "Linear",
        faceShape: "Sharp",
        personalityVibe: "Haughty and sophisticated"
      },
      fashion: {
        overview: "Strong contrast of black & white or vivid primary color points suit well. Clean and perfectly fitting fit is recommended.",
        tops: "Black turtleneck, white shirt, vivid knit",
        bottoms: "Black slacks, leather skirt, dark denim",
        outerwear: "Black coat, fur jacket, blazer",
        shoes: "Walkers, long boots, pumps heels",
        accessories: "Bold silver jewelry, sunglasses",
        colorsToWear: ["Black", "White", "Royal Blue", "Burgundy"],
        colorsToAvoid: ["Beige", "Orange", "Brown", "Khaki"]
      },
      beauty: {
        overview: "Clear skin without blemishes and lip point makeup are best.",
        foundation: "Bright and radiant semi-matte foundation",
        eyeMakeup: "Clean eyeliner, silver pearl shadow",
        lipColor: "Red, plum, deep wine",
        blush: "Skip or very light lavender",
        hairStyle: "Bob cut, black straight hair, ponytail",
        hairColor: "Blue black, deep black"
      },
      actionItems: [
        "Show off clean and chic charm with a black and white look.",
        "Give a strong point with just red lipstick.",
        "Add glamor with bold silver accessories.",
        "Utilize a jacket with a linear silhouette."
      ]
    }
  }
];
