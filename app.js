// STATE MANAGEMENT
let state = {
    records: [],
    employees: [], // { maNV, tenNV, to }
    selectedMonth: 'all',
    dashboardSelectedMonth: 'all',
    filters: {
        searchName: '',
        searchId: '',
        searchTeam: ''
    },
    apiUrl: localStorage.getItem('reward_api_url') || 'https://script.google.com/macros/s/AKfycbyjB80DEs4THeZmo_sHF9hBo_q_-U5mE4ixU8EJW910kjIXP7HJavrfmKYXn2n4-x9g/exec',
    isLive: false,
    sort: {
        key: 'STT',
        direction: 'asc'
    },
    lockedMonths: [],
    isAdmin: false
};

// INITIAL MOCK DATA (Lấy từ sheet thực tế của người dùng và bổ sung mẫu)
const MOCK_EMPLOYEES = [
    {
        "maNV": "VNPT018256",
        "tenNV": "Nguyễn Công Hoan",
        "to": "Ban Giám đốc"
    },
    {
        "maNV": "VNPT017946",
        "tenNV": "Nguyễn Minh Cường",
        "to": "Ban Giám đốc"
    },
    {
        "maNV": "VNPT018467",
        "tenNV": "Nguyễn Trung Kiên",
        "to": "Ban Giám đốc"
    },
    {
        "maNV": "VNPT018451",
        "tenNV": "Nguyễn Tiến Thành",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018452",
        "tenNV": "Trần Công Lộc",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018469",
        "tenNV": "Nguyễn Anh Tuấn",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018477",
        "tenNV": "Nguyễn Văn Trường",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018478",
        "tenNV": "Lã Minh Tuấn",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018479",
        "tenNV": "Bùi Văn Tình",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018480",
        "tenNV": "Nguyễn Đức Mạnh",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018481",
        "tenNV": "Hoàng Trung Kiên",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018482",
        "tenNV": "Lê Đức Hạnh",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018489",
        "tenNV": "Hoàng Mai Nam",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018496",
        "tenNV": "Hoàng Trung Dũng",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018501",
        "tenNV": "Vũ Mạnh Tuấn",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018526",
        "tenNV": "Lương Ngọc Khánh",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018530",
        "tenNV": "Bùi Chính Hữu",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018536",
        "tenNV": "Ngô Mạnh Cường",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018589",
        "tenNV": "Lê Anh Dũng",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018449",
        "tenNV": "Đỗ Chu Đằng",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "VNPT018429",
        "tenNV": "Bùi Văn Bản",
        "to": "Tổ Hạ tầng Lạc Sơn"
    },
    {
        "maNV": "VNPT018473",
        "tenNV": "Kiều Toàn",
        "to": "Tổ Hạ tầng Lạc Sơn"
    },
    {
        "maNV": "VNPT018571",
        "tenNV": "Hà Tuấn Lương",
        "to": "Tổ Hạ tầng Lạc Sơn"
    },
    {
        "maNV": "VNPT018568",
        "tenNV": "Phạm Trung Thành",
        "to": "Tổ Hạ tầng Lạc Sơn"
    },
    {
        "maNV": "VNPT018410",
        "tenNV": "Bùi Đăng Thành",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "VNPT018549",
        "tenNV": "Phùng Thế Hậu",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "VNPT018552",
        "tenNV": "Vương Xuân Tiến",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "VNPT018558",
        "tenNV": "Bạch Công Tường",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "VNPT018566",
        "tenNV": "Phạm Anh Tuấn",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "VNPT018551",
        "tenNV": "Phùng Thế Nam",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "VNPT018553",
        "tenNV": "Vũ Mạnh Khương",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "VNPT018113",
        "tenNV": "Dương Văn Dần",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "VNPT018130",
        "tenNV": "Nguyễn Văn Đài",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "VNPT018139",
        "tenNV": "Phan Việt Hùng",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "VNPT018140",
        "tenNV": "Nguyễn Công Chương",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "VNPT018143",
        "tenNV": "Lê Huy Sơn",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "VNPT018147",
        "tenNV": "Lê Quang Tiến",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "VNPT018239",
        "tenNV": "Bùi Trung Thành",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "VNPT018259",
        "tenNV": "Ngô Tiến Mạnh",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "VNPT018168",
        "tenNV": "Nguyễn Minh Chí",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "VNPT018220",
        "tenNV": "Phan Tiến Dũng",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "VNPT018221",
        "tenNV": "Trần Anh Tuấn",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "VNPT018246",
        "tenNV": "Nguyễn Xuân Huy",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "VNPT018247",
        "tenNV": "Trần Anh Quân",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "VNPT018248",
        "tenNV": "Lê Minh Thuyết",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "VNPT018518",
        "tenNV": "Nguyễn Văn Liệu",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "VNPT018576",
        "tenNV": "Bùi Văn Kiểm",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "VNPT018577",
        "tenNV": "Bùi Thanh Quang",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "VNPT018593",
        "tenNV": "Hà Văn Huẩn",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "VNPT018594",
        "tenNV": "Lò Văn Sơn",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "VNPT018472",
        "tenNV": "Hoàng Minh Tuấn",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "VNPT018419",
        "tenNV": "Bùi Văn Chung",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "VNPT017817",
        "tenNV": "Đỗ Tiến Thịnh",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "VNPT017847",
        "tenNV": "Nguyễn Viết Tuân",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "VNPT017868",
        "tenNV": "Trần Trọng Nghĩa",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "VNPT017886",
        "tenNV": "Hà Khương Duy",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "VNPT017920",
        "tenNV": "Trần Tuyên",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "VNPT017953",
        "tenNV": "Hà Trí Kiên",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "VNPT017873",
        "tenNV": "Ngô Minh Tuấn",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "VNPT017900",
        "tenNV": "Nguyễn Trung Ánh",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "VNPT017935",
        "tenNV": "Nguyễn Thành Long",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "VNPT017940",
        "tenNV": "Nguyễn Tuấn Anh",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "VNPT017945",
        "tenNV": "Tạ Tuấn Linh",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "VNPT017905",
        "tenNV": "Chúc Mạnh Sơn",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "VNPT017827",
        "tenNV": "Phùng Quang Hưng",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017830",
        "tenNV": "Trần Minh Tuấn",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017854",
        "tenNV": "Nguyễn Minh Trí",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017858",
        "tenNV": "Nguyễn Hữu Quân",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017859",
        "tenNV": "Nguyễn Anh Vũ",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017911",
        "tenNV": "Lê Trung Kiên",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017912",
        "tenNV": "Trần Thành Trung",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017925",
        "tenNV": "Đỗ Ngọc Sơn",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017926",
        "tenNV": "Nguyễn Mạnh Hà",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017959",
        "tenNV": "Nguyễn Văn Sâm",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017960",
        "tenNV": "Trần Hữu Lợi",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT018254",
        "tenNV": "Cao Văn Huy",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT017962",
        "tenNV": "Chử Hồng Thái",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "VNPT018110",
        "tenNV": "Kiều Phúc Tuấn",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018111",
        "tenNV": "Phạm Minh Phú",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018112",
        "tenNV": "Lê Văn Trường",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018119",
        "tenNV": "Hoàng Xuân Sửu",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018191",
        "tenNV": "Khổng Doãn Anh",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018202",
        "tenNV": "Nguyễn Mạnh Hùng",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018249",
        "tenNV": "Nguyễn Xuân Hoàn",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018252",
        "tenNV": "Lưu Văn Dương",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018250",
        "tenNV": "Trần Duy Hưng",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "VNPT018454",
        "tenNV": "Nguyễn Trung Kiên",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Hoà Bình"
    },
    {
        "maNV": "VNPT018471",
        "tenNV": "Nguyễn Mạnh Cường",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Hoà Bình"
    },
    {
        "maNV": "VNPT018542",
        "tenNV": "Bùi Đỗ Anh",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Hoà Bình"
    },
    {
        "maNV": "VNPT018468",
        "tenNV": "Nguyễn Thị Ánh Tuyết",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Hoà Bình"
    },
    {
        "maNV": "VNPT017955",
        "tenNV": "Nguyễn Trường Giang",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Phú Thọ"
    },
    {
        "maNV": "VNPT017957",
        "tenNV": "Lê Anh Tuấn",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Phú Thọ"
    },
    {
        "maNV": "VNPT017958",
        "tenNV": "Đào Quốc Khánh",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Phú Thọ"
    },
    {
        "maNV": "VNPT017967",
        "tenNV": "Ngô Duy Duyệt",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Phú Thọ"
    },
    {
        "maNV": "VNPT017954",
        "tenNV": "Trần Xuân Trường",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Phú Thọ"
    },
    {
        "maNV": "VNPT018244",
        "tenNV": "Phùng Văn Thọ",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Vĩnh Phúc"
    },
    {
        "maNV": "VNPT018245",
        "tenNV": "Đỗ Đức Hoàng",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Vĩnh Phúc"
    },
    {
        "maNV": "VNPT017963",
        "tenNV": "Lương Khánh Toàn",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT017964",
        "tenNV": "Hà Thị Lý",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT017973",
        "tenNV": "Lê Đức Anh",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018234",
        "tenNV": "Trần Nam Trung",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT017814",
        "tenNV": "Cao Bá Khiêm",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT017947",
        "tenNV": "Đặng Hồng Quân",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT017948",
        "tenNV": "Nguyễn Mạnh Cường",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT017951",
        "tenNV": "Nguyễn Hữu Lâm",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT017961",
        "tenNV": "Đỗ Đức Phương",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018095",
        "tenNV": "Nguyễn Anh Dũng",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018229",
        "tenNV": "Nguyễn Mạnh Hà",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018236",
        "tenNV": "Nguyễn Văn Phây",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018241",
        "tenNV": "Trần Ngọc Ánh",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018255",
        "tenNV": "Nguyễn Trọng Thái",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018470",
        "tenNV": "Đỗ Tuấn Anh",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018483",
        "tenNV": "Dương Văn Nam",
        "to": "Tổ Khai thác Hệ thống Phú Thọ"
    },
    {
        "maNV": "VNPT018275",
        "tenNV": "Vũ Thị Lan Phương",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT017797",
        "tenNV": "Hà Mạnh Hùng",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT017801",
        "tenNV": "Đỗ Văn Tuấn",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT017811",
        "tenNV": "Đỗ Quang Thanh",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT017956",
        "tenNV": "Nguyễn Thu Trang",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018090",
        "tenNV": "Trần Văn Minh",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018091",
        "tenNV": "Nguyễn Đức Lượng",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018092",
        "tenNV": "Nguyễn Văn Luận",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018106",
        "tenNV": "Nguyễn Thị Thúy",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018231",
        "tenNV": "Nguyễn Cao Cường",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018233",
        "tenNV": "Nguyễn Thị Phương Anh",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018243",
        "tenNV": "Lê Hồng Minh",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018251",
        "tenNV": "Vương Văn Trung",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018253",
        "tenNV": "Nguyễn Quốc An",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018278",
        "tenNV": "Trần Tiến Giang",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018345",
        "tenNV": "Ngô Thị Anh",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018369",
        "tenNV": "Phạm Đức Thuận",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018465",
        "tenNV": "Trần Thị Thủy",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018488",
        "tenNV": "Lê Minh Hưởng",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018528",
        "tenNV": "Bùi Văn Lản",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018531",
        "tenNV": "Hoàng Quốc Bình",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "VNPT018532",
        "tenNV": "Nguyễn Mạnh Việt",
        "to": "Tổ Tổng hợp"
    },
    {
        "maNV": "CTV036461",
        "tenNV": "Xa Văn Thực",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "CTV078681",
        "tenNV": "Ngô thành Chung",
        "to": "Tổ Hạ tầng Hòa Bình"
    },
    {
        "maNV": "CTV029433",
        "tenNV": "Nguyễn Trường Sơn",
        "to": "Tổ Hạ tầng Lạc Sơn"
    },
    {
        "maNV": "CTV046560",
        "tenNV": "Bùi Văn Đông",
        "to": "Tổ Hạ tầng Lạc Sơn"
    },
    {
        "maNV": "CTV082727",
        "tenNV": "Bùi Văn Giang",
        "to": "Tổ Hạ tầng Lạc Sơn"
    },
    {
        "maNV": "CTV084214",
        "tenNV": "Bùi Văn Nhất",
        "to": "Tổ Hạ tầng Lạc Sơn"
    },
    {
        "maNV": "CTV029416",
        "tenNV": "Nguyễn Minh Thắng",
        "to": "Tổ Hạ tầng Lạc Thủy"
    },
    {
        "maNV": "CTV029417",
        "tenNV": "Hà Công Thảo",
        "to": "Tổ Hạ tầng Lạc Thủy"
    },
    {
        "maNV": "CTV029382",
        "tenNV": "Bùi Đình Đông",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "CTV036469",
        "tenNV": "Nguyễn Văn Thi",
        "to": "Tổ Hạ tầng Lương Sơn"
    },
    {
        "maNV": "CTV042439",
        "tenNV": "Mai Đức Nam",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "CTV069928",
        "tenNV": "Nguyễn Minh Tuấn",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "CTV086512",
        "tenNV": "Nguyễn Đức Hoàn",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "CTV091159",
        "tenNV": "Đỗ Quang Trung",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "CTV091160",
        "tenNV": "Nguyễn Thanh Giang",
        "to": "Tổ Hạ tầng Phúc Yên"
    },
    {
        "maNV": "CTV042460",
        "tenNV": "Hoàng Đức Hữu",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV062418",
        "tenNV": "Lê Thế Long",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV070708",
        "tenNV": "Hà Đình Tiến",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV071925",
        "tenNV": "Lê Tiến Chức",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV082862",
        "tenNV": "Nguyễn Văn Thành",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV084669",
        "tenNV": "Nguyễn Ngọc Dương",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV086297",
        "tenNV": "Nguyễn Ngọc Linh",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV086774",
        "tenNV": "Nguyễn Văn Trại",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV086776",
        "tenNV": "Nguyễn Duy Mạnh",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV091462",
        "tenNV": "Lê Văn Hưng",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV091463",
        "tenNV": "Nguyễn Văn Lợi",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV092750",
        "tenNV": "Trần Đăng",
        "to": "Tổ Hạ tầng Tam Đảo"
    },
    {
        "maNV": "CTV029418",
        "tenNV": "Bùi Hoàng Thương",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "CTV029427",
        "tenNV": "Khà Xuân Khuê",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "CTV029428",
        "tenNV": "Đào Sỹ Lâm",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "CTV079748",
        "tenNV": "Bùi Văn Tân",
        "to": "Tổ Hạ tầng Tân Lạc"
    },
    {
        "maNV": "CTV066417",
        "tenNV": "Trần Duy Hiển",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "CTV074204",
        "tenNV": "Hà Văn Nguyên",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "CTV080480",
        "tenNV": "Đỗ Tiến Thành",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "CTV081921",
        "tenNV": "Nguyễn Tiến Tùng",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "CTV091488",
        "tenNV": "Dương Mạnh Hải",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "CTV092075",
        "tenNV": "Nguyễn Quang Thuận",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "CTV092128",
        "tenNV": "Nguyễn Long Giang",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "CTV092464",
        "tenNV": "Hà Xuân Long",
        "to": "Tổ Hạ tầng Thanh Ba"
    },
    {
        "maNV": "CTV069549",
        "tenNV": "Hoàng Đình Luân",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV084971",
        "tenNV": "Phùng Văn Hà",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV087334",
        "tenNV": "Nguyễn Anh Tuấn",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV091489",
        "tenNV": "Hà Văn Vinh",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV091543",
        "tenNV": "Trần Văn Lâm",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV092039",
        "tenNV": "Nguyễn Văn Thắng",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV092620",
        "tenNV": "Nguyễn Tiến Dần",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV092623",
        "tenNV": "Phạm Hoàng Cương",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV092866",
        "tenNV": "Nguyễn Quang Ngọc",
        "to": "Tổ Hạ tầng Thanh Sơn"
    },
    {
        "maNV": "CTV036557",
        "tenNV": "Bùi Anh Tuấn",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "CTV039486",
        "tenNV": "Nguyễn Bảo Linh",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "CTV091885",
        "tenNV": "Đỗ Thành Ba",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "CTV092074",
        "tenNV": "Nguyễn Đình Nam",
        "to": "Tổ Hạ tầng Việt Trì"
    },
    {
        "maNV": "CTV082815",
        "tenNV": "Bùi Quốc Tuấn",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV085395",
        "tenNV": "Nguyễn Quang Nam",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV086410",
        "tenNV": "Nguyễn Hữu Ước",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV087513",
        "tenNV": "Nguyễn Văn Nam",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV088063",
        "tenNV": "Ôn Đức Phương",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV088389",
        "tenNV": "Đinh Quang Hải",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV090324",
        "tenNV": "Hoàng Văn Tú",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV091280",
        "tenNV": "Lê Anh Tuấn",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV092027",
        "tenNV": "Đặng Văn Dự",
        "to": "Tổ Hạ tầng Vĩnh Yên"
    },
    {
        "maNV": "CTV092097",
        "tenNV": "Ngô Thượng Cương",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Phú Thọ"
    },
    {
        "maNV": "CTV068057",
        "tenNV": "Nguyễn Tuấn Linh",
        "to": "Tổ Hỗ trợ Khách hàng Vip site Vĩnh Phúc"
    },
    {
        "maNV": "CTV029466",
        "tenNV": "Phan Nguyên Long",
        "to": "Tổ Tổng hợp"
    }
];

