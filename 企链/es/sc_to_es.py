#-*- encoding:utf-8 -*-
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import DatabaseOperator as do
import CommonOperator as Co
import re as res
import time,datetime
import ast


def getData(datainfo,field):
    ss = datainfo[field]
    # print(ss)
    if ss:
        res = ss
    else:
        res = None

    if(field =="company_id"):
        arr=int(res)
        return arr
    if(type(res)==datetime.datetime):
        # print(res)
        return res.strftime("%Y-%m-%d")
    else:
        return res

def DataOper(datainfo):
    isTrue = True
    action = {}
    try:
        mysql_field=["company_id","gsb_company_name","gsb_usc_code","gsb_reg_number","change_item","content_before","content_after","change_time","create_time"]
        es_field=["company_id","gsb_company_name","gsb_usc_code","gsb_reg_number","change_item","content_before","content_after","change_time","create_time"]
        doc = {}
        action["_index"] = index_name
        action["_type"] = "_doc"
        id = datainfo["id"]
        # print(id)
        action["_id"] = id

        for index,field in enumerate(mysql_field):
            doc[es_field[index]] = getData(datainfo,field)
        action["_source"] = doc
    except Exception as e:
        print(e,'------------')
        isTrue = False
    # print(isTrue,action)
    return isTrue,action


if __name__ == '__main__':
    #global error,other,f1,f2
    error = "error.txt"
    other = "other.txt"
    f1 = open(error, "a")
    f2 = open(other,"a")
    #ip = "43.247.184.94"
    #port = 9188
    # ip = "47.95.76.74"
    # port = 3306
    # database = "gsb_license"
    # user = "root"
    # password = "Gongsibao2018"

    ip = "43.247.184.94"
    port = 7800
    database = "prism1"
    user = "nice"
    password = "Niceee@2020"





    esip = "es-cn-zz11nl9y20001gczg.public.elasticsearch.aliyuncs.com"
    esport = 9200
    #esip = "43.247.184.94"
    #esport = 9200
    index_name = "bigdata_ic_gsb_change_1"
    index_type = "_doc"
    esuser = "elastic"
    espassword = "w3OL+51eo*)c=^7"
    es = Elasticsearch([esip], http_auth=(esuser, espassword), port=esport)
    # es = Elasticsearch([esip], port=esport)

    sql = "select * from company_change_info_all_copy2"
    result = do.query(ip,user,password,database,port,sql)
    # print(result)
    if result != "error":
        bulkList = []
        for re in result:
            try:
                isTrue,action = DataOper(re)
                if isTrue:
                    bulkList.append(action)
                else:
                    f1.write("获取"+str(re)+ "的数据出错！\r\n")
                if len(bulkList) ==1000:
                    try:
                        bulk(es, bulkList, index=index_name, raise_on_error=True)  # 批量插入
                    except Exception as e:
                        print(e)
                        f1.write("插入" + str(bulkList) + "的数据出错！\r\n")
                    bulkList = []
            except Exception as e:
                print(e)
                f1.write("处理" + str(re) + "的数据出错！\r\n")
            #print(str(re))

        if len(bulkList) > 0:
            try:
                bulk(es, bulkList, index=index_name, raise_on_error=True)  # 批量插入
            except Exception as e:
                print(e,'----------------')
                f1.write("插入" + str(bulkList) + "的数据出错----------------4！\r\n")
            bulkList = []
    else:
        f1.write("获取软件著作权数据出错！\r\n")


    f1.flush()
    f1.close()
    f2.flush()
    f2.close()
    print("over")
