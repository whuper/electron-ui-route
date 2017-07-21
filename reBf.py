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

        self.conn = sqlite3.connect("./assets/wenhaotest.db")
        self.cursor = self.conn.cursor()

    def launch(self):
        result = self.cursor.execute("SELECT id,wordname from english LIMIT 2000 OFFSET 4000")
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

            example = soup.select('#bilingual ul.ol > li')
            example_str = self.format_list(example)
            #
            self.save_to_db(phonetic_str,wordGroup_str,example_str,word_id)
  
    def save_to_db(self, phonetic, wordGroup,example,word_id): ##保存到数据库
        if(not word_id):
            os._exit(0)
        #sql = "insert into lesson_info values ('%s', '%s','%s','%s','%s','%s')" % (name, link, des, number, time, degree)
        sql = 'update english set phonetic = ?,wordGroup = ?,example = ? where id = ?'
        data = (phonetic,wordGroup,example,word_id)
      
        try:
            self.cursor.execute(sql,data)
            self.conn.commit()
        except:
            print 'failed !'
            file_object = open('log.txt', 'w')
            file_object.write(sql.encode('GBK','ignore'))
            file_object.close()
        else:
            print word_id + 'succesful !'

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
            text = ' '.join(text.split())
            tmp_list.append(text)
        tmp_list_str = '#'.join(tmp_list)

        #print tmp_list_str.encode('GBK','ignore')
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
