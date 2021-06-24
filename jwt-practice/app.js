// express cors jsonwebtoken express-jwt
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const expressJWT = require("express-jwt")

// 解析json
app.use(express.json())
// express.urlencoded()解析表單x-www-form-urlencoded數據
app.use(express.urlencoded({
	extended: false
}))
// 解析post表單 express4.16版前要
// app.use(bodyParser.urlencoded({extended:false}))
// ---------
// cors
app.use(cors())
// jsonwebtoken

// secretkey
const secretkey = "我是任意加密字符串"
//expressJWT把JWT三段字符串幾希還原成json對象
// 配置成功expressJWT後可以把用戶信息掛載到req.user
app.use(expressJWT({
	secret: secretkey,
	algorithms: ['HS256']
}).unless({
	path: ['/login']
}))
// ---------
// 全局註冊處理錯誤中間件
app.use((err, req, res, next) => {
	// token解析失敗
	if (err.name === "UnauthorizedError") {
		return res.send({
			status:401,
			message:'token 不合法'
		})
	}
	res.send({
		status:500,
		message:'不可預期錯誤',
	})
})


app.get("/", (req, res) => {
	res.send("HELLO!!!")
})



app.post("/login", (req, res) => {
	const userinfo = req.body
	console.log(userinfo)
	if (userinfo.username !== 'admin' || userinfo.password !== '123456') {
		return res.send({
			status: 400,
			message: "登錄失敗",
		})
	}
	const thisistoken = "Bearer "+jwt.sign({
		username: userinfo.username
	}, secretkey, {
		expiresIn: '30h'
	})
	console.log(thisistoken)
	res.send({
		status: 200,
		message: "登錄OK",
		token: thisistoken,
	})

})

app.get("/getinfo",(req,res)=>{
	res.send({
		status:200,
		message:'get info success',
		data:req.user
	})
})

app.listen(8181, () => {
	console.log("server is ok")
})