const MOCK_RECORDS = [
    {
        "STT": 1,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 160,
        "Tiền thưởng": 800000,
        "Lý do": "Thực hiện điều động ứng cứu xử lý sự cố nguồn trạm BXN012 từ 17h30 đến 22h00 ngày 19/07/2025; Trực bão số 3 WIPHA đêm 21-22/07/2025; Sửa máy nổ trạm Tân Long",
        "Thời điểm": "2026-05-19 22:00:00"
    },
    {
        "STT": 2,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 80,
        "Tiền thưởng": 400000,
        "Lý do": "Thực hiện BCĐ PCTT VTT trực đảm bảo cơn bão số 3 WIPHA đêm 22-23/07/2025; Tăng cường đo Drivingtest CSHT mới địa bàn tỉnh ngày 27-30/07/2025",
        "Thời điểm": "2026-05-23 02:00:00"
    },
    {
        "STT": 3,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 120,
        "Tiền thưởng": 600000,
        "Lý do": "Thực hiện điều động ứng cứu sự cố đổ cột đứt cáp 24fo 48fo Vĩnh Yên - Tam Dương từ 17h00 đến 00h30 ngày 19/07/2025",
        "Thời điểm": "2026-05-19 23:30:00"
    },
    {
        "STT": 4,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 230,
        "Tiền thưởng": 1150000,
        "Lý do": "Phối hợp cùng Kasati, INOC đấu chuyển dồn dịch port để thực hiện nâng cấp mạng MANE 19 tại Chùa Hà, nâng cấp Ring 13 ngày 02/07/2025",
        "Thời điểm": "2026-05-02 18:00:00"
    },
    {
        "STT": 5,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 210,
        "Tiền thưởng": 1050000,
        "Lý do": "Phối hợp cùng TTVT Phúc Yên triển khai làm hạ tầng mạng LAN tại bệnh viện K74 TW ngày 10-12/07/2025",
        "Thời điểm": "2026-05-12 17:30:00"
    },
    {
        "STT": 6,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018221",
        "Tên Nhân viên": "Trần Anh Tuấn",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 180,
        "Tiền thưởng": 900000,
        "Lý do": "Hỗ trợ lắp đặt thiết bị MAN-E và cấu hình định tuyến cho trạm viễn thông trung tâm Vĩnh Yên",
        "Thời điểm": "2026-05-10 16:45:00"
    },
    {
        "STT": 7,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018222",
        "Tên Nhân viên": "Trần Thị Bình",
        "Tổ": "Tổ Kỹ thuật Nghiệp vụ",
        "Điểm khuyến khích": 100,
        "Tiền thưởng": 500000,
        "Lý do": "Xử lý hồ sơ nghiệm thu kỹ thuật và lập quyết toán các công trình hạ tầng mạng lưới đợt 1 năm 2026",
        "Thời điểm": "2026-05-15 15:00:00"
    },
    {
        "STT": 8,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018223",
        "Tên Nhân viên": "Lê Hoàng Châu",
        "Tổ": "Tổ Hạ tầng Bình Xuyên",
        "Điểm khuyến khích": 150,
        "Tiền thưởng": 750000,
        "Lý do": "Tăng cường ứng cứu khắc phục đứt cáp quang trục chính liên huyện ngày nghỉ cuối tuần 24/05/2026",
        "Thời điểm": "2026-05-24 11:30:00"
    }
];

// CHART INSTANCES
let teamChart = null;
let employeeChart = null;

// DOM ELEMENTS & INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

// INITIALIZE APP
async function initApp() {
    // Kiểm tra cờ admin trong URL (?admin=true hoặc #admin)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || window.location.hash.includes('admin')) {
        localStorage.setItem('admin_mode', 'true');
    }
    
    // Gán trạng thái admin từ LocalStorage
    state.isAdmin = localStorage.getItem('admin_mode') === 'true';
    
    // Điều khiển ẩn/hiện nút "Khóa Chốt Tháng" dựa trên cờ Admin
    const settingsBtn = document.getElementById('btn-open-settings');
    if (settingsBtn) {
        settingsBtn.style.display = state.isAdmin ? 'flex' : 'none';
    }

    loadLocalSettings();
    
    // 1. Tải dữ liệu đệm từ LocalStorage hoặc Mock trước để giao diện hiển thị ngay lập tức (Dưới 0.1s)
    loadMockData();
    extractEmployeeDatabase();
    populateMonthSelectors();
    updateUI();
    
    // 2. Kích hoạt xử lý định tuyến theo Hash ngay tức thì
    handleHashRouting();
    
    // 3. Tiến hành đồng bộ dữ liệu ngầm song song không gây chặn UI
    fetchLiveSyncInBackground();
}

// Tiến trình đồng bộ dữ liệu ngầm bất đồng bộ song song
async function fetchLiveSyncInBackground() {
    try {
        // Đồng bộ danh bạ nhân viên từ sheet trước
        await fetchDanhBaLive();
        // Cập nhật gợi ý autocomplete dựa trên danh bạ vừa tải về
        extractEmployeeDatabase();
        updateUI();
    } catch (e) {
        console.error("Lỗi đồng bộ danh bạ ngầm:", e);
    }
    
    try {
        // Đồng bộ các bản ghi khen thưởng thực tế từ Google Sheets
        await refreshData(false);
    } catch (e) {
        console.error("Lỗi đồng bộ khen thưởng ngầm:", e);
    }
}

// FETCH DANH BẠ TRỰC TIẾP TỪ SHEET MÀ KHÔNG CẦN CHỜ GOOGLE APPS SCRIPT API
async function fetchDanhBaLive() {
    try {
        const url = "https://docs.google.com/spreadsheets/d/1GlFBYQm7aWxpB0Uh7iekskhWy2o0nhxNbmcOSNU5oCY/gviz/tq?tqx=out:csv&sheet=danhba";
        const res = await fetch(url);
        if (!res.ok) return;
        const csvText = await res.text();
        
        const lines = csvText.split('\n');
        const liveEmployees = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 4) {
                const to = cols[1];
                const maNV = cols[2];
                const tenNV = cols[3];
                if (maNV && tenNV) {
                    liveEmployees.push({ maNV, tenNV, to });
                }
            }
        }
        if (liveEmployees.length > 0) {
            // Ghi đè vào MOCK_EMPLOYEES để chạy offline/demo mượt mà với dữ liệu thật
            MOCK_EMPLOYEES.length = 0;
            MOCK_EMPLOYEES.push(...liveEmployees);
            state.employees = [...liveEmployees];
        }
    } catch(e) {
        console.error("Không thể tải danh bạ trực tiếp", e);
    }
}

