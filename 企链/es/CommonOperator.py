#-*- encoding:utf-8 -*-

def strQ2B(ustring):
    """全角转半角"""
    rstring = ""
    for uchar in ustring:
        inside_code = ord(uchar)
        if inside_code == 12288:  # 全角空格直接转换
            inside_code = 32
        elif (inside_code >= 65281 and inside_code <= 65374):  # 全角字符（除空格）根据关系转化
            inside_code -= 65248
        rstring += chr(inside_code)
    return rstring

def transPubtype(strvol,strorgtype):
    """公布类型信息转换"""
    strRetype = strorgtype
    if (strvol is not None and strvol != ""):
        udata = int(strvol)
        if ((udata >= 2614 and udata <= 3322) or (udata >= 332301 and udata <= 345202)):
            if strorgtype == "Y":
                strRetype = "U"
            elif strorgtype == "D":
                strRetype = "S"
            elif strorgtype == "C":
                strRetype = "B"
    return strRetype


