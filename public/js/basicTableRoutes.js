const express = require('express');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT ;
const tablerouter = express.Router();

let connection = undefined;
async function dbQuery(query, params){
  if(connection===undefined){
    connection = await oracledb.getConnection({ user: "C##INSLIB", password: "PROJECT", connectionString: "127.0.0.1/orcl" });
  }
  try{
    let result = await connection.execute(query,params);
    return result.rows;
  }catch(error){
    console.log(error);
  }
}

tablerouter.get("/members.html/bg", async (req,res)=>{
  const query = "SELECT MEMBER_ID, MEMBER_NAME, TYPE, EMAIL, PHONE_NUMBER, BLOOD_GROUP FROM MEMBER ORDER BY BLOOD_GROUP";
  const params = [];
  const result = await dbQuery(query,params);
  res.status(200).json(result);
});

tablerouter.get("/members.html/id", async (req,res)=>{
  const query = "SELECT MEMBER_ID, MEMBER_NAME, TYPE, EMAIL, PHONE_NUMBER, BLOOD_GROUP FROM MEMBER ORDER BY MEMBER_ID";
  const params = [];
  const result = await dbQuery(query,params);
  res.status(200).json(result);
});

tablerouter.get("/Reviews.html/academic", async (req,res)=>{
    const query = "SELECT B.COVER_IMAGE, B.BOOK_NAME,B.BOOK_ID, A.AUTHOR_NAME, M.MEMBER_NAME,M.MEMBER_ID, RL.REVIEW_TEXT FROM  MEMBER M JOIN REVIEW_LIST RL ON (M.MEMBER_ID = RL.MEMBER_ID) JOIN BOOK B ON (RL.BOOK_ID = B.BOOK_ID) JOIN AUTHOR A ON (B.AUTHOR_ID = A.AUTHOR_ID) WHERE UPPER(B.BOOK_TYPE) LIKE '%ACADEMIC%' ORDER BY B.BOOK_NAME";
    const params = [];
    const result = await dbQuery(query,params);
    res.status(200).json(result);
});

tablerouter.get("/Reviews.html/other", async (req,res)=>{
  const query = "SELECT B.COVER_IMAGE, B.BOOK_NAME,B.BOOK_ID, A.AUTHOR_NAME, M.MEMBER_NAME,M.MEMBER_ID, RL.REVIEW_TEXT FROM  MEMBER M JOIN REVIEW_LIST RL ON (M.MEMBER_ID = RL.MEMBER_ID) JOIN BOOK B ON (RL.BOOK_ID = B.BOOK_ID) JOIN AUTHOR A ON (B.AUTHOR_ID = A.AUTHOR_ID) WHERE UPPER(B.BOOK_TYPE) LIKE '%OTHER%' ORDER BY B.BOOK_NAME";
  const params = [];
  const result = await dbQuery(query,params);
  res.status(200).json(result);
});

tablerouter.get("/news_events.html/fill", async (req,res)=>{
  const query = "SELECT IMAGE,TITLE,TO_CHAR(NEWS_DATE, 'DD.MM.YYYY') AS NEWS_DATE,DESCRIPTION FROM NEWS_AND_EVENTS ORDER BY NEWS_DATE DESC";
  const params = [];
  const result = await dbQuery(query,params);
  res.status(200).json(result);
});

tablerouter.get("/index.html/news", async (req,res)=>{
  const query = "SELECT IMAGE,TITLE,TO_CHAR(NEWS_DATE, 'DD.MM.YYYY') AS NEWS_DATE FROM NEWS_AND_EVENTS ORDER BY NEWS_DATE DESC";
  const params = [];
  const result = await dbQuery(query,params);
  res.status(200).json(result);
});

tablerouter.get("/index.html/books", async (req,res)=>{
  const query = "SELECT B.BOOK_NAME, A.AUTHOR_NAME, B.STATUS, B.COVER_IMAGE,B.DATE_OF_ARRIVAL"+
                " FROM BOOK B JOIN AUTHOR A ON (A.AUTHOR_ID = B.AUTHOR_ID) WHERE ((SYSDATE-B.DATE_OF_ARRIVAL)/30)<=3 ORDER BY B.DATE_OF_ARRIVAL";

  const params = [];
  const result = await dbQuery(query,params);
  res.status(200).json(result);
});

tablerouter.get("/links.html/fill", async (req,res)=>{
    const query = "SELECT LINK_NAME,LINK_TEXT FROM LINKS ORDER BY LINK_NAME";
    const params = [];
    const result = await dbQuery(query,params);
    res.status(200).json(result);
});

tablerouter.get("/Authors.html/fill", async (req,res)=>{
    const query = "SELECT AUTHOR_NAME, NATIONALITY, LIFE_SPAN FROM AUTHOR ORDER BY AUTHOR_NAME";
    const params = [];
    const result = await dbQuery(query,params);
    res.status(200).json(result);
});

tablerouter.get("/Publishers.html/fill", async (req,res)=>{
    const query = "SELECT PUBLISHER_NAME, ADDRESS, PHONE_NUMBER FROM PUBLISHER ORDER BY PUBLISHER_NAME";
    const params = [];
    const result = await dbQuery(query,params);
    res.status(200).json(result);
});

module.exports = tablerouter;