// HÀM TRỢ GIÚP LẤY THÁNG TRƯỚC MẶC ĐỊNH (ĐỊNH DẠNG TTrrrr)
function getDefaultMonthFormatted() {
    const now = new Date();
    let prevMonth = now.getMonth(); // 0-indexed, so 0 is Jan (which means it defaults to last month's index)
    let prevYear = now.getFullYear();
    if (prevMonth === 0) { // Nếu là tháng 1, tháng trước là tháng 12 năm trước
        prevMonth = 12;
        prevYear -= 1;
    }
    return prevMonth + "" + prevYear;
}

// LOAD SETTINGS FROM LOCALSTORAGE
function loadLocalSettings() {
    const defaultUrl = 'https://script.google.com/macros/s/AKfycbyjB80DEs4THeZmo_sHF9hBo_q_-U5mE4ixU8EJW910kjIXP7HJavrfmKYXn2n4-x9g/exec';
    const savedUrl = localStorage.getItem('reward_api_url');
    state.apiUrl = savedUrl || defaultUrl;
    
    const apiUrlInput = document.getElementById('api-url-input');
    if (apiUrlInput) {
        apiUrlInput.value = state.apiUrl;
    }
    
    // Tự động điền tháng trước vào form nhập (vì đa phần sẽ nhập quyết định tháng trước)
    const prevMonthFormatted = getDefaultMonthFormatted();
    document.getElementById('reward-month').value = prevMonthFormatted;
    const deductMonthEl = document.getElementById('deduct-month');
    if (deductMonthEl) {
        deductMonthEl.value = prevMonthFormatted;
    }
}

// REFRESH DATA FROM API OR MOCK
async function refreshData(isManual = false) {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const statusDotMobile = document.getElementById('status-dot-mobile');
    
    const setStatusClass = (cls) => {
        if (statusDot) statusDot.className = `status-dot ${cls}`;
        if (statusDotMobile) statusDotMobile.className = `status-dot ${cls}`;
    };
    
    if (state.apiUrl) {
        try {
            if (statusText) statusText.textContent = "Đang kết nối...";
            setStatusClass("");
            
            // Sử dụng mã bảo mật hệ thống chạy ngầm
            const passcode = 'vnpt_admin';
            let requestUrl = state.apiUrl;
            try {
                const urlObj = new URL(state.apiUrl);
                urlObj.searchParams.append('passcode', passcode);
                requestUrl = urlObj.toString();
            } catch(e) {
                // url không hợp lệ
            }
            
            const response = await fetch(requestUrl, { method: 'GET' });
            const result = await response.json();
            
            if (result.status === "success") {
                // Nhận diện dữ liệu thành công từ Google Sheets
                // Map các tên cột sang định dạng chuẩn trong App
                state.records = parseSheetsData(result.data);
                
                // Nếu có danh sách danh bạ từ sheet danhba, lưu trữ làm autocomplete chính thức
                if (result.employees && result.employees.length > 0) {
                    state.employees = result.employees;
                    MOCK_EMPLOYEES.length = 0;
                    MOCK_EMPLOYEES.push(...result.employees);
                }

                // Cập nhật cấu hình khóa tháng & trạng thái Admin từ server
                if (result.config) {
                    state.lockedMonths = (result.config.lockedMonths || "").split(",").map(m => m.trim()).filter(Boolean);
                    state.isAdmin = !!result.config.isAdmin;
                } else {
                    state.lockedMonths = [];
                    state.isAdmin = false;
                }
                
                state.isLive = true;
                
                setStatusClass("connected");
                if (statusText) statusText.textContent = "Đã kết nối trực tiếp";
                if (isManual) {
                    showToast("Đã tải dữ liệu trực tiếp từ Google Sheets!", "success");
                }
            } else {
                throw new Error(result.message || "Lỗi API");
            }
        } catch (error) {
            console.error("Cảnh báo: Không thể tải dữ liệu từ API, chuyển sang Mock Data.", error);
            loadMockData();
            setStatusClass("");
            if (statusText) statusText.textContent = "Chế độ Ngoại tuyến";
            if (isManual) {
                showToast("Kết nối API lỗi. Đã tải dữ liệu Demo tích hợp sẵn.", "error");
            }
        }
    } else {
        loadMockData();
        setStatusClass("");
        if (statusText) statusText.textContent = "Chế độ Demo (Chưa cấu hình)";
    }
    
    extractEmployeeDatabase();
    populateMonthSelectors();
    updateUI();
}

// PARSE SHEET COLUMNS DYNAMICALLY
function parseSheetsData(sheetRows) {
    return sheetRows.map(row => {
        return {
            "STT": parseInt(row["STT"]) || 0,
            "Tháng": (row["Tháng"] || "").toString().trim(),
            "Mã nhân viên": (row["Mã nhân viên"] || "").toString().trim(),
            "Tên Nhân viên": (row["Tên Nhân viên"] || "").toString().trim(),
            "Tổ": (row["Tổ"] || "").toString().trim(),
            "Điểm khuyến khích": parseFloat(row["Điểm khuyến khích"]) || 0,
            "Tiền thưởng": parseFloat(row["Tiền thưởng"]) || 0,
            "Lý do": (row["Lý do"] || "").toString().trim(),
            "Thời điểm": (row["Thời điểm"] || "").toString().trim()
        };
    });
}

// LOAD DATA FROM MOCK AND LOCAL STORAGE
function loadMockData() {
    state.isLive = false;
    const localRecords = localStorage.getItem('demo_records');
    if (localRecords) {
        state.records = JSON.parse(localRecords);
    } else {
        state.records = [...MOCK_RECORDS];
        localStorage.setItem('demo_records', JSON.stringify(state.records));
    }
}

// POPULATE TEAM FILTER DROPDOWN
function populateTeamFilterSelect() {
    const teamFilterEl = document.getElementById('reward-team-filter-select');
    const deductTeamFilterEl = document.getElementById('deduct-team-filter-select');
    
    // Trích xuất các tổ duy nhất từ state.employees
    const teams = [...new Set(state.employees.map(emp => emp.to).filter(Boolean))];
    teams.sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'accent' }));
    
    // Populate reward team filter
    if (teamFilterEl) {
        const currentTeamVal = teamFilterEl.value || "all";
        teamFilterEl.innerHTML = '<option value="all">-- Tất cả các Tổ --</option>';
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamFilterEl.appendChild(option);
        });
        if (currentTeamVal && (currentTeamVal === "all" || teams.includes(currentTeamVal))) {
            teamFilterEl.value = currentTeamVal;
        } else {
            teamFilterEl.value = "all";
        }
    }
    
    // Populate deduct team filter
    if (deductTeamFilterEl) {
        const currentTeamVal = deductTeamFilterEl.value || "all";
        deductTeamFilterEl.innerHTML = '<option value="all">-- Tất cả các Tổ --</option>';
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            deductTeamFilterEl.appendChild(option);
        });
        if (currentTeamVal && (currentTeamVal === "all" || teams.includes(currentTeamVal))) {
            deductTeamFilterEl.value = currentTeamVal;
        } else {
            deductTeamFilterEl.value = "all";
        }
    }
}

// POPULATE EMPLOYEE DROPDOWN SELECT FROM STATE
function populateEmployeeSelect() {
    populateEmployeeSelectForId('reward-employee-select', 'reward-team-filter-select', 'reward-name', 'reward-id', 'reward-team');
    populateEmployeeSelectForId('deduct-employee-select', 'deduct-team-filter-select', 'deduct-name', 'deduct-id', 'deduct-team');
}

function populateEmployeeSelectForId(selectId, teamFilterId, nameInputId, idInputId, teamInputId) {
    const selectEl = document.getElementById(selectId);
    const teamFilterEl = document.getElementById(teamFilterId);
    if (!selectEl) return;
    
    const selectedTeam = teamFilterEl ? teamFilterEl.value : "all";
    const currentVal = selectEl.value;
    
    selectEl.innerHTML = '<option value="">-- Click để chọn nhân viên từ danh bạ --</option>';
    
    let filteredEmployees = [...state.employees];
    if (selectedTeam && selectedTeam !== "all") {
        filteredEmployees = filteredEmployees.filter(emp => emp.to === selectedTeam);
    }
    
    filteredEmployees.sort((a, b) => {
        const nameA = (a.tenNV || "").toString();
        const nameB = (b.tenNV || "").toString();
        return nameA.localeCompare(nameB, 'vi', { sensitivity: 'accent' });
    });
    
    filteredEmployees.forEach(emp => {
        if (!emp || !emp.maNV) return;
        const option = document.createElement('option');
        option.value = emp.maNV;
        option.textContent = `${emp.tenNV} (${emp.maNV}) - ${emp.to || "Chưa chia tổ"}`;
        selectEl.appendChild(option);
    });
    
    if (currentVal && filteredEmployees.some(emp => emp.maNV === currentVal)) {
        selectEl.value = currentVal;
    } else {
        selectEl.value = "";
        const nameInput = document.getElementById(nameInputId);
        const idInput = document.getElementById(idInputId);
        const teamInput = document.getElementById(teamInputId);
        if (nameInput) nameInput.value = "";
        if (idInput) idInput.value = "";
        if (teamInput) teamInput.value = "";
    }
}

// EXTRACT UNIQUE EMPLOYEES FOR AUTOCOMPLETE
function extractEmployeeDatabase() {
    // Nếu ở chế độ Live và đã có dữ liệu danh bạ chính thức từ sheet danhba, giữ nguyên
    if (state.isLive && state.employees && state.employees.length > 0) {
        populateTeamFilterSelect();
        populateEmployeeSelect();
        return;
    }
    // Nếu ở chế độ Demo/Offline, sử dụng danh sách nhân viên danh bạ tĩnh để chạy thử đầy đủ
    if (!state.isLive && typeof MOCK_EMPLOYEES !== 'undefined' && MOCK_EMPLOYEES.length > 0) {
        state.employees = [...MOCK_EMPLOYEES];
        populateTeamFilterSelect();
        populateEmployeeSelect();
        return;
    }
    const empMap = new Map();
    state.records.forEach(r => {
        if (r["Mã nhân viên"] && r["Tên Nhân viên"]) {
            const key = r["Mã nhân viên"].toLowerCase();
            if (!empMap.has(key)) {
                empMap.set(key, {
                    maNV: r["Mã nhân viên"],
                    tenNV: r["Tên Nhân viên"],
                    to: r["Tổ"] || ""
                });
            } else if (r["Tổ"] && !empMap.get(key).to) {
                // Cập nhật Tổ nếu trước đó bị thiếu
                empMap.get(key).to = r["Tổ"];
            }
        }
    });
    state.employees = Array.from(empMap.values());
    populateTeamFilterSelect();
    populateEmployeeSelect();
}

