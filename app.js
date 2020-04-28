const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const port = process.env.PORT || 4000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
let msg=''
var phonenumber=''
var substring=''
app.post('/webhook', (req, res) => {
    msg=''
    substring=''
    substring=''
    if (req.method === 'POST') {
        let reply_token = req.body.events[0].replyToken
        msg = req.body.events[0].message.text
    if (req.body.events[0].type === 'message') {

        var str = req.body.events[0].message.text;
        var numstr = str.length;
             if (numstr===15){
                substring=req.body.events[0].message.text
                phonenumber=req.body.events[0].message.text
                phonenumber=substring.substr(5, 15); 
                substring=substring.substr(0, 5); 
              }
    
         if (substring ==='#123#'){
             substring=''
             Registerline(req.body,reply_token,phonenumber)
          }else{
             reply(req.body, msg,reply_token)
          }
    }else if(req.body.events[0].type === 'follow'){
        
         Registerline(req.body,reply_token)
    }else if(req.body.events[0].type === 'unfollow'){
       
         Registerline(req.body,reply_token)
    }
    }
 res.sendStatus(200)
})
app.post('/Sendorder', (req, res) => {
  
    Sendorder(req.body)
     
 res.sendStatus(200)
})
app.listen(port)
function reply(bodyResponse, msg,reply_token) {
    try {
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sKJLbqM9qS/wDlLuitbNMKhGeJ7zN1mkrLk8RIkiZsvifG051efF/iCtHT4fMHA2jMnStRYUMOKU+bY+yzZ3CTfOUDH+ULXQCeOYTkMsSLOQv+d67caQWLI1sp/Opr40w3SdgJQfLKqwpkABjTjtpQdB04t89/1O/w1cDnyilFU='
        }
        let body
        let type =bodyResponse.events[0].message.type
        if (type ==='text'){
            if (bodyResponse.events[0].message.text ==='สวัสดี'){
                body = JSON.stringify({
                   replyToken: reply_token,
                   messages: [{
                       type: 'text',
                       text: msg
                   }]
               })
           }else if(bodyResponse.events[0].message.text ==='Register') {
                body = JSON.stringify({
                   replyToken: reply_token,
                   messages: [{
                       type: 'text',
                       text: 'กรุณาใส่หมายเลขโทรศัพท์ เพื่อทำการลงทะเบียน โดยพิมพ์ #123#เบอร์โทรศัพท์ของท่าน เเล้วส่งมาที่ ไลน์'
                   }]
               })
           }else{
                 body = JSON.stringify({
                   replyToken: reply_token,
                   messages: [{
                       type: 'text',
                       text: JSON.stringify(bodyResponse)
                   }]
               })
           }
        }else if (type ==='image'){
    
            body = JSON.stringify({
                replyToken: reply_token,
                messages: [{
                    type: 'text',
                    text: 'รูป'
                }]
            })
        }else if (type ==='location'){
            body = JSON.stringify({
                replyToken: reply_token,
                messages: [{
                    type: 'text',
                    text: 'location'
                }]
            })
        }
       
       
        request.post({
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: headers,
            body: body
        }, (err, res, body) => {
            console.log('status = ' + res.statusCode);
        });

      }
      catch (e) {
        console.log(e);
        send(reply_token,e)
      }
      finally {
        
      }
   
}
function reply1(reply_token) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sKJLbqM9qS/wDlLuitbNMKhGeJ7zN1mkrLk8RIkiZsvifG051efF/iCtHT4fMHA2jMnStRYUMOKU+bY+yzZ3CTfOUDH+ULXQCeOYTkMsSLOQv+d67caQWLI1sp/Opr40w3SdgJQfLKqwpkABjTjtpQdB04t89/1O/w1cDnyilFU='
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: 'สวัสดี'
        }]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}

function Registerline(bodyResponse,reply_token,phonenumber) {
let num=""
 num="เข้า try 1 เบอร์ " +phonenumber
var err=""
    try {
        num=num +"เข้า try 2 เบอร์ " +phonenumber
         var options = {
            method: 'POST',
            url: 'http://vm-feeduat/FeedLineBot/WebService.asmx',
            headers:
            {
              soapaction: 'http://tempuri.org/registerline',
              host: 'vm-feeduat',
              'content-type': 'text/xml; charset=utf-8'
            },
            body: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body> <registerline xmlns="http://tempuri.org/">     <JsonStr>{"Data":[{"User_ID":"'+bodyResponse.events[0].source.userId+'","Phone_No":"'+phonenumber+'","Email":"","Nameline":"ball"}]}</JsonStr>   </registerline></soap:Body></soap:Envelope>'
          };
            num=num +"ก่อนเข้า req " +phonenumber
          var req = request(options, function(error, res, cb) {
            num=num +"เข้า ฟังชั่น1 " +phonenumber
            var msg = '';
          
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
              msg += chunk;
              num=num +"เข้า ฟังชั่น2 " +phonenumber +"-"+ msg
            });
            res.on('end', function() {
                num=num +"เข้า ฟังชั่น3 " +phonenumber +"-"+ msg
              console.log(JSON.parse(msg));
            });
          });
          
          req.write(data);
          req.end();

         //var requ =request(options, function (error, response, cb) {
          //  if (error) throw new Error(error);
          //  num=num +"เข้า ฟังชั่น " +phonenumber
          //   console.log(cb);
             
          //});

         
         num=num +" หลุด ฟังชั่น " +phonenumber+" & "+ requ
      }
      catch (e) {
        console.log(e);
          err=e
       num=num +"เข้า try 3 error " + err
       
      }
      finally {
      num=num +"เข้า try 4 เบอร์ " 
        
      }
      send(reply_token,num)
  }
  
    function send(reply_token,num)  {

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sKJLbqM9qS/wDlLuitbNMKhGeJ7zN1mkrLk8RIkiZsvifG051efF/iCtHT4fMHA2jMnStRYUMOKU+bY+yzZ3CTfOUDH+ULXQCeOYTkMsSLOQv+d67caQWLI1sp/Opr40w3SdgJQfLKqwpkABjTjtpQdB04t89/1O/w1cDnyilFU='
        }
        body = JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: 'สวัสดี  '+ num
            }]
        })
        
        request.post({
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: headers,
            body: body
        }, (err, res, body) => {
            console.log('status = ' + res.statusCode);
        });

        }
  function Sendorder(bodyResponse) {
      
    try {
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sKJLbqM9qS/wDlLuitbNMKhGeJ7zN1mkrLk8RIkiZsvifG051efF/iCtHT4fMHA2jMnStRYUMOKU+bY+yzZ3CTfOUDH+ULXQCeOYTkMsSLOQv+d67caQWLI1sp/Opr40w3SdgJQfLKqwpkABjTjtpQdB04t89/1O/w1cDnyilFU='
    }
    body = JSON.stringify({
        to: bodyResponse.events[0].source.userId,
        messages: [{
            type: "image",
            originalContentUrl: bodyResponse.events[0].message.text ,
            previewImageUrl: bodyResponse.events[0].message.text 
        }]
    })
    
      request.post({
        url: 'https://api.line.me/v2/bot/message/push',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
    }
    catch (e) {
 
    console.log(e);
  
    }
    finally {
 
    }
    
    }
    
function findsubstr(str,reply_token) { 
      substring = str.substr(0, 5); 
      phonenumber= str.substr(5, 15); 
      send(reply_token,substring)
      
      send(reply_token,phonenumber)
   
    } 
