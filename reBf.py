#!/usr/bin/python
#coding:utf-8

import requests
from bs4 import BeautifulSoup
import sqlite3
import os
import re

class BeautifulPicture():

    def __init__(self):  #类的初始化操作
        self.headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1207.1 Safari/537.1'}  #给请求指定一个请求头来模拟chrome浏览器
        self.base_url = 'http://www.youdao.com/w/'

        self.conn = sqlite3.connect("D:/nodejs/electron/electron-ui-route/assets/wenhaotest.db")
        self.cursor = self.conn.cursor()

    def launch(self):
        result = self.cursor.execute("SELECT id,wordname from english LIMIT 1 OFFSET 0")
        wordlist = result.fetchall()
        #cursor.close()
        #conn.close()

        for row in wordlist:
            word_id = str(row[0])
            word = row[1].strip()

            page = requests.get(self.base_url + word,headers=self.headers)
            soup = BeautifulSoup(page.text,'lxml')

            #phonetic = unicode(soup.select('div.baav span.phonetic'))
            phonetics = soup.select('div.baav span.phonetic')
            phonetic_str = self.format_list(phonetics)
            
          
            wordGroup = soup.select('#wordGroup p.wordGroup')
            wordGroup_str = self.format_list(wordGroup)

            example = soup.select('#bilingual ul.ol')
            example_str = self.format_list(example)
            #
            self.save_to_db(phonetic_str,wordGroup_str,example_str,word_id)
  
    def save_to_db(self, phonetic, wordGroup,example,word_id): ##保存到数据库
        # 连接数据库并插入相应数据
       
        #sql = "insert into lesson_info values ('%s', '%s','%s','%s','%s','%s')" % (name, link, des, number, time, degree)
        sql = 'update english set phonetic = "' + phonetic + '", set wordGroup = "' + wordGroup + '", set example = "' + example + '" where id = "' + word_id + '"'
        #print sql
        file_object = open('log.txt', 'w')
        file_object.write(sql.encode('GBK','ignore'))
        file_object.close()

        self.cursor.execute(sql)
        self.conn.commit()

    def mkdir(self, path):  ##这个函数创建文件夹
        path = path.strip()
        isExists = os.path.exists(path)
        if not isExists:
            print(u'创建名字叫做', path, '的文件夹')
            os.makedirs(path)
            print(u'创建成功！')
        else:
            print(path, u'文件夹已经存在了，不再创建')
    def format_list(self,list_):
        tmp_list = []
        for phonetic in list_:
            text = phonetic.get_text()
            tmp_list.append(text)
        tmp_list_str = ' # '.join(tmp_list)

        print tmp_list_str.encode('GBK','ignore')
        return tmp_list_str

    def test(self):
        page = requests.get(self.base_url + 'hello',headers=self.headers)
        page.encoding = 'UTF-8'
        #print page.content
        soup = BeautifulSoup(page.text,'lxml')
        
        #在对unicode字符编码时，添加ignore参数，忽略无法无法编码的字符，这样就可以正常编码为GBK了
        #print(soup.prettify().encode('GBK','ignore'))
        phonetic = soup.select('div.baav span') 


beauty = BeautifulPicture()  #创建类的实例
beauty.launch()  #执行类中的方法