// POPULATE MONTH SELECTION DROPDOWNS
function populateMonthSelectors() {
    const filterMonth = document.getElementById('filter-month');
    const teamFilterMonth = document.getElementById('team-stats-filter-month');
    const dashboardFilterMonth = document.getElementById('dashboard-filter-month');
    const months = [...new Set(state.records.map(r => r["Tháng"]))].filter(Boolean);
    
    // Sắp xếp tháng từ mới nhất đến cũ nhất
    months.sort((a, b) => b.localeCompare(a));
    
    // 1. Lọc Lịch sử & Thống kê
    if (filterMonth) {
        const currentVal = filterMonth.value;
        filterMonth.innerHTML = '<option value="all">Tất cả các tháng</option>';
        months.forEach(m => {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = formatMonthDisplay(m);
            filterMonth.appendChild(option);
        });
        if (months.includes(currentVal)) {
            filterMonth.value = currentVal;
        } else {
            filterMonth.value = 'all';
            state.selectedMonth = 'all';
        }
    }

    // 2. Lọc Thống kê theo Tổ
    if (teamFilterMonth) {
        const currentTeamVal = teamFilterMonth.value;
        teamFilterMonth.innerHTML = '<option value="all">Tất cả các tháng</option>';
        months.forEach(m => {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = formatMonthDisplay(m);
            teamFilterMonth.appendChild(option);
        });
        if (months.includes(currentTeamVal)) {
            teamFilterMonth.value = currentTeamVal;
        } else {
            teamFilterMonth.value = 'all';
        }
    }

    // 3. Lọc Tổng quan
    if (dashboardFilterMonth) {
        const currentDashVal = dashboardFilterMonth.value || 'all';
        dashboardFilterMonth.innerHTML = '<option value="all">Tất cả các tháng</option>';
        months.forEach(m => {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = formatMonthDisplay(m);
            dashboardFilterMonth.appendChild(option);
        });
        if (months.includes(currentDashVal)) {
            dashboardFilterMonth.value = currentDashVal;
            state.dashboardSelectedMonth = currentDashVal;
        } else {
            // Mặc định chọn tháng mới nhất nếu có, nếu không thì chọn 'all'
            if (months.length > 0) {
                dashboardFilterMonth.value = months[0];
                state.dashboardSelectedMonth = months[0];
            } else {
                dashboardFilterMonth.value = 'all';
                state.dashboardSelectedMonth = 'all';
            }
        }
    }
}

// FORMAT MONTH DISPLAY STRING
function formatMonthDisplay(monthStr) {
    if (!monthStr) return "";
    const s = monthStr.toString();
    if (s.length >= 5) {
        // ví dụ 52026 -> Tháng 5/2026 hoặc 112026 -> Tháng 11/2026
        const year = s.substring(s.length - 4);
        const month = s.substring(0, s.length - 4);
        return `Tháng ${month}/${year}`;
    }
    return `Tháng ${s}`;
}

// HELPER FOR SELECTS & AUTOMATION IN FORMS
function setupFormSelects(selectId, teamFilterId, nameInputId, idInputId, teamInputId) {
    const employeeSelect = document.getElementById(selectId);
    const teamFilterSelect = document.getElementById(teamFilterId);
    const nameInput = document.getElementById(nameInputId);
    const idInput = document.getElementById(idInputId);
    const teamInput = document.getElementById(teamInputId);

    if (teamFilterSelect) {
        teamFilterSelect.addEventListener('change', () => {
            // Khi đổi tổ lọc, cập nhật danh sách nhân viên tương ứng
            populateEmployeeSelect();
        });
    }

    if (employeeSelect) {
        employeeSelect.addEventListener('change', (e) => {
            const selectedMaNV = e.target.value;
            if (selectedMaNV) {
                const selectedEmp = state.employees.find(emp => emp.maNV === selectedMaNV);
                if (selectedEmp) {
                    nameInput.value = selectedEmp.tenNV || "";
                    idInput.value = selectedEmp.maNV || "";
                    teamInput.value = selectedEmp.to || "";
                    
                    // Thêm hiệu ứng highlight nhẹ để thông báo tự động điền thành công
                    [nameInput, idInput, teamInput].forEach(el => {
                        el.style.transition = 'background-color 0.3s ease';
                        el.style.backgroundColor = 'rgba(var(--hue-accent), 0.15)';
                        setTimeout(() => {
                            el.style.backgroundColor = '';
                        }, 500);
                    });
                }
            } else {
                nameInput.value = "";
                idInput.value = "";
                teamInput.value = "";
            }
        });
    }
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
    // Sidebar Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Lắng nghe thay đổi hash trên URL để định tuyến lại tức thì
    window.addEventListener('hashchange', handleHashRouting);

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar on mobile clicking item
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        });
    }

    // Config: Save API URL
    const saveApiBtn = document.getElementById('save-api-btn');
    if (saveApiBtn) {
        saveApiBtn.addEventListener('click', () => {
            const urlInput = document.getElementById('api-url-input').value.trim();
            localStorage.setItem('reward_api_url', urlInput);
            state.apiUrl = urlInput;
            showToast("Đã lưu thiết lập API Google Sheets!", "success");
            refreshData(true);
        });
    }

    // Search and Filters in Lịch sử (với Debounce 300ms tối ưu hiệu năng)
    const debouncedUpdateUI = debounce(() => {
        updateUI();
    }, 300);

    document.getElementById('search-name').addEventListener('input', (e) => {
        state.filters.searchName = e.target.value.toLowerCase();
        debouncedUpdateUI();
    });
    document.getElementById('search-id').addEventListener('input', (e) => {
        state.filters.searchId = e.target.value.toLowerCase();
        debouncedUpdateUI();
    });
    document.getElementById('search-team').addEventListener('input', (e) => {
        state.filters.searchTeam = e.target.value.toLowerCase();
        debouncedUpdateUI();
    });
    document.getElementById('filter-month').addEventListener('change', (e) => {
        state.selectedMonth = e.target.value;
        updateUI();
    });

    // Cài đặt click tiêu đề bảng để sắp xếp cột (Sorting)
    const tableHeaders = document.querySelectorAll('#history-table th');
    const sortKeys = [
        'STT',
        'Tháng',
        'Mã nhân viên',
        'Tên Nhân viên',
        'Tổ',
        'Điểm khuyến khích',
        'Tiền thưởng',
        null // 'Lý do / Công việc' không sắp xếp
    ];
    
    tableHeaders.forEach((th, idx) => {
        const key = sortKeys[idx];
        if (key) {
            th.style.cursor = 'pointer';
            th.classList.add('sortable-header');
            th.addEventListener('click', () => {
                if (state.sort.key === key) {
                    state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sort.key = key;
                    state.sort.direction = 'asc';
                }
                updateSortHeaderIcons();
                updateUI();
            });
        }
    });
    
    // Khởi tạo các icon sắp xếp mặc định
    updateSortHeaderIcons();

    // Form logic: Auto-calculate reward money
    const pointsInput = document.getElementById('reward-points');
    const moneyPreview = document.getElementById('money-amount-preview');
    if (pointsInput) {
        pointsInput.addEventListener('input', (e) => {
            const points = parseFloat(e.target.value) || 0;
            const money = points * 5000;
            moneyPreview.textContent = formatCurrency(money);
        });
    }

    // Form logic: Auto-calculate demerit money
    const deductPointsInput = document.getElementById('deduct-points');
    const deductMoneyPreview = document.getElementById('deduct-money-amount-preview');
    if (deductPointsInput) {
        deductPointsInput.addEventListener('input', (e) => {
            const points = parseFloat(e.target.value) || 0;
            const money = points * -5000; // Negative for demerits
            deductMoneyPreview.textContent = formatCurrency(money);
        });
    }

    // Form logic: Dropdown Selects for Employee from Danh Bạ
    setupFormSelects('reward-employee-select', 'reward-team-filter-select', 'reward-name', 'reward-id', 'reward-team');
    setupFormSelects('deduct-employee-select', 'deduct-team-filter-select', 'deduct-name', 'deduct-id', 'deduct-team');

    // Form submission
    const submitBtn = document.getElementById('submit-reward-btn');
    const rewardForm = document.getElementById('reward-points-form');
    if (rewardForm) {
        rewardForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const thang = document.getElementById('reward-month').value.trim();
            const maNV = document.getElementById('reward-id').value.trim();
            const tenNV = document.getElementById('reward-name').value.trim();
            const to = document.getElementById('reward-team').value.trim();
            const diem = parseFloat(pointsInput.value) || 0;
            const lyDo = document.getElementById('reward-reason').value.trim();
            
            if (!maNV || !tenNV || !diem) {
                showToast("Vui lòng nhập đầy đủ thông tin bắt buộc!", "error");
                return;
            }

            // Kiểm tra khóa chốt tháng
            if (state.lockedMonths && state.lockedMonths.includes(thang) && !state.isAdmin) {
                showToast(`Tháng ${formatMonthDisplay(thang)} đã được chốt và khóa! Chỉ Admin mới có quyền thêm mới.`, "error");
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = "Đang xử lý...";
            
            const timestamp = getNowTimestampString();
            const newRecord = {
                thang,
                maNV,
                tenNV,
                to,
                diem,
                lyDo,
                timestamp,
                passcode: 'vnpt_admin'
            };
            
            if (state.isLive && state.apiUrl) {
                // Gửi lên Google Sheets API
                try {
                    const res = await fetch(state.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain;charset=utf-8'
                        },
                        body: JSON.stringify(newRecord)
                    });
                    
                    let success = false;
                    let errMsg = "";
                    try {
                        const result = await res.json();
                        if (result && result.status === "success") {
                            success = true;
                        } else {
                            errMsg = result ? result.message : "Lỗi không xác định";
                        }
                    } catch (e) {
                        errMsg = "Không nhận được phản hồi chuẩn từ Google Sheets.";
                    }
                    
                    if (success) {
                        showToast("Điểm thưởng đã được gửi và lưu thành công trên Google Sheets!", "success");
                        rewardForm.reset();
                        document.getElementById('reward-month').value = getDefaultMonthFormatted();
                        moneyPreview.textContent = "0 đ";
                        
                        setTimeout(async () => {
                            await refreshData();
                            submitBtn.disabled = false;
                            submitBtn.textContent = "Lưu Điểm Khuyến khích";
                            switchTab('history');
                        }, 2000);
                    } else {
                        showToast("Lỗi lưu Google Sheets: " + errMsg + ". Đang chuyển lưu offline.", "error");
                        saveOffline(newRecord);
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Lưu Điểm Khuyến khích";
                        rewardForm.reset();
                        moneyPreview.textContent = "0 đ";
                        switchTab('history');
                    }
                } catch (error) {
                    showToast("Lỗi kết nối tới Google Sheets. Đang chuyển lưu offline.", "error");
                    console.error(error);
                    saveOffline(newRecord);
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Lưu Điểm Khuyến khích";
                }
            } else {
                // Chế độ demo offline
                saveOffline(newRecord);
                submitBtn.disabled = false;
                submitBtn.textContent = "Lưu Điểm Khuyến khích";
                rewardForm.reset();
                moneyPreview.textContent = "0 đ";
                switchTab('history');
            }
        });
    }

    // Deduct Form submission
    const deductForm = document.getElementById('deduct-points-form');
    const submitDeductBtn = document.getElementById('submit-deduct-btn');
    if (deductForm) {
        deductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const thang = document.getElementById('deduct-month').value.trim();
            const maNV = document.getElementById('deduct-id').value.trim();
            const tenNV = document.getElementById('deduct-name').value.trim();
            const to = document.getElementById('deduct-team').value.trim();
            const pointsVal = parseFloat(deductPointsInput.value) || 0;
            const diem = pointsVal * -1; // Force negative!
            const lyDo = document.getElementById('deduct-reason').value.trim();
            
            if (!maNV || !tenNV || !diem) {
                showToast("Vui lòng nhập đầy đủ thông tin bắt buộc!", "error");
                return;
            }

            // Kiểm tra khóa chốt tháng
            if (state.lockedMonths && state.lockedMonths.includes(thang) && !state.isAdmin) {
                showToast(`Tháng ${formatMonthDisplay(thang)} đã được chốt và khóa! Chỉ Admin mới có quyền thêm mới.`, "error");
                return;
            }
            
            submitDeductBtn.disabled = true;
            submitDeductBtn.textContent = "Đang xử lý...";
            
            const timestamp = getNowTimestampString();
            const newRecord = {
                thang,
                maNV,
                tenNV,
                to,
                diem,
                lyDo,
                timestamp,
                passcode: 'vnpt_admin'
            };
            
            if (state.isLive && state.apiUrl) {
                // Gửi lên Google Sheets API
                try {
                    const res = await fetch(state.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain;charset=utf-8'
                        },
                        body: JSON.stringify(newRecord)
                    });
                    
                    let success = false;
                    let errMsg = "";
                    try {
                        const result = await res.json();
                        if (result && result.status === "success") {
                            success = true;
                        } else {
                            errMsg = result ? result.message : "Lỗi không xác định";
                        }
                    } catch (e) {
                        errMsg = "Không nhận được phản hồi chuẩn từ Google Sheets.";
                    }
                    
                    if (success) {
                        showToast("Điểm trừ đã được gửi và lưu thành công trên Google Sheets!", "success");
                        deductForm.reset();
                        const deductMonthEl = document.getElementById('deduct-month');
                        if (deductMonthEl) deductMonthEl.value = getDefaultMonthFormatted();
                        deductMoneyPreview.textContent = "0 đ";
                        
                        setTimeout(async () => {
                            await refreshData();
                            submitDeductBtn.disabled = false;
                            submitDeductBtn.textContent = "Lưu Điểm Trừ";
                            switchTab('history');
                        }, 2000);
                    } else {
                        showToast("Lỗi lưu Google Sheets: " + errMsg + ". Đang chuyển lưu offline.", "error");
                        saveOffline(newRecord);
                        submitDeductBtn.disabled = false;
                        submitDeductBtn.textContent = "Lưu Điểm Trừ";
                        deductForm.reset();
                        deductMoneyPreview.textContent = "0 đ";
                        switchTab('history');
                    }
                } catch (error) {
                    showToast("Lỗi kết nối tới Google Sheets. Đang chuyển lưu offline.", "error");
                    console.error(error);
                    saveOffline(newRecord);
                    submitDeductBtn.disabled = false;
                    submitDeductBtn.textContent = "Lưu Điểm Trừ";
                }
            } else {
                // Chế độ demo offline
                saveOffline(newRecord);
                submitDeductBtn.disabled = false;
                submitDeductBtn.textContent = "Lưu Điểm Trừ";
                deductForm.reset();
                deductMoneyPreview.textContent = "0 đ";
                switchTab('history');
            }
        });
    }

    // Export CSV Button
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            exportToCSV();
        });
    }

    // Modal Edit Event Listeners
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-record-form');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    const hideModal = () => {
        if (editModal) {
            editModal.classList.remove('active');
        }
    };
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', hideModal);
    
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) hideModal();
        });
    }
    
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleEditSubmit();
        });
    }
    // Toggle Monthly vs Cumulative in Team Stats view
    const toggleMonthlyBtn = document.getElementById('btn-toggle-monthly');
    const toggleCumulativeBtn = document.getElementById('btn-toggle-cumulative');
    const monthlyContainer = document.getElementById('monthly-stats-container');
    const cumulativeContainer = document.getElementById('cumulative-stats-container');

    if (toggleMonthlyBtn && toggleCumulativeBtn) {
        toggleMonthlyBtn.addEventListener('click', () => {
            toggleMonthlyBtn.classList.add('active');
            toggleCumulativeBtn.classList.remove('active');
            if (monthlyContainer) monthlyContainer.style.display = 'grid';
            if (cumulativeContainer) cumulativeContainer.style.display = 'none';
        });

        toggleCumulativeBtn.addEventListener('click', () => {
            toggleCumulativeBtn.classList.add('active');
            toggleMonthlyBtn.classList.remove('active');
            if (monthlyContainer) monthlyContainer.style.display = 'none';
            if (cumulativeContainer) cumulativeContainer.style.display = 'grid';
        });
    }

    // Filters for Team Stats view (with Debounce 300ms)
    const debouncedRenderTeamStats = debounce(() => {
        renderStatsTables(getFilteredRecordsForTeamStats());
    }, 300);

    const teamFilterTeam = document.getElementById('team-stats-filter-team');
    const teamFilterMonth = document.getElementById('team-stats-filter-month');

    if (teamFilterTeam) {
        teamFilterTeam.addEventListener('input', () => {
            debouncedRenderTeamStats();
        });
    }

    if (teamFilterMonth) {
        teamFilterMonth.addEventListener('change', () => {
            renderStatsTables(getFilteredRecordsForTeamStats());
        });
    }

    // Control for settings modal
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('btn-open-settings');
    const closeSettingsBtn = document.getElementById('close-settings-modal-btn');
    const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
    const settingsForm = document.getElementById('settings-form');
    
    const showSettingsModal = () => {
        if (settingsModal) {
            document.getElementById('settings-api-url').value = state.apiUrl || '';
            document.getElementById('settings-locked-months').value = state.lockedMonths ? state.lockedMonths.join(", ") : '';
            settingsModal.classList.add('active');
        }
    };
    
    const hideSettingsModal = () => {
        if (settingsModal) {
            settingsModal.classList.remove('active');
        }
    };
    
    if (openSettingsBtn) openSettingsBtn.addEventListener('click', showSettingsModal);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', hideSettingsModal);
    if (cancelSettingsBtn) cancelSettingsBtn.addEventListener('click', hideSettingsModal);
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) hideSettingsModal();
        });
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const apiUrlVal = document.getElementById('settings-api-url').value.trim();
            const lockedMonthsVal = document.getElementById('settings-locked-months').value.trim();
            
            // Save API URL locally
            localStorage.setItem('reward_api_url', apiUrlVal);
            state.apiUrl = apiUrlVal;
            
            // Submit to the server if live
            if (state.isLive && state.apiUrl) {
                const saveSettingsBtn = document.getElementById('save-settings-btn');
                if (saveSettingsBtn) {
                    saveSettingsBtn.disabled = true;
                    saveSettingsBtn.textContent = "Đang gửi...";
                }
                
                try {
                    const res = await fetch(state.apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify({
                            action: 'save_config',
                            passcode: 'vnpt_admin',
                            lockedMonths: lockedMonthsVal
                        })
                    });
                    const result = await res.json();
                    if (result.status === 'success') {
                        showToast("Đã cập nhật cấu hình bảo mật lên Google Sheets thành công!", "success");
                        hideSettingsModal();
                        await refreshData(true);
                    } else {
                        showToast("Lỗi lưu cấu hình: " + result.message, "error");
                    }
                } catch(err) {
                    showToast("Không thể kết nối lưu cấu hình bảo mật. Đang chuyển cấu hình cục bộ.", "warning");
                    hideSettingsModal();
                    await refreshData(true);
                } finally {
                    if (saveSettingsBtn) {
                        saveSettingsBtn.disabled = false;
                        saveSettingsBtn.textContent = "Lưu Cấu Hình";
                    }
                }
            } else {
                showToast("Đã lưu thiết lập API cục bộ (Chế độ offline).", "success");
                hideSettingsModal();
                await refreshData(true);
            }
        });
    }

    // Filter for Overview (Dashboard) view
    const dashboardFilterMonth = document.getElementById('dashboard-filter-month');
    if (dashboardFilterMonth) {
        dashboardFilterMonth.addEventListener('change', (e) => {
            state.dashboardSelectedMonth = e.target.value;
            updateUI();
            renderCharts();
        });
    }
}

