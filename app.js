const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
const { rmSync } = require("fs");
const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html");

})
app.post("/", (req, res)=>{
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    
    const url = 'https://us14.api.mailchimp.com/3.0/lists/212411c5f1';
    const options = {
        method: "post",
        auth: "sourav:172f64deb5749696b34558933a7c6cd6-us14"
    }
    
    const jsonData = JSON.stringify(data);
    // const listId = process.env.LIST_ID;
    // const serverNum = process.env.SERVER_NUM;
    // const url = `https://us${serverNum}.api.mailchimp.com/3.0/lists/${listId}`;
    // const options = {
    //     method: "post",
    //     auth: `sourav:${process.env.MAIL_API_KEY}`
    // };

    const request = https.request(url, options, function(response){
        if(response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } 
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData); 
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is running at port 3000");
})

//apikey- 172f64deb5749696b34558933a7c6cd6-us14
//audience id - 212411c5f1

