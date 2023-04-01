const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function(require, respond) {
    respond.sendFile(__dirname + "/signup.html");
})
app.post("/", function(require, respond) {
    const firstname = require.body.fname;
    const lastname = require.body.lname;
    const data = {
        members: [{
            email_address: firstname,
            status: "subscribed",
            merge_fields: {
                LNAME: lastname
            }
        }]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us18.api.mailchimp.com/3.0/lists/88c5690180";
    const options = {
        method: "POST",
        auth: "dd:f8915e2bfbda9eda26359a91a3d04167-us18"
    }
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            respond.sendFile(__dirname + "/success.html");
        } else {
            respond.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})
app.post("/failure", function(request, respond) {
    respond.redirect("/");
})
app.listen(3000, function() {
    console.log("server is running on port 3000");
})