// OPEN EDIT MODAL
function openEditModal(stt) {
    const record = state.records.find(r => Number(r["STT"]) === Number(stt));
    if (!record) {
        showToast("Không tìm thấy bản ghi cần chỉnh sửa!", "error");
        return;
    }
    
    const maNV = record["Mã nhân viên"];
    const emp = state.employees.find(e => e.maNV === maNV);
    const displayName = emp ? emp.tenNV : (record["Tên Nhân viên"] || "Chưa xác định");
    
    document.getElementById('edit-stt').value = stt;
    document.getElementById('edit-name').value = displayName;
    document.getElementById('edit-id').value = maNV;
    document.getElementById('edit-month').value = record["Tháng"] || "";
    document.getElementById('edit-points').value = record["Điểm khuyến khích"] || "";
    document.getElementById('edit-reason').value = record["Lý do"] || "";
    
    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.classList.add('active');
    }
}

// HANDLE EDIT FORM SUBMIT
async function handleEditSubmit() {
    const stt = parseInt(document.getElementById('edit-stt').value);
    const thang = document.getElementById('edit-month').value.trim();
    const diem = parseFloat(document.getElementById('edit-points').value) || 0;
    const lyDo = document.getElementById('edit-reason').value.trim();
    
    if (!thang || !diem || !lyDo) {
        showToast("Vui lòng điền đầy đủ các thông tin bắt buộc!", "error");
        return;
    }

    // Kiểm tra khóa chốt tháng
    const oldRecord = state.records.find(r => Number(r["STT"]) === Number(stt));
    const oldMonth = oldRecord ? oldRecord["Tháng"] : "";
    if (state.lockedMonths && (state.lockedMonths.includes(thang) || state.lockedMonths.includes(oldMonth)) && !state.isAdmin) {
        showToast("Thao tác bị từ chối! Tháng này đã chốt và khóa.", "error");
        return;
    }
    
    const editBtn = document.getElementById('save-edit-btn');
    if (editBtn) {
        editBtn.disabled = true;
        editBtn.textContent = "Đang xử lý...";
    }
    
    const timestamp = getNowTimestampString();
    
    // Cập nhật tạm thời offline trong bộ đệm ngay lập tức (Optimistic UI) để mang lại trải nghiệm mượt mà nhất
    const idx = state.records.findIndex(r => Number(r["STT"]) === Number(stt));
    if (idx !== -1) {
        state.records[idx]["Tháng"] = thang;
        state.records[idx]["Điểm khuyến khích"] = diem;
        state.records[idx]["Tiền thưởng"] = diem * 5000;
        state.records[idx]["Lý do"] = lyDo;
        state.records[idx]["Thời điểm"] = timestamp;
        localStorage.setItem('demo_records', JSON.stringify(state.records));
        
        // Vẽ lại giao diện ngay lập tức mà không phải chờ API phản hồi
        extractEmployeeDatabase();
        populateMonthSelectors();
        updateUI();
    }
    
    // Đóng modal và trả trạng thái nút lưu ngay lập tức để người dùng không cảm thấy ứng dụng bị treo
    const editModal = document.getElementById('edit-modal');
    if (editModal) editModal.classList.remove('active');
    
    if (editBtn) {
        editBtn.disabled = false;
        editBtn.textContent = "Lưu Thay Đổi";
    }
    
    // GỬI LIVE LÊN GOOGLE SHEETS TRONG NỀN
    if (state.isLive && state.apiUrl) {
        try {
            const payload = {
                action: "edit",
                stt,
                thang,
                diem,
                lyDo,
                timestamp,
                passcode: 'vnpt_admin'
            };
            
            showToast("Đang đồng bộ thay đổi chỉnh sửa lên Google Sheets...", "info");
            
            const res = await fetch(state.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });
            
            let success = false;
            let errMsg = "";
            try {
                const result = await res.json();
                if (result && result.status === "success") {
                    success = true;
                } else {
                    errMsg = result ? result.message : "Lỗi không xác định";
                }
            } catch (e) {
                errMsg = "Không nhận được phản hồi chuẩn từ Google Sheets.";
            }
            
            if (success) {
                showToast("Thay đổi đã được cập nhật lên Google Sheets thành công!", "success");
                
                // Tải lại dữ liệu kiểm chứng sau 2.5 giây
                setTimeout(async () => {
                    await refreshData();
                }, 2500);
            } else {
                if (errMsg.includes("Thiếu thông tin Mã nhân viên hoặc Tên nhân viên")) {
                    showToast("Lỗi: Máy chủ Google Sheets đang chạy phiên bản Apps Script cũ. Vui lòng thực hiện Triển khai phiên bản mới (New version) trên Sheets.", "error");
                } else {
                    showToast("Không thể lưu lên Google Sheets: " + errMsg, "error");
                }
            }
            
        } catch (error) {
            showToast("Lỗi đồng bộ lên Google Sheets. Dữ liệu đang được lưu tạm Offline.", "error");
            console.error(error);
        }
    } else {
        // CHẾ ĐỘ OFFLINE DEMO
        showToast("Đã cập nhật bản ghi thành công (Offline Demo)!", "success");
    }
}

