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
    if(type(res)==datetime.date):
        print(res)
        return res.strftime("%Y-%m-%d")
    if(field=='jdglry' and res!=None):
        arr = res.split(';')
        return arr
    elif(field=='xkmx' and res!=None):
        return ast.literal_eval(res)
    else:
        return res

def DataOper(datainfo):
    isTrue = True
    action = {}
    try:
        mysql_field=["sczname","shxycode","fdhuman","zadd","scadd","spfate","xkznum","dgljg","jdglry","fzjg","qfhuman","fzdate","yxdate","xkmx","zs"]
        es_field=["companyName","scc_icn","legal_person","residence","prod_address","food_category","licence_no","manage_agency","manage_person","issuing_authority","signer","pub_time","end_date","license_details","note"]
        doc = {}
        action["_index"] = index_name
        action["_type"] = "_doc"
        id = datainfo["id"]
        action["_id"] = id

        for index,field in enumerate(mysql_field):
            doc[es_field[index]] = getData(datainfo,field)
        action["_source"] = doc
    except Exception as e:
        print(e)
        isTrue = False
    return isTrue,action


if __name__ == '__main__':
    #global error,other,f1,f2
    error = "error.txt"
    other = "other.txt"
    f1 = open(error, "a")
    f2 = open(other,"a")
    #ip = "43.247.184.94"
    #port = 9188
    ip = "39.106.39.121"
    port = 3306
    database = "ali"
    user = "root"
    password = "YUZ224102lss@#"

    esip = "39.106.39.121"
    esport = 9200
    #esip = "43.247.184.94"
    #esport = 9200
    index_name = "enterprise_chain_sc"
    index_type = "_doc"
    # esuser = "admines"
    # espassword = "adminGSBes"
    # es = Elasticsearch([esip], http_auth=(esuser, espassword), port=esport)
    es = Elasticsearch([esip], port=esport)

    sql = "select * from SC_info limit 1"
    result = do.query(ip,user,password,database,port,sql)
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
                        f1.write("插入" + str(bulkList) + "的数据出错！\r\n")
                    bulkList = []
            except Exception as e:
                f1.write("处理" + str(re) + "的数据出错！\r\n")
            #print(str(re))

        if len(bulkList) > 0:
            try:
                bulk(es, bulkList, index=index_name, raise_on_error=True)  # 批量插入
            except Exception as e:
                f1.write("插入" + str(bulkList) + "的数据出错！\r\n")
            bulkList = []
    else:
        f1.write("获取软件著作权数据出错！\r\n")


    f1.flush()
    f1.close()
    f2.flush()
    f2.close()
    print("over")
