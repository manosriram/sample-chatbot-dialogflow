const express = require("express");
const app = express();
const dlf = require("dialogflow-fulfillment");

app.post("/hook", express.json(), async (req, res) => {
    try {
    console.log(req.body);
    const agent = new dlf.WebhookClient({
        request: req,
        response: res
    });

    function firstIntent() {
        agent.add("Enter your username");
    }

    function secondIntent() {
        let { queryText } = req.body.queryResult;
        queryText = queryText.split(" ");
        if (queryText.length !== 2) {
            agent.add("Username and password required");
        } else {
            const username = queryText[0], password = queryText[1];
            if (username === "mano" && password === "sriram") agent.add("Enter your location");
            else agent.add("Invalid credentials");
        }
    }

    function lastIntent() {
        let location = req.body.queryResult.queryText;
        location = location.toLowerCase();

        if (["vizag", "chennai", "hyderabad"].includes(location)) {
            agent.add("Thank you for your time");
        } else {
            agent.add("Location not recognized");
        }
    }

    const agentMap = new Map();
    agentMap.set('testintent', firstIntent);
    agentMap.set('intenttwo', secondIntent);
    agentMap.set('lastintent', lastIntent);

    agent.handleRequest(agentMap);
    } catch (er) {
        console.log(er);
    }
});


app.listen(5001, () => {
    console.log("Server at 5001");
});