function editOffline(stt, thang, diem, lyDo, timestamp) {
    const idx = state.records.findIndex(r => Number(r["STT"]) === Number(stt));
    if (idx !== -1) {
        state.records[idx]["Tháng"] = thang;
        state.records[idx]["Điểm khuyến khích"] = diem;
        state.records[idx]["Tiền thưởng"] = diem * 5000;
        state.records[idx]["Lý do"] = lyDo;
        state.records[idx]["Thời điểm"] = timestamp;
        
        localStorage.setItem('demo_records', JSON.stringify(state.records));
        
        extractEmployeeDatabase();
        populateMonthSelectors();
        updateUI();
        
        showToast("Đã cập nhật bản ghi thành công (Offline Demo)!", "success");
    }
}

// HANDLE DELETE RECORD
async function handleDeleteRecord(stt) {
    const record = state.records.find(r => Number(r["STT"]) === Number(stt));
    if (!record) return;
    
    // Kiểm tra khóa chốt tháng
    const monthVal = record["Tháng"] ? record["Tháng"].toString() : "";
    if (state.lockedMonths && state.lockedMonths.includes(monthVal) && !state.isAdmin) {
        showToast(`Tháng ${formatMonthDisplay(monthVal)} đã được chốt và khóa! Bạn không có quyền xóa bản ghi này.`, "error");
        return;
    }

    const maNV = record["Mã nhân viên"];
    const emp = state.employees.find(e => e.maNV === maNV);
    const displayName = emp ? emp.tenNV : (record["Tên Nhân viên"] || "Chưa xác định");
    
    const isConfirmed = confirm(`Bạn có chắc chắn muốn XÓA bản ghi điểm của [${displayName}]?\n- Số điểm: ${formatNumber(record["Điểm khuyến khích"])} điểm\n- Lý do: ${record["Lý do"]}\n\nHành động này không thể hoàn tác.`);
    if (!isConfirmed) return;
    
    // Cập nhật giao diện xóa tức thì (Optimistic UI)
    state.records = state.records.filter(r => Number(r["STT"]) !== Number(stt));
    localStorage.setItem('demo_records', JSON.stringify(state.records));
    
    extractEmployeeDatabase();
    populateMonthSelectors();
    updateUI();
    
    // GỬI LIVE LÊN GOOGLE SHEETS TRONG NỀN
    if (state.isLive && state.apiUrl) {
        try {
            showToast("Đang đồng bộ yêu cầu xóa lên Google Sheets...", "info");
            const payload = {
                action: "delete",
                stt,
                passcode: 'vnpt_admin'
            };
            
            const res = await fetch(state.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });
            
            let success = false;
            let errMsg = "";
            try {
                const result = await res.json();
                if (result && result.status === "success") {
                    success = true;
                } else {
                    errMsg = result ? result.message : "Lỗi không xác định";
                }
            } catch (e) {
                errMsg = "Không nhận được phản hồi chuẩn từ Google Sheets.";
            }
            
            if (success) {
                showToast("Đã xóa bản ghi thành công trên Google Sheets!", "success");
                
                // Tải lại dữ liệu kiểm chứng sau 2.5 giây
                setTimeout(async () => {
                    await refreshData();
                }, 2500);
            } else {
                if (errMsg.includes("Thiếu thông tin Mã nhân viên hoặc Tên nhân viên")) {
                    showToast("Lỗi: Máy chủ Google Sheets đang chạy phiên bản Apps Script cũ. Vui lòng thực hiện Triển khai phiên bản mới (New version) trên Sheets.", "error");
                } else {
                    showToast("Không thể xóa trên Google Sheets: " + errMsg, "error");
                }
            }
            
        } catch (error) {
            showToast("Lỗi gửi yêu cầu xóa lên Google Sheets. Dữ liệu đang xóa tạm Offline.", "error");
            console.error(error);
        }
    } else {
        // CHẾ ĐỘ OFFLINE DEMO
        showToast("Đã xóa bản ghi thành công (Offline Demo)!", "success");
    }
}

function deleteOffline(stt) {
    state.records = state.records.filter(r => Number(r["STT"]) !== Number(stt));
    localStorage.setItem('demo_records', JSON.stringify(state.records));
    
    extractEmployeeDatabase();
    populateMonthSelectors();
    updateUI();
    
    showToast("Đã xóa bản ghi thành công (Offline Demo)!", "success");
}

// SAVE OFFLINE DEMO RECORD
function saveOffline(payload) {
    const nextStt = state.records.length > 0 ? Math.max(...state.records.map(r => r["STT"])) + 1 : 1;
    const added = {
        "STT": nextStt,
        "Tháng": payload.thang,
        "Mã nhân viên": payload.maNV,
        "Tên Nhân viên": payload.tenNV,
        "Tổ": payload.to,
        "Điểm khuyến khích": payload.diem,
        "Tiền thưởng": payload.diem * 5000,
        "Lý do": payload.lyDo,
        "Thời điểm": payload.timestamp
    };
    
    state.records.unshift(added); // Đưa lên đầu bảng
    localStorage.setItem('demo_records', JSON.stringify(state.records));
    
    extractEmployeeDatabase();
    populateMonthSelectors();
    updateUI();
    
    showToast("Đã lưu điểm khuyến khích thành công (Offline Demo)!", "success");
}



// SWITCH VIEWS / TABS
function switchTab(tabName) {
    window.location.hash = tabName;
}

// HANDLE HASH ROUTING (Deep Linking & Forward/Backward Navigation)
function handleHashRouting() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    
    // Kiểm tra tính hợp lệ của tab
    const validTabs = ['dashboard', 'reward', 'deduct', 'history', 'team-stats'];
    const tabName = validTabs.includes(hash) ? hash : 'dashboard';
    
    const views = document.querySelectorAll('.page-view');
    views.forEach(v => v.classList.remove('active'));
    
    const targetView = document.getElementById(`${tabName}-view`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Cập nhật menu-item active
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (tabName === 'dashboard') {
        // Đảm bảo canvas đã hoàn tất vẽ
        setTimeout(() => {
            renderCharts();
        }, 50);
    }
    
    // Tự động cuộn main-content lên đầu trang khi đổi tab
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
}

