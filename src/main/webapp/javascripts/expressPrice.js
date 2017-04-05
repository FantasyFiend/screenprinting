var _SHOUZHONG1 = 8;
var _SHOUZHONG2 = 10;
var _SHOUZHONG3 = 12;
var _SHOUZHONG4 = 15;
var _SHOUZHONG5 = 22;
/*
	【地区码】北京本地：北京(11)
			 北京周围：河北(13),天津(12)
			 北京附近：浙江(33),江苏(32),上海(31),山东(37),安徽(34)
			 普通地区：黑龙江(23),吉林(22),辽宁(21),陕西(61),重庆(50),广东(44),
			 		  湖北(42),福建(35),山西(14),河南(41),江西(36),湖南(43)
			 一般偏远：内蒙古(15),云南(53),甘肃(62),青海(63),宁夏(64),
			 		  贵州(52),四川(51),海南(46),广西(45),
			 极度偏远：新疆(65),西藏(54)
			 其他地区：港(72),澳(73),台(71)
*/
function getExpressPrice(code, list){
	switch(code){
	case 71:
	case 72:
	case 73:
		return 0;
	case 54:
	case 65:
		return _SHOUZHONG5;
	case 11:
		return _SHOUZHONG1;
	case 12:
	case 13:
		return _SHOUZHONG2;
	case 37:
	case 34:
	case 33:
	case 32:
	case 31:
	case 23:
	case 22:
	case 21:
	case 61:
	case 50:
	case 44:
	case 42:
	case 14:
	case 41:
	case 36:
	case 43:
	case 15:
	case 53:
	case 62:
	case 63:
	case 64:
	case 52:
	case 51:
	case 46:
	case 45:
		return _SHOUZHONG4;
	default:
		return 10;
	}
}