// UPDATE CORE UI & TABLES
function updateUI() {
    // 1. Lọc bản ghi theo bộ lọc hiện tại
    const filteredRecords = state.records.filter(r => {
        const matchMonth = state.selectedMonth === 'all' || r["Tháng"] === state.selectedMonth;
        const matchName = !state.filters.searchName || (r["Tên Nhân viên"] || "").toLowerCase().includes(state.filters.searchName);
        const matchId = !state.filters.searchId || (r["Mã nhân viên"] || "").toLowerCase().includes(state.filters.searchId);
        const matchTeam = !state.filters.searchTeam || (r["Tổ"] || "").toLowerCase().includes(state.filters.searchTeam);
        
        return matchMonth && matchName && matchId && matchTeam;
    });

    // 1.2 Thực hiện sắp xếp (Sorting) tối ưu
    filteredRecords.sort((a, b) => {
        let valA = a[state.sort.key];
        let valB = b[state.sort.key];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        // Handle numeric / float comparison safely
        if (state.sort.key === 'STT' || state.sort.key === 'Điểm khuyến khích' || state.sort.key === 'Tiền thưởng') {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
        }
        
        if (valA < valB) return state.sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return state.sort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // 2. Tính toán tổng số lượng cho KPIs của trang Tổng quan (dựa trên tháng được chọn trên tab Tổng quan)
    const overviewRecords = state.records.filter(r => state.dashboardSelectedMonth === 'all' || r["Tháng"] === state.dashboardSelectedMonth);
    const activeRecords = state.records.filter(r => state.selectedMonth === 'all' || r["Tháng"] === state.selectedMonth);
    
    // Tính tổng điểm cộng (các bản ghi điểm > 0)
    const positivePoints = overviewRecords
        .filter(r => (r["Điểm khuyến khích"] || 0) > 0)
        .reduce((sum, r) => sum + r["Điểm khuyến khích"], 0);
        
    // Tính tổng điểm trừ (các bản ghi điểm < 0)
    const negativePoints = overviewRecords
        .filter(r => (r["Điểm khuyến khích"] || 0) < 0)
        .reduce((sum, r) => sum + r["Điểm khuyến khích"], 0);

    // Tính tổng thực chi tiền thưởng (chỉ tính điểm > 0)
    const totalRewardMoney = overviewRecords
        .filter(r => (r["Điểm khuyến khích"] || 0) > 0)
        .reduce((sum, r) => sum + (r["Tiền thưởng"] || 0), 0);

    // Tính tổng tiền giảm trừ (chỉ tính điểm < 0)
    const totalDeductMoney = overviewRecords
        .filter(r => (r["Điểm khuyến khích"] || 0) < 0)
        .reduce((sum, r) => sum + (r["Tiền thưởng"] || 0), 0);
    
    // Đếm nhân sự được thưởng và bị phạt riêng biệt của trang Tổng quan
    const rewardedEmployeesCount = new Set(
        overviewRecords
            .filter(r => (r["Điểm khuyến khích"] || 0) > 0)
            .map(r => r["Mã nhân viên"])
    ).size;
    
    const penalizedEmployeesCount = new Set(
        overviewRecords
            .filter(r => (r["Điểm khuyến khích"] || 0) < 0)
            .map(r => r["Mã nhân viên"])
    ).size;

    // Cập nhật các KPI Card
    const posPointsEl = document.getElementById('kpi-positive-points');
    const negPointsEl = document.getElementById('kpi-negative-points');
    if (posPointsEl) posPointsEl.textContent = formatNumber(positivePoints);
    if (negPointsEl) negPointsEl.textContent = formatNumber(negativePoints);
    
    const totalMoneyEl = document.getElementById('kpi-total-money');
    const totalDeductMoneyEl = document.getElementById('kpi-total-deduct-money');
    const rewardedEmployeesEl = document.getElementById('kpi-rewarded-employees');
    const penalizedEmployeesEl = document.getElementById('kpi-penalized-employees');
    if (totalMoneyEl) totalMoneyEl.textContent = formatCurrency(totalRewardMoney);
    if (totalDeductMoneyEl) totalDeductMoneyEl.textContent = formatCurrency(totalDeductMoney);
    if (rewardedEmployeesEl) rewardedEmployeesEl.textContent = rewardedEmployeesCount;
    if (penalizedEmployeesEl) penalizedEmployeesEl.textContent = penalizedEmployeesCount;

    // 3. Render Bảng Lịch sử đầy đủ
    renderHistoryTable(filteredRecords);

    // 4. Render Bảng Thống kê Tổ (dùng bộ lọc riêng của tab thống kê tổ)
    renderStatsTables(getFilteredRecordsForTeamStats());

    // 5. Render Bảng Thống kê Nhân viên (dùng bộ lọc của tab Lịch sử)
    renderEmployeeStatsTable(activeRecords);
}

// RENDER REWARD HISTORY TABLE
function renderHistoryTable(records) {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    
    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted);">Không tìm thấy dữ liệu phù hợp với điều kiện tìm kiếm.</td></tr>`;
        return;
    }
    
    records.forEach(r => {
        const maNV = r["Mã nhân viên"];
        const emp = state.employees.find(e => e.maNV === maNV);
        const displayName = emp ? emp.tenNV : (r["Tên Nhân viên"] || "Chưa xác định");
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="STT">${r["STT"]}</td>
            <td data-label="Kỳ Thưởng"><span class="badge primary">${formatMonthDisplay(r["Tháng"])}</span></td>
            <td data-label="Mã NV"><code>${r["Mã nhân viên"]}</code></td>
            <td data-label="Họ Và Tên"><strong>${displayName}</strong></td>
            <td data-label="Tổ">${r["Tổ"] || '<span style="color: var(--text-muted); font-style: italic;">Chưa phân tổ</span>'}</td>
            <td data-label="Điểm" style="font-weight: 700;">${formatNumber(r["Điểm khuyến khích"])}</td>
            <td data-label="Tiền Thưởng" style="color: var(--color-accent); font-weight: 700;">${formatCurrency(r["Tiền thưởng"])}</td>
            <td data-label="Lý do">
                <div class="expandable-reason-container">
                    <span class="reason-text" title="Nhấp nút bên cạnh để mở rộng/thu gọn lý do">${truncateString(r["Lý do"], 60)}</span>
                    ${r["Lý do"] && r["Lý do"].length > 60 ? `
                        <button class="btn-expand-reason" title="Xem thêm chi tiết lý do">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
            <td data-label="Thao tác">
                <div class="action-buttons-container">
                    ${(state.lockedMonths && state.lockedMonths.includes(r["Tháng"] ? r["Tháng"].toString() : "") && !state.isAdmin) ? `
                        <span style="color: var(--color-danger); font-size: 0.85rem; display: flex; align-items: center; gap: 4px; font-weight: 600;" title="Tháng này đã được chốt và khóa. Chỉ Admin mới được sửa.">
                            <i class="fa-solid fa-lock"></i> Đã Chốt
                        </span>
                    ` : `
                        <button class="btn-action edit" title="Sửa bản ghi này">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-action delete" title="Xóa bản ghi này">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    `}
                </div>
            </td>
        `;
        
        // Thêm trình xử lý sự kiện click để mở rộng lý do
        const expandBtn = tr.querySelector('.btn-expand-reason');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                const textSpan = tr.querySelector('.reason-text');
                const isExpanded = expandBtn.classList.contains('expanded');
                
                if (isExpanded) {
                    textSpan.textContent = truncateString(r["Lý do"], 60);
                    expandBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
                    expandBtn.classList.remove('expanded');
                } else {
                    textSpan.textContent = r["Lý do"];
                    expandBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
                    expandBtn.classList.add('expanded');
                }
            });
        }
        
        // Thêm sự kiện click Sửa/Xóa
        const editBtn = tr.querySelector('.btn-action.edit');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                openEditModal(r["STT"]);
            });
        }
        
        const deleteBtn = tr.querySelector('.btn-action.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                handleDeleteRecord(r["STT"]);
            });
        }
        
        tbody.appendChild(tr);
    });
}

// TRẢ VỀ DANH SÁCH BẢN GHI LỌC CHO THỐNG KÊ TỔ
function getFilteredRecordsForTeamStats() {
    const filterTeamEl = document.getElementById('team-stats-filter-team');
    const filterMonthEl = document.getElementById('team-stats-filter-month');
    
    const filterTeamVal = filterTeamEl ? filterTeamEl.value.trim().toLowerCase() : '';
    const filterMonthVal = filterMonthEl ? filterMonthEl.value : 'all';
    
    return state.records.filter(r => {
        // Lọc theo tổ
        if (filterTeamVal) {
            const team = (r["Tổ"] || "").toLowerCase();
            if (!team.includes(filterTeamVal)) return false;
        }
        // Lọc theo tháng
        if (filterMonthVal !== 'all') {
            if (r["Tháng"] !== filterMonthVal) return false;
        }
        return true;
    });
}

// RENDER TEAM & EMPLOYEE STATS TABLES
function renderStatsTables(activeRecords) {
    // -------------------------------------------------------------
    // 1. GOM NHÓM THEO THÁNG (MONHTLY TEAM STATS)
    // -------------------------------------------------------------
    const rewardMonthlyStats = {};
    const overallRewardMonthlyStaff = new Set();
    let overallRewardMonthlyPoints = 0;
    let overallRewardMonthlyMoney = 0;

    const deductionMonthlyStats = {};
    const overallDeductionMonthlyStaff = new Set();
    let overallDeductionMonthlyPoints = 0;
    let overallDeductionMonthlyMoney = 0;

    // -------------------------------------------------------------
    // 2. GOM NHÓM LŨY KẾ (CUMULATIVE TEAM STATS)
    // -------------------------------------------------------------
    const rewardCumulativeStats = {};
    const overallRewardCumulativeStaff = new Set();
    let overallRewardCumulativePoints = 0;
    let overallRewardCumulativeMoney = 0;

    const deductionCumulativeStats = {};
    const overallDeductionCumulativeStaff = new Set();
    let overallDeductionCumulativePoints = 0;
    let overallDeductionCumulativeMoney = 0;



    activeRecords.forEach(r => {
        const points = r["Điểm khuyến khích"] || 0;
        const money = r["Tiền thưởng"] || 0;
        const month = r["Tháng"] || "";
        const team = r["Tổ"] || "Chưa phân tổ";
        const maNV = r["Mã nhân viên"];

        // Phân loại Thưởng vs Phạt
        if (points > 0) {
            // A. Theo Tháng
            const keyMonthly = `${month}_${team}`;
            if (!rewardMonthlyStats[keyMonthly]) {
                rewardMonthlyStats[keyMonthly] = { month, team, points: 0, money: 0, staff: new Set() };
            }
            rewardMonthlyStats[keyMonthly].points += points;
            rewardMonthlyStats[keyMonthly].money += money;
            rewardMonthlyStats[keyMonthly].staff.add(maNV);

            overallRewardMonthlyStaff.add(maNV);
            overallRewardMonthlyPoints += points;
            overallRewardMonthlyMoney += money;

            // B. Lũy Kế (Không phân biệt tháng)
            if (!rewardCumulativeStats[team]) {
                rewardCumulativeStats[team] = { team, points: 0, money: 0, staff: new Set() };
            }
            rewardCumulativeStats[team].points += points;
            rewardCumulativeStats[team].money += money;
            rewardCumulativeStats[team].staff.add(maNV);

            overallRewardCumulativeStaff.add(maNV);
            overallRewardCumulativePoints += points;
            overallRewardCumulativeMoney += money;

        } else if (points < 0) {
            // A. Theo Tháng
            const keyMonthly = `${month}_${team}`;
            if (!deductionMonthlyStats[keyMonthly]) {
                deductionMonthlyStats[keyMonthly] = { month, team, points: 0, money: 0, staff: new Set() };
            }
            deductionMonthlyStats[keyMonthly].points += points;
            deductionMonthlyStats[keyMonthly].money += money;
            deductionMonthlyStats[keyMonthly].staff.add(maNV);

            overallDeductionMonthlyStaff.add(maNV);
            overallDeductionMonthlyPoints += points;
            overallDeductionMonthlyMoney += money;

            // B. Lũy Kế (Không phân biệt tháng)
            if (!deductionCumulativeStats[team]) {
                deductionCumulativeStats[team] = { team, points: 0, money: 0, staff: new Set() };
            }
            deductionCumulativeStats[team].points += points;
            deductionCumulativeStats[team].money += money;
            deductionCumulativeStats[team].staff.add(maNV);

            overallDeductionCumulativeStaff.add(maNV);
            overallDeductionCumulativePoints += points;
            overallDeductionCumulativeMoney += money;
        }


    });

    const getMonthValue = (m) => {
        if (!m) return 0;
        const s = m.toString();
        if (s.length >= 5) {
            const yr = parseInt(s.substring(s.length - 4)) || 0;
            const mo = parseInt(s.substring(0, s.length - 4)) || 0;
            return yr * 100 + mo;
        }
        return parseInt(s) || 0;
    };

    // Sắp xếp danh sách Theo Tháng
    const rewardMonthlyList = Object.values(rewardMonthlyStats).sort((a, b) => {
        const valA = getMonthValue(a.month);
        const valB = getMonthValue(b.month);
        if (valA !== valB) return valB - valA;
        return b.points - a.points;
    });

    const deductionMonthlyList = Object.values(deductionMonthlyStats).sort((a, b) => {
        const valA = getMonthValue(a.month);
        const valB = getMonthValue(b.month);
        if (valA !== valB) return valB - valA;
        return a.points - b.points; // Điểm trừ nhiều nhất lên đầu
    });

    // Sắp xếp danh sách Lũy Kế
    const rewardCumulativeList = Object.values(rewardCumulativeStats).sort((a, b) => b.points - a.points);
    const deductionCumulativeList = Object.values(deductionCumulativeStats).sort((a, b) => a.points - b.points);

    // -------------------------------------------------------------
    // A. RENDER CÁC BẢNG THEO THÁNG
    // -------------------------------------------------------------
    // 1. Thưởng Theo Tháng
    const rewardMonthlyTbody = document.getElementById('team-reward-monthly-tbody');
    const rewardMonthlyTfoot = document.getElementById('team-reward-monthly-tfoot');
    if (rewardMonthlyTbody) {
        rewardMonthlyTbody.innerHTML = '';
        if (rewardMonthlyList.length === 0) {
            rewardMonthlyTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Không có dữ liệu khen thưởng tháng.</td></tr>`;
        } else {
            rewardMonthlyList.forEach(t => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="badge primary">${formatMonthDisplay(t.month)}</span></td>
                    <td><strong>${t.team}</strong></td>
                    <td style="text-align: center;"><span class="badge">${t.staff.size} Nhân sự</span></td>
                    <td style="font-weight: 700; text-align: right; color: var(--text-normal);">${formatNumber(t.points)}</td>
                    <td style="color: var(--color-accent); font-weight: 700; text-align: right;">${formatCurrency(t.money)}</td>
                `;
                rewardMonthlyTbody.appendChild(tr);
            });
        }
    }
    if (rewardMonthlyTfoot) {
        rewardMonthlyTfoot.innerHTML = `
            <tr>
                <td colspan="2" style="text-transform: uppercase; color: var(--text-muted);">Tổng cộng</td>
                <td style="text-align: center; color: var(--color-primary); font-weight: 800;">${overallRewardMonthlyStaff.size} Người</td>
                <td style="text-align: right; color: var(--text-normal); font-weight: 800;">${formatNumber(overallRewardMonthlyPoints)}</td>
                <td style="color: var(--color-accent); font-weight: 800; text-align: right;">${formatCurrency(overallRewardMonthlyMoney)}</td>
            </tr>
        `;
    }

    // 2. Phạt Theo Tháng
    const deductionMonthlyTbody = document.getElementById('team-deduction-monthly-tbody');
    const deductionMonthlyTfoot = document.getElementById('team-deduction-monthly-tfoot');
    if (deductionMonthlyTbody) {
        deductionMonthlyTbody.innerHTML = '';
        if (deductionMonthlyList.length === 0) {
            deductionMonthlyTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Không có dữ liệu điểm trừ tháng.</td></tr>`;
        } else {
            deductionMonthlyList.forEach(t => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="badge primary">${formatMonthDisplay(t.month)}</span></td>
                    <td><strong>${t.team}</strong></td>
                    <td style="text-align: center;"><span class="badge">${t.staff.size} Nhân sự</span></td>
                    <td style="font-weight: 700; text-align: right; color: var(--color-danger);">${formatNumber(t.points)}</td>
                    <td style="color: var(--color-danger); font-weight: 700; text-align: right;">${formatCurrency(t.money)}</td>
                `;
                deductionMonthlyTbody.appendChild(tr);
            });
        }
    }
    if (deductionMonthlyTfoot) {
        deductionMonthlyTfoot.innerHTML = `
            <tr>
                <td colspan="2" style="text-transform: uppercase; color: var(--text-muted);">Tổng cộng</td>
                <td style="text-align: center; color: var(--color-danger); font-weight: 800;">${overallDeductionMonthlyStaff.size} Người</td>
                <td style="text-align: right; color: var(--color-danger); font-weight: 800;">${formatNumber(overallDeductionMonthlyPoints)}</td>
                <td style="color: var(--color-danger); font-weight: 800; text-align: right;">${formatCurrency(overallDeductionMonthlyMoney)}</td>
            </tr>
        `;
    }

    // -------------------------------------------------------------
    // B. RENDER CÁC BẢNG LŨY KẾ
    // -------------------------------------------------------------
    // 1. Thưởng Lũy Kế
    const rewardCumulativeTbody = document.getElementById('team-reward-cumulative-tbody');
    const rewardCumulativeTfoot = document.getElementById('team-reward-cumulative-tfoot');
    if (rewardCumulativeTbody) {
        rewardCumulativeTbody.innerHTML = '';
        if (rewardCumulativeList.length === 0) {
            rewardCumulativeTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Không có dữ liệu khen thưởng lũy kế.</td></tr>`;
        } else {
            rewardCumulativeList.forEach(t => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${t.team}</strong></td>
                    <td style="text-align: center;"><span class="badge">${t.staff.size} Nhân sự</span></td>
                    <td style="font-weight: 700; text-align: right; color: var(--text-normal);">${formatNumber(t.points)}</td>
                    <td style="color: var(--color-accent); font-weight: 700; text-align: right;">${formatCurrency(t.money)}</td>
                `;
                rewardCumulativeTbody.appendChild(tr);
            });
        }
    }
    if (rewardCumulativeTfoot) {
        rewardCumulativeTfoot.innerHTML = `
            <tr>
                <td style="text-transform: uppercase; color: var(--text-muted);">Tổng cộng</td>
                <td style="text-align: center; color: var(--color-primary); font-weight: 800;">${overallRewardCumulativeStaff.size} Người</td>
                <td style="text-align: right; color: var(--text-normal); font-weight: 800;">${formatNumber(overallRewardCumulativePoints)}</td>
                <td style="color: var(--color-accent); font-weight: 800; text-align: right;">${formatCurrency(overallRewardCumulativeMoney)}</td>
            </tr>
        `;
    }

    // 2. Phạt Lũy Kế
    const deductionCumulativeTbody = document.getElementById('team-deduction-cumulative-tbody');
    const deductionCumulativeTfoot = document.getElementById('team-deduction-cumulative-tfoot');
    if (deductionCumulativeTbody) {
        deductionCumulativeTbody.innerHTML = '';
        if (deductionCumulativeList.length === 0) {
            deductionCumulativeTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Không có dữ liệu điểm trừ lũy kế.</td></tr>`;
        } else {
            deductionCumulativeList.forEach(t => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${t.team}</strong></td>
                    <td style="text-align: center;"><span class="badge">${t.staff.size} Nhân sự</span></td>
                    <td style="font-weight: 700; text-align: right; color: var(--color-danger);">${formatNumber(t.points)}</td>
                    <td style="color: var(--color-danger); font-weight: 700; text-align: right;">${formatCurrency(t.money)}</td>
                `;
                deductionCumulativeTbody.appendChild(tr);
            });
        }
    }
    if (deductionCumulativeTfoot) {
        deductionCumulativeTfoot.innerHTML = `
            <tr>
                <td style="text-transform: uppercase; color: var(--text-muted);">Tổng cộng</td>
                <td style="text-align: center; color: var(--color-danger); font-weight: 800;">${overallDeductionCumulativeStaff.size} Người</td>
                <td style="text-align: right; color: var(--color-danger); font-weight: 800;">${formatNumber(overallDeductionCumulativePoints)}</td>
                <td style="color: var(--color-danger); font-weight: 800; text-align: right;">${formatCurrency(overallDeductionCumulativeMoney)}</td>
            </tr>
        `;
    }

}

// RENDER EMPLOYEE STATS TABLE
function renderEmployeeStatsTable(activeRecords) {
    const empStats = {};
    activeRecords.forEach(r => {
        const key = r["Mã nhân viên"];
        if (!empStats[key]) {
            const emp = state.employees.find(e => e.maNV === key);
            const displayName = emp ? emp.tenNV : (r["Tên Nhân viên"] || "Chưa xác định");
            
            empStats[key] = {
                id: r["Mã nhân viên"],
                name: displayName,
                team: r["Tổ"] || "Chưa phân tổ",
                points: 0,
                money: 0
            };
        }
        empStats[key].points += r["Điểm khuyến khích"] || 0;
        empStats[key].money += r["Tiền thưởng"] || 0;
    });

    const empTbody = document.getElementById('employee-stats-tbody');
    if (empTbody) {
        empTbody.innerHTML = '';
        const empList = Object.values(empStats).sort((a, b) => b.points - a.points);

        if (empList.length === 0) {
            empTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Không có dữ liệu thống kê nhân viên.</td></tr>`;
        } else {
            empList.forEach(e => {
                const tr = document.createElement('tr');
                const pointsColor = e.points >= 0 ? 'var(--text-normal)' : 'var(--color-danger)';
                const moneyColor = e.points >= 0 ? 'var(--color-accent)' : 'var(--color-danger)';
                
                tr.innerHTML = `
                    <td><strong>${e.name}</strong> (<code>${e.id}</code>)</td>
                    <td>${e.team}</td>
                    <td style="font-weight: 700; text-align: right; color: ${pointsColor};">${formatNumber(e.points)}</td>
                    <td style="font-weight: 700; text-align: right; color: ${moneyColor};">${formatCurrency(e.money)}</td>
                `;
                empTbody.appendChild(tr);
            });
        }
    }
}

// RENDER CHARTS
function renderCharts() {
    const activeRecords = state.records.filter(r => state.dashboardSelectedMonth === 'all' || r["Tháng"] === state.dashboardSelectedMonth);
    
    // Tính toán dữ liệu biểu đồ Tổ
    const teamData = {};
    activeRecords.forEach(r => {
        const team = r["Tổ"] || "Chưa phân tổ";
        teamData[team] = (teamData[team] || 0) + (r["Điểm khuyến khích"] || 0);
    });
    
    const teamLabels = Object.keys(teamData);
    const teamValues = Object.values(teamData);

    // Tính toán dữ liệu biểu đồ Nhân viên (Top 5)
    const empPointsMap = {};
    activeRecords.forEach(r => {
        const maNV = r["Mã nhân viên"];
        if (maNV) {
            empPointsMap[maNV] = (empPointsMap[maNV] || 0) + (r["Điểm khuyến khích"] || 0);
        }
    });
    
    const sortedEmps = Object.entries(empPointsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
        
    const empLabels = sortedEmps.map(x => {
        const maNV = x[0];
        const emp = state.employees.find(e => e.maNV === maNV);
        return emp ? emp.tenNV : maNV;
    });
    const empValues = sortedEmps.map(x => x[1]);

    // Vẽ biểu đồ cột cho các Tổ
    const ctxTeam = document.getElementById('teamChart').getContext('2d');
    if (teamChart) teamChart.destroy();
    
    // Tạo bảng màu HSL hài hòa cho biểu đồ
    const isDark = !document.body.classList.contains('light-theme');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
    const textColor = isDark ? '#e2e8f0' : '#1e293b';

    teamChart = new Chart(ctxTeam, {
        type: 'bar',
        data: {
            labels: teamLabels,
            datasets: [{
                label: 'Tổng Điểm Khuyến Khích',
                data: teamValues,
                backgroundColor: 'rgba(0, 196, 140, 0.65)',
                borderColor: 'rgba(0, 196, 140, 1)',
                borderWidth: 1.5,
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let val = context.raw;
                            return `Tổng điểm: ${formatNumber(val)} điểm (${formatCurrency(val * 5000)})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '500' } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                }
            }
        }
    });

    // Vẽ biểu đồ tròn cho Top 5 Nhân viên
    const ctxEmp = document.getElementById('employeeChart').getContext('2d');
    if (employeeChart) employeeChart.destroy();

    employeeChart = new Chart(ctxEmp, {
        type: 'doughnut',
        data: {
            labels: empLabels.length > 0 ? empLabels : ["Không có dữ liệu"],
            datasets: [{
                data: empValues.length > 0 ? empValues : [0],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(0, 196, 140, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: isDark ? '#1e293b' : '#ffffff',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        boxWidth: 12,
                        padding: 15,
                        font: { family: 'Plus Jakarta Sans', weight: '500', size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let val = context.raw;
                            return `Điểm: ${formatNumber(val)} (${formatCurrency(val * 5000)})`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// TOGGLE THEME LIGHT/DARK
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> <span>Giao diện Sáng</span>';
        showToast("Đã chuyển sang giao diện tối hiện đại!", "info");
    } else {
        body.classList.add('light-theme');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> <span>Giao diện Tối</span>';
        showToast("Đã chuyển sang giao diện sáng trực quan!", "info");
    }
    
    // Vẽ lại biểu đồ để cập nhật màu chữ lưới trục
    if (document.getElementById('dashboard-view').classList.contains('active')) {
        renderCharts();
    }
}
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// EXPORT TABLE TO CSV
function exportToCSV() {
    const activeRecords = state.records.filter(r => {
        const matchMonth = state.selectedMonth === 'all' || r["Tháng"] === state.selectedMonth;
        const matchName = !state.filters.searchName || (r["Tên Nhân viên"] || "").toLowerCase().includes(state.filters.searchName);
        const matchId = !state.filters.searchId || (r["Mã nhân viên"] || "").toLowerCase().includes(state.filters.searchId);
        const matchTeam = !state.filters.searchTeam || (r["Tổ"] || "").toLowerCase().includes(state.filters.searchTeam);
        
        return matchMonth && matchName && matchId && matchTeam;
    });

    if (activeRecords.length === 0) {
        showToast("Không có dữ liệu phù hợp để xuất!", "error");
        return;
    }

    let csvContent = "\ufeff"; // BOM hỗ trợ hiển thị tiếng Việt UTF-8 chuẩn trong Excel
    csvContent += "STT,Thang,Ma nhan vien,Ten Nhan vien,To,Diem khuyen khich,Tien thuong,Ly do,Thoi diem\n";
    
    activeRecords.forEach(r => {
        // Làm sạch dữ liệu tránh lỗi cấu trúc CSV
        const cleanName = `"${(r["Tên Nhân viên"] || '').replace(/"/g, '""')}"`;
        const cleanTeam = `"${(r["Tổ"] || '').replace(/"/g, '""')}"`;
        const cleanReason = `"${(r["Lý do"] || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        const cleanTime = `"${(r["Thời điểm"] || '')}"`;
        
        csvContent += `${r["STT"]},${r["Tháng"]},${r["Mã nhân viên"]},${cleanName},${cleanTeam},${r["Điểm khuyến khích"]},${r["Tiền thưởng"]},${cleanReason},${cleanTime}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const dateStr = new Date().toISOString().slice(0,10);
    link.setAttribute("href", url);
    link.setAttribute("download", `Diem_Khuyen_Khich_VNPT_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã tải xuống báo cáo CSV thành công!", "success");
}

// TOAST NOTIFICATIONS
function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fas fa-info-circle"></i>';
    if (type === 'success') icon = '<i class="fas fa-check-circle" style="color: var(--color-accent);"></i>';
    if (type === 'error') icon = '<i class="fas fa-exclamation-circle" style="color: var(--color-danger);"></i>';
    
    toast.innerHTML = `
        ${icon}
        <div>${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Tự động xóa sau 4 giây
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.2s reverse forwards';
        setTimeout(() => {
            container.removeChild(toast);
        }, 200);
    }, 4000);
}

// UTILITY FUNCTIONS & SORT ICON UPDATER
function updateSortHeaderIcons() {
    const tableHeaders = document.querySelectorAll('#history-table th');
    const sortKeys = [
        'STT',
        'Tháng',
        'Mã nhân viên',
        'Tên Nhân viên',
        'Tổ',
        'Điểm khuyến khích',
        'Tiền thưởng',
        null
    ];
    
    tableHeaders.forEach((th, idx) => {
        const key = sortKeys[idx];
        if (!key) return;
        
        let iconSpan = th.querySelector('.sort-icon');
        if (!iconSpan) {
            iconSpan = document.createElement('span');
            iconSpan.className = 'sort-icon';
            th.appendChild(iconSpan);
        }
        
        if (state.sort.key === key) {
            iconSpan.innerHTML = state.sort.direction === 'asc' ? ' <i class="fa-solid fa-caret-up"></i>' : ' <i class="fa-solid fa-caret-down"></i>';
            th.classList.add('sorted');
        } else {
            iconSpan.innerHTML = ' <i class="fa-solid fa-sort" style="opacity: 0.3; margin-left: 4px;"></i>';
            th.classList.remove('sorted');
        }
    });
}

function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
}

function truncateString(str, num) {
    if (!str) return "";
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}

function getNowTimestampString() {
    const now = new Date();
    const pad = (n) => n < 10 ? '0' + n : n;